"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Zap, 
  Mail, 
  Shield, 
  Key, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Copy,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const steps = [
  { id: 1, title: "Connect Gmail", description: "Link your Gmail account" },
  { id: 2, title: "Choose Method", description: "OAuth or App Password" },
  { id: 3, title: "Complete Setup", description: "Verify connection" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [authMethod, setAuthMethod] = useState<"oauth" | "app-password">("oauth")
  const [appPassword, setAppPassword] = useState("")
  const [email, setEmail] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOAuthConnect = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setCurrentStep(3)
    }, 1500)
  }

  const handleAppPasswordSubmit = () => {
    if (appPassword && email) {
      setIsConnecting(true)
      setTimeout(() => {
        setIsConnecting(false)
        setCurrentStep(3)
      }, 1500)
    }
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ColdMailer</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            Skip for now
          </Button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-border px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : currentStep === step.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 sm:w-24 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-xl mx-auto">
          {/* Step 1: Introduction */}
          {currentStep === 1 && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Connect your Gmail account</CardTitle>
                <CardDescription className="text-base">
                  ColdMailer needs access to send emails on your behalf. Your credentials are encrypted and secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Secure & Private</div>
                      <div className="text-sm text-muted-foreground">
                        We never store your password. OAuth uses secure tokens.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Send-Only Access</div>
                      <div className="text-sm text-muted-foreground">
                        We only request permission to send emails, not read them.
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setCurrentStep(2)}>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Choose Method */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose connection method</CardTitle>
                <CardDescription>
                  Select how you want to connect your Gmail account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={authMethod} onValueChange={(v) => setAuthMethod(v as "oauth" | "app-password")}>
                  <div className={`relative rounded-xl border-2 p-4 cursor-pointer transition-colors ${authMethod === 'oauth' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}>
                    <RadioGroupItem value="oauth" id="oauth" className="absolute right-4 top-4" />
                    <Label htmlFor="oauth" className="cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            Google OAuth
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Recommended</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            One-click sign in with your Google account. Most secure option.
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className={`relative rounded-xl border-2 p-4 cursor-pointer transition-colors ${authMethod === 'app-password' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'}`}>
                    <RadioGroupItem value="app-password" id="app-password" className="absolute right-4 top-4" />
                    <Label htmlFor="app-password" className="cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Key className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Gmail App Password</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Use a generated app-specific password from Google.
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {authMethod === "oauth" && (
                  <Button className="w-full" onClick={handleOAuthConnect} disabled={isConnecting}>
                    {isConnecting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </Button>
                )}

                {authMethod === "app-password" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                        <div className="space-y-3 flex-1">
                          <div className="text-sm font-medium">How to generate an App Password:</div>
                          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Go to your Google Account settings</li>
                            <li>Navigate to Security → 2-Step Verification</li>
                            <li>Scroll to App passwords and click it</li>
                            <li>Select &quot;Mail&quot; and your device, then Generate</li>
                          </ol>
                          <a 
                            href="https://myaccount.google.com/apppasswords" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Open Google App Passwords
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Gmail Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appPassword">App Password</Label>
                      <div className="relative">
                        <Input
                          id="appPassword"
                          type="password"
                          placeholder="xxxx xxxx xxxx xxxx"
                          value={appPassword}
                          onChange={(e) => setAppPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(appPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {copied ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={handleAppPasswordSubmit}
                      disabled={!email || !appPassword || isConnecting}
                    >
                      {isConnecting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        <>
                          Connect Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <Button variant="ghost" className="w-full" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">You&apos;re all set!</CardTitle>
                <CardDescription className="text-base">
                  Your Gmail account has been connected successfully. You can now start sending emails.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Connected Account</div>
                      <div className="text-sm text-muted-foreground">
                        {email || "you@gmail.com"} via {authMethod === "oauth" ? "Google OAuth" : "App Password"}
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">What&apos;s next?</div>
                  <div className="grid gap-3">
                    {[
                      { title: "Create your first template", desc: "Set up reusable email templates" },
                      { title: "Import contacts", desc: "Add recipients from CSV or manually" },
                      { title: "Send your first email", desc: "Start your outreach campaign" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </div>
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <span className="text-muted-foreground"> — {item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={handleComplete}>
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
