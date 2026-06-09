"use client";

import { motion } from "framer-motion";

const integrations = [
  { name: "Google Workspace", category: "Email Providers", description: "Native OAuth integration for one-click setup of Gmail accounts." },
  { name: "Microsoft 365", category: "Email Providers", description: "Seamless connection for Outlook and Exchange accounts." },
  { name: "SMTP / IMAP", category: "Email Providers", description: "Connect any custom email provider using standard protocols." },
  { name: "Salesforce", category: "CRM", description: "Bi-directional sync for leads, contacts, and activity logging." },
  { name: "HubSpot", category: "CRM", description: "Automatically push positive replies and update deal stages." },
  { name: "Slack", category: "Communication", description: "Get real-time alerts for new replies and campaign milestones." },
  { name: "Zapier", category: "Workflow", description: "Connect Antigravity to 5,000+ other apps without writing code." },
  { name: "Webhooks", category: "Developer Tools", description: "Real-time event streaming for custom integrations." },
  { name: "REST API", category: "Developer Tools", description: "Full programmatic access to your Antigravity workspace." },
];

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5 bg-white/[0.01]">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Plays nice with your stack
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect Antigravity to your existing tools to automate workflows and keep your data perfectly synced.
        </p>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                {integration.category}
              </div>
              <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
