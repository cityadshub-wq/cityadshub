import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, X, Image, Film, FileText } from 'lucide-react'
import { Button, Card, Input, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'
import { getMediaItems, createMediaItem, deleteMediaItem } from '@/services/media'
import type { MediaItem } from '@/types'

export function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [form, setForm] = useState({ name: '', alt_text: '', folder: 'general' })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { const data = await getMediaItems(); setItems(data) } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  function getFileType(mime: string): string {
    if (mime.startsWith('image')) return 'image'
    if (mime.startsWith('video')) return 'video'
    return 'document'
  }

  function getFileIcon(type: string) {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />
      case 'video': return <Film className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `${form.folder}/${fileName}`

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)

      await createMediaItem({
        name: form.name || file.name,
        url: publicUrl,
        type: getFileType(file.type),
        mime_type: file.type,
        size: file.size,
        alt_text: form.alt_text,
        folder: form.folder,
      })

      setFile(null)
      setForm({ name: '', alt_text: '', folder: 'general' })
      setShowUpload(false)
      await load()
    } catch (e) {
      console.error('Upload error:', e)
    } finally { setUploading(false) }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm('Delete this file?')) return
    try {
      const path = item.url.split('/').slice(-2).join('/')
      await supabase.storage.from('media').remove([path])
      await deleteMediaItem(item.id)
      await load()
    } catch (e) { console.error('Delete error:', e) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Media Library" />
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Media Library</h1><p className="text-gray-500 text-sm">{items.length} files</p></div>
        <Button onClick={() => setShowUpload(true)}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
      </div>

      {showUpload && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Upload File</h2>
            <button onClick={() => { setShowUpload(false); setFile(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              {file ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-dark-navy">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                  <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload (JPEG, PNG, SVG, WEBP, PDF — max 10MB)</p>
                  <input type="file" accept="image/jpeg,image/png,image/svg+xml,image/webp,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
            <Input label="File Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Leave empty to use original name" />
            <Input label="Alt Text" value={form.alt_text} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} />
            <Input label="Folder" value={form.folder} onChange={(e) => setForm({ ...form, folder: e.target.value })} placeholder="general" />
            <Button loading={uploading} disabled={!file} onClick={handleUpload}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card><p className="text-center py-12 text-gray-500">No files uploaded yet</p></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.alt_text || item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="text-gray-300">{getFileIcon(item.type)}</div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-dark-navy truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary" className="text-[10px]">{item.type}</Badge>
                  <span className="text-[10px] text-gray-400">{formatSize(item.size)}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
