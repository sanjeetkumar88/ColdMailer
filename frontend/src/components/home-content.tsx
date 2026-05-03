"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Mail, PlayCircle, Globe, 
} from "lucide-react"

// Import Sections
import { Hero } from "./sections/hero"

// Dynamic Imports for below-the-fold sections
const UseCases = dynamic(() => import("./sections/use-cases").then(mod => mod.UseCases), {
  loading: () => <div className="h-[600px] animate-pulse bg-white/50" />,
  ssr: true
})

const Features = dynamic(() => import("./sections/features").then(mod => mod.Features), {
  loading: () => <div className="h-[800px] animate-pulse bg-[#fafafa]" />,
  ssr: true
})

const FAQ = dynamic(() => import("./sections/faq").then(mod => mod.FAQ), {
  loading: () => <div className="h-[600px] animate-pulse bg-white" />,
  ssr: true
})

const Testimonials = dynamic(() => import("./sections/testimonials").then(mod => mod.Testimonials), {
  loading: () => <div className="h-[600px] animate-pulse bg-[#111111] rounded-[4rem] mx-6" />,
  ssr: true
})

export function HomeContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }

  const stagger = {
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-indigo-100 overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-noise" />

      {/* Navigation */}
      <header className="fixed top-0 z-[60] w-full border-b border-black/[0.03] bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 animate-float">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">ColdMailer</span>
          </div>
          <nav className="hidden lg:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-black/40">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link>
            <Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
            <Link href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest hover:bg-black/5">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12 shadow-xl shadow-indigo-200 transition-all active:scale-95 font-bold uppercase tracking-widest text-[10px]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 animate-pulse" />

        <Hero y1={y1} fadeIn={fadeIn} stagger={stagger} />

        <UseCases />

        <Features />

        <FAQ />

        <Testimonials fadeIn={fadeIn} />

        {/* Final CTA */}
        <section className="py-40 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 max-w-4xl mx-auto italic">
              Start your outbound <br />
              evolution today.
            </h2>
            <Link href="/login">
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-20 px-16 text-2xl font-bold shadow-2xl shadow-indigo-200 transition-all active:scale-95">
                 Get Started for Free
               </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="relative bg-white pt-40 pb-20 border-t border-black/[0.03]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-20 mb-32">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold tracking-tighter">ColdMailer</span>
              </div>
              <p className="text-2xl font-medium text-black/30 leading-relaxed mb-12 max-w-sm">
                The modern standard for high-deliverability cold outreach and job application automation.
              </p>
              <div className="flex gap-4">
                 {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-full bg-[#fafafa] border border-black/[0.05] flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer"><Globe className="h-5 w-5" /></div>)}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <p className="font-black text-[10px] tracking-[0.2em] uppercase text-black/20 mb-10">Platform</p>
                <ul className="space-y-6 text-sm font-bold tracking-tight text-black/50">
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Deliverability</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Sender Rotation</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">AI Writing</Link></li>
                  <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                  <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-black text-[10px] tracking-[0.2em] uppercase text-black/20 mb-10">Learn</p>
                <ul className="space-y-6 text-sm font-bold tracking-tight text-black/50">
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Cold Email Guide</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Job Search Strategy</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">API Reference</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-black text-[10px] tracking-[0.2em] uppercase text-black/20 mb-10">Company</p>
                <ul className="space-y-6 text-sm font-bold tracking-tight text-black/50">
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Security</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Legal</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-black/[0.03] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
               <p className="text-[10px] font-black tracking-[0.2em] uppercase text-black/20">© 2026 COLDMAILER PLATFORM. ALL RIGHTS RESERVED.</p>
               <div className="hidden md:flex gap-6 text-[10px] font-black tracking-[0.2em] uppercase text-black/20">
                  <Link href="#" className="hover:text-black">Privacy</Link>
                  <Link href="#" className="hover:text-black">Terms</Link>
                  <Link href="#" className="hover:text-black">Cookies</Link>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black tracking-[0.2em] uppercase text-black/30">Network Status: Optimal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
