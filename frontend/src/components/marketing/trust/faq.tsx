"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Do you provide the email accounts?",
    answer: "No, we are an infrastructure and sending platform. You will need to connect your own Google Workspace or Microsoft 365 accounts. This ensures you maintain full control over your sender reputation."
  },
  {
    question: "How does the unlimited warmup work?",
    answer: "We use a proprietary peer-to-peer network of high-reputation inboxes. Your connected accounts will automatically send and receive emails from this network, slowly ramping up volume to build perfect sender reputation."
  },
  {
    question: "Are there any hidden limits on the 'Unlimited' accounts?",
    answer: "There are no hard limits on the number of accounts you can connect. We have customers successfully managing over 500 sending accounts from a single workspace."
  },
  {
    question: "Do you integrate with my CRM?",
    answer: "Yes, we have native integrations with Salesforce, HubSpot, and Pipedrive. We also offer Zapier integration and webhooks for custom workflows."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/[0.02] border-y border-white/5">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Frequently asked questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-background">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <ChevronDown
                  className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", 
                    openIndex === i ? "rotate-180" : ""
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
