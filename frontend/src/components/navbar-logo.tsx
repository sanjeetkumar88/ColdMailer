"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export function NavbarLogo({ className, iconClassName }: { className?: string, iconClassName?: string }) {
  return (
    <div className={className || "flex items-center group transition-all"}>
      <div className={iconClassName || "relative flex items-center w-36 h-10 transition-all duration-300"}>
        <img 
          src="/logo.png" 
          alt="ColdMailer Logo" 
          className="w-full h-full object-contain object-left dark:hidden"
        />
        <img 
          src="/logo-dark.png" 
          alt="ColdMailer Logo Dark Mode" 
          className="w-full h-full object-contain object-left hidden dark:block"
        />
      </div>
    </div>
  )
}
