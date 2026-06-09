import { GradientText } from "@/components/ui/gradient-text";

export const metadata = {
  title: "About Us | ColdMailer",
  description: "Learn about the team building the future of outbound sales.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-white/5">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Built by founders, <br />
          <span className="text-gradient-primary">for founders.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We built ColdMailer because we were tired of tools that overpromised and underdelivered on cold outreach.
        </p>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-invert prose-lg max-w-none">
          <h2>Our Story</h2>
          <p>
            In 2023, we were scaling our previous SaaS company. We tried every cold email tool on the market. They were either too complex to use, had terrible deliverability, or lacked the modern API-first infrastructure our engineering team needed.
          </p>
          <p>
            We spent more time managing warmup pools and dealing with spam complaints than actually talking to prospects. That's when we realized the fundamental infrastructure of outbound sales needed a rewrite.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is simple: to make outbound sales effortless and highly effective for modern revenue teams. We believe that technology should handle the complexity of deliverability and personalization, freeing up human reps to do what they do best: build relationships and close deals.
          </p>

          <h2>Core Values</h2>
          <ul>
            <li><strong>Deliverability First:</strong> If it doesn't land in the primary inbox, nothing else matters.</li>
            <li><strong>Developer-Friendly:</strong> We believe modern sales teams are technical. Our API is a first-class citizen.</li>
            <li><strong>Radical Transparency:</strong> We don't hide deliverability metrics or charge hidden fees for basic features.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

