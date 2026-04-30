"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Mail, 
  FileText, 
  Users, 
  Settings, 
  Zap,
  Menu,
  X,
  Send,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Send Email", href: "/dashboard/send", icon: Send },
  { name: "Templates", href: "/dashboard/templates", icon: FileText },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">ColdMailer</span>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="flex flex-col gap-1 mt-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                    {item.name}
                  </Link>
                )
              })}
              <div className="mt-4 pt-4 border-t border-border">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign out
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <div className="h-14" /> {/* Spacer for fixed header */}
    </div>
  )
}
