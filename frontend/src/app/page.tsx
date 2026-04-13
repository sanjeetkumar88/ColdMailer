import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowRight, Mail, Users, Zap, BarChart2, 
  Briefcase, Globe, Sparkles, Send, LayoutTemplate 
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              ColdMailer
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32 lg:pb-40">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-8 ring-1 ring-inset ring-primary/20 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Revolutionize your outreach
            </div>
            
            <h1 className="mx-auto max-w-4xl font-extrabold tracking-tight text-4xl sm:text-6xl lg:text-7xl mb-6">
              Automate Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                Email Outreach
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
              ColdMailer gives you the power to send highly personalized, scalable campaigns. 
              Perfect for job applications, networking, and cold sales outreach.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="rounded-full w-full sm:w-auto text-base hover:scale-105 transition-transform duration-300 shadow-xl shadow-primary/20">
                  Start Sending Free
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-base backdrop-blur-sm hover:bg-accent/50">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to scale</h2>
              <p className="text-lg text-muted-foreground">
                We've built all the tools required to make your cold outreach feel warm, personal, and highly effective.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <LayoutTemplate className="h-10 w-10 text-blue-500" />,
                  title: "Dynamic Templates",
                  description: "Create liquid-like templates with dynamic variables to give every recipient a personalized touch."
                },
                {
                  icon: <Users className="h-10 w-10 text-indigo-500" />,
                  title: "Smart Recipient Management",
                  description: "Import, categorize, and manage your contacts seamlessly from CSVs or manual entry."
                },
                {
                  icon: <Send className="h-10 w-10 text-purple-500" />,
                  title: "Automated Dispatch",
                  description: "Schedule your campaigns and let ColdMailer handle rate-limits and delivery automatically."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="group relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader>
                    <div className="mb-4 bg-background p-3 rounded-2xl inline-block w-fit shadow-sm border border-border/50 group-hover:scale-110 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Relevance and Future Scope */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl" aria-hidden="true">
            <div className="aspect-[1020/880] w-[63.75rem] bg-gradient-to-br from-indigo-400 to-purple-300 opacity-20" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Why ColdMailer Matters Today</h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    In today's highly competitive job market and fast-paced business world, standing out requires <strong>volume without losing personalization.</strong>
                  </p>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <Briefcase className="h-6 w-6 text-primary shrink-0" />
                      <span><strong>Job Seekers:</strong> Send uniquely tailored applications to dozens of recruiters instantly.</span>
                    </li>
                    <li className="flex gap-3">
                      <Globe className="h-6 w-6 text-primary shrink-0" />
                      <span><strong>Freelancers:</strong> Automate cold outreach to potential clients seamlessly.</span>
                    </li>
                    <li className="flex gap-3">
                      <BarChart2 className="h-6 w-6 text-primary shrink-0" />
                      <span><strong>Marketers:</strong> Engage your audience with hyper-targeted email blasts.</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-card border shadow-2xl rounded-2xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                  <h3 className="text-2xl font-bold mb-6">Future Scope Roadmap</h3>
                  <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-muted">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background"></div>
                      <p className="font-semibold text-foreground">AI-Powered Copywriting</p>
                      <p className="text-muted-foreground text-sm mt-1">Generate perfect email variants using built-in LLMs to bypass spam filters.</p>
                    </div>
                    <div className="relative pl-6 border-l-2 border-muted">
                      <div className="absolute w-3 h-3 bg-muted-foreground/30 rounded-full -left-[7px] top-1.5 ring-4 ring-background"></div>
                      <p className="font-semibold text-foreground">A/B Testing Engine</p>
                      <p className="text-muted-foreground text-sm mt-1">Automatically compare subject lines and track open rates natively.</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-muted-foreground/30 rounded-full -left-[5px] top-1.5 ring-4 ring-background"></div>
                      <p className="font-semibold text-foreground">CRM Integrations</p>
                      <p className="text-muted-foreground text-sm mt-1">Two-way sync with Salesforce, HubSpot, and Notion databases.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">Ready to automate your success?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join the growing number of professionals using ColdMailer to secure jobs, close deals, and build networks.
            </p>
            <Link href="/login">
              <Button size="lg" className="rounded-full text-lg h-14 px-8 shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                Create Your Account Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-muted-foreground">ColdMailer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ColdMailer Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
