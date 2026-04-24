"use client"

import { useState, useRef, useEffect } from "react"
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
  Check
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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



export default function SendEmailPage() {
  const [senders, setSenders] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedSender, setSelectedSender] = useState<string>("")
  const [recipients, setRecipients] = useState<string[]>([])
  const [recipientInput, setRecipientInput] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sendersRes, templatesRes] = await Promise.all([
          fetch(`${API_URL}/senders`),
          fetch(`${API_URL}/templates`)
        ])
        const sendersData = await sendersRes.json()
        const templatesData = await templatesRes.json()
        
        if (sendersData.success) setSenders(sendersData.data)
        if (templatesData.success) setTemplates(templatesData.data)
        
        if (sendersData.data?.length > 0) {
          setSelectedSender(sendersData.data[0]._id)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  const addRecipient = (email: string) => {
    const trimmedEmail = email.trim().toLowerCase()
    if (trimmedEmail && !recipients.includes(trimmedEmail) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setRecipients([...recipients, trimmedEmail])
      setRecipientInput("")
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
    const template = templates.find(t => t._id === templateId)
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

  const handleSend = async () => {
    if (!selectedSender) return alert("Please select a sender account")
    
    setIsSending(true)
    try {
      let attachmentUrls: string[] = []
      
      // 1. Upload Attachments if any
      if (attachments.length > 0) {
        const formData = new FormData()
        attachments.forEach(file => formData.append('files', file))
        
        const uploadRes = await fetch(`${API_URL}/media/upload`, {
          method: 'POST',
          body: formData
          // Note: Browser will automatically set Content-Type to multipart/form-data with boundary
        })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          attachmentUrls = uploadData.data
        }
      }

      // 2. Create Campaign
      const campaignRes = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Campaign ${new Date().toLocaleString()}`,
          sender: selectedSender,
          template: selectedTemplate || (templates.length > 0 ? templates[0]._id : undefined),
          recipients,
          subject,
          html: body,
          attachments: attachmentUrls,
          status: 'draft'
        })
      })
      const campaignData = await campaignRes.json()
      
      if (!campaignData.success) throw new Error(campaignData.message)

      // 2. Launch Campaign
      const launchRes = await fetch(`${API_URL}/campaigns/${campaignData.data._id}/launch`, {
        method: 'POST'
      })
      const launchData = await launchRes.json()

      if (launchData.success) {
        alert("Campaign launched successfully!")
        // Reset form
        setRecipients([])
        setSubject("")
        setBody("")
        setAttachments([])
        setSelectedTemplate(null)
      }
    } catch (error: any) {
      alert(`Failed to send: ${error.message}`)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Send Email</h1>
        <p className="text-muted-foreground mt-1">
          Compose and send emails to one or multiple recipients
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Sender Selection */}
          <div className="space-y-2">
            <Label>From (Sender Account)</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
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
          <div className="space-y-2">
            <Label>Recipients</Label>
            <div className="flex flex-wrap items-center gap-2 p-3 min-h-[48px] rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              {recipients.map((email) => (
                <Badge key={email} variant="secondary" className="gap-1 pr-1">
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

          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Template (Optional)</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {selectedTemplate
                      ? templates.find(t => t._id === selectedTemplate)?.name
                      : "Select a template"}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template._id}
                    onClick={() => handleTemplateSelect(template._id)}
                    className="flex items-center justify-between"
                  >
                    <span>{template.name}</span>
                    {selectedTemplate === template._id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject line"
            />
            {subject.includes("{{") && (
              <p className="text-xs text-primary">
                Placeholders like {"{{role}}"} will be replaced with actual values
              </p>
            )}
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <div className="border rounded-lg overflow-hidden">
              {/* Rich text toolbar */}
              <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email message..."
                className="min-h-[200px] border-0 rounded-none focus-visible:ring-0 resize-none"
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />
            {attachments.length > 0 && (
              <div className="space-y-2 mb-3">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeAttachment(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-dashed"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Attachment
            </Button>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!subject || !body}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Email
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
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
                  <Separator />
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Message:</div>
                    <div className="whitespace-pre-wrap text-sm bg-muted/30 p-4 rounded-lg">
                      {body || "No message content"}
                    </div>
                  </div>
                  {attachments.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Attachments:</div>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((file, i) => (
                          <Badge key={i} variant="outline">
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
              onClick={handleSend}
              disabled={recipients.length === 0 || !subject || !body || isSending}
              className="sm:w-auto"
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email{recipients.length > 1 ? ` (${recipients.length})` : ""}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
