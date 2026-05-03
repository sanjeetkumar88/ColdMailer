"use client"

import { Briefcase, TrendingUp, CheckCircle2 } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

export function UseCases() {
  return (
    <section id="use-cases" className="py-40 bg-white">
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 italic">One platform. Endless opportunities.</h2>
            <p className="text-xl text-black/40 font-medium">Whether you're a job seeker looking for your dream role or a sales team scaling outreach, ColdMailer is built for you.</p>
          </div>
        </FadeIn>
        
        <div className="grid md:grid-cols-2 gap-16">
          <FadeIn direction="right">
            <div className="bg-[#f8f9ff] rounded-[3rem] p-16 relative overflow-hidden h-full">
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
          </FadeIn>
          <FadeIn direction="left" delay={0.1}>
            <div className="bg-[#fffcf8] rounded-[3rem] p-16 relative overflow-hidden h-full">
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
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

