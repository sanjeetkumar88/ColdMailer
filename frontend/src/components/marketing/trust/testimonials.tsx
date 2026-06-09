"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "ColdMailer completely transformed our outbound motion. We went from booking 5 meetings a month to 45, without scaling our SDR team.",
    author: "Sarah Jenkins",
    role: "VP Sales at HyperGrowth",
    avatar: "S"
  },
  {
    quote: "The deliverability infrastructure is insane. We migrated from another platform and instantly saw our open rates jump from 25% to 68%.",
    author: "David Chen",
    role: "Founder at AgencyScale",
    avatar: "D"
  },
  {
    quote: "The AI personalization actually sounds like a human wrote it. It saves our reps hours of manual research every single day.",
    author: "Michael Roberts",
    role: "Head of Growth at TechStack",
    avatar: "M"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white/[0.02] border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Loved by revenue leaders</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. See what top teams are saying about ColdMailer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl border border-white/5 bg-background hover:border-white/10 transition-colors flex flex-col justify-between"
            >
              <div className="mb-6">
                {/* 5 Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-foreground italic leading-relaxed">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

