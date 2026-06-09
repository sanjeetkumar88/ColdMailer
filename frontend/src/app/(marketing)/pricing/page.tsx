"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { FAQ } from "@/components/marketing/trust/faq";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
          No complex tiers. No hidden deliverability fees. Just one plan that scales with you.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-left">
          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col"
          >
            <h3 className="text-2xl font-semibold mb-2">Starter</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">$37</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            
            <AnimatedButton asChild variant="outline" size="lg" className="w-full mb-8">
              <Link href="/signup">Start Free Trial</Link>
            </AnimatedButton>
            
            <div className="space-y-4 flex-1">
              {[
                "Unlimited email sending accounts",
                "Unlimited email warmup",
                "5,000 emails/month",
                "1,000 AI personalization credits",
                "Basic analytics"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Growth Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl border border-primary/30 bg-primary/5 relative overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.1)] flex flex-col"
          >
            <div className="absolute top-0 right-0 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-bl-xl">
              Most Popular
            </div>
            <h3 className="text-2xl font-semibold mb-2">Growth</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">$97</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            
            <AnimatedButton asChild size="lg" className="w-full mb-8">
              <Link href="/signup">Start Free Trial</Link>
            </AnimatedButton>
            
            <div className="space-y-4 flex-1">
              {[
                "Unlimited email sending accounts",
                "Unlimited email warmup",
                "100,000 emails/month",
                "10,000 AI personalization credits",
                "Advanced A/B testing & analytics",
                "API access & webhooks"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col"
          >
            <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">Custom</span>
            </div>
            
            <AnimatedButton asChild variant="outline" size="lg" className="w-full mb-8">
              <Link href="/demo">Contact Sales</Link>
            </AnimatedButton>
            
            <div className="space-y-4 flex-1">
              {[
                "Everything in Growth",
                "Unlimited email sending volume",
                "Custom AI models trained on your data",
                "Dedicated deliverability consultant",
                "SLA & priority support",
                "Custom integrations"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
