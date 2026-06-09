"use client";

import { motion } from "framer-motion";

const companies = [
  "Startup",
  "Agency",
  "Enterprise",
  "Recruitment Firm",
  "SaaS Platform",
  "Consulting",
];

export function TrustedBy() {
  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
          {companies.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-xl md:text-2xl font-bold tracking-tighter"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
