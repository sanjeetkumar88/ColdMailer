"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Copy,
  Trash2,
  ArrowRightCircle,
  ExternalLink,
  Send,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

export default function CampaignsPage() {
  const { data: session, status } = useSession()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const fetchCampaigns = useCallback(async () => {
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }
    if (status === 'loading') return
    setLoading(true)
    try {
      const res = await axios.post(`/api/graphql-proxy`, {
        query: `
          query {
            paginatedCampaigns(page: ${page}, limit: 10, status: "${statusFilter}") {
              campaigns {
                id
                name
                subject
                recipients
                status
                sentCount
                failedCount
                openedCount
                sender {
                  email
                }
                template {
                  name
                }
                createdAt
                updatedAt
              }
              totalPages
            }
          }
        `
      })
      const data = res.data?.data?.paginatedCampaigns
      if (data) {
        setCampaigns(data.campaigns)
        setTotalPages(data.totalPages)
      }
    } catch (error) {
      toast.error("Failed to fetch campaigns")
    } finally {
      setLoading(false)
    }
  }, [API_URL, page, statusFilter, status])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const handleAction = async (action: string, campaign: any) => {
    if (action === 'resend') {
      if (!campaign.sender) {
        toast.error("Cannot resend: The sender account for this campaign has been disconnected. Please use 'Duplicate' to send using a new account.")
        return
      }
      
      try {
        const endpoint = campaign.failedCount > 0 
          ? `/api/proxy/campaigns/${campaign.id}/retry` 
          : `/api/proxy/campaigns/${campaign.id}/launch`;

        const res = await fetch(endpoint, {
          method: 'POST',
          
        })
        const data = await res.json()
        if (data.success) {
          toast.success(campaign.failedCount > 0 ? "Smart retry started for failed emails!" : "Campaign re-launched!")
          fetchCampaigns()
        } else {
          toast.error(data.message || "Failed to resend")
        }
      } catch (error) {
        toast.error("Network error")
      }
    } else if (action === 'followup') {
      window.location.href = `/dashboard/send?followup=${campaign.id}`
    } else if (action === 'duplicate') {
      window.location.href = `/dashboard/send?duplicate=${campaign.id}`
    } else if (action === 'delete') {
      if (!confirm("Are you sure you want to delete this campaign?")) return;
      try {
        const res = await fetch(`/api/proxy/campaigns/${campaign.id}`, {
          method: 'DELETE',
          
        })
        const data = await res.json()
        if (data.success) {
          toast.success("Campaign deleted")
          fetchCampaigns()
        }
      } catch (error) {
        toast.error("Failed to delete")
      }
    }
  }

  const getStatusIcon = (status: string, campaign: any) => {
    // Override icon if sender disconnected
    if (!campaign.sender && (status === 'processing' || status === 'scheduled')) {
      return <XCircle className="w-4 h-4 text-destructive" />;
    }

    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-warning" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  }

  const filteredCampaigns = campaigns.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Manage and track your outreach campaigns</p>
        </div>
        <Link href="/dashboard/send">
          <Button>
            <Send className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search campaigns..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium">Campaign</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Delivery</th>
                  <th className="text-left p-4 font-medium">Engagement</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td>
                    </tr>
                  ))
                ) : filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((campaign) => {
                    const displayStatus = !campaign.sender && (campaign.status === 'processing' || campaign.status === 'scheduled') ? 'failed' : campaign.status;

                    return (
                    <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium">{campaign.name || campaign.subject}</div>
                        <div className="text-xs flex items-center gap-1 mt-0.5">
                          {campaign.sender ? (
                            <span className="text-muted-foreground truncate max-w-[150px]">
                              From: {campaign.sender.email}
                            </span>
                          ) : (
                            <span className="text-destructive flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Sender disconnected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(campaign.status, campaign)}
                          <span className="capitalize text-xs">{displayStatus}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{campaign.sentCount || 0} / {campaign.recipients?.length || 0}</span>
                            <span>{Math.round(((campaign.sentCount || 0) / (campaign.recipients?.length || 1)) * 100)}%</span>
                          </div>
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all" 
                              style={{ width: `${Math.min(100, ((campaign.sentCount || 0) / (campaign.recipients?.length || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{campaign.openedCount || 0}</span>
                            <span className="text-[10px] text-muted-foreground">Opens</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-destructive">{campaign.failedCount || 0}</span>
                            <span className="text-[10px] text-muted-foreground text-destructive">Failed</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(campaign.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleAction('resend', campaign)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              {campaign.failedCount > 0 ? "Retry Failed" : "Resend Now"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('followup', campaign)}>
                              <ArrowRightCircle className="w-4 h-4 mr-2" />
                              Follow-up
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('duplicate', campaign)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/campaigns/${campaign.id}`}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleAction('delete', campaign)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1 || loading}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
