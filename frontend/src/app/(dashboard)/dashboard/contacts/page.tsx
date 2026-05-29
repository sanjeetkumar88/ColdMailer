"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Plus, 
  Search, 
  Users, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Upload,
  Mail,
  Tag,
  X,
  Check,
  Download,
  Filter
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuCheckboxItem,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Contact {
  id: string
  name: string
  email: string
  company: string
  tags: string[]
  createdAt: string
}

const availableTags = ["HR", "Recruiter", "Hiring Manager", "Startup", "Enterprise", "Agency"]

const initialContacts: any[] = []

export default function ContactsPage() {
  const { data: session } = useSession()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    tags: [] as string[]
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  const token = (session?.user as any)?.accessToken

  const fetchContacts = async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        
      })
      const data = await res.json()
      if (data.success) {
        setContacts(data.data.map((c: any) => ({
          id: c._id,
          name: c.name,
          email: c.email,
          company: c.company || "",
          tags: c.tags || [],
          createdAt: new Date(c.createdAt).toLocaleDateString()
        })))
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [token])

  const handleAdd = async () => {
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        fetchContacts()
        setFormData({ name: "", email: "", company: "", tags: [] })
        setIsAddOpen(false)
      }
    } catch (error) {
      console.error("Failed to add contact:", error)
    }
  }

  const handleEdit = async () => {
    if (selectedContact) {
      try {
        const res = await fetch(`${API_URL}/contacts/${selectedContact.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify(formData)
        })
        if (res.ok) {
          fetchContacts()
          setIsEditOpen(false)
          setSelectedContact(null)
        }
      } catch (error) {
        console.error("Failed to update contact:", error)
      }
    }
  }

  const handleDelete = async () => {
    if (selectedContact) {
      try {
        const res = await fetch(`${API_URL}/contacts/${selectedContact.id}`, {
          method: 'DELETE',
          
        })
        if (res.ok) {
          fetchContacts()
          setIsDeleteOpen(false)
          setSelectedContact(null)
        }
      } catch (error) {
        console.error("Failed to delete contact:", error)
      }
    }
  }
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some(t => c.tags.includes(t))
    return matchesSearch && matchesTags
  })

  const handleBulkDelete = () => {
    setContacts(contacts.filter(c => !selectedContacts.includes(c.id)))
    setSelectedContacts([])
  }

  const openEditDialog = (contact: Contact) => {
    setSelectedContact(contact)
    setFormData({
      name: contact.name,
      email: contact.email,
      company: contact.company,
      tags: contact.tags
    })
    setIsEditOpen(true)
  }

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id))
    }
  }

  const toggleContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id))
    } else {
      setSelectedContacts([...selectedContacts, id])
    }
  }

  const toggleFormTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
    } else {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate CSV import
      const newContacts: Contact[] = [
        { id: Date.now().toString(), name: "Imported User 1", email: "import1@example.com", company: "Import Co", tags: [], createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
        { id: (Date.now() + 1).toString(), name: "Imported User 2", email: "import2@example.com", company: "Import Co", tags: [], createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
      ]
      setContacts([...newContacts, ...contacts])
      setIsImportOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your email recipients and contact lists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Contacts</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with your contacts
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <div className="text-sm font-medium">Click to upload or drag and drop</div>
                  <div className="text-xs text-muted-foreground mt-1">CSV files only</div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="text-sm text-muted-foreground">
                  <div className="font-medium mb-1">Expected CSV format:</div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    name,email,company,tags
                  </code>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ name: "", email: "", company: "", tags: [] })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>
                  Add a new recipient to your contact list
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Inc"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant={formData.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleFormTag(tag)}
                      >
                        {formData.tags.includes(tag) && <Check className="w-3 h-3 mr-1" />}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAdd}
                  disabled={!formData.name || !formData.email}
                >
                  Add Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Tag
              {selectedTags.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTags([...selectedTags, tag])
                  } else {
                    setSelectedTags(selectedTags.filter(t => t !== tag))
                  }
                }}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedTags.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedTags([])}>
                  Clear filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border">
          <span className="text-sm font-medium">
            {selectedContacts.length} contact{selectedContacts.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <Empty>
              <Empty.Icon>
                <Users className="w-10 h-10" />
              </Empty.Icon>
              <Empty.Title>No contacts found</Empty.Title>
              <Empty.Description>
                {searchQuery || selectedTags.length > 0
                  ? "Try adjusting your filters" 
                  : "Add your first contact or import from CSV"}
              </Empty.Description>
              {!searchQuery && selectedTags.length === 0 && (
                <Empty.Actions>
                  <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </Empty.Actions>
              )}
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Tags</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContact(contact.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{contact.company}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(contact)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedContact(contact)
                            setIsDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update contact information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant={formData.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFormTag(tag)}
                  >
                    {formData.tags.includes(tag) && <Check className="w-3 h-3 mr-1" />}
                    {tag}
                  </Badge>
                ))}
              </div>
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

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedContact?.name}? This action cannot be undone.
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
