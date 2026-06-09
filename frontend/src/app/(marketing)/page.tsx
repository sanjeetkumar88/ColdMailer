import { HeroSection } from "@/components/marketing/hero/hero-section";
import { TrustedBy } from "@/components/marketing/trust/trusted-by";
import { AnimatedDemo } from "@/components/marketing/demo/animated-demo";
import { ProblemSolution } from "@/components/marketing/features/problem-solution";
import { FeaturesGrid } from "@/components/marketing/features/features-grid";
import { HowItWorks } from "@/components/marketing/features/how-it-works";
import { AICapabilities } from "@/components/marketing/features/ai-capabilities";
import { Testimonials } from "@/components/marketing/trust/testimonials";
import { PricingPreview } from "@/components/marketing/pricing/pricing-preview";
import { FAQ } from "@/components/marketing/trust/faq";
import { FinalCTA } from "@/components/marketing/hero/final-cta";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TrustedBy />
      <AnimatedDemo />
      <ProblemSolution />
      <FeaturesGrid />
      <HowItWorks />
      <AICapabilities />
      <Testimonials />
      <PricingPreview />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
