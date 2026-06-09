"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2 } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="py-24 bg-white/[0.02] border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">The old way is broken</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Traditional cold email tools limit your growth, burn your domains, and waste your time. We built Antigravity to fix this.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-destructive/20 text-destructive">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">The Old Way</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Managing multiple inboxes across 10 different tabs",
                "Domains landing in spam because of poor warmup",
                "Generic templated emails that get ignored",
                "Manually tracking replies and updating CRMs",
                "Paying extra for basic deliverability features"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-destructive mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-2xl border border-success/20 bg-success/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 rounded-full bg-success/20 text-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">The Antigravity Way</h3>
            </div>
            <ul className="space-y-4 relative z-10">
              {[
                "One unified master inbox for unlimited sending accounts",
                "Automated domain rotation and intelligent warmup",
                "AI-powered personalization that sounds human",
                "Native 2-way CRM sync and automated lead scoring",
                "Everything included. No hidden deliverability fees."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground font-medium">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
