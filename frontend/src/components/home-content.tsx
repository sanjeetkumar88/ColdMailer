import Link from "next/link"
import dynamic from "next/dynamic"
import { Mail, ArrowRight, Menu, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavBarLogo } from "./navbar-logo"

// Dynamic Imports for sections - keeping SSR: true for initial HTML delivery
const Hero = dynamic(() => import("./sections/hero").then(mod => mod.Hero), { 
  ssr: true,
  loading: () => <div className="h-screen bg-indigo-50/10 animate-pulse" />
})

const UseCases = dynamic(() => import("./sections/use-cases").then(mod => mod.UseCases), { 
  ssr: true,
  loading: () => <div className="h-[600px] bg-white/50 animate-pulse" />
})

const Features = dynamic(() => import("./sections/features").then(mod => mod.Features), { 
  ssr: true,
  loading: () => <div className="h-[800px] bg-[#fafafa] animate-pulse" />
})

const FAQ = dynamic(() => import("./sections/faq").then(mod => mod.FAQ), { 
  ssr: true,
  loading: () => <div className="h-[600px] bg-white animate-pulse" />
})

const Testimonials = dynamic(() => import("./sections/testimonials").then(mod => mod.Testimonials), { 
  ssr: true,
  loading: () => <div className="h-[600px] bg-[#111111] rounded-[4rem] mx-6 animate-pulse" />
})

export function HomeContent() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-indigo-100 overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-noise" />

      {/* Navigation */}
      <header className="fixed top-0 z-[60] w-full border-b border-black/[0.03] bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NavBarLogo />
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
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12 shadow-xl shadow-indigo-200 transition-all active:scale-95 font-bold uppercase tracking-widest text-[10px] group">
                Get Started
                <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 animate-pulse" />

        {/* Hero Section - The props are now optional in the sub-component */}
        <Hero />
        <UseCases />
        <Features />
        <FAQ />
        <Testimonials />

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
                </ul>
              </div>
              <div>
                <p className="font-black text-[10px] tracking-[0.2em] uppercase text-black/20 mb-10">Learn</p>
                <ul className="space-y-6 text-sm font-bold tracking-tight text-black/50">
                  <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Cold Email Guide</Link></li>
                  <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Job Search Strategy</Link></li>
                  <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Success Stories</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-black text-[10px] tracking-[0.2em] uppercase text-black/20 mb-10">Company</p>
                <ul className="space-y-6 text-sm font-bold tracking-tight text-black/50">
                  <li><Link href="/about" className="hover:text-indigo-600 transition-colors">Our Story</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                  <li><Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-black/[0.03] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
               <p className="text-[10px] font-black tracking-[0.2em] uppercase text-black/20">© 2026 COLDMAILER PLATFORM. ALL RIGHTS RESERVED.</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black tracking-[0.2em] uppercase text-black/30">Infrastructure: Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
