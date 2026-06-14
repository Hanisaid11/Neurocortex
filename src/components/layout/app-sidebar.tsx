'use client';

import * as React from "react"
import {
  Brain,
  Search,
  Image as ImageIcon,
  Mic,
  Settings,
  Database,
  GraduationCap,
  Activity,
  Plus,
  MessageSquare,
  Trash2,
  MoreVertical,
  ChevronDown
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

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [chats, setChats] = React.useState<ChatSession[]>([])

  React.useEffect(() => {
    setChats(storage.getChats())
  }, [pathname])

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Math.random().toString(36).substring(7),
      title: "New Case Discussion",
      messages: [],
      lastUpdated: Date.now()
    }
    const updated = [newChat, ...chats]
    storage.saveChats(updated)
    setChats(updated)
    router.push(`/dashboard/chat/${newChat.id}`)
  }

  const deleteChat = (id: string) => {
    const updated = chats.filter(c => c.id !== id)
    storage.saveChats(updated)
    setChats(updated)
    if (pathname.includes(id)) router.push('/dashboard/chat')
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Brain className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <span className="font-headline font-bold text-lg group-data-[collapsible=icon]:hidden">
            NeuroCortex <span className="text-accent">Pro</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Case Discussions</span>
            <Button variant="ghost" size="icon" className="h-4 w-4" onClick={createNewChat}>
              <Plus className="w-3 h-3" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={createNewChat} className="bg-primary/10 text-primary hover:bg-primary/20">
                  <Plus className="w-4 h-4" />
                  <span>Start New Case</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <div className="flex items-center w-full">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(chat.id)}
                      className="flex-1"
                    >
                      <Link href={`/dashboard/chat/${chat.id}`}>
                        <MessageSquare className="w-4 h-4" />
                        <span className="truncate">{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => deleteChat(chat.id)} className="text-destructive">
                          <Trash2 className="w-3 h-3 mr-2" /> Delete
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
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarMenu>
            {[
              { title: "Knowledge Hub", icon: Search, url: "/dashboard/knowledge" },
              { title: "Imaging Workspace", icon: ImageIcon, url: "/dashboard/imaging" },
              { title: "Clinical Log", icon: Database, url: "/dashboard/cases" },
              { title: "Outcomes", icon: Activity, url: "/dashboard/outcomes" },
            ].map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon strokeWidth={1.5} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'}>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4" />
                <span>System Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
