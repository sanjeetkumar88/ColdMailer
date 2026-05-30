"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Mail } from "lucide-react"

export function NavBarLogo({ className, iconClassName, textClassName }: { className?: string, iconClassName?: string, textClassName?: string }) {
  const { status } = useSession()
  const href = status === "authenticated" ? "/dashboard" : "/"
  
  return (
    <Link href={href} className={className || "flex items-center gap-3"}>
      <div className={iconClassName || "bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 animate-float"}>
        <Mail className="h-5 w-5 text-white" />
      </div>
      <span className={textClassName || "text-2xl font-bold tracking-tighter"}>ColdMailer</span>
    </Link>
  )
}
