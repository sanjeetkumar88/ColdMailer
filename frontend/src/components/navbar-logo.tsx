"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export function NavbarLogo({ className, iconClassName }: { className?: string, iconClassName?: string }) {
  return (
    <div className={className || "flex items-center gap-2 group transition-all"}>
      <div className={iconClassName || "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300"}>
        <img 
          src="/logo.png" 
          alt="ColdMailer Logo" 
          className="w-full h-full object-contain rounded-lg"
        />
        <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}
