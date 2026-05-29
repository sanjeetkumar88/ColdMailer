"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Plus, 
  Search, 
  FileText, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Copy,
  Eye,
  Clock,
  Mail,
  X,
  Bold,
  Italic,
  Underline,
  List,
  Link2
} from "lucide-react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Empty } from "@/components/ui/empty"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Template {
  id: string
  name: string
  subject: string
  body: string
  usageCount: number
  lastUsed: string
  createdAt: string
}

const initialTemplates: Template[] = [
  {
    id: "1",
    name: "Job Application",
    subject: "Application for {{role}} Position at {{company}}",
    body: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the {{role}} position at {{company}}.\n\nWith my experience in [Your Skills], I believe I would be a valuable addition to your team.\n\nI have attached my resume for your review. I am excited about the opportunity to discuss how my skills align with your needs.\n\nBest regards,\n{{name}}",
    usageCount: 156,
    lastUsed: "2 hours ago",
    createdAt: "Jan 15, 2024"
  },
  {
    id: "2",
    name: "Follow Up",
    subject: "Following up on my application for {{role}}",
    body: "Dear {{recruiter_name}},\n\nI hope this email finds you well. I wanted to follow up on my application for the {{role}} position that I submitted on {{date}}.\n\nI remain very interested in the opportunity and would love to discuss how my background could benefit your team.\n\nThank you for your consideration.\n\nBest regards,\n{{name}}",
    usageCount: 89,
    lastUsed: "1 day ago",
    createdAt: "Jan 20, 2024"
  },
  {
    id: "3",
    name: "Thank You - Interview",
    subject: "Thank you for the interview - {{role}}",
    body: "Dear {{interviewer_name}},\n\nThank you so much for taking the time to meet with me today to discuss the {{role}} position.\n\nI really enjoyed learning more about {{company}} and the exciting projects your team is working on.\n\nOur conversation reinforced my enthusiasm for this opportunity. I am confident that my skills in [Your Skills] would make me a strong fit.\n\nPlease feel free to reach out if you need any additional information.\n\nBest regards,\n{{name}}",
    usageCount: 45,
    lastUsed: "3 days ago",
    createdAt: "Feb 1, 2024"
  },
  {
    id: "4",
    name: "Cold Outreach",
    subject: "Quick question about {{company}}",
    body: "Hi {{name}},\n\nI came across {{company}} and was impressed by [Something Specific].\n\nI'm currently exploring opportunities in [Your Field] and would love to learn more about your team and culture.\n\nWould you be open to a quick 15-minute chat sometime this week?\n\nThanks,\n{{your_name}}",
    usageCount: 23,
    lastUsed: "1 week ago",
    createdAt: "Feb 10, 2024"
  },
]

export default function TemplatesPage() {
  const { data: session } = useSession()
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: ""
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const token = (session?.user as any)?.accessToken

  const fetchTemplates = async () => {
    try {
      const res = await axios.post(`/api/graphql-proxy`, {
        query: `
          query {
            templates {
              id
              name
              subject
              html
              createdAt
            }
          }
        `
      })
      const { data, errors } = res.data
      if (errors) {
        console.error("GraphQL errors:", errors)
      } else if (data?.templates) {
        setTemplates(data.templates.map((t: any) => ({
          id: t.id,
          name: t.name,
          subject: t.subject,
          body: t.html || "",
          usageCount: 0,
          lastUsed: "Never",
          createdAt: new Date(Number(t.createdAt) || t.createdAt).toLocaleDateString()
        })))
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleCreate = async () => {
    try {
      const res = await axios.post(`/graphql`, {
        query: `
          mutation CreateTemplate($input: CreateTemplateInput!) {
            createTemplate(input: $input) {
              id
            }
          }
        `,
        variables: {
          input: {
            name: formData.name,
            subject: formData.subject,
            html: formData.body
          }
        }
      })
      const json = res.data
      if (!json.errors) {
        const newTemplate = {
          id: json.data.createTemplate.id,
          name: formData.name,
          subject: formData.subject,
          body: formData.body,
          usageCount: 0,
          lastUsed: "Never",
          createdAt: new Date().toLocaleDateString()
        }
        setTemplates(prev => [newTemplate, ...prev])
        setFormData({ name: "", subject: "", body: "" })
        setIsCreateOpen(false)
      } else {
        console.error(json.errors)
      }
    } catch (error) {
      console.error("Failed to create template:", error)
    }
  }

  const handleEdit = async () => {
    if (selectedTemplate) {
      try {
        const res = await axios.post(`/graphql`, {
          query: `
            mutation UpdateTemplate($id: ID!, $input: UpdateTemplateInput!) {
              updateTemplate(id: $id, input: $input) {
                id
              }
            }
          `,
          variables: {
            id: selectedTemplate.id,
            input: {
              name: formData.name,
              subject: formData.subject,
              html: formData.body
            }
          }
        })
        const json = res.data
        if (!json.errors) {
          setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? {
            ...t,
            name: formData.name,
            subject: formData.subject,
            body: formData.body
          } : t))
          setIsEditOpen(false)
          setSelectedTemplate(null)
        } else {
          console.error(json.errors)
        }
      } catch (error) {
        console.error("Failed to update template:", error)
      }
    }
  }

  const handleDelete = async () => {
    if (selectedTemplate) {
      try {
        const res = await axios.post(`/graphql`, {
          query: `
            mutation DeleteTemplate($id: ID!) {
              deleteTemplate(id: $id) {
                id
              }
            }
          `,
          variables: { id: selectedTemplate.id }
        })
        const json = res.data
        if (!json.errors) {
          setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id))
          setIsDeleteOpen(false)
          setSelectedTemplate(null)
        } else {
          console.error(json.errors)
        }
      } catch (error) {
        console.error("Failed to delete template:", error)
      }
    }
  }

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDuplicate = (template: Template) => {
    const duplicate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      lastUsed: "Never",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }
    setTemplates([duplicate, ...templates])
  }

  const openEditDialog = (template: Template) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body
    })
    setIsEditOpen(true)
  }

  const openPreviewDialog = (template: Template) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage reusable email templates
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData({ name: "", subject: "", body: "" })}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Create a reusable email template with placeholders
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Job Application"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Application for {{role}} Position"
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{{placeholder}}"} syntax for dynamic content
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <div className="border rounded-lg overflow-hidden">
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
                  </div>
                  <Textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Write your email template..."
                    className="min-h-[200px] border-0 rounded-none focus-visible:ring-0 resize-none"
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="text-sm font-medium mb-2">Available Placeholders:</div>
                <div className="flex flex-wrap gap-2">
                  {["{{name}}", "{{company}}", "{{role}}", "{{date}}", "{{recruiter_name}}"].map((p) => (
                    <Badge key={p} variant="outline" className="font-mono text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!formData.name || !formData.subject || !formData.body}
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <Empty>
              <Empty.Icon>
                <FileText className="w-10 h-10" />
              </Empty.Icon>
              <Empty.Title>No templates found</Empty.Title>
              <Empty.Description>
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Create your first template to get started"}
              </Empty.Description>
              {!searchQuery && (
                <Empty.Actions>
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </Empty.Actions>
              )}
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Created {template.createdAt}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openPreviewDialog(template)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(template)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setSelectedTemplate(template)
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {template.subject}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {template.usageCount} uses
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {template.lastUsed}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your email template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Template Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject Line</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-body">Email Body</Label>
              <Textarea
                id="edit-body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Template preview with placeholder values
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Subject:</div>
              <div className="font-medium">{selectedTemplate?.subject}</div>
            </div>
            <Separator />
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Body:</div>
              <div className="whitespace-pre-wrap text-sm bg-muted/30 p-4 rounded-lg">
                {selectedTemplate?.body}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsPreviewOpen(false)
              openEditDialog(selectedTemplate!)
            }}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedTemplate?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
