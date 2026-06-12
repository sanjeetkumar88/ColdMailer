"use client";

import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2 } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-24 sm:py-32 flex flex-col lg:flex-row gap-16 items-center">
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          See ColdMailer in Action
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg">
          Schedule a personalized 30-minute walkthrough with our deliverability experts to see how we can scale your outreach.
        </p>
        <div className="space-y-4">
          {[
            "Live demo of AI personalization",
            "Deliverability best practices review",
            "Unlimited sender rotation showcase",
            "Custom pricing for enterprise needs"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <span className="text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-md bg-card/50 backdrop-blur-sm border rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Book your session</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" type="email" placeholder="john@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" placeholder="Acme Inc." />
          </div>
          <AnimatedButton className="w-full mt-4" size="lg">
            Request Demo
          </AnimatedButton>
        </form>
      </div>
    </div>
  )
}
