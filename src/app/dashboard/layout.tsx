'use client';

import * as React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { storage } from "@/lib/storage"
import { translations } from "@/lib/translations"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [lang, setLang] = React.useState<'en' | 'ar'>('en');

  React.useEffect(() => {
    setLang(storage.getProfile().preferences.language);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-background flex" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar with high z-index and native overlay logic */}
      <AppSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        lang === 'ar' ? "lg:mr-72 lg:ml-0" : "lg:ml-72 lg:mr-0"
      )}>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 lg:px-8 bg-background/50 backdrop-blur-md sticky top-0 z-[30]">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors animate-nav-pulse relative z-[31]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          
          <div className="hidden lg:block">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t.subtitle}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden relative">
          {children}
        </main>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
