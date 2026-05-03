import Link from "next/link"
import { Mail, Clock, User, ArrowLeft, Share2, Twitter, Linkedin, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  
  if (!post) return { title: "Post Not Found" }
  
  return {
    title: `${post.title} | ColdMailer Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  
  if (!post) notFound()

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
            <Link href="/blog">
              <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest hover:bg-black/5">Back to Blog</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-12 shadow-xl shadow-indigo-200 transition-all font-bold uppercase tracking-widest text-[10px]">
                Try Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative pt-40 pb-32">
        <article className="container mx-auto px-6 max-w-4xl">
          {/* Article Header */}
          <header className="mb-16">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-10 hover:gap-4 transition-all">
               <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-black/[0.03]">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                     <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Written by</p>
                     <p className="text-sm font-bold">{post.author}</p>
                  </div>
               </div>
               <div className="flex items-center gap-10">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Published</p>
                     <p className="text-sm font-bold">{post.date}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Read Time</p>
                     <p className="text-sm font-bold">{post.readTime}</p>
                  </div>
               </div>
            </div>
          </header>

          {/* Social Share (Floating-like) */}
          <div className="flex items-center gap-4 mb-16">
             <span className="text-[10px] font-black uppercase tracking-widest text-black/20">Share</span>
             <div className="flex gap-2">
                {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                   <div key={i} className="w-10 h-10 rounded-full bg-white border border-black/[0.05] flex items-center justify-center hover:bg-black hover:text-white cursor-pointer transition-all">
                      <Icon className="h-4 w-4" />
                   </div>
                ))}
             </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-xl prose-indigo max-w-none prose-headings:tracking-tighter prose-headings:font-bold prose-p:text-black/60 prose-p:leading-relaxed prose-li:text-black/60"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer CTA */}
          <section className="mt-32 p-16 bg-white rounded-[3rem] border border-black/[0.03] shadow-xl shadow-indigo-100/20 text-center">
             <h2 className="text-3xl font-bold tracking-tighter mb-8 italic">Ready to transform your outreach?</h2>
             <p className="text-black/40 font-medium mb-10 max-w-md mx-auto leading-relaxed">
                Join thousands of high-performers who are booking more interviews and scaling their careers with ColdMailer.
             </p>
             <Link href="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-16 px-12 text-xl font-bold shadow-xl shadow-indigo-200 transition-all">
                   Start Sending for Free
                </Button>
             </Link>
          </section>
        </article>
      </main>

      {/* Premium Footer */}
      <footer className="bg-white pt-40 pb-20 border-t border-black/[0.03]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
               <p className="text-[10px] font-black tracking-[0.2em] uppercase text-black/20">© 2026 COLDMAILER PLATFORM. ALL RIGHTS RESERVED.</p>
               <div className="flex gap-6 text-[10px] font-black tracking-[0.2em] uppercase text-black/20">
                  <Link href="/blog" className="hover:text-black">Blog</Link>
                  <Link href="/about" className="hover:text-black">About</Link>
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
