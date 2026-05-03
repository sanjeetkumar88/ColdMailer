"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, Mail, Zap, BarChart2, 
  Send, Shield, CheckCircle2,
  Settings, Layers, Rocket, Globe, Sparkles,
  Command, ChevronRight, PlayCircle, Star,
  HelpCircle, Cpu, Lock, Database,
  Briefcase, TrendingUp, Search, MessageSquare
} from "lucide-react"

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
            <Link href="#use-cases" className="hover:text-indigo-600 transition-colors">Use Cases</Link>
            <Link href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
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

        {/* Hero Section */}
        <section className="relative pt-40 pb-32">
          <div className="container mx-auto px-6 text-center">
            <motion.div 
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-5xl mx-auto"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center rounded-full px-5 py-2 text-xs font-bold tracking-widest bg-white border border-black/[0.05] shadow-sm mb-12 uppercase">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                #1 Automation Tool for Modern Outreach
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-12 leading-[0.95] text-gradient">
                Cold email <br />
                <span className="text-indigo-600 italic">automation.</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-2xl text-black/40 mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
                The modern standard for high-volume, personalized outreach. Rotate multiple senders, bypass spam filters, and land every job interview with AI-driven precision.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-16 px-12 text-xl font-bold shadow-2xl shadow-indigo-200 w-full active:scale-95 transition-all">
                    Start Sending Free
                  </Button>
                </Link>
                <Button size="lg" variant="ghost" className="rounded-2xl h-16 px-12 text-xl font-bold hover:bg-black/5 w-full sm:w-auto gap-2">
                  <PlayCircle className="h-6 w-6" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Dashboard Preview */}
              <motion.div 
                style={{ y: y1 }}
                variants={fadeIn}
                className="relative mx-auto max-w-6xl rounded-[3rem] border border-black/[0.05] bg-white p-6 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)]"
              >
                 {/* ... (Dashboard UI remains same as previous high-end version) ... */}
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
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section (NEW - Heavy Content) */}
        <section id="use-cases" className="py-40 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-32">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 italic">One platform. Endless opportunities.</h2>
              <p className="text-xl text-black/40 font-medium">Whether you're a job seeker looking for your dream role or a sales team scaling outreach, ColdMailer is built for you.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16">
              <div className="bg-[#f8f9ff] rounded-[3rem] p-16 relative overflow-hidden">
                <Briefcase className="h-16 w-16 text-indigo-600 mb-10" />
                <h3 className="text-3xl font-bold mb-6">For Job Seekers & Professionals</h3>
                <p className="text-black/50 mb-10 leading-relaxed text-lg">In today's competitive job market, applying manually isn't enough. ColdMailer's automated outreach lets you reach 50+ recruiters daily with uniquely personalized messages, increasing your interview rate by up to 300%.</p>
                <ul className="space-y-4">
                  {["Automated follow-up sequences", "AI-driven resume tailoring", "Recruiter relationship management"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-bold text-sm text-indigo-600 uppercase tracking-widest">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#fffcf8] rounded-[3rem] p-16 relative overflow-hidden">
                <TrendingUp className="h-16 w-16 text-amber-600 mb-10" />
                <h3 className="text-3xl font-bold mb-6">For B2B Sales & Growth Teams</h3>
                <p className="text-black/50 mb-10 leading-relaxed text-lg">Scale your B2B lead generation and prospecting without hitting spam folders. Our multi-sender rotation engine mimics human behavior, ensuring your sales outreach lands in the primary inbox every time.</p>
                <ul className="space-y-4">
                  {["Domain rotation & warming", "A/B testing email templates", "Detailed reply tracking analytics"].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-bold text-sm text-amber-600 uppercase tracking-widest">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Deep Dive (Expanded) */}
        <section id="features" className="py-40 bg-[#fafafa]">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-32 items-center mb-40">
               <div>
                  <p className="text-indigo-600 font-bold text-sm tracking-[0.2em] mb-6 uppercase">The Infrastructure</p>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-10 leading-tight">Built for <br /> zero-fail delivery.</h2>
                  <p className="text-xl text-black/40 leading-relaxed max-w-lg font-medium">We don't just send emails. We engineer deliverability through a distributed network of secure senders.</p>
               </div>
               <div className="grid sm:grid-cols-2 gap-8 text-left">
                  {[
                    { icon: <Shield className="text-rose-500" />, title: "Ban-Proof Logic", desc: "Our rotation system mimics human behavior patterns, including typing speeds and random delay offsets, to keep your domains alive and healthy." },
                    { icon: <Cpu className="text-indigo-500" />, title: "AI Variable Engine", desc: "Go beyond 'Hi [Name]'. Our engine allows you to inject custom logic and AI-generated snippets into every single email for maximum relevance." },
                    { icon: <Lock className="text-amber-500" />, title: "Secure SMTP / OAuth", desc: "Connect via Google OAuth, Microsoft Graph, or standard SMTP with enterprise-grade encryption. Your credentials never touch our database in plain text." },
                    { icon: <Database className="text-emerald-500" />, title: "Cloud Contact Sync", desc: "Manage thousands of leads with our high-speed database. Import CSVs, sync with Google Sheets, and tag recipients for granular targeting." }
                  ].map((f, i) => (
                    <div key={i} className="bg-white border border-black/[0.03] p-10 rounded-[2.5rem] hover:shadow-xl transition-all group">
                       <div className="mb-6 bg-[#fafafa] p-4 rounded-2xl w-fit shadow-sm border border-black/[0.03] group-hover:scale-110 transition-transform">
                          {f.icon}
                       </div>
                       <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                       <p className="text-black/40 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* FAQ Section (NEW - Massive for SEO) */}
        <section id="faq" className="py-40 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-6xl font-bold tracking-tighter italic">Everything you need to know.</h2>
            </div>
            
            <div className="space-y-8 text-left">
              {[
                { 
                  q: "How does ColdMailer protect my email domain reputation?", 
                  a: "ColdMailer uses a proprietary 'Multi-Sender Rotation' engine. Instead of sending 500 emails from one account, it sends 10 emails from 50 different accounts. This mimics natural human behavior and prevents your domain from being flagged as a spammer by Gmail and Outlook."
                },
                { 
                  q: "Can I use ColdMailer for job applications?", 
                  a: "Absolutely. ColdMailer was originally designed for high-end professional outreach. You can upload a list of recruiters, use our dynamic variables to mention specific job titles or company values, and automate your follow-ups to stay on top of their inbox."
                },
                { 
                  q: "Do I need technical skills to set up ColdMailer?", 
                  a: "No. Our dashboard is designed for ease of use. Connecting a sender takes 30 seconds via OAuth (Google/Microsoft), and our template editor works just like any modern document editor."
                },
                { 
                  q: "What is the difference between ColdMailer and Mailchimp?", 
                  a: "Mailchimp is for newsletters (marketing emails). ColdMailer is for cold outreach (sales/networking). Mailchimp emails land in the 'Promotions' tab; ColdMailer emails land in the 'Primary' inbox because they are sent via your actual mail server."
                },
                { 
                  q: "Is there a limit to how many emails I can send?", 
                  a: "On the Starter plan, you can send up to 1,000 emails per month. Our Pro plan offers unlimited sending, restricted only by the daily limits of your connected email providers (usually 2,000/day per Gmail account)."
                }
              ].map((faq, i) => (
                <div key={i} className="p-10 bg-[#fafafa] border border-black/[0.03] rounded-[2.5rem] hover:bg-white transition-all">
                  <div className="flex items-start gap-4">
                     <HelpCircle className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                     <div>
                        <h4 className="text-xl font-bold mb-4">{faq.q}</h4>
                        <p className="text-black/40 leading-relaxed font-medium">{faq.a}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-40 bg-[#111111] text-white rounded-[4rem] mx-6">
          <div className="container mx-auto px-6 text-center">
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-24 italic">Loved by the world's most ambitious.</h2>
              <div className="grid md:grid-cols-3 gap-12 text-left text-white">
                {[
                  { name: "Sanjeet Kumar", role: "Software Engineer", quote: "ColdMailer helped me land 12 interviews in 2 weeks. The personalization variables are a game changer for job hunters." },
                  { name: "Sarah Chen", role: "Growth Lead @ Vortex", quote: "We scaled our B2B outreach with zero drop in deliverability. It's the most stable platform we've ever used." },
                  { name: "James Wilson", role: "Tech Founder", quote: "Intuitive, fast, and secure. The UI alone makes me want to send more emails. Truly a next-gen tool." }
                ].map((t, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="flex gap-1 mb-8">
                       {[1,2,3,4,5].map(j => <Star key={j} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
                    </div>
                    <p className="text-xl mb-12 opacity-80 italic leading-relaxed">"{t.quote}"</p>
                    <div>
                      <p className="font-bold text-lg">{t.name}</p>
                      <p className="text-sm opacity-40 uppercase tracking-widest font-bold">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

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
