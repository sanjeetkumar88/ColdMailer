"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect Your Inboxes",
    description: "Link your Google Workspace or Outlook accounts in seconds. We handle the technical setup and DNS configuration automatically."
  },
  {
    number: "02",
    title: "Build Your Audience",
    description: "Import your leads via CSV, sync with your CRM, or use our built-in B2B database to find your ideal buyers."
  },
  {
    number: "03",
    title: "Launch & Optimize",
    description: "Set up multi-step sequences with conditional logic. Watch the replies roll into your unified master inbox."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white/[0.02] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">How it works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From zero to sending campaigns in under 5 minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent hidden md:block" />

          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-2xl bg-background border border-white/10 flex items-center justify-center text-3xl font-bold text-primary mb-8 mx-auto shadow-xl relative z-10">
                  {step.number}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
