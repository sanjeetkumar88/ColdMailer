"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import axios from "axios"

export function ResumeUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
  const { data: session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleUpload = async () => {
    if (!file || !session) return

    setIsUploading(true)
    setUploadProgress(10)

    const formData = new FormData()
    formData.append("files", file)

    try {
      const res = await axios.post(`/api/proxy/media/upload`, formData)
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Upload failed")
      }

      setUploadProgress(100)
      toast.success("Resume uploaded successfully!")
      setFile(null)
      if (onUploadSuccess) onUploadSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Upload failed")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer
            flex flex-col items-center justify-center gap-4
            ${isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"}
          `}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium">Click or drag resume here</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports PDF and Word documents (Max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-muted-foreground/20 rounded-2xl p-6 bg-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <File className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {!isUploading && (
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading to secure storage...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}

          {!isUploading && (
            <Button className="w-full mt-6" onClick={handleUpload}>
              Upload Resume
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
