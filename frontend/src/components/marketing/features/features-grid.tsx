"use client";

import { motion } from "framer-motion";
import { Mail, Users, Settings, Activity, Zap, Shield, Database, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Unlimited Sending Accounts",
    description: "Connect as many Google Workspace and Microsoft 365 accounts as you need. Scale your volume infinitely."
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Unified Master Inbox",
    description: "Manage replies from all your sending accounts in one beautiful, lightning-fast interface."
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Smart Warmup Network",
    description: "Keep your domains healthy with our peer-to-peer warmup network. Never land in spam again."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Advanced Sequences",
    description: "Build complex multi-channel sequences with conditional logic based on prospect behavior."
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "B2B Lead Database",
    description: "Access our integrated database of 250M+ verified B2B contacts. Build targeted lists in seconds."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Bounce Protection",
    description: "We automatically verify every email before sending to protect your domain reputation."
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "API & Webhooks",
    description: "Developer-first infrastructure. Build custom workflows and integrate with your existing stack."
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Deep Analytics",
    description: "Understand your performance at a glance with beautiful, real-time reporting dashboards."
  }
];

export function FeaturesGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need. Nothing you don't.</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive suite of tools designed specifically for high-volume, personalized cold outreach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
