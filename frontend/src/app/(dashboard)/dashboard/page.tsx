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
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
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
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const token = (session?.user as any)?.accessToken

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (status === 'unauthenticated') {
      setIsLoading(false)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (!isSilent) setIsLoading(true);

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
          }
        `
      });

      const json = res.data;
      if (json.errors) {
        console.error("GraphQL errors:", json.errors);
      } else if (json.data) {
        const { dashboardStats: s, recentCampaigns: campaigns } = json.data;
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
      }
    } catch (error: any) {
      if (!axios.isCancel(error)) {
        console.error("Failed to fetch dashboard data:", error)
      }
    } finally {
      if (!isSilent) setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
      
      const interval = setInterval(() => {
        // Only fetch if the tab is visible to save browser resources
        if (document.visibilityState === 'visible') {
          fetchDashboardData(true) // silent fetch (no full loading skeleton)
        }
      }, 30000)
      
      return () => {
        clearInterval(interval);
        if (abortControllerRef.current) abortControllerRef.current.abort();
      }
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
          
        const res = await axios.post(endpoint)
        const data = res.data
        if (data.success) {
          toast.success(activity.progress.failed > 0 ? "Smart retry started for failed emails!" : "Campaign re-launched successfully!")
          fetchDashboardData()
        } else {
          toast.error(data.message || "Failed to resend")
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Network error occurred")
      }
    } else if (action === 'followup') {
      window.location.href = `/dashboard/send?followup=${activity.id}`
    } else if (action === 'duplicate') {
      window.location.href = `/dashboard/send?duplicate=${activity.id}`
    } else if (action === 'delete') {
      if (!confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;
      try {
        const res = await axios.delete(`${API_URL}/campaigns/${activity.id}`)
        const data = res.data
        if (data.success) {
          toast.success("Campaign deleted")
          fetchDashboardData()
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete")
      }
    }
  }

  // Memoize the recent activity list so it only re-renders when data actually changes
  const renderedRecentActivity = useMemo(() => {
    if (recentActivityData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium">No activity yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">
            Start by creating a new campaign or template to see your outreach progress here.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/dashboard/send">
              Launch your first campaign
            </Link>
          </Button>
        </div>
      );
    }
    
    return recentActivityData.map((activity) => {
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
              <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleAction('resend', activity)} className="cursor-pointer">
                <RefreshCw className="w-4 h-4 mr-2" />
                {activity.progress.failed > 0 ? "Retry Failed" : "Resend Now"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('followup', activity)} className="cursor-pointer">
                <ArrowRightCircle className="w-4 h-4 mr-2" />
                Follow-up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('duplicate', activity)} className="cursor-pointer">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/dashboard/campaigns/${activity.id}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => handleAction('delete', activity)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    });
  }, [recentActivityData]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Authenticating...</p>
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
          <Button asChild size="sm">
            <Link href="/dashboard/send">
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </Link>
          </Button>
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
              {isLoading ? (
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-8 w-20" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
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
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
              <Link href="/dashboard/campaigns">
                View all
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/10">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))
            ) : (
              renderedRecentActivity
            )}
          </div>
        </CardContent>
      </Card>

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
