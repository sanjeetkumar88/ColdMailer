"use client"

import Link from "next/link"
import { motion, MotionValue } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, PlayCircle, Command, Mail } from "lucide-react"

import { FadeIn } from "@/components/ui/fade-in"

interface HeroProps {
  y1?: any
  fadeIn?: any
  stagger?: any
}

export function Hero({ y1, fadeIn, stagger }: HeroProps) {
  return (
    <section className="relative pt-40 pb-32">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center rounded-full px-5 py-2 text-xs font-bold tracking-widest bg-white border border-black/[0.05] shadow-sm mb-12 uppercase">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              #1 Automation Tool for Modern Outreach
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-12 leading-[0.95] text-gradient">
              Cold email <br />
              <span className="text-indigo-600 italic">automation.</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-2xl text-black/40 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
              The modern standard for high-volume, personalized outreach. Rotate multiple senders, bypass spam filters, and land every job interview with AI-driven precision.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-16 px-12 text-xl font-bold shadow-2xl shadow-indigo-200 w-full active:scale-95 transition-all">
                  Start Sending Free
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="rounded-2xl h-16 px-12 text-xl font-bold hover:bg-black/5 w-full sm:w-auto gap-2">
                <PlayCircle className="h-6 w-6" />
                Watch Demo
              </Button>
            </div>
          </FadeIn>

          {/* Dashboard Preview */}
          <motion.div 
            style={{ y: y1 }}
            variants={fadeIn}
            className="relative mx-auto max-w-6xl rounded-[3rem] border border-black/[0.05] bg-white p-6 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)]"
          >
             <div className="rounded-[2.5rem] bg-[#f8f9ff] aspect-[16/10] overflow-hidden flex flex-col relative">
              <div className="h-16 border-b border-black/[0.03] flex items-center justify-between px-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-8 px-4 rounded-full bg-white border border-black/[0.05] flex items-center gap-2 text-[10px] font-bold text-black/30 tracking-widest uppercase">
                  <Command className="h-3 w-3" />
                  Command Center
                </div>
              </div>
              <div className="flex-1 p-10 grid grid-cols-12 gap-10 text-left">
                <div className="col-span-8 space-y-10">
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { label: 'DELIVERED', value: '48.2k', up: '+22%' },
                      { label: 'OPEN RATE', value: '64.5%', up: '+8%' },
                      { label: 'REPLIES', value: '1,248', up: '+15%' }
                    ].map((s, i) => (
                      <div key={i} className="bg-white rounded-3xl p-8 border border-black/[0.03] shadow-sm">
                        <p className="text-[10px] font-black tracking-[0.2em] text-black/20 mb-4 uppercase">{s.label}</p>
                        <div className="flex items-end justify-between">
                          <p className="text-4xl font-bold tracking-tighter">{s.value}</p>
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{s.up}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-64 rounded-[2.5rem] bg-white border border-black/[0.03] p-10 relative overflow-hidden">
                     <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Campaign Velocity</h4>
                        <div className="flex gap-2">
                           <div className="w-4 h-4 rounded-full bg-indigo-600" />
                           <div className="w-4 h-4 rounded-full bg-indigo-200" />
                        </div>
                     </div>
                     <div className="flex items-end gap-3 h-32">
                        {[20, 45, 30, 80, 55, 90, 40, 75, 60, 85, 30, 50].map((h, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              transition={{ delay: i * 0.05, duration: 1 }}
                              className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full" 
                            />
                        ))}
                     </div>
                  </div>
                </div>
                <div className="col-span-4 bg-white rounded-[2.5rem] border border-black/[0.03] p-10 flex flex-col justify-between">
                   <div className="space-y-8">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-black/40">Infrastructure</h4>
                      {[1,2,3].map(i => (
                         <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase text-black/30">
                               <span>Node_{i}.mail</span>
                               <span>99%</span>
                            </div>
                            <div className="h-2 bg-black/[0.03] rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: '99%' }}
                                 transition={{ duration: 2 }}
                                 className="h-full bg-emerald-500" 
                               />
                            </div>
                         </div>
                      ))}
                   </div>
                   <Button className="w-full bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] h-14">
                      Scale Infrastructure
                   </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
