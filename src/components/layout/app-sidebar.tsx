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
  ChevronRight
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
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

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setOpenMobile, isMobile } = useSidebar()
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
    if (isMobile) setOpenMobile(false)
  }

  const deleteChat = (id: string) => {
    const updated = chats.filter(c => c.id !== id)
    storage.saveChats(updated)
    setChats(updated)
    if (pathname.includes(id)) router.push('/dashboard/chat')
  }

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false)
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
    <Sidebar collapsible="icon" className="transition-all duration-300 ease-in-out bg-sidebar/80 backdrop-blur-md border-r border-sidebar-border/50">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
        <Link href="/dashboard" className="flex items-center gap-2 group" onClick={handleLinkClick}>
          <div className="bg-primary p-1.5 rounded-lg shadow-[0_0_15px_rgba(34,124,255,0.4)] transition-transform group-hover:scale-110">
            <Brain className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <span className="font-headline font-bold text-lg group-data-[collapsible=icon]:hidden">
            NeuroCortex <span className="text-accent">Pro</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="scroll-smooth">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Case Discussions</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => createNewChat('case')} 
                  className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 mb-1"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-semibold">Start Patient Case</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {caseChats.map((chat) => (
                <SidebarMenuItem key={chat.id} className="group/item">
                  <div className="flex items-center w-full">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(chat.id)}
                      className={cn(
                        "flex-1 transition-all duration-200",
                        pathname.includes(chat.id) && "bg-accent/10 text-accent border-r-2 border-accent"
                      )}
                    >
                      <Link href={`/dashboard/chat/${chat.id}`} onClick={handleLinkClick}>
                        <FolderOpen className="w-4 h-4" />
                        <span className="truncate">{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity">
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
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">General AI Chat</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => createNewChat('general')} 
                  className="bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 mb-1"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-semibold">Quick Q&A</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {generalChats.map((chat) => (
                <SidebarMenuItem key={chat.id} className="group/item">
                  <div className="flex items-center w-full">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(chat.id)}
                      className={cn(
                        "flex-1 transition-all duration-200",
                        pathname.includes(chat.id) && "bg-primary/10 text-primary border-r-2 border-primary"
                      )}
                    >
                      <Link href={`/dashboard/chat/${chat.id}`} onClick={handleLinkClick}>
                        <MessageSquare className="w-4 h-4" />
                        <span className="truncate">{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover/item:opacity-100 transition-opacity">
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
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Clinical Modules</SidebarGroupLabel>
          <SidebarMenu>
            {modules.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.url}
                  className={cn(
                    "transition-all duration-200 group/btn",
                    pathname === item.url ? "bg-gradient-to-r text-foreground font-bold shadow-md" : "text-muted-foreground",
                    pathname === item.url && item.color
                  )}
                >
                  <Link href={item.url} onClick={handleLinkClick} className="flex items-center">
                    <item.icon className={cn(
                      "transition-colors",
                      pathname === item.url ? "text-cyan-400" : "text-muted-foreground group-hover/btn:text-foreground"
                    )} strokeWidth={1.5} />
                    <span>{item.title}</span>
                    {pathname === item.url && <div className="ml-auto w-1 h-4 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} className="hover:bg-accent/10">
              <Link href="/dashboard/settings" onClick={handleLinkClick}>
                <Settings className="w-4 h-4" />
                <span>System Configuration</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
