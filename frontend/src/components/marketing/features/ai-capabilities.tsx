"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, PenTool, Search } from "lucide-react";
import { GradientText } from "@/components/ui/gradient-text";

export function AICapabilities() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/2" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>Antigravity AI</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              Hyper-personalization at <GradientText>scale</GradientText>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Stop sending generic templates. Our AI researches your prospects, writes highly relevant opening lines, and categorizes incoming replies automatically.
            </motion.p>

            <div className="space-y-6">
              {[
                {
                  icon: <Search className="w-5 h-5 text-secondary" />,
                  title: "Deep Prospect Research",
                  desc: "Scrapes LinkedIn, recent news, and company websites to find relevant hooks."
                },
                {
                  icon: <PenTool className="w-5 h-5 text-primary" />,
                  title: "AI Icebreakers",
                  desc: "Generates custom opening lines that sound human and drastically increase reply rates."
                },
                {
                  icon: <Bot className="w-5 h-5 text-success" />,
                  title: "Automated Reply Handling",
                  desc: "Categorizes replies (Positive, Out of Office, Unsubscribe) and takes action automatically."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
            <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary p-[1px]">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">AI Agent</div>
                    <div className="text-xs text-muted-foreground">Generating personalization...</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm font-mono text-muted-foreground">
                  <span className="text-secondary">&gt;</span> Analyzing profile: Sarah Jenkins (VP Sales at Acme Corp)
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm font-mono text-muted-foreground">
                  <span className="text-secondary">&gt;</span> Found recent post: "Scaling sales teams in Q3"
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-white leading-relaxed">
                    "Hi Sarah, loved your recent post about scaling sales teams in Q3. I know managing quota attainment across a growing team can be challenging..."
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-success font-medium">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Ready to send
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
