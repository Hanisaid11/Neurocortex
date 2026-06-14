"use client"

import * as React from "react"
import {
  Brain,
  Search,
  Image as ImageIcon,
  Mic,
  Settings,
  ClipboardList,
  GraduationCap,
  Activity,
  ChevronRight,
  Database
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
import { usePathname } from "next/navigation"

const navigation = [
  {
    title: "Clinical Hub",
    items: [
      { title: "Knowledge Hub", icon: Search, url: "/dashboard/knowledge" },
      { title: "Imaging Workspace", icon: ImageIcon, url: "/dashboard/imaging" },
      { title: "OR Assistant", icon: Mic, url: "/dashboard/voice" },
    ],
  },
  {
    title: "Research & Training",
    items: [
      { title: "Clinical Log", icon: Database, url: "/dashboard/cases" },
      { title: "Board Prep", icon: GraduationCap, url: "/dashboard/board-prep" },
      { title: "Outcomes", icon: Activity, url: "/dashboard/outcomes" },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", icon: Settings, url: "/dashboard/settings" },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

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
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className="hover:text-accent"
                    >
                      <Link href={item.url}>
                        <item.icon strokeWidth={1.5} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:p-0">
              <div className="flex items-center gap-3 px-1 py-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <span className="text-xs font-bold">DR</span>
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">Dr. Sterling</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Senior Consultant</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}