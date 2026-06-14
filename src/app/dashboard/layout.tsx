'use client';

import * as React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Custom Sidebar Navigation */}
      <AppSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 lg:px-8 bg-background/50 backdrop-blur-md sticky top-0 z-30">
          {/* Custom SVG Navigation Icon (3-line Menu) */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors animate-nav-pulse"
            aria-label="Toggle Navigation Menu"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-primary"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          
          <div className="hidden lg:block">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Secure Clinical Environment
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
