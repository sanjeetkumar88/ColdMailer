import { FeaturesGrid } from "@/components/marketing/features/features-grid";
import { AICapabilities } from "@/components/marketing/features/ai-capabilities";
import { FinalCTA } from "@/components/marketing/hero/final-cta";

export const metadata = {
  title: "Features | ColdMailer",
  description: "Explore the comprehensive suite of tools designed specifically for high-volume, personalized cold outreach.",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Everything you need to <span className="text-gradient-primary">scale</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We built the infrastructure so you can focus on writing great copy and closing deals.
        </p>
      </section>

      <FeaturesGrid />
      
      <div className="border-t border-white/5">
        <AICapabilities />
      </div>

      <FinalCTA />
    </div>
  );
}

