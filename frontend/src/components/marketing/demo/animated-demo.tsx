"use client";

import { motion } from "framer-motion";
import { Mail, Users, BarChart3, Inbox } from "lucide-react";

export function AnimatedDemo() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need to scale</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A unified workflow to find leads, engage them, and close deals faster.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
          {/* Mac window controls */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-success" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
            {/* Sidebar Mockup */}
            <div className="hidden md:block border-r border-white/10 bg-white/[0.02] p-4 space-y-4">
              <div className="flex items-center gap-3 px-3 py-2 text-primary bg-primary/10 rounded-md">
                <Inbox className="w-5 h-5" />
                <span className="font-medium text-sm">Unified Inbox</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span className="font-medium text-sm">Campaigns</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-white transition-colors">
                <Users className="w-5 h-5" />
                <span className="font-medium text-sm">Leads</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-white transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium text-sm">Analytics</span>
              </div>
            </div>

            {/* Main Content Area Mockup */}
            <div className="col-span-3 p-6 md:p-8 relative">
              {/* Decorative gradient blob inside the mockup */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold">Campaign Overview</h3>
                <div className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium border border-success/30">
                  Active
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Sent", value: "12,450", trend: "+12%" },
                  { label: "Open Rate", value: "68.2%", trend: "+5%" },
                  { label: "Reply Rate", value: "14.5%", trend: "+2%" },
                  { label: "Meetings", value: "34", trend: "+8%" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                  >
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-success">{stat.trend} this week</div>
                  </motion.div>
                ))}
              </div>

              {/* Activity Feed Mockup */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-white/[0.01]"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-1/3 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-white/5 rounded"></div>
                    </div>
                    <div className="h-4 w-12 bg-white/10 rounded"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
