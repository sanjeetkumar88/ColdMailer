"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const caseStudies = [
  {
    type: "Startup",
    company: "HyperGrowth SaaS",
    headline: "How HyperGrowth scaled to $1M ARR purely on outbound",
    metrics: [
      { label: "Reply Rate", value: "14.2%" },
      { label: "Meetings Booked", value: "45/mo" }
    ],
    description: "Learn how a seed-stage startup used Antigravity's AI personalization to break through the noise and book meetings with Fortune 500 VP's."
  },
  {
    type: "Agency",
    company: "ScalePartners",
    headline: "Managing 50+ clients from a single unified workspace",
    metrics: [
      { label: "Time Saved", value: "20hrs/wk" },
      { label: "Client Retention", value: "98%" }
    ],
    description: "ScalePartners eliminated their mess of 15 different tools and unified their entire lead gen agency operation on Antigravity."
  },
  {
    type: "Enterprise",
    company: "TechStack Global",
    headline: "Migrating a 200-person SDR team to modern infrastructure",
    metrics: [
      { label: "Deliverability", value: "+42%" },
      { label: "Cost Reduction", value: "60%" }
    ],
    description: "How a global enterprise replaced their legacy sales engagement platform and solved their critical spam issues overnight."
  },
  {
    type: "Recruitment Firm",
    company: "TalentSource",
    headline: "Sourcing top engineering talent with hyper-personalized outreach",
    metrics: [
      { label: "Candidate Response", value: "28%" },
      { label: "Placements", value: "3x" }
    ],
    description: "Using Antigravity's LinkedIn scraping and AI personalization to source and recruit highly competitive engineering talent."
  }
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5 bg-white/[0.01]">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Customer Stories
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          See how innovative teams across every industry are using Antigravity to scale their revenue.
        </p>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          {caseStudies.map((study, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                  {study.type}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {study.company}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                {study.headline}
              </h3>
              
              <p className="text-muted-foreground mb-8 flex-1">
                {study.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-background border border-white/5">
                {study.metrics.map((metric, j) => (
                  <div key={j}>
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center text-primary font-medium text-sm group-hover:underline mt-auto">
                Read full case study <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
