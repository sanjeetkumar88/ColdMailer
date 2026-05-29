"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { 
  ChevronLeft, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Eye,
  Send,
  User,
  FileText,
  BarChart3,
  ExternalLink,
  ArrowRightCircle,
  Copy,
  Trash2,
  Calendar,
  RotateCcw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Link from "next/link"

export default function CampaignDetailPage() {
  const params = useParams()
  const id = params?.id
  const router = useRouter()
  const { data: session, status } = useSession()
  const [campaign, setCampaign] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const fetchData = useCallback(async () => {
    if (status === 'unauthenticated' || !id) {
      setLoading(false)
      return
    }
    if (status === 'loading') return

    try {
      const res = await axios.post(`/api/graphql-proxy`, {
        query: `
          query {
            campaign(id: "${id}") {
              id
              name
              subject
              recipients
              status
              sentCount
              failedCount
              openedCount
              createdAt
              updatedAt
              sender {
                email
              }
              template {
                name
              }
            }
            campaignStats(campaignId: "${id}") {
              totalSent
              totalOpened
              totalFailed
            }
            campaignEvents(campaignId: "${id}") {
              id
              recipientEmail
              type
              error
              createdAt
            }
          }
        `
      })

      const data = res.data?.data
      if (data?.campaign) {
        setCampaign(data.campaign)
        setStats(data.campaignStats)
        setEvents(data.campaignEvents)
      }
    } catch (error) {
      toast.error("Failed to load campaign details")
    } finally {
      setLoading(false)
    }
  }, [id, status])

  useEffect(() => {
    fetchData()
    if (campaign?.status === 'processing') {
      const interval = setInterval(fetchData, 10000)
      return () => clearInterval(interval)
    }
  }, [fetchData, campaign?.status])

  const handleResendSingle = async (email: string) => {
    if (!id) return
    setIsRetrying(email)
    try {
      const res = await fetch(`/api/proxy/campaigns/${id}/retry`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emails: [email] })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Retry started for ${email}`)
        fetchData()
      } else {
        toast.error(data.message || "Failed to retry")
      }
    } catch (error) {
      toast.error("Network error")
    } finally {
      setIsRetrying(null)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this campaign?")) return
    try {
      const res = await fetch(`/api/proxy/campaigns/${id}`, {
        method: 'DELETE',
        
      })
      if (res.ok) {
        toast.success("Campaign deleted")
        router.push('/dashboard/campaigns')
      }
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Campaign not found</h2>
        <Button variant="link" onClick={() => router.push('/dashboard/campaigns')}>
          Back to campaigns
        </Button>
      </div>
    )
  }

  const sentPercent = Math.round(((campaign.sentCount || 0) / (campaign.recipients?.length || 1)) * 100)
  const openRate = stats?.totalSent ? Math.round((stats.totalOpened / stats.totalSent) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/campaigns">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="capitalize">
                {campaign.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created on {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={() => fetchData()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => window.location.href = `/dashboard/send?duplicate=${campaign._id}`}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.sentCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {sentPercent}% of total recipients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opened</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{campaign.openedCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {openRate}% open rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{campaign.failedCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(((campaign.failedCount || 0) / (campaign.recipients?.length || 1)) * 100)}% failure rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.recipients?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total in list</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Progress</CardTitle>
              <CardDescription>Real-time campaign execution status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Completion</span>
                  <span className="font-medium">{sentPercent}%</span>
                </div>
                <Progress value={sentPercent} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Sender</div>
                    <div className="text-sm font-medium truncate max-w-[150px]">{campaign.sender?.email || "N/A"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Template</div>
                    <div className="text-sm font-medium">{campaign.template?.name || "Custom"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recipient Activity</CardTitle>
              <CardDescription>Latest interaction logs for this campaign</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t max-h-[500px] overflow-y-auto">
                {events.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No activity recorded yet
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        event.type === 'sent' ? 'bg-primary/10 text-primary' : 
                        event.type === 'opened' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {event.type === 'sent' ? <Send className="w-4 h-4" /> : 
                         event.type === 'opened' ? <Eye className="w-4 h-4" /> : 
                         <XCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{event.recipientEmail}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.type === 'sent' ? 'Email delivered' : 
                           event.type === 'opened' ? 'Email opened' : 
                           `Failed: ${event.error || 'Unknown error'}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-[10px] text-muted-foreground text-right">
                          {event.createdAt ? new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isRetrying === event.recipientEmail}
                          onClick={() => handleResendSingle(event.recipientEmail)}
                        >
                          <RotateCcw className={`h-4 w-4 ${isRetrying === event.recipientEmail ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => {
                  if(confirm("This will restart the campaign for ALL recipients. Continue?")) {
                    window.location.href = `/dashboard/send?duplicate=${id}`
                  }
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resend to All
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = `/dashboard/send?followup=${id}`}>
                <ArrowRightCircle className="w-4 h-4 mr-2" />
                Follow-up Campaign
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = `/dashboard/send?duplicate=${campaign._id}`}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate Campaign
              </Button>
              <Button 
                className="w-full justify-start text-destructive hover:text-destructive" 
                variant="outline"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Campaign
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Subject
                </div>
                <div className="text-sm font-medium break-all">{campaign.subject}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Created
                </div>
                <div className="text-sm font-medium">{new Date(campaign.createdAt).toLocaleString()}</div>
              </div>
              {campaign.variables && Object.keys(campaign.variables).length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Variables</div>
                  {Object.entries(campaign.variables).map(([key, val]: any) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-mono">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
