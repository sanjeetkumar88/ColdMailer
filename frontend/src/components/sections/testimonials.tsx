import { Star } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

interface TestimonialsProps {
  fadeIn?: any
}

export function Testimonials({ fadeIn }: TestimonialsProps) {
  return (
    <section className="py-40 bg-[#111111] text-white rounded-[4rem] mx-6">
      <div className="container mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-24 italic">Loved by the world's most ambitious.</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-12 text-left text-white">
          {[
            { name: "Sanjeet Kumar", role: "Software Engineer", quote: "ColdMailer helped me land 12 interviews in 2 weeks. The personalization variables are a game changer for job hunters." },
            { name: "Sarah Chen", role: "Growth Lead @ Vortex", quote: "We scaled our B2B outreach with zero drop in deliverability. It's the most stable platform we've ever used." },
            { name: "James Wilson", role: "Tech Founder", quote: "Intuitive, fast, and secure. The UI alone makes me want to send more emails. Truly a next-gen tool." }
          ].map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-xl h-full">
                <div className="flex gap-1 mb-8">
                   {[1,2,3,4,5].map(j => <Star key={j} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-xl mb-12 opacity-80 italic leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-lg">{t.name}</p>
                  <p className="text-sm opacity-40 uppercase tracking-widest font-bold">{t.role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

