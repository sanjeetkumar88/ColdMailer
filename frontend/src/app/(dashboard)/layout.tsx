"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(true) // Start collapsed as requested

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <MobileNav />
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out h-screen flex flex-col min-w-0 overflow-hidden",
        isCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col min-h-0 relative">
          {children}
        </div>
      </main>
    </div>
  )
}
