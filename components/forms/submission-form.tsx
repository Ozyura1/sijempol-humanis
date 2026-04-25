"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, Upload, File } from "lucide-react"

interface FormField {
  name: string
  label: string
  type: "text" | "email" | "tel" | "date" | "select" | "textarea" | "file"
  required?: boolean
  placeholder?: string
  options?: readonly any[]
  maxFileSize?: number // in MB
  acceptFileTypes?: string
}

interface SubmissionFormProps {
  serviceName: string
  serviceTitle: string
  fields: readonly FormField[]
  onSubmit: (data: any) => Promise<{ success: boolean; message?: string; data?: any }>
  submitButtonText?: string
}

export function SubmissionForm({
  serviceName,
  serviceTitle,
  fields,
  onSubmit,
  submitButtonText = "Ajukan Pengajuan",
}: SubmissionFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [files, setFiles] = useState<Record<string, File>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [submissionId, setSubmissionId] = useState<number | null>(null)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    for (const field of fields) {
      if (field.required) {
        if (field.type === "file") {
          if (!files[field.name]) {
            newErrors[field.name] = `${field.label} wajib diunggah`
          }
        } else {
          if (!formData[field.name] || formData[field.name].toString().trim() === "") {
            newErrors[field.name] = `${field.label} wajib diisi`
          }
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, field: FormField) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (field.maxFileSize && file.size > field.maxFileSize * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `Ukuran file maksimal ${field.maxFileSize}MB`,
      }))
      return
    }

    setFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }))

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Convert files to Base64
      const documents: Record<string, string> = {}
      for (const [fieldName, file] of Object.entries(files)) {
        const reader = new FileReader()
        await new Promise((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string
            documents[fieldName] = base64
            resolve(null)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      // Prepare submission data
      const submissionData = {
        applicant_name: formData.applicant_name || formData.nama_lengkap || formData.name || "Unknown",
        data: formData,
        documents,
      }

      const result = await onSubmit(submissionData)

      if (result.success) {
        setSuccessMessage(result.message || "Pengajuan berhasil dikirim!")
        if (result.data?.id) {
          setSubmissionId(result.data.id)
        }
        setSubmitted(true)
        setFormData({})
        setFiles({})
      } else {
        setErrors({ submit: result.message || "Gagal mengirim pengajuan" })
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "Terjadi kesalahan saat mengirim pengajuan" })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Pengajuan Berhasil Dikirim</h2>
          <p className="text-muted-foreground mb-4">{successMessage}</p>
          {submissionId && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
              <p className="text-sm text-muted-foreground">Nomor Tracking:</p>
              <p className="text-lg font-mono font-bold text-primary">{serviceName.toUpperCase()}-{submissionId}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Simpan nomor ini untuk melacak status pengajuan Anda.
              </p>
            </div>
          )}
          <Button
            onClick={() => {
              setSubmitted(false)
              setSubmissionId(null)
            }}
          >
            Buat Pengajuan Baru
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{serviceTitle}</CardTitle>
        <CardDescription>Isi formulir di bawah untuk mengajukan layanan ini</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === "text" && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={loading}
                  className={errors[field.name] ? "border-red-500" : ""}
                />
              )}

              {field.type === "email" && (
                <Input
                  id={field.name}
                  type="email"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={loading}
                  className={errors[field.name] ? "border-red-500" : ""}
                />
              )}

              {field.type === "tel" && (
                <Input
                  id={field.name}
                  type="tel"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={loading}
                  className={errors[field.name] ? "border-red-500" : ""}
                />
              )}

              {field.type === "date" && (
                <Input
                  id={field.name}
                  type="date"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={loading}
                  className={errors[field.name] ? "border-red-500" : ""}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={loading}
                  className={errors[field.name] ? "border-red-500" : ""}
                  rows={4}
                />
              )}

              {field.type === "select" && (
                <Select
                  value={formData[field.name] || ""}
                  onValueChange={(value) => handleInputChange(field.name, value)}
                  disabled={loading}
                >
                  <SelectTrigger className={errors[field.name] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Pilih opsi..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "file" && (
                <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                  errors[field.name] ? "border-red-500 bg-red-50" : "border-muted-foreground/25 hover:border-primary/50"
                } ${files[field.name] ? "border-green-500 bg-green-50" : ""}`}>
                  <input
                    id={field.name}
                    type="file"
                    accept={field.acceptFileTypes}
                    onChange={(e) => handleFileChange(e, field.name, field)}
                    disabled={loading}
                    className="hidden"
                  />
                  <label htmlFor={field.name} className="cursor-pointer block">
                    {files[field.name] ? (
                      <>
                        <File className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <p className="text-sm font-medium text-green-700">{files[field.name].name}</p>
                        <p className="text-xs text-green-600">
                          ({(files[field.name].size / 1024).toFixed(2)} KB)
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Klik untuk mengunggah</p>
                        <p className="text-xs text-muted-foreground">atau drag dan drop file</p>
                        {field.maxFileSize && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Maksimal {field.maxFileSize}MB
                          </p>
                        )}
                      </>
                    )}
                  </label>
                </div>
              )}

              {errors[field.name] && (
                <p className="text-sm text-red-500 mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? (
              <>
                <Spinner className="mr-2" />
                Mengirim...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
