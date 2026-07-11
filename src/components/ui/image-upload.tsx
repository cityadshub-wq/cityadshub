import { useState, useRef } from 'react'
import { X, ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  bucket?: string
  path?: string
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
  className?: string
}

export function ImageUpload({
  bucket = 'blog-images',
  path = 'uploads',
  value,
  onChange,
  label = 'Upload Image',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum 5MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `${path}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      setPreview(publicUrl)
      onChange(publicUrl)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-dark-navy">{label}</label>
      )}
      {preview ? (
        <div className="relative inline-block rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Upload preview"
            className="max-h-40 object-contain bg-gray-50"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
          >
            <X className="h-3.5 w-3.5 text-gray-600" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:border-primary hover:text-primary transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : 'Click to upload image'}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
