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
  Send,
  Sparkles,
  Megaphone
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signOut, useSession } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
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
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 border-r border-border/50 bg-gradient-to-b from-sidebar/95 to-sidebar/50 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-3 group transition-all">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
            <Zap className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
              ColdMailer
            </span>
            <span className="text-[10px] font-medium text-primary tracking-widest uppercase opacity-80 flex items-center gap-1">
              Workspace <Sparkles className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>

      <div className="px-4 mb-2">
        <Separator className="bg-border/50" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "text-primary shadow-sm bg-primary/10" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-md shadow-primary/50" />
              )}
              
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                isActive ? "bg-background shadow-sm text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:bg-background/50 group-hover:shadow-sm"
              )}>
                <item.icon className={cn(
                  "w-4 h-4 transition-transform duration-300", 
                  isActive ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-3"
                )} />
              </div>
              
              <span className={cn(
                "flex-1 transition-transform duration-300",
                isActive ? "translate-x-0" : "group-hover:translate-x-1"
              )}>
                {item.name}
              </span>
              
              {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto text-primary opacity-70 animate-in slide-in-from-left-2 fade-in" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-muted/40 border border-border/50 p-1 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-sm font-bold text-primary-foreground">{initials}</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{user?.name || "User"}</div>
              <div className="text-xs text-muted-foreground truncate font-medium">{user?.email || "user@example.com"}</div>
            </div>
          </div>
          <div className="px-1 pb-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl h-9"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
