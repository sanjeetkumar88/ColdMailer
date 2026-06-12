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
  ChevronLeft,
  Send,
  Sparkles,
  Megaphone,
  Inbox
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signOut, useSession } from "next-auth/react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { name: "Send Email", href: "/dashboard/send", icon: Send },
  { name: "Templates", href: "/dashboard/templates", icon: FileText },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface AppSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

export function AppSidebar({ isCollapsed, setIsCollapsed }: AppSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user

  // Get initials for avatar
  const initials = user?.name 
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    : "JD"

  return (
    <aside className={cn(
      "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-border/50 bg-gradient-to-b from-sidebar/95 to-sidebar/50 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-all duration-300 ease-in-out",
      isCollapsed ? "lg:w-20" : "lg:w-72"
    )}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1 shadow-md hover:bg-primary/90 transition-transform z-50 flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo */}
      <div className={cn("px-4 py-6 flex items-center transition-all duration-300", isCollapsed ? "justify-center" : "px-6")}>
        <Link href="/dashboard" className="flex items-center gap-3 group transition-all w-full">
          <div className={cn("relative flex items-center transition-all duration-300 group-hover:scale-105", isCollapsed ? "w-10 h-10 justify-center" : "h-10 w-36")}>
            <img 
              src="/logo.png" 
              alt="ColdMailer Logo" 
              className={cn("w-full h-full dark:hidden", isCollapsed ? "object-cover object-left" : "object-contain object-left")}
            />
            <img 
              src="/logo-dark.png" 
              alt="ColdMailer Logo Dark Mode" 
              className={cn("w-full h-full hidden dark:block", isCollapsed ? "object-cover object-left" : "object-contain object-left")}
            />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 ml-auto">
              <span className="text-[10px] font-medium text-primary tracking-widest uppercase opacity-80 flex items-center gap-1">
                Workspace <Sparkles className="w-3 h-3" />
              </span>
            </div>
          )}
        </Link>
      </div>

      <div className="px-4 mb-2">
        <Separator className="bg-border/50" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                isCollapsed ? "justify-center px-0" : "px-3",
                isActive 
                  ? "text-primary shadow-sm bg-primary/10" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-md shadow-primary/50" />
              )}
              
              <div className={cn(
                "flex items-center justify-center w-8 h-8 shrink-0 rounded-lg transition-all duration-300",
                isActive ? "bg-background shadow-sm text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:bg-background/50 group-hover:shadow-sm",
                isCollapsed && isActive && "ring-1 ring-primary/20 shadow-md scale-110"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300", 
                  isActive && !isCollapsed ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-3"
                )} />
              </div>
              
              {!isCollapsed && (
                <>
                  <span className={cn(
                    "flex-1 transition-transform duration-300 overflow-hidden whitespace-nowrap",
                    isActive ? "translate-x-0" : "group-hover:translate-x-1"
                  )}>
                    {item.name}
                  </span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto text-primary opacity-70 animate-in slide-in-from-left-2 fade-in shrink-0" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 mt-auto">
        <div className={cn(
          "rounded-2xl bg-muted/40 border border-border/50 p-1 backdrop-blur-sm transition-all duration-300",
          isCollapsed ? "flex flex-col items-center gap-2 py-2" : "flex flex-col"
        )}>
          <div className={cn("flex items-center gap-3", isCollapsed ? "p-0" : "px-3 py-3")}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-sm font-bold text-primary-foreground">{initials}</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0 overflow-hidden animate-in fade-in">
                <div className="text-sm font-semibold text-foreground truncate">{user?.name || "User"}</div>
                <div className="text-xs text-muted-foreground truncate font-medium">{user?.email || "user@example.com"}</div>
              </div>
            )}
          </div>
          
          <div className={cn("transition-all duration-300", isCollapsed ? "w-full" : "px-1 pb-1")}>
            {isCollapsed ? (
               <Button 
                variant="ghost" 
                size="icon" 
                title="Sign out"
                className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl h-10"
                onClick={() => signOut({ callbackUrl: '/login' })}
               >
                 <LogOut className="w-5 h-5" />
               </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl h-9"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
