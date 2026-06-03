"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import {
  Send,
  X,
  Plus,
  Paperclip,
  Eye,
  FileText,
  Upload,
  Trash2,
  Bold,
  Italic,
  Underline,
  List,
  Link2,
  Image as ImageIcon,
  ChevronDown,
  Check,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



function SendEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const followupId = searchParams.get('followup')
  const duplicateId = searchParams.get('duplicate')

  const [senders, setSenders] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [contactLists, setContactLists] = useState<any[]>([])
  const [selectedSender, setSelectedSender] = useState<string>("")
  const [campaignName, setCampaignName] = useState("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [recipientInput, setRecipientInput] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isDrafting, setIsDrafting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [includeUnsubscribe, setIncludeUnsubscribe] = useState(true)
  const [loadedListId, setLoadedListId] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.allSettled([
        axios.get(`/api/proxy/senders`),
        axios.post(`/api/graphql-proxy`, {
          query: `
            query {
              templates {
                id
                name
                subject
                html
              }
            }
          `
        }),
        axios.get(`/api/proxy/contact-lists`)
      ])

      const [sendersRes, templatesRes, contactListsRes] = results

      if (sendersRes.status === 'fulfilled' && sendersRes.value.data?.success) {
        setSenders(sendersRes.value.data.data)
        if (sendersRes.value.data.data?.length > 0) {
          setSelectedSender(sendersRes.value.data.data[0]._id)
        }
      } else if (sendersRes.status === 'rejected') {
        console.error("Failed to fetch senders:", sendersRes.reason)
      }

      if (templatesRes.status === 'fulfilled' && !templatesRes.value.data?.errors) {
        setTemplates(templatesRes.value.data.data?.templates || [])
      } else if (templatesRes.status === 'rejected') {
        console.error("Failed to fetch templates:", templatesRes.reason)
      } else if (templatesRes.status === 'fulfilled' && templatesRes.value.data?.errors) {
        console.error("GraphQL errors fetching templates:", templatesRes.value.data.errors)
      }

      if (contactListsRes.status === 'fulfilled' && contactListsRes.value.data?.success) {
        setContactLists(contactListsRes.value.data.data)
      } else if (contactListsRes.status === 'rejected') {
        console.error("Failed to fetch contact lists:", contactListsRes.reason)
      }
      setIsLoading(false)
    }
    if (status === 'authenticated') fetchData()
  }, [status])

  // Handle Follow-up / Duplicate logic
  useEffect(() => {
    const fetchSourceCampaign = async (id: string, isFollowup: boolean) => {
      try {
        const res = await axios.get(`${API_URL}/campaigns/${id}`)
        const result = res.data
        if (result.success) {
          const campaign = result.data
          setRecipients(campaign.recipients || [])
          setSelectedSender(campaign.sender?._id || campaign.sender || "")
          setSelectedTemplate(campaign.template?._id || campaign.template || null)
          
          if (isFollowup) {
            setSubject(`Re: ${campaign.subject}`)
            setBody(`Following up on my previous email...\n\n---\n${campaign.html || ""}`)
          } else {
            setSubject(campaign.subject)
            setBody(campaign.html || "")
          }
        }
      } catch (error) {
        console.error("Failed to fetch source campaign:", error)
      }
    }

    if (status === 'authenticated' && (followupId || duplicateId)) {
      fetchSourceCampaign((followupId || duplicateId)!, !!followupId)
    }
  }, [status, followupId, duplicateId])

  const addRecipient = (email: string) => {
    const trimmedEmail = (email || "").trim().toLowerCase()
    if (trimmedEmail && !recipients.includes(trimmedEmail) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setRecipients([...recipients, trimmedEmail])
      setRecipientInput("")
    }
  }

  const loadContactList = async (listId: string) => {
    try {
      const res = await axios.get(`${API_URL}/contacts?listId=${listId}`, {
        headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken}` }
      });
      if (res.data.success) {
        const emails = res.data.data.map((c: any) => c.email.toLowerCase());
        const uniqueNewEmails = emails.filter((email: string) => !recipients.includes(email));
        if (uniqueNewEmails.length > 0) {
          setRecipients([...recipients, ...uniqueNewEmails]);
        }
        setLoadedListId(listId);
      }
    } catch (error) {
      console.error("Failed to load contacts from list:", error);
    }
  }

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addRecipient(recipientInput)
    }
    if (e.key === "Backspace" && !recipientInput && recipients.length > 0) {
      removeRecipient(recipients[recipients.length - 1])
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSubject(template.subject)
      setBody(template.html || template.text || "")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const saveCampaign = async (launch: boolean) => {
    if (!selectedSender) return alert("Please select a sender account")
    
    if (launch) setIsSending(true)
    else setIsDrafting(true)

    try {
      let attachmentUrls: string[] = []
      
      // 1. Upload Attachments if any
      if (attachments.length > 0) {
        const formData = new FormData()
        attachments.forEach(file => formData.append('files', file))
        
        const uploadRes = await axios.post(`${API_URL}/media/upload`, formData)
        const uploadData = uploadRes.data
        
        if (!uploadData.success) {
          throw new Error(uploadData.message || "Failed to upload attachments. Campaign aborted.")
        }
        
        attachmentUrls = uploadData.data
      }

      const finalBody = includeUnsubscribe 
        ? `${body}\n\n---\nP.S. If you're not the right person for this, or don't want to hear from me again, just let me know.`
        : body

      // 2. Create Campaign (Initially as draft)
      const finalCampaignName = campaignName.trim() || `Campaign ${new Date().toLocaleString()}`
      const campaignRes = await axios.post(`/api/proxy/campaigns`, {
        name: finalCampaignName,
        sender: selectedSender,
        template: selectedTemplate || (templates.length > 0 ? templates[0].id : undefined),
        recipients,
        subject,
        html: finalBody,
        contactList: loadedListId,
        attachments: attachmentUrls,
        status: 'draft'
      })
      const campaignData = campaignRes.data
      
      if (!campaignData.success) throw new Error(campaignData.message)

      // 3. Launch if requested
      if (launch) {
        const launchRes = await axios.post(`/api/proxy/campaigns/${campaignData.data._id}/launch`)
        const launchData = launchRes.data

        if (launchData.success) {
          alert("Campaign launched successfully!")
        } else {
           throw new Error(launchData.message || "Failed to launch campaign")
        }
      } else {
        alert("Campaign saved as draft!")
      }

      // Reset form and redirect
      setRecipients([])
      setSubject("")
      setBody("")
      setAttachments([])
      setSelectedTemplate(null)
      router.push("/dashboard/campaigns")
      
    } catch (error: any) {
      alert(`Failed to ${launch ? 'send' : 'save draft'}: ${error.response?.data?.message || error.message}`)
    } finally {
      if (launch) setIsSending(false)
      else setIsDrafting(false)
    }
  }

  const handleSend = () => saveCampaign(true)
  const handleDraft = () => saveCampaign(false)

  if (isLoading || status === 'loading') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card className="border-muted/40 shadow-sm">
          <CardContent className="pt-6 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-64 w-full rounded-md" />
            </div>
            <Skeleton className="h-12 w-32 rounded-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-3xl -z-10 rounded-full" />
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Launch Campaign
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Craft and deploy highly personalized email campaigns at scale.
        </p>
      </div>

      <Card className="border-muted/30 shadow-lg shadow-black/5 bg-background/60 backdrop-blur-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        <CardContent className="pt-8 space-y-8">
          {/* Campaign Name */}
          <div className="space-y-2 group">
            <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
              Campaign Name
            </Label>
            <Input 
              placeholder="E.g., Summer Outreach 2026"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="bg-muted/30 border-muted/50 focus-visible:ring-primary/20 transition-all hover:bg-muted/50"
            />
          </div>

          {/* Sender Selection */}
          <div className="space-y-2 group">
            <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
              From <span className="text-muted-foreground font-normal">(Sender Account)</span>
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-muted/30 border-muted/50 hover:bg-muted/50 hover:border-muted-foreground/30 transition-all">
                  <span className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      <Send className="w-4 h-4" />
                    </div>
                    {selectedSender
                      ? senders.find(s => s._id === selectedSender)?.email
                      : "Select a sender account"}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {senders.map((sender) => (
                  <DropdownMenuItem
                    key={sender._id}
                    onClick={() => setSelectedSender(sender._id)}
                    className="flex items-center justify-between"
                  >
                    <span>{sender.email}</span>
                    {selectedSender === sender._id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Recipients */}
          <div className="space-y-2 group">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
                Recipients
              </Label>
              {contactLists.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-primary">
                      <Plus className="w-3 h-3 mr-1" /> Load Contact List
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {contactLists.map(list => (
                      <DropdownMenuItem key={list._id} onClick={() => loadContactList(list._id)}>
                        Load "{list.name}" list
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 p-3 min-h-[56px] rounded-lg border border-muted/50 bg-muted/30 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all shadow-inner">
              {recipients.map((email) => (
                <Badge key={email} variant="secondary" className="gap-1 pr-1 py-1 px-3 bg-background border-muted shadow-sm hover:bg-muted/80 transition-colors">
                  {email}
                  <button
                    onClick={() => removeRecipient(email)}
                    className="ml-1 hover:bg-muted rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <Input
                type="email"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => addRecipient(recipientInput)}
                placeholder={recipients.length === 0 ? "Add email addresses..." : ""}
                className="flex-1 min-w-[200px] border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add multiple recipients
            </p>
          </div>

          <Separator className="my-6 opacity-50" />

          {/* Template Selection */}
          <div className="space-y-2 group">
            <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
              Template <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-muted/30 border-muted/50 hover:bg-muted/50 transition-all">
                  <span className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
                      <FileText className="w-4 h-4" />
                    </div>
                    {selectedTemplate
                      ? templates.find(t => t.id === selectedTemplate)?.name
                      : "Select a template"}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className="flex items-center justify-between"
                  >
                    <span>{template.name}</span>
                    {selectedTemplate === template.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subject Line */}
          <div className="space-y-2 group">
            <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
              Subject Line
            </Label>
            <Input 
              placeholder="What is this email about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-muted/30 border-muted/50 focus-visible:ring-primary/20 transition-all text-lg font-medium py-6"
            />
          </div>

          {/* Body */}
          <div className="space-y-2 group">
            <Label className="text-sm font-semibold flex items-center gap-2 text-foreground/80 group-focus-within:text-primary transition-colors">
              Message
            </Label>
            <div className="border border-muted/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all shadow-sm">
              <div className="flex items-center gap-1 p-2 bg-muted/40 border-b border-muted/50">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Underline className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Link2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
              <Textarea 
                placeholder="Type your message here..."
                className="min-h-[300px] border-0 focus-visible:ring-0 rounded-none bg-background/50 resize-y p-4 text-base leading-relaxed"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>

          {/* Attachments & Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-muted/30">
            <div className="flex flex-wrap items-center gap-3">
              <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {attachments.length > 0 ? `${attachments.length} file(s)` : "Attach"}
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-muted/50">
                <Switch 
                  id="unsubscribe"
                  checked={includeUnsubscribe}
                  onCheckedChange={setIncludeUnsubscribe}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="unsubscribe" className="text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  Unsubscribe Link
                </Label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  disabled={!subject || !body}
                  className="hover:bg-muted/50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-muted/50">
                <DialogHeader>
                  <DialogTitle>Email Preview</DialogTitle>
                  <DialogDescription>
                    Review your email before sending
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">To:</div>
                    <div className="flex flex-wrap gap-1">
                      {recipients.length > 0 ? recipients.map(r => (
                        <Badge key={r} variant="secondary">{r}</Badge>
                      )) : (
                        <span className="text-muted-foreground text-sm">No recipients added</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Subject:</div>
                    <div className="font-medium">{subject || "No subject"}</div>
                  </div>
                  <Separator className="opacity-50" />
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Message:</div>
                    <div className="whitespace-pre-wrap text-sm bg-muted/20 p-4 rounded-xl border border-muted/30">
                      {body || "No message content"}
                      {includeUnsubscribe && (
                        <div className="mt-4 text-muted-foreground">
                          ---<br />
                          P.S. If you're not the right person for this, or don't want to hear from me again, just let me know.
                        </div>
                      )}
                    </div>
                  </div>
                  {attachments.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Attachments:</div>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((file, i) => (
                          <Badge key={i} variant="outline" className="bg-background">
                            <Paperclip className="w-3 h-3 mr-1" />
                            {file.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Close
                  </Button>
                  <Button onClick={() => { setShowPreview(false); handleSend(); }}>
                    Send Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline"
              onClick={handleDraft} 
              disabled={isDrafting || isSending || !selectedSender || !subject}
              className="px-6 py-6 rounded-xl font-medium text-lg hover:bg-muted/50"
            >
              {isDrafting ? "Saving..." : "Save as Draft"}
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={isSending || isDrafting || !selectedSender || recipients.length === 0 || !subject}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-8 py-6 rounded-xl font-medium text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSending ? "Sending..." : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Campaign
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SendEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SendEmailForm />
    </Suspense>
  )
}
