"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Globe, Sparkles, Heart, Shield, Zap, Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-indigo-100 overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-noise" />

      {/* Navigation */}
      <header className="fixed top-0 z-[60] w-full border-b border-black/[0.03] bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 animate-float">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">ColdMailer</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest hover:bg-black/5">Home</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest hover:bg-black/5">Blog</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12 shadow-xl shadow-indigo-200 transition-all font-bold uppercase tracking-widest text-[10px]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative pt-40 pb-32">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 animate-pulse" />

        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <section className="max-w-4xl mx-auto text-center mb-40">
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" className="inline-flex items-center rounded-full px-5 py-2 text-xs font-bold tracking-widest bg-white border border-black/[0.05] shadow-sm mb-12 uppercase">
              <Heart className="mr-2 h-3.5 w-3.5 text-rose-500 fill-rose-500" />
              Our Mission
            </motion.div>
            <motion.h1 variants={fadeIn} initial="initial" whileInView="whileInView" className="text-6xl md:text-8xl font-bold tracking-tighter mb-12 leading-[0.95] text-gradient">
              Automating the <br />
              <span className="text-indigo-600 italic">modern job hunt.</span>
            </motion.h1>
            <motion.p variants={fadeIn} initial="initial" whileInView="whileInView" className="text-xl md:text-2xl text-black/40 leading-relaxed font-medium">
              We started ColdMailer because we believe the job application process is broken. Applying manually to hundreds of jobs is a full-time job in itself. We're here to change that.
            </motion.p>
          </section>

          {/* Story Section */}
          <section className="grid lg:grid-cols-2 gap-20 items-center mb-40">
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" className="relative">
              <div className="aspect-[4/5] bg-indigo-50 rounded-[3rem] overflow-hidden relative border border-black/[0.05] shadow-2xl">
                 {/* Visual Placeholder for Founder/Team */}
                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-indigo-600/20">
                    <Sparkles className="h-40 w-40 text-indigo-600 opacity-20" />
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2.5rem] border border-black/[0.05] shadow-2xl max-w-[280px]">
                <p className="text-sm font-bold italic text-black/60">"Outreach shouldn't feel like a chore. It should feel like an opportunity."</p>
              </div>
            </motion.div>
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" className="space-y-8">
              <h2 className="text-4xl font-bold tracking-tighter">The ColdMailer Story</h2>
              <p className="text-lg text-black/50 leading-relaxed font-medium">
                ColdMailer was born out of frustration. Our founders were seeing incredibly talented engineers and marketers getting lost in the "black hole" of online applications.
              </p>
              <p className="text-lg text-black/50 leading-relaxed font-medium">
                We realized that the most successful candidates weren't just clicking "Apply"—they were reaching out directly. But direct outreach doesn't scale... until now.
              </p>
              <div className="pt-8 grid grid-cols-2 gap-8">
                <div>
                   <p className="text-4xl font-bold text-indigo-600 tracking-tighter">1M+</p>
                   <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mt-2">Emails Delivered</p>
                </div>
                <div>
                   <p className="text-4xl font-bold text-indigo-600 tracking-tighter">12k+</p>
                   <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mt-2">Interviews Booked</p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Values Section */}
          <section className="py-32 bg-white rounded-[4rem] px-12 border border-black/[0.03] shadow-sm mb-40">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-bold tracking-tighter italic">Values that drive us.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: <Shield className="text-rose-500" />, title: "Trust First", desc: "Your email reputation is our top priority. Every feature we build is designed to protect your domain." },
                { icon: <Zap className="text-indigo-500" />, title: "Built for Speed", desc: "No bloat. No complex workflows. Just high-speed, effective outreach that gets results." },
                { icon: <Target className="text-emerald-500" />, title: "Radical Focus", desc: "We focus on one thing: getting your emails into the primary inbox. Everything else is secondary." }
              ].map((v, i) => (
                <div key={i} className="space-y-6">
                  <div className="bg-[#fafafa] p-5 rounded-2xl w-fit border border-black/[0.03] shadow-sm">
                    {v.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{v.title}</h3>
                  <p className="text-black/40 font-medium leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center">
            <h2 className="text-5xl font-bold tracking-tighter mb-12 italic">Join the outreach revolution.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-16 px-12 text-xl font-bold shadow-2xl shadow-indigo-200 transition-all active:scale-95">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost" className="h-16 px-12 text-xl font-bold hover:bg-black/5 gap-2">
                  Read our Blog <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-white pt-40 pb-20 border-t border-black/[0.03]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">ColdMailer</span>
            </div>
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-black/20">© 2026 COLDMAILER PLATFORM. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4">
              <Globe className="h-5 w-5 text-black/20 hover:text-black cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
