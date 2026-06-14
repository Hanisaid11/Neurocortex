'use client';

import * as React from "react"
import {
  Brain,
  Search,
  Image as ImageIcon,
  Settings,
  Database,
  Activity,
  Plus,
  MessageSquare,
  Trash2,
  MoreVertical,
  FolderOpen,
  X
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { storage, type ChatSession } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [chats, setChats] = React.useState<ChatSession[]>([])

  React.useEffect(() => {
    setChats(storage.getChats())
  }, [pathname])

  const createNewChat = (type: 'case' | 'general') => {
    const newChat: ChatSession = {
      id: Math.random().toString(36).substring(7),
      title: type === 'case' ? "New Case Discussion" : "General Medical Q&A",
      type,
      messages: [],
      lastUpdated: Date.now()
    }
    const updated = [newChat, ...chats]
    storage.saveChats(updated)
    setChats(updated)
    router.push(`/dashboard/chat/${newChat.id}`)
    onClose()
  }

  const deleteChat = (id: string) => {
    const updated = chats.filter(c => c.id !== id)
    storage.saveChats(updated)
    setChats(updated)
    if (pathname.includes(id)) router.push('/dashboard/chat')
  }

  const caseChats = chats.filter(c => c.type === 'case')
  const generalChats = chats.filter(c => c.type === 'general')

  const modules = [
    { title: "Knowledge Hub", icon: Search, url: "/dashboard/knowledge", color: "from-cyan-500/20 to-blue-500/20" },
    { title: "Imaging Workspace", icon: ImageIcon, url: "/dashboard/imaging", color: "from-blue-500/20 to-indigo-500/20" },
    { title: "Clinical Log", icon: Database, url: "/dashboard/cases", color: "from-indigo-500/20 to-purple-500/20" },
    { title: "Outcomes", icon: Activity, url: "/dashboard/outcomes", color: "from-purple-500/20 to-pink-500/20" },
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border/50 transition-transform duration-300 ease-in-out transform flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/50 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 group" onClick={onClose}>
            <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_15px_rgba(34,124,255,0.4)] transition-transform group-hover:scale-110">
              <Brain className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-headline font-bold text-lg">
              NeuroCortex <span className="text-accent">Pro</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-sidebar-border">
          {/* Case Discussions Section */}
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Case Discussions</span>
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => createNewChat('case')} 
                className="w-full flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-md text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Start Patient Case</span>
              </button>
              {caseChats.map((chat) => (
                <div key={chat.id} className="group relative flex items-center">
                  <Link 
                    href={`/dashboard/chat/${chat.id}`}
                    onClick={onClose}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 truncate",
                      pathname.includes(chat.id) 
                        ? "bg-accent/10 text-accent border-r-2 border-accent" 
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <FolderOpen className="w-4 h-4 shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
                      <DropdownMenuItem onClick={() => deleteChat(chat.id)} className="text-destructive focus:bg-destructive/10">
                        <Trash2 className="w-3 h-3 mr-2" /> Delete Case
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>

          {/* General Discussions Section */}
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">General AI Chat</span>
            </div>
            <div className="space-y-1">
              <button 
                onClick={() => createNewChat('general')} 
                className="w-full flex items-center gap-2 px-3 py-2 bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 rounded-md text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Quick Q&A</span>
              </button>
              {generalChats.map((chat) => (
                <div key={chat.id} className="group relative flex items-center">
                  <Link 
                    href={`/dashboard/chat/${chat.id}`}
                    onClick={onClose}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 truncate",
                      pathname.includes(chat.id) 
                        ? "bg-primary/10 text-primary border-r-2 border-primary" 
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border">
                      <DropdownMenuItem onClick={() => deleteChat(chat.id)} className="text-destructive focus:bg-destructive/10">
                        <Trash2 className="w-3 h-3 mr-2" /> Delete Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Modules Section */}
          <div className="px-4">
            <div className="px-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Clinical Modules</span>
            </div>
            <div className="space-y-1">
              {modules.map((item) => (
                <Link 
                  key={item.title}
                  href={item.url}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 group/btn relative",
                    pathname === item.url 
                      ? cn("bg-gradient-to-r text-foreground font-bold shadow-md", item.color)
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    pathname === item.url ? "text-cyan-400" : "text-muted-foreground group-hover/btn:text-foreground"
                  )} strokeWidth={1.5} />
                  <span>{item.title}</span>
                  {pathname === item.url && <div className="ml-auto w-1 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]" />}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border/50 shrink-0">
          <Link 
            href="/dashboard/settings" 
            onClick={onClose}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all hover:bg-accent/10",
              pathname === '/dashboard/settings' ? "text-accent font-bold" : "text-muted-foreground"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>System Configuration</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
