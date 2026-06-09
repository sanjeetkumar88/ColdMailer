"use client"

import Link from "next/link"
import { Zap } from "lucide-react"

export function NavbarLogo({ className, iconClassName }: { className?: string, iconClassName?: string }) {
  return (
    <div className={className || "flex items-center gap-2 group transition-all"}>
      <div className={iconClassName || "relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300"}>
        <Zap className="w-4 h-4 text-white" />
        <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}
