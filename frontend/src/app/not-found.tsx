"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-indigo-100 items-center justify-center p-6 text-center">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] filter contrast-[150%] brightness-[1000%]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-200 inline-block mb-12 animate-bounce">
          <Mail className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-8xl font-bold tracking-tighter mb-4 text-indigo-600">404</h1>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Lost in the Mail.</h2>
        
        <p className="text-black/40 text-lg mb-12 leading-relaxed font-medium">
          The page you're looking for was either moved, deleted, or never existed in our system.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 font-bold uppercase tracking-widest text-xs gap-2">
              <Home className="h-4 w-4" />
              Back Home
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 border-black/10 rounded-2xl h-14 font-bold uppercase tracking-widest text-xs gap-2 hover:bg-black/5" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-20 pt-12 border-t border-black/[0.03] flex items-center justify-center gap-2">
           <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
           <span className="text-[10px] font-black tracking-[0.2em] uppercase text-black/20">MailFlow Error Protocol 404</span>
        </div>
      </motion.div>
    </div>
  )
}
