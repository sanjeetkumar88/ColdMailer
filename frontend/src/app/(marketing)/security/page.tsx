"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Server, FileCheck, AlertTriangle } from "lucide-react";

const securityFeatures = [
  {
    icon: <Server className="w-6 h-6" />,
    title: "Infrastructure",
    description: "Enterprise-grade infrastructure hosted on AWS with multi-region redundancy and 99.99% guaranteed uptime."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Data Encryption",
    description: "All data is encrypted at rest using AES-256 and in transit using TLS 1.3. We never store plain-text credentials."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Access Controls",
    description: "Role-based access control (RBAC), SSO integration, and mandatory 2FA for all administrative access."
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: "Compliance",
    description: "Fully compliant with GDPR, CCPA, and SOC 2 Type II certified. Regular third-party penetration testing."
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Incident Response",
    description: "24/7 automated monitoring and a dedicated security team with a strict 15-minute incident response SLA."
  }
];

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5 bg-white/[0.01]">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Enterprise-grade security
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your data security and privacy are our top priorities. Built from day one to meet the strict requirements of enterprise IT.
        </p>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
