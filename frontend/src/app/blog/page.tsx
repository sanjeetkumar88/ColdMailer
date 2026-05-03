"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Search, ArrowRight, Clock, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog-data"
import { Badge } from "@/components/ui/badge"

export default function BlogPage() {
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
            <Link href="/about">
              <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest hover:bg-black/5">About</Button>
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
          <section className="max-w-4xl mx-auto text-center mb-32">
            <motion.h1 variants={fadeIn} initial="initial" whileInView="whileInView" className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.95] text-gradient">
               Outreach <br />
               <span className="text-indigo-600 italic">Insights.</span>
            </motion.h1>
            <motion.p variants={fadeIn} initial="initial" whileInView="whileInView" className="text-xl text-black/40 font-medium max-w-2xl mx-auto">
              Master the art of cold email, recruiter outreach, and career growth with our latest guides and articles.
            </motion.p>
          </section>

          {/* Search Bar */}
          <section className="max-w-xl mx-auto mb-32">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-black/20" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full h-16 pl-16 pr-6 rounded-3xl bg-white border border-black/[0.05] shadow-xl shadow-indigo-100/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-lg"
              />
            </div>
          </section>

          {/* Blog Grid */}
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post, i) => (
              <motion.div 
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-black/[0.03] rounded-[3rem] p-10 hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">{post.category}</Badge>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-black/20 uppercase tracking-widest">
                       <Clock className="h-3 w-3" />
                       {post.readTime}
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-bold mb-6 group-hover:text-indigo-600 transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-black/40 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-black/[0.03]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                       <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all">
                     Read <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </section>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-white pt-40 pb-20 border-t border-black/[0.03]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
               <p className="text-[10px] font-black tracking-[0.2em] uppercase text-black/20">© 2026 COLDMAILER PLATFORM. ALL RIGHTS RESERVED.</p>
               <div className="hidden md:flex gap-6 text-[10px] font-black tracking-[0.2em] uppercase text-black/20">
                  <Link href="/about" className="hover:text-black">About</Link>
                  <Link href="/" className="hover:text-black">Home</Link>
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
