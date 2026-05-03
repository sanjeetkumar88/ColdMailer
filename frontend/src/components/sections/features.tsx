"use client"

import { Shield, Cpu, Lock, Database } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-40 bg-[#fafafa]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-32 items-center mb-40">
           <div>
              <p className="text-indigo-600 font-bold text-sm tracking-[0.2em] mb-6 uppercase">The Infrastructure</p>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-10 leading-tight">Built for <br /> zero-fail delivery.</h2>
              <p className="text-xl text-black/40 leading-relaxed max-w-lg font-medium">We don't just send emails. We engineer deliverability through a distributed network of secure senders.</p>
              
              <div className="mt-12 space-y-6 text-black/50 text-sm leading-relaxed max-w-md">
                <p>Our distributed architecture ensures that your campaigns are never tied to a single point of failure. By leveraging edge computing and real-time sender health monitoring, we maintain a 99.9% inbox placement rate.</p>
                <p>Every email sent through ColdMailer undergoes a proprietary "Spam-Check" protocol, analyzing content against modern filter algorithms before it ever leaves our servers.</p>
              </div>
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
  )
}
