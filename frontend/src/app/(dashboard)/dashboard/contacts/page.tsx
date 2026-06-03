"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import Papa from "papaparse"
import { 
  Plus, Search, Users, MoreHorizontal, Pencil, Trash2, Upload, FileDown, Folder, X, Check, ArrowRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Empty } from "@/components/ui/empty"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactList {
  _id: string;
  name: string;
  columns: string[];
}

interface Contact {
  id: string
  name: string
  email: string
  metadata: Record<string, any>
  createdAt: string
}

export default function ContactsPage() {
  const { data: session, status } = useSession()
  const [lists, setLists] = useState<ContactList[]>([])
  const [selectedList, setSelectedList] = useState<ContactList | null>(null)
  
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Modals
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleteListOpen, setIsDeleteListOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const [selectedContact, setSelectedContact] = useState<any | null>(null)
  const [listFormData, setListFormData] = useState({ name: "", columns: [] as string[] })
  const [newColumnName, setNewColumnName] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    metadata: {} as Record<string, string>
  })

  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const fetchLists = async () => {
    try {
      const res = await axios.get(`/api/proxy/contact-lists`)
      if (res.data.success) {
        const fetchedLists = res.data.data
        setLists(fetchedLists)
        if (fetchedLists.length > 0 && !selectedList) {
          setSelectedList(fetchedLists[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch lists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchContacts = async () => {
    if (!selectedList) return
    try {
      setIsLoading(true)
      const res = await axios.get(`/api/proxy/contacts?listId=${selectedList._id}`)
      if (res.data.success) {
        setContacts(res.data.data.map((c: any) => ({
          id: c._id,
          name: c.name,
          email: c.email,
          metadata: c.metadata || {},
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
    if (status === 'authenticated') {
      fetchLists()
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated' && selectedList) {
      fetchContacts()
    }
  }, [selectedList, status])

  const handleCreateList = async () => {
    try {
      const res = await axios.post(`/api/proxy/contact-lists`, listFormData)
      if (res.data.success) {
        fetchLists()
        setSelectedList(res.data.data)
        setIsCreateListOpen(false)
        setListFormData({ name: "", columns: [] })
      }
    } catch (error) {
      console.error("Failed to create list:", error)
    }
  }

  const handleDeleteList = async () => {
    if (!selectedList) return
    try {
      await axios.delete(`/api/proxy/contact-lists/${selectedList._id}`)
      setSelectedList(null)
      fetchLists()
      setIsDeleteListOpen(false)
    } catch (error) {
      console.error("Failed to delete list:", error)
    }
  }

  const handleAddContact = async () => {
    if (!selectedList) return
    try {
      const payload: any = { 
        name: formData.name, 
        email: formData.email, 
        listId: selectedList._id,
        ...formData.metadata
      }

      const res = await axios.post(`/api/proxy/contacts`, payload)
      if (res.status === 200 || res.status === 201) {
        fetchContacts()
        setFormData({ name: "", email: "", metadata: {} })
        setIsAddOpen(false)
      }
    } catch (error) {
      console.error("Failed to add contact:", error)
    }
  }

  const handleEditContact = async () => {
    if (!selectedContact || !selectedList) return
    try {
      const payload: any = { 
        name: formData.name, 
        email: formData.email, 
        listId: selectedList._id,
        ...formData.metadata
      }

      const res = await axios.patch(`/api/proxy/contacts/${selectedContact.id}`, payload)
      if (res.status === 200) {
        fetchContacts()
        setIsEditOpen(false)
        setSelectedContact(null)
      }
    } catch (error) {
      console.error("Failed to update contact:", error)
    }
  }

  const handleDeleteContact = async () => {
    if (selectedContact) {
      try {
        const res = await axios.delete(`/api/proxy/contacts/${selectedContact.id}`)
        if (res.status === 200) {
          fetchContacts()
          setIsDeleteOpen(false)
          setSelectedContact(null)
        }
      } catch (error) {
        console.error("Failed to delete contact:", error)
      }
    }
  }

  const openAddContactModal = () => {
    const meta: Record<string, string> = {}
    selectedList?.columns.forEach(col => { meta[col] = "" })
    setFormData({ name: "", email: "", metadata: meta })
    setIsAddOpen(true)
  }

  const openEditContactModal = (contact: Contact) => {
    setSelectedContact(contact)
    const meta: Record<string, string> = {}
    selectedList?.columns.forEach(col => { meta[col] = contact.metadata[col] || "" })
    setFormData({
      name: contact.name,
      email: contact.email,
      metadata: meta
    })
    setIsEditOpen(true)
  }

  // --- Bulk CSV Import Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImportFile(file);
      
      // Peek at headers
      Papa.parse(file, {
        preview: 3,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.meta.fields) {
            setCsvHeaders(results.meta.fields);
            // Auto-map where possible
            const defaultMapping: Record<string, string> = {};
            results.meta.fields.forEach(header => {
              const h = header.toLowerCase().replace(/[^a-z0-9_]/g, '');
              const originalH = header.toLowerCase();
              if (originalH.includes('email')) defaultMapping[header] = 'email';
              else if (originalH.includes('name') && !originalH.includes('company')) defaultMapping[header] = 'name';
              else if (selectedList?.columns.includes(h)) defaultMapping[header] = h;
              else defaultMapping[header] = h; // Default to creating a new custom column
            });
            setColumnMapping(defaultMapping);
          }
        }
      });
    }
  };

  const handleBulkUpload = async () => {
    if (!importFile || !selectedList) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('listId', selectedList._id);
      
      // Filter out ignored columns and identify new columns
      const finalMapping: Record<string, string> = {};
      const newColumns: string[] = [];
      
      for (const [csvHeader, listColumn] of Object.entries(columnMapping)) {
        if (listColumn !== 'ignore') {
          finalMapping[csvHeader] = listColumn;
          if (listColumn !== 'email' && listColumn !== 'name' && !selectedList.columns.includes(listColumn)) {
            newColumns.push(listColumn);
          }
        }
      }

      // If there are new custom columns, update the list schema first
      if (newColumns.length > 0) {
        const uniqueColumns = Array.from(new Set([...selectedList.columns, ...newColumns]));
        await axios.patch(`/api/proxy/contact-lists/${selectedList._id}`, { columns: uniqueColumns });
        
        // Update local state temporarily so the table refreshes correctly
        setSelectedList({ ...selectedList, columns: uniqueColumns });
      }

      formData.append('mappingConfig', JSON.stringify(finalMapping));

      const res = await axios.post(`/api/proxy/contacts/bulk-upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.data.success) {
        fetchContacts();
        setIsImportOpen(false);
        setImportFile(null);
        setCsvHeaders([]);
        alert(`Successfully imported ${res.data.count} contacts!`);
      }
    } catch (error: any) {
      console.error("Bulk upload failed:", error);
      alert("Failed to upload CSV: " + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* Sidebar for Lists */}
      <div className="w-64 shrink-0 flex flex-col gap-4 border-r pr-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Contact Lists</h2>
          <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New List</DialogTitle>
                <DialogDescription>Define a new contact list and its custom columns.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>List Name</Label>
                  <Input value={listFormData.name} onChange={e => setListFormData({...listFormData, name: e.target.value})} placeholder="e.g. Beta Users" />
                </div>
                <div className="space-y-2">
                  <Label>Custom Columns (Optional)</Label>
                  <div className="flex gap-2">
                    <Input value={newColumnName} onChange={e => setNewColumnName(e.target.value)} placeholder="Column Name (e.g. companyname)" />
                    <Button variant="outline" onClick={() => {
                      if (newColumnName.trim() && !listFormData.columns.includes(newColumnName.trim())) {
                        setListFormData({...listFormData, columns: [...listFormData.columns, newColumnName.trim().toLowerCase()]})
                        setNewColumnName("")
                      }
                    }}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {listFormData.columns.map(col => (
                      <Badge key={col} variant="secondary" className="pr-1">
                        {col}
                        <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setListFormData({...listFormData, columns: listFormData.columns.filter(c => c !== col)})}>
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateListOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateList} disabled={!listFormData.name}>Create List</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && lists.length === 0 ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
        ) : (
          <div className="flex flex-col gap-1">
            {lists.map(list => (
              <Button
                key={list._id}
                variant={selectedList?._id === list._id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setSelectedList(list)}
              >
                <Folder className="w-4 h-4 mr-2 opacity-50" />
                {list.name}
              </Button>
            ))}
            {lists.length === 0 && <p className="text-sm text-muted-foreground mt-4 text-center">No lists created yet.</p>}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        {selectedList ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {selectedList.name}
                  <Badge variant="outline" className="ml-2 font-normal">{contacts.length} Contacts</Badge>
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Columns: name, email{selectedList.columns.length > 0 ? `, ${selectedList.columns.join(', ')}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={() => setIsDeleteListOpen(true)} className="hidden sm:flex">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete List
                </Button>
                
                <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" /> Import CSV
                </Button>

                <Button onClick={openAddContactModal}>
                  <Plus className="w-4 h-4 mr-2" /> Add Contact
                </Button>
              </div>
            </div>

            {/* Contacts Table */}
            <Card>
              <div className="p-4 border-b flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search contacts..." className="pl-10" />
                </div>
              </div>
              
              {isLoading ? (
                <div className="p-8 space-y-4">
                  {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : filteredContacts.length === 0 ? (
                <Empty>
                  <Empty.Icon variant="icon">
                    <Users className="w-6 h-6" />
                  </Empty.Icon>
                  <Empty.Header>
                    <Empty.Title>{searchQuery ? "No matching contacts" : "No contacts in this list"}</Empty.Title>
                    <Empty.Description>{searchQuery ? "Try a different search term" : "Add your first contact or import a CSV to get started"}</Empty.Description>
                  </Empty.Header>
                  {!searchQuery && (
                    <Empty.Actions>
                      <div className="flex gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                          <Upload className="w-4 h-4 mr-2" /> Import CSV
                        </Button>
                        <Button onClick={openAddContactModal}>
                          <Plus className="w-4 h-4 mr-2" /> Add Contact
                        </Button>
                      </div>
                    </Empty.Actions>
                  )}
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      {selectedList.columns.map(col => (
                        <TableHead key={col} className="capitalize">{col}</TableHead>
                      ))}
                      <TableHead>Added</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name || "N/A"}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        {selectedList.columns.map(col => (
                          <TableCell key={col}>{contact.metadata[col] || "-"}</TableCell>
                        ))}
                        <TableCell className="text-muted-foreground">{contact.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditContactModal(contact)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => { setSelectedContact(contact); setIsDeleteOpen(true); }}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Empty>
              <Empty.Icon variant="icon">
                <Folder className="w-6 h-6" />
              </Empty.Icon>
              <Empty.Header>
                <Empty.Title>No List Selected</Empty.Title>
                <Empty.Description>Select a contact list from the sidebar or create a new one to manage contacts.</Empty.Description>
              </Empty.Header>
            </Empty>
          </div>
        )}
      </div>

      {/* CSV Import Modal */}
      <Dialog open={isImportOpen} onOpenChange={(open) => {
        setIsImportOpen(open);
        if (!open) {
          setImportFile(null);
          setCsvHeaders([]);
          setColumnMapping({});
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Contacts via CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file and map its columns to your list's fields.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {!importFile ? (
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
                <FileDown className="w-10 h-10 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-1">Click to upload CSV</h3>
                <p className="text-sm text-muted-foreground">Ensure your file has a header row</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileDown className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{importFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(importFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setImportFile(null); setCsvHeaders([]); }}>
                    <X className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>

                {csvHeaders.length > 0 && (
                  <div className="space-y-4 border rounded-xl p-4">
                    <h4 className="font-semibold text-sm">Map Columns</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      Match the columns from your CSV to the fields in "{selectedList?.name}". Ignored columns will not be imported.
                    </p>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {csvHeaders.map(header => {
                        const newColSlug = header.toLowerCase().replace(/[^a-z0-9_]/g, '');
                        const isNewColumn = !['email', 'name', 'ignore'].includes(columnMapping[header]) && !selectedList?.columns.includes(columnMapping[header]);
                        
                        return (
                          <div key={header} className="flex items-center gap-4 bg-muted/20 p-2 rounded-lg">
                            <div className="flex-1 font-medium text-sm truncate" title={header}>
                              {header}
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                            <Select
                              value={columnMapping[header] || "ignore"}
                              onValueChange={(val) => setColumnMapping({ ...columnMapping, [header]: val })}
                            >
                              <SelectTrigger className="w-[180px] bg-background">
                                <SelectValue placeholder="Ignore Column" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ignore">-- Ignore --</SelectItem>
                                <SelectItem value="email">Email (Required)</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                {selectedList?.columns.map(col => (
                                  <SelectItem key={col} value={col}>{col} (Custom)</SelectItem>
                                ))}
                                {/* If it's not a known standard or existing custom column, allow creating it */}
                                {newColSlug && !selectedList?.columns.includes(newColSlug) && (
                                  <SelectItem value={newColSlug}>Create as "{newColSlug}"</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleBulkUpload} 
              disabled={!importFile || isUploading || !Object.values(columnMapping).includes('email')}
            >
              {isUploading ? "Importing..." : "Start Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Contact Modals */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={isAddOpen ? setIsAddOpen : setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddOpen ? "Add Contact to List" : "Edit Contact"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
            </div>
            {selectedList?.columns.map(col => (
              <div key={col} className="space-y-2">
                <Label className="capitalize">{col}</Label>
                <Input 
                  value={formData.metadata[col] || ""} 
                  onChange={e => setFormData({...formData, metadata: {...formData.metadata, [col]: e.target.value}})} 
                  placeholder={`Enter ${col}`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => isAddOpen ? setIsAddOpen(false) : setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={isAddOpen ? handleAddContact : handleEditContact} disabled={!formData.email}>
              {isAddOpen ? "Add Contact" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Contact Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteContact}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete List Modal */}
      <Dialog open={isDeleteListOpen} onOpenChange={setIsDeleteListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete List</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{selectedList?.name}"? All contacts within this list will be permanently deleted!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteListOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteList}>Delete List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
