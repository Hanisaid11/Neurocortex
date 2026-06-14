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
  X,
  Pill,
  ClipboardList
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
import { translations } from "@/lib/translations"

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [chats, setChats] = React.useState<ChatSession[]>([])
  const [lang, setLang] = React.useState<'en' | 'ar'>('en')

  React.useEffect(() => {
    setChats(storage.getChats())
    setLang(storage.getProfile().preferences.language)
  }, [pathname])

  const t = translations[lang]

  const createNewChat = (type: 'case' | 'general') => {
    const newChat: ChatSession = {
      id: Math.random().toString(36).substring(7),
      title: type === 'case' ? (lang === 'ar' ? "حالة جديدة" : "New Case") : (lang === 'ar' ? "نقاش طبي" : "Medical Q&A"),
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
    { title: t.knowledgeHub, icon: Search, url: "/dashboard/knowledge", color: "from-cyan-500/20 to-blue-500/20" },
    { title: t.imagingWorkspace, icon: ImageIcon, url: "/dashboard/imaging", color: "from-blue-500/20 to-indigo-500/20" },
    { title: t.pharmacology, icon: Pill, url: "/dashboard/pharmacology", color: "from-emerald-500/20 to-teal-500/20" },
    { title: t.treatmentPlanner, icon: ClipboardList, url: "/dashboard/planner", color: "from-orange-500/20 to-red-500/20" },
    { title: t.clinicalLog, icon: Database, url: "/dashboard/cases", color: "from-indigo-500/20 to-purple-500/20" },
    { title: t.outcomes, icon: Activity, url: "/dashboard/outcomes", color: "from-purple-500/20 to-pink-500/20" },
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar/95 backdrop-blur-md border-r border-sidebar-border/50 transition-transform duration-300 ease-in-out transform flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          lang === 'ar' ? "right-0 left-auto border-l border-r-0" : "left-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border/50 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 group" onClick={onClose}>
            <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_15px_rgba(34,124,255,0.4)] transition-transform group-hover:scale-110">
              <Brain className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-headline font-bold text-lg">
              {t.title.split(' ')[0]} <span className="text-accent">{t.title.split(' ')[1]}</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-2 block">{t.caseDiscussions}</span>
            <div className="space-y-1">
              <button 
                onClick={() => createNewChat('case')} 
                className="w-full flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-md text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t.startCase}</span>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0" onClick={() => deleteChat(chat.id)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-2 block">{t.generalChat}</span>
            <div className="space-y-1">
              <button 
                onClick={() => createNewChat('general')} 
                className="w-full flex items-center gap-2 px-3 py-2 bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 rounded-md text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t.quickQA}</span>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0" onClick={() => deleteChat(chat.id)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 px-2 mb-2 block">{t.clinicalModules}</span>
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
                  <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{item.title}</span>
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
            <span>{t.settings}</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
