"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import Link from "next/link";

export function PricingPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to scale your outreach, in one simple plan.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-semibold mb-2">Growth Plan</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">$97</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            
            <AnimatedButton asChild size="lg" className="w-full mb-8">
              <Link href="/signup">Start 14-Day Free Trial</Link>
            </AnimatedButton>
            
            <div className="space-y-4">
              {[
                "Unlimited email sending accounts",
                "Unlimited email warmup",
                "25,000 active leads/month",
                "AI personalization credits included",
                "A/B testing & analytics",
                "API access & webhooks"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
