"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Mail, 
  FileText, 
  Users, 
  Settings, 
  Zap,
  LogOut,
  ChevronRight,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signOut, useSession } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Send Email", href: "/dashboard/send", icon: Send },
  { name: "Templates", href: "/dashboard/templates", icon: FileText },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  // Get initials for avatar
  const initials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    : "JD"

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-sidebar-foreground">ColdMailer</span>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
              {item.name}
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start mt-2 text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
