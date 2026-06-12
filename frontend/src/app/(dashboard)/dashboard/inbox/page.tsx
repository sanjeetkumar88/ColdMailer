"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { 
  Search, 
  Inbox as InboxIcon, 
  Send, 
  Archive, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown,
  Star,
  CornerUpLeft,
  MoreVertical,
  Paperclip,
  Reply
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import { toast } from "sonner"
import Link from "next/link"

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "not_connected" | "auth_error">("connected")
  const [filter, setFilter] = useState("all") // all, unread, sent, interested, not-interested, bounced
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const fetchMessages = async (currentPage: number, append: boolean = false) => {
    if (currentPage === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const response = await axios.get(`/api/proxy/inbox?page=${currentPage}&limit=20`);
      if (response.data.success) {
        if (response.data.notConnected) {
          setConnectionStatus("not_connected");
        } else if (response.data.hasAuthError && response.data.messages.length === 0) {
          setConnectionStatus("auth_error");
        } else {
          setConnectionStatus("connected");
        }

          // Normalize dates
          const data = response.data.messages.map((m: any) => ({
            ...m,
            date: new Date(m.date)
          }));

          setMessages(prev => {
            const newMessages = append ? [...prev, ...data] : data;
            
            // Only set selectedId if we don't have one and there are messages
            if (newMessages.length > 0) {
              setSelectedId(current => current || newMessages[0].id);
            }
            
            return newMessages;
          });

          setHasMore(response.data.hasMore);
        }
      } catch (error) {
        toast.error("Failed to fetch inbox messages");
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
  };

  useEffect(() => {
    setPage(1);
    fetchMessages(1, false);
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage, true);
    }
  }

  // Filtering Logic
  const filteredMessages = messages.filter(msg => {
    // Text search
    const matchesSearch = 
      msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      msg.sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Category filter
    switch(filter) {
      case "unread": return !msg.isRead;
      case "interested": return msg.sentiment === "interested";
      case "not-interested": return msg.sentiment === "not-interested";
      case "bounced": return msg.sentiment === "bounced";
      default: return true;
    }
  })

  const selectedMessage = messages.find(m => m.id === selectedId)

  // Handlers
  const handleReplySend = () => {
    if(!replyText.trim()) return
    alert("Reply sent! (Mock Action)")
    setReplyText("")
  }

  // Helpers
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase()
  }

  const getSentimentBadge = (sentiment: string) => {
    switch(sentiment) {
      case "interested": return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0 text-[10px]">Interested</Badge>
      case "not-interested": return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0 text-[10px]">Not Interested</Badge>
      case "bounced": return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-0 text-[10px]">Bounced</Badge>
      default: return null
    }
  }

  return (
    <div className="absolute inset-4 lg:inset-6 flex flex-col bg-background md:rounded-xl md:border overflow-hidden md:shadow-sm">
      {/* Header bar */}
      <div className="border-b bg-card/50 backdrop-blur flex items-center px-6 py-4 shrink-0">
        <h1 className="text-xl font-bold">Unified Inbox</h1>
        <div className="ml-auto w-full max-w-sm relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search emails..." 
            className="w-full bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Folders/Filters */}
        <div className="w-64 border-r bg-card/30 hidden md:flex flex-col">
          <div className="p-4 space-y-1">
            <Button 
              variant={filter === "all" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setFilter("all")}
            >
              <InboxIcon className="mr-2 h-4 w-4" />
              All Messages
              {!isLoading && (
                <span className="ml-auto bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full font-medium">
                  {messages.length}
                </span>
              )}
            </Button>
            <Button 
              variant={filter === "unread" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setFilter("unread")}
            >
              <Star className="mr-2 h-4 w-4" />
              Unread
            </Button>
            <Button 
              variant={filter === "sent" ? "secondary" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setFilter("sent")}
            >
              <Send className="mr-2 h-4 w-4" />
              Sent
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </div>

          <div className="px-4 py-2">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Smart Tags</h3>
            <div className="space-y-1">
              <Button 
                variant={filter === "interested" ? "secondary" : "ghost"} 
                className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-500/10"
                onClick={() => setFilter("interested")}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Interested
              </Button>
              <Button 
                variant={filter === "not-interested" ? "secondary" : "ghost"} 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                onClick={() => setFilter("not-interested")}
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Not Interested
              </Button>
              <Button 
                variant={filter === "bounced" ? "secondary" : "ghost"} 
                className="w-full justify-start text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-500/10"
                onClick={() => setFilter("bounced")}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Bounced
              </Button>
            </div>
          </div>
        </div>

        {/* Middle - Message List */}
        <div className="w-full md:w-96 border-r flex flex-col bg-background min-h-0 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <span className="text-sm font-medium text-muted-foreground">
              {!isLoading && `${filteredMessages.length} message${filteredMessages.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex flex-col">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col gap-2 animate-pulse pb-4 border-b">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted" />
                          <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                        <div className="h-3 w-10 bg-muted rounded" />
                      </div>
                      <div className="h-4 w-3/4 bg-muted rounded mt-1" />
                      <div className="h-3 w-full bg-muted rounded mt-1" />
                      <div className="h-3 w-2/3 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : connectionStatus === "not_connected" ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="font-medium">No Email Connected</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Please connect your Gmail account in settings.</p>
                  <Button asChild size="sm">
                    <Link href="/dashboard/settings">Connect Account</Link>
                  </Button>
                </div>
              ) : connectionStatus === "auth_error" ? (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                  <AlertCircle className="h-10 w-10 text-destructive mb-3" />
                  <p className="font-medium">Connection Expired</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Your Gmail connection has expired or been revoked.</p>
                  <Button asChild size="sm" variant="destructive">
                    <Link href="/dashboard/settings">Reconnect Account</Link>
                  </Button>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No messages found.
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedId(msg.id)}
                    className={cn(
                      "flex flex-col items-start gap-2 p-4 text-left text-sm transition-all border-b",
                      !msg.isRead && "bg-muted/30 font-medium",
                      selectedId === msg.id ? "bg-muted" : "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex w-full justify-between items-start gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px]">{getInitials(msg.sender.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold truncate">{msg.sender.name}</span>
                        {msg.thread && msg.thread.length > 1 && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 ml-1 shrink-0">
                            {msg.thread.length}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {format(msg.date, "MMM d")}
                      </span>
                    </div>
                    
                    <div className="flex w-full flex-col gap-1">
                      <div className="font-medium truncate">{msg.subject}</div>
                      <div className="line-clamp-2 text-xs text-muted-foreground">
                        {msg.snippet}
                      </div>
                    </div>
                    
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getSentimentBadge(msg.sentiment)}
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded truncate max-w-[120px]" title={`Received by: ${msg.receiverEmail}`}>
                        To: {msg.receiverEmail}
                      </span>
                    </div>
                  </button>
                ))
              )}
              {filteredMessages.length > 0 && hasMore && (
                <div className="p-4 flex justify-center border-b">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "Loading..." : "Load More emails"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Message Detail */}
        <div className="flex-1 hidden md:flex flex-col bg-background/50">
          {isLoading ? (
             <div className="flex flex-col h-full animate-pulse">
                <div className="h-16 border-b bg-card flex items-center px-4 gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-48 bg-muted rounded" />
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-8 w-1/2 bg-muted rounded mb-8" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                  <div className="h-4 w-4/5 bg-muted rounded" />
                </div>
             </div>
          ) : selectedMessage ? (
            <>
              {/* Detail Header */}
                <div className="flex items-center justify-between p-4 border-b bg-card shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback>{getInitials(selectedMessage.sender.name)}</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <div className="font-semibold flex items-center gap-2">
                          {selectedMessage.sender.name}
                          <Badge variant="secondary" className="text-[10px] h-4 font-normal px-1.5">
                            Received at {selectedMessage.receiverEmail}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{selectedMessage.sender.email}</div>
                      </div>
                    </div>
                  </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto min-h-0 bg-background/30 px-4 py-6">
                  <div className="max-w-3xl mx-auto space-y-6 pb-4">
                  <h2 className="text-2xl font-bold tracking-tight mb-8">{selectedMessage.subject}</h2>
                  
                  {/* If there's no thread body yet, we just show the snippet */}
                  {selectedMessage.thread && selectedMessage.thread.length > 0 ? (
                    selectedMessage.thread.map((threadMsg: any, idx: number) => (
                      <div 
                        key={threadMsg.id} 
                        className={cn(
                          "flex flex-col gap-2 rounded-xl p-4 border",
                          idx === 0 ? "bg-card shadow-sm" : "bg-muted/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">
                            {threadMsg.from.name || threadMsg.from.email}
                            <span className="text-xs text-muted-foreground ml-2 font-normal">&lt;{threadMsg.from.email}&gt;</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{format(new Date(threadMsg.date), "PPp")}</div>
                        </div>
                        <div className="text-sm text-foreground/90 mt-4 bg-background rounded-lg p-4 border overflow-x-auto">
                          {threadMsg.body ? (
                            <div dangerouslySetInnerHTML={{ __html: threadMsg.body }} className="prose prose-sm dark:prose-invert max-w-none" />
                          ) : (
                            <div className="whitespace-pre-wrap">{threadMsg.snippet}</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col gap-2 rounded-xl p-4 border bg-card shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{selectedMessage.sender.name}</div>
                        <div className="text-xs text-muted-foreground">{format(selectedMessage.date, "PPp")}</div>
                      </div>
                      <div className="text-sm whitespace-pre-wrap text-foreground/90 mt-2">
                        {selectedMessage.snippet}
                        <br/><br/>
                        <span className="text-muted-foreground italic text-xs">(Full body fetched on demand in production)</span>
                      </div>
                    </div>
                  )}
                  </div>
              </div>

              {/* Reply Box */}
              <div className="p-4 bg-card border-t shrink-0">
                <div className="max-w-3xl mx-auto flex flex-col gap-2 rounded-xl border bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary transition-all">
                  <textarea 
                    placeholder="Write your reply..." 
                    className="min-h-[100px] w-full resize-none bg-transparent p-2 text-sm outline-none placeholder:text-muted-foreground"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex items-center justify-between p-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleReplySend} className="px-6 shadow-sm">
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <InboxIcon className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
