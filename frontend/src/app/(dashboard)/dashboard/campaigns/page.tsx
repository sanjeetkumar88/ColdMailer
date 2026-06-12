"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
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
  Copy,
  Trash2,
  ArrowRightCircle,
  ExternalLink,
  Send,
  Sparkles,
  Inbox
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCampaigns = useCallback(async () => {
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }
    if (status === 'loading') return
    
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

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
      }, { signal: abortControllerRef.current.signal })
      
      const data = res.data?.data?.paginatedCampaigns
      if (data) {
        setCampaigns(data.campaigns)
        setTotalPages(data.totalPages)
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        toast.error("Failed to fetch campaigns")
      }
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, status])

  useEffect(() => {
    fetchCampaigns()
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    }
  }, [fetchCampaigns])

  const handleAction = async (action: string, campaign: any) => {
    if (action === 'resend') {
      if (!campaign.sender) {
        toast.error("Cannot resend: The sender account for this campaign has been disconnected.")
        return
      }
      try {
        const endpoint = campaign.failedCount > 0 
          ? `/api/proxy/campaigns/${campaign.id}/retry` 
          : `/api/proxy/campaigns/${campaign.id}/launch`;

        const res = await axios.post(endpoint)
        if (res.data.success) {
          toast.success(campaign.failedCount > 0 ? "Smart retry started!" : "Campaign re-launched!")
          fetchCampaigns()
        } else {
          toast.error(res.data.message || "Failed to resend")
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Network error")
      }
    } else if (action === 'followup') {
      window.location.href = `/dashboard/send?followup=${campaign.id}`
    } else if (action === 'duplicate') {
      window.location.href = `/dashboard/send?duplicate=${campaign.id}`
    } else if (action === 'delete') {
      if (!confirm("Are you sure you want to delete this campaign?")) return;
      try {
        const res = await axios.delete(`/api/proxy/campaigns/${campaign.id}`)
        if (res.data.success) {
          toast.success("Campaign deleted")
          fetchCampaigns()
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete")
      }
    }
  }

  // Memoize filtered campaigns to prevent recalculation on every render
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [campaigns, searchTerm]);

  // Memoize the rendered list to prevent re-rendering all cards when search term changes
  const renderedCampaigns = useMemo(() => {
    if (filteredCampaigns.length === 0) return null;
    
    return filteredCampaigns.map((campaign) => {
      const displayStatus = !campaign.sender && (campaign.status === 'processing' || campaign.status === 'scheduled') ? 'failed' : campaign.status;
      
      const total = Math.max(campaign.recipients?.length || 1, 1);
      const sent = campaign.sentCount || 0;
      const progress = Math.min(100, Math.round((sent / total) * 100));

      return (
        <Card 
          key={campaign.id} 
          className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 group border-border/50 bg-card/80 backdrop-blur-sm"
        >
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row lg:items-center p-5 gap-6">
              
              <div className="flex items-start gap-4 flex-[1.5]">
                <div className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center shadow-sm ${
                  displayStatus === "completed" ? "bg-primary/10 text-primary" : 
                  displayStatus === "processing" ? "bg-blue-500/10 text-blue-500" : 
                  displayStatus === "scheduled" ? "bg-warning/10 text-warning" : 
                  "bg-destructive/10 text-destructive"
                }`}>
                  {displayStatus === "completed" ? <CheckCircle2 className="w-6 h-6" /> : 
                   displayStatus === "processing" ? <RefreshCw className="w-6 h-6 animate-spin" /> : 
                   displayStatus === "scheduled" ? <Clock className="w-6 h-6" /> : 
                   <XCircle className="w-6 h-6" />}
                </div>
                
                <div className="min-w-0 flex flex-col justify-center h-12">
                  <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                    {campaign.name || campaign.subject}
                  </h3>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                    {campaign.sender ? (
                      <span>{campaign.sender.email}</span>
                    ) : (
                      <span className="text-destructive font-medium flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Disconnected
                      </span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{new Date(campaign.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between items-center text-xs font-medium mb-2">
                  <span className="text-muted-foreground">Delivery Progress</span>
                  <span className={progress === 100 ? "text-primary" : "text-foreground"}>
                    {sent} / {campaign.recipients?.length || 0} ({progress}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 flex-1 justify-between lg:justify-end">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-muted/30">
                    <span className="font-bold text-sm">{campaign.openedCount || 0}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Opens</span>
                  </div>
                  <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-destructive/5">
                    <span className="font-bold text-sm text-destructive">{campaign.failedCount || 0}</span>
                    <span className="text-[10px] text-destructive uppercase tracking-wider font-medium">Fails</span>
                  </div>
                </div>

                <Badge 
                  variant="secondary" 
                  className={`capitalize px-3 py-1 text-xs font-medium ${
                    displayStatus === "completed" ? "bg-primary/10 text-primary hover:bg-primary/20" : 
                    displayStatus === "processing" ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" : 
                    displayStatus === "scheduled" ? "bg-warning/10 text-warning hover:bg-warning/20" : 
                    "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  }`}
                >
                  {displayStatus}
                </Badge>
              </div>

              <div className="pl-2 flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl">
                    <DropdownMenuItem onClick={() => handleAction('resend', campaign)} className="py-2.5 rounded-lg cursor-pointer">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {campaign.failedCount > 0 ? "Retry Failed" : "Resend Now"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('followup', campaign)} className="py-2.5 rounded-lg cursor-pointer">
                      <ArrowRightCircle className="w-4 h-4 mr-2" />
                      Follow-up
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('duplicate', campaign)} className="py-2.5 rounded-lg cursor-pointer">
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="py-2.5 rounded-lg cursor-pointer">
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive py-2.5 rounded-lg cursor-pointer"
                      onClick={() => handleAction('delete', campaign)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    })
  }, [filteredCampaigns]); // Only re-render cards when filtered campaigns change, not on other state updates

  return (
    <div className="space-y-8 w-full mx-auto pb-8">
      {/* Premium Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Send className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Campaigns</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            Manage your email sequences, track engagement, and launch new outreach efforts all in one place.
          </p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30 active:scale-95 rounded-xl">
          <Link href="/dashboard/send">
            <Sparkles className="w-4 h-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search campaigns..." 
            className="pl-9 h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus-visible:ring-primary/20 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-11 bg-background/50 backdrop-blur-sm border-muted-foreground/20 rounded-xl">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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

      {/* Campaigns List (Card Based instead of Table) */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-border/50 bg-card/50">
              <CardContent className="p-5 flex items-center gap-6">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="space-y-2 flex-1 hidden md:block">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardContent>
            </Card>
          ))
        ) : filteredCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/60 rounded-2xl bg-muted/10">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 text-muted-foreground">
              <Inbox className="w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Get started by creating your first email campaign. It takes just a few clicks to set up.
            </p>
            <Button asChild variant="outline" className="rounded-xl h-11 px-8">
              <Link href="/dashboard/send">
                Create Campaign
              </Link>
            </Button>
          </div>
        ) : (
          renderedCampaigns
        )}
      </div>

      {/* Minimal Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground font-medium">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg h-9 hover:bg-primary/5 hover:text-primary border-muted-foreground/20"
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-lg h-9 hover:bg-primary/5 hover:text-primary border-muted-foreground/20"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
