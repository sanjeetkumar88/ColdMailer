"use client"

import { 
  Mail, 
  FileText, 
  TrendingUp, 
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  RefreshCw, 
  Copy, 
  Trash2, 
  Mail as MailIcon, 
  ArrowRightCircle,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ResumeUpload } from "@/components/resume-upload"
import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import axios from "axios"

const initialStats = [
  { name: "Total Emails Sent", value: "0", change: "0%", trend: "up", icon: Mail, description: "Lifetime" },
  { name: "Success Rate", value: "0%", change: "0%", trend: "up", icon: TrendingUp, description: "Delivery rate" },
  { name: "Emails Opened", value: "0", change: "0%", trend: "up", icon: Clock, description: "Total opens" },
  { name: "Active Campaigns", value: "0", change: "0%", trend: "up", icon: Send, description: "Running now" },
]

const initialActivity: any[] = []

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [dashboardStats, setDashboardStats] = useState(initialStats)
  const [recentActivityData, setRecentActivityData] = useState(initialActivity)
  const [resumes, setResumes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isResumesLoading, setIsResumesLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const token = (session?.user as any)?.accessToken

  const fetchDashboardData = useCallback(async () => {
    if (status === 'unauthenticated') {
      setIsLoading(false)
      return
    }

    try {
      const res = await axios.post(`/api/graphql-proxy`, {
        query: `
          query {
            dashboardStats {
              totalSent
              totalOpened
              successRate
            }
            recentCampaigns(limit: 10) {
              id
              subject
              recipients
              status
              sentCount
              failedCount
              template { name }
              sender { email }
              updatedAt
            }
            mediaFiles {
              id
              originalName
              size
              url
              createdAt
            }
          }
        `
      });

      const json = res.data;
      if (json.errors) {
        console.error("GraphQL errors:", json.errors);
      } else if (json.data) {
        const { dashboardStats: s, recentCampaigns: campaigns, mediaFiles } = json.data;
        setDashboardStats([
          { 
            name: "Total Emails Sent", 
            value: s.totalSent?.toString() || "0", 
            change: "+0%", 
            trend: "up",
            icon: Mail,
            description: "Lifetime"
          },
          { 
            name: "Success Rate", 
            value: s.successRate ? `${s.successRate.toFixed(1)}%` : "0%", 
            change: "+0%", 
            trend: "up",
            icon: TrendingUp,
            description: "Delivery rate"
          },
          { 
            name: "Emails Opened", 
            value: s.totalOpened?.toString() || "0", 
            change: "+0%", 
            trend: "up",
            icon: Clock,
            description: "Total opens"
          },
          { 
            name: "Active Campaigns", 
            value: (campaigns || []).filter((c: any) => c.status === 'processing').length.toString(), 
            change: "+0%", 
            trend: "up",
            icon: Send,
            description: "Running now"
          },
        ])

        const mappedActivity = (campaigns || []).map((c: any) => ({
          id: c.id,
          recipient: c.recipients?.length === 1 ? c.recipients[0] : `${c.recipients?.length || 0} recipients`,
          subject: c.subject || "No Subject",
          template: c.template?.name || "Custom",
          status: c.status,
          hasSender: !!c.sender,
          senderEmail: c.sender?.email,
          progress: {
            sent: c.sentCount || 0,
            failed: c.failedCount || 0,
            total: c.recipients?.length || 0
          },
          time: new Date(Number(c.updatedAt) || c.updatedAt).toLocaleDateString()
        }))
        setRecentActivityData(mappedActivity)
        
        setResumes(mediaFiles || [])
        setIsResumesLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [status])

  const fetchResumes = useCallback(async () => {
    // Media files are now fetched in fetchDashboardData
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return
    try {
      const res = await fetch(`${API_URL}/media/${id}`, {
        method: 'DELETE',
        
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Resume deleted")
        fetchResumes()
      } else {
        toast.error(data.message || "Failed to delete")
      }
    } catch (error) {
      toast.error("Failed to delete resume")
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true)
      fetchDashboardData()
      
      const interval = setInterval(() => {
        fetchDashboardData()
      }, 30000)
      return () => clearInterval(interval)
    } else if (status === 'unauthenticated') {
      setIsLoading(false)
    }
  }, [status, fetchDashboardData])

  const handleAction = async (action: string, activity: any) => {
    if (action === 'resend') {
      if (!activity.hasSender) {
        toast.error("Cannot resend: The sender account for this campaign has been disconnected. Please use 'Duplicate' to send using a new account.")
        return
      }
      
      try {
        const endpoint = activity.progress.failed > 0 
          ? `${API_URL}/campaigns/${activity.id}/retry` 
          : `${API_URL}/campaigns/${activity.id}/launch`;
          
        const res = await fetch(endpoint, {
          method: 'POST',
          
        })
        const data = await res.json()
        if (data.success) {
          toast.success(activity.progress.failed > 0 ? "Smart retry started for failed emails!" : "Campaign re-launched successfully!")
          fetchDashboardData()
        } else {
          toast.error(data.message || "Failed to resend")
        }
      } catch (error) {
        toast.error("Network error occurred")
      }
    } else if (action === 'followup') {
      window.location.href = `/dashboard/send?followup=${activity.id}`
    } else if (action === 'duplicate') {
      window.location.href = `/dashboard/send?duplicate=${activity.id}`
    } else if (action === 'delete') {
      if (!confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;
      try {
        const res = await fetch(`${API_URL}/campaigns/${activity.id}`, {
          method: 'DELETE',
          
        })
        const data = await res.json()
        if (data.success) {
          toast.success("Campaign deleted")
          fetchDashboardData()
        }
      } catch (error) {
        toast.error("Failed to delete")
      }
    }
  }

  if (status === 'loading' || (isLoading && token)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your outreach performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchDashboardData()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/send">
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-medium flex items-center ${
                  stat.trend === "up" ? "text-primary" : "text-destructive"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-1 bg-primary/10 w-full group-hover:bg-primary/20 transition-colors" />
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <Card className="overflow-hidden border-primary/10">
        <CardHeader className="bg-muted/30 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Real-time status of your email campaigns</CardDescription>
            </div>
            <Link href="/dashboard/campaigns">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                View all
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentActivityData.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium">No activity yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs mt-1">
                  Start by creating a new campaign or template to see your outreach progress here.
                </p>
                <Link href="/dashboard/send">
                  <Button variant="outline" className="mt-6">
                    Launch your first campaign
                  </Button>
                </Link>
              </div>
            ) : (
              recentActivityData.map((activity) => {
                const displayStatus = !activity.hasSender && (activity.status === 'processing' || activity.status === 'scheduled') ? 'failed' : activity.status;

                return (
                  <div 
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      displayStatus === "completed" 
                        ? "bg-primary/10" 
                        : displayStatus === "processing"
                          ? "bg-blue-500/10"
                          : displayStatus === "pending" || displayStatus === "scheduled"
                            ? "bg-warning/10" 
                            : "bg-destructive/10"
                    }`}>
                      {displayStatus === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : displayStatus === "processing" ? (
                        <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                      ) : displayStatus === "pending" || displayStatus === "scheduled" ? (
                        <Clock className="w-5 h-5 text-warning" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{activity.recipient}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {activity.template}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate mt-0.5">
                        {activity.subject} {activity.status === 'processing' && `(${activity.progress.sent}/${activity.progress.total})`}
                        {!activity.hasSender && (
                          <span className="text-destructive text-[10px] ml-2 font-medium">
                            (Sender disconnected)
                          </span>
                        )}
                        {activity.progress.failed > 0 && (
                          <span className="text-destructive text-[10px] ml-2 font-medium">
                            ({activity.progress.failed} failed)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                      {activity.time}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleAction('resend', activity)}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {activity.progress.failed > 0 ? "Retry Failed" : "Resend Now"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('followup', activity)}>
                          <ArrowRightCircle className="w-4 h-4 mr-2" />
                          Follow-up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('duplicate', activity)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/campaigns/${activity.id}`}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleAction('delete', activity)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resume Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resume Manager</CardTitle>
            <CardDescription>Upload and manage your resumes for outreach</CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeUpload onUploadSuccess={fetchResumes} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Documents</CardTitle>
            <CardDescription>Recently uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            {isResumesLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : resumes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Your resumes will appear here once uploaded.</p>
            ) : (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div key={resume._id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group border border-transparent hover:border-primary/20 transition-all">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{resume.originalName}</p>
                      <p className="text-[10px] text-muted-foreground">{(resume.size / 1024 / 1024).toFixed(2)} MB • {new Date(resume.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={resume.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteResume(resume._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/send">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Send New Email</div>
                  <div className="text-sm text-muted-foreground">
                    Compose and send to recipients
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/templates">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Create Template</div>
                  <div className="text-sm text-muted-foreground">
                    Build reusable email templates
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/contacts">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Manage Contacts</div>
                  <div className="text-sm text-muted-foreground">
                    Organize your outreach list
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
