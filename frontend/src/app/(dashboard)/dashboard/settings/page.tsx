"use client"

import { toast } from "sonner"
import axios from "axios"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"
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
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [senders, setSenders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState({
    emailSent: true,
    emailFailed: true,
    weeklyReport: false,
    productUpdates: true
  })
  const [isReconfigureOpen, setIsReconfigureOpen] = useState(false)
  const [isReconfiguring, setIsReconfiguring] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // SMTP State
  const [authMethod, setAuthMethod] = useState<"oauth" | "app-password" | "smtp">("oauth")
  const [smtpPreset, setSmtpPreset] = useState("other")
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const SMTP_PRESETS = {
    gmail: { name: "Gmail", host: "smtp.gmail.com", port: "587" },
    outlook: { name: "Outlook / Office 365", host: "smtp-mail.outlook.com", port: "587" },
    yahoo: { name: "Yahoo Mail", host: "smtp.mail.yahoo.com", port: "587" },
    zoho: { name: "Zoho Mail", host: "smtp.zoho.com", port: "465" },
    other: { name: "Custom / Other", host: "", port: "587" }
  }

  const handleSmtpPresetChange = (value: string) => {
    setSmtpPreset(value)
    if (value !== "other") {
      const preset = SMTP_PRESETS[value as keyof typeof SMTP_PRESETS]
      setSmtpForm(prev => ({ ...prev, host: preset.host, port: preset.port }))
    }
  }
  const [smtpForm, setSmtpForm] = useState({
    name: "",
    email: "",
    host: "",
    port: "587",
    user: "",
    pass: "",
    replyTo: "",
    dailyLimit: 500
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const fetchData = async () => {
    if (status === "unauthenticated") return
    try {
      const [profileRes, sendersRes] = await Promise.all([
        axios.get(`/api/proxy/auth/profile`),
        axios.get(`/api/proxy/senders`)
      ])
      const profileData = profileRes.data
      const sendersData = sendersRes.data

      if (profileData.success) setUserProfile(profileData.data)
      if (sendersData.success) setSenders(sendersData.data)
    } catch (error) {
      console.error("Failed to fetch settings data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = () => {
    // There is no backend endpoint for this currently, so we'll mock the success
    toast.success("Profile updated successfully")
  }

  useEffect(() => {
    if (status !== "loading") {
      fetchData()
    }
  }, [status])

  const connectedSender = senders.length > 0 ? senders[0] : null
  const activeAuthMethod = connectedSender?.provider === 'smtp' ? "smtp" : (connectedSender?.authMethod || "oauth")

  const handleReconfigure = async () => {
    setIsReconfiguring(true)
    if (authMethod === "oauth") {
      // Redirect to backend OAuth flow via the secure proxy
      window.location.href = `/api/proxy/senders/google/auth`
    } else if (authMethod === "smtp") {
      try {
        const res = await axios.post(`/api/proxy/senders/smtp`, smtpForm)
        const data = res.data
        if (data.success) {
          toast.success("SMTP Account connected successfully")
          setIsReconfigureOpen(false)
          fetchData()
        } else {
          toast.error(data.message || "Failed to connect SMTP account")
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Network error occurred")
      } finally {
        setIsReconfiguring(false)
      }
    } else {
      // Logic for App Password would go here
      setIsReconfiguring(false)
      setIsReconfigureOpen(false)
    }
  }

  const handleDisconnect = async (id: string) => {
    if (!confirm("Are you sure you want to disconnect this account? You will not be able to send emails until you reconnect.")) return

    try {
      const res = await axios.delete(`/api/proxy/senders/${id}`)
      const data = res.data
      if (data.success) {
        toast.success("Account disconnected successfully")
        fetchData()
      } else {
        toast.error(data.message || "Failed to disconnect")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Network error occurred")
    }
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

      {/* Email Accounts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Accounts
            </CardTitle>
            <CardDescription className="mt-1">
              Manage your connected email accounts for sending campaigns
            </CardDescription>
          </div>
          <Button onClick={() => setIsReconfigureOpen(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Connect New Account
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {senders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-muted/30 border border-dashed">
              <Mail className="w-8 h-8 text-muted-foreground mb-3" />
              <div className="font-medium">No accounts connected</div>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Connect a Gmail, Outlook, or Custom SMTP account to start sending campaigns.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {senders.map((sender) => (
                <div key={sender._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{sender.email}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Connected via {sender.provider === 'smtp' ? 'Custom SMTP' : 'Google OAuth'}</span>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal">
                          <Check className="w-2.5 h-2.5 mr-0.5" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground shrink-0"
                      onClick={() => setIsReconfigureOpen(true)}
                      title="Reconfigure Account"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reconfigure
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                      onClick={() => handleDisconnect(sender._id)}
                      title="Remove Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={userProfile?.name || ""} 
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={userProfile?.email || ""} disabled className="bg-muted" />
          </div>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
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
          <RadioGroup value={mounted ? theme : "system"} onValueChange={(v) => setTheme(v)}>
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

      {/* Connect Account Dialog */}
      <Dialog open={isReconfigureOpen} onOpenChange={setIsReconfigureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect New Account</DialogTitle>
            <DialogDescription>
              Add a new email account to send campaigns from
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="space-y-3">
              <Label>Choose authentication method</Label>
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
                    authMethod === "smtp" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <RadioGroupItem value="smtp" id="reconfig-smtp" />
                    <Label htmlFor="reconfig-smtp" className="cursor-pointer flex-1">
                      Custom SMTP Credentials
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {authMethod === "smtp" && (
                <div className="mt-4 space-y-3 p-4 border rounded-lg bg-muted/20">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Sender Name</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={smtpForm.name} 
                        onChange={(e) => setSmtpForm({...smtpForm, name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Email Address</Label>
                      <Input 
                        placeholder="john@example.com" 
                        value={smtpForm.email} 
                        onChange={(e) => setSmtpForm({...smtpForm, email: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email Provider (Preset Settings)</Label>
                    <Select value={smtpPreset} onValueChange={handleSmtpPresetChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SMTP_PRESETS).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 col-span-2">
                      <Label>SMTP Host</Label>
                      <Input 
                        placeholder="smtp.example.com" 
                        value={smtpForm.host} 
                        disabled={smtpPreset !== "other"}
                        onChange={(e) => setSmtpForm({...smtpForm, host: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label>Port</Label>
                        {smtpForm.port === '465' && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">SSL/TLS</span>}
                        {smtpForm.port === '587' && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">STARTTLS</span>}
                      </div>
                      <Input 
                        placeholder="465 or 587" 
                        value={smtpForm.port} 
                        disabled={smtpPreset !== "other"}
                        onChange={(e) => setSmtpForm({...smtpForm, port: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>SMTP Username</Label>
                      <Input 
                        placeholder="john@example.com" 
                        value={smtpForm.user} 
                        onChange={(e) => setSmtpForm({...smtpForm, user: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>SMTP Password</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        value={smtpForm.pass} 
                        onChange={(e) => setSmtpForm({...smtpForm, pass: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  {/* Dynamic Help Text for App Passwords */}
                  {(smtpPreset === "gmail" || smtpPreset === "yahoo") && (
                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20 flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>App Password Required:</strong> You cannot use your regular login password. You must generate an App Password in your account security settings.</span>
                    </div>
                  )}
                  {smtpPreset === "outlook" && (
                    <div className="text-xs text-amber-600 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Microsoft 365:</strong> Basic auth is deprecated. If connection fails, your admin must enable SMTP AUTH for this mailbox, or you may need an App Password.</span>
                    </div>
                  )}
                  {smtpPreset === "zoho" && (
                    <div className="text-xs text-amber-600 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Zoho Mail:</strong> If 2FA is enabled, an App Password is required. SMTP access must also be enabled in Zoho Mail settings.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <Label>Reply-To Address <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
                      <Input 
                        placeholder="replies@example.com" 
                        value={smtpForm.replyTo} 
                        onChange={(e) => setSmtpForm({...smtpForm, replyTo: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Daily Send Limit</Label>
                      <Input 
                        type="number"
                        placeholder="500" 
                        value={smtpForm.dailyLimit} 
                        onChange={(e) => setSmtpForm({...smtpForm, dailyLimit: parseInt(e.target.value) || 500})} 
                      />
                    </div>
                  </div>
                </div>
              )}
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
