"use client"

import { useState } from "react"
import { 
  Mail, 
  Shield, 
  Key, 
  Check, 
  RefreshCw,
  ExternalLink,
  AlertCircle,
  User,
  Bell,
  Moon,
  Sun,
  Laptop,
  ChevronRight,
  LogOut,
  Trash2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const [connectedEmail, setConnectedEmail] = useState("john.doe@gmail.com")
  const [authMethod, setAuthMethod] = useState<"oauth" | "app-password">("oauth")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [notifications, setNotifications] = useState({
    emailSent: true,
    emailFailed: true,
    weeklyReport: false,
    productUpdates: true
  })
  const [isReconfigureOpen, setIsReconfigureOpen] = useState(false)
  const [isReconfiguring, setIsReconfiguring] = useState(false)

  const handleReconfigure = () => {
    setIsReconfiguring(true)
    setTimeout(() => {
      setIsReconfiguring(false)
      setIsReconfigureOpen(false)
    }, 1500)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Gmail Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Gmail Configuration
          </CardTitle>
          <CardDescription>
            Manage your connected Gmail account for sending emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connected Account */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-medium">{connectedEmail}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Connected via {authMethod === "oauth" ? "Google OAuth" : "App Password"}</span>
                  <Badge variant="secondary" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsReconfigureOpen(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reconfigure
            </Button>
          </div>

          {/* Auth Method Info */}
          <div className="space-y-3">
            <Label>Authentication Method</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`p-4 rounded-xl border-2 transition-colors ${
                authMethod === "oauth" ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center gap-3">
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
                  <div>
                    <div className="font-medium text-sm">Google OAuth</div>
                    <div className="text-xs text-muted-foreground">Secure token-based</div>
                  </div>
                  {authMethod === "oauth" && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </div>
              <div className={`p-4 rounded-xl border-2 transition-colors ${
                authMethod === "app-password" ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">App Password</div>
                    <div className="text-xs text-muted-foreground">Gmail app-specific</div>
                  </div>
                  {authMethod === "app-password" && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="john@example.com" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how ColdMailer looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(v) => setTheme(v as typeof theme)}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Label 
                htmlFor="light"
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                }`}
              >
                <RadioGroupItem value="light" id="light" className="sr-only" />
                <Sun className="w-5 h-5" />
                <span className="font-medium">Light</span>
                {theme === "light" && <Check className="w-4 h-4 text-primary ml-auto" />}
              </Label>
              <Label 
                htmlFor="dark"
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                }`}
              >
                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                <Moon className="w-5 h-5" />
                <span className="font-medium">Dark</span>
                {theme === "dark" && <Check className="w-4 h-4 text-primary ml-auto" />}
              </Label>
              <Label 
                htmlFor="system"
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  theme === "system" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                }`}
              >
                <RadioGroupItem value="system" id="system" className="sr-only" />
                <Laptop className="w-5 h-5" />
                <span className="font-medium">System</span>
                {theme === "system" && <Check className="w-4 h-4 text-primary ml-auto" />}
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "emailSent", label: "Email sent successfully", description: "Get notified when your emails are delivered" },
            { key: "emailFailed", label: "Email delivery failed", description: "Get alerted when an email fails to send" },
            { key: "weeklyReport", label: "Weekly activity report", description: "Receive a weekly summary of your email activity" },
            { key: "productUpdates", label: "Product updates", description: "Learn about new features and improvements" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
              <Switch 
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, [item.key]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Change Password</div>
              <div className="text-xs text-muted-foreground">Update your account password</div>
            </div>
            <Button variant="outline" size="sm">
              Change
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Two-Factor Authentication</div>
              <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
            </div>
            <Button variant="outline" size="sm">
              Enable
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Active Sessions</div>
              <div className="text-xs text-muted-foreground">View and manage logged in devices</div>
            </div>
            <Button variant="outline" size="sm">
              Manage
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Sign out of all devices</div>
              <div className="text-xs text-muted-foreground">This will sign you out everywhere</div>
            </div>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out All
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Delete Account</div>
              <div className="text-xs text-muted-foreground">Permanently delete your account and all data</div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Reconfigure Dialog */}
      <Dialog open={isReconfigureOpen} onOpenChange={setIsReconfigureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reconfigure Gmail</DialogTitle>
            <DialogDescription>
              Disconnect and reconnect your Gmail account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-xl bg-muted/50 border flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">Current connection will be removed</div>
                <div className="text-muted-foreground mt-1">
                  You&apos;ll need to re-authenticate with Google or set up a new app password.
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Choose new authentication method</Label>
              <RadioGroup value={authMethod} onValueChange={(v) => setAuthMethod(v as typeof authMethod)}>
                <div className="space-y-2">
                  <div className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                    authMethod === "oauth" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <RadioGroupItem value="oauth" id="reconfig-oauth" />
                    <Label htmlFor="reconfig-oauth" className="cursor-pointer flex-1">
                      Google OAuth (Recommended)
                    </Label>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                    authMethod === "app-password" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <RadioGroupItem value="app-password" id="reconfig-app" />
                    <Label htmlFor="reconfig-app" className="cursor-pointer flex-1">
                      Gmail App Password
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReconfigureOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReconfigure} disabled={isReconfiguring}>
              {isReconfiguring ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Reconnecting...
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
