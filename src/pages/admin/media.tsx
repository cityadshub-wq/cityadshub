import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Upload, Trash2, X, Image, Film, FileText, Search, RefreshCw, Copy, Check } from 'lucide-react'
import { Button, Card, Input, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'
import { getMediaItems, createMediaItem, updateMediaItem, deleteMediaItem } from '@/services/media'
import type { MediaItem } from '@/types'

const typeFilters = ['all', 'image', 'video', 'document'] as const
type TypeFilter = (typeof typeFilters)[number]

export function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [form, setForm] = useState({ name: '', alt_text: '', folder: 'general' })
  const [file, setFile] = useState<File | null>(null)
  const [search, setSearch] = useState('')
  const [folderFilter, setFolderFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [copied, setCopied] = useState(false)
  const [replacingId, setReplacingId] = useState<string | null>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)

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

  const folders = useMemo(() => Array.from(new Set(items.map((i) => i.folder))).sort(), [items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      if (folderFilter !== 'all' && item.folder !== folderFilter) return false
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !(item.alt_text || '').toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [items, search, folderFilter, typeFilter])

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
      if (previewItem?.id === item.id) setPreviewItem(null)
      await load()
    } catch (e) { console.error('Delete error:', e) }
  }

  function startReplace(item: MediaItem) {
    setReplacingId(item.id)
    replaceInputRef.current?.click()
  }

  async function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const item = items.find((i) => i.id === replacingId)
    if (!file || !item) return
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const filePath = `${item.folder}/${fileName}`

      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
      const oldPath = item.url.split('/').slice(-2).join('/')

      await updateMediaItem(item.id, {
        url: publicUrl,
        type: getFileType(file.type),
        mime_type: file.type,
        size: file.size,
      })
      await supabase.storage.from('media').remove([oldPath])
      await load()
    } catch (err) {
      console.error('Replace error:', err)
    } finally {
      setReplacingId(null)
      if (replaceInputRef.current) replaceInputRef.current.value = ''
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Media Library" />
      <input ref={replaceInputRef} type="file" accept="image/jpeg,image/png,image/svg+xml,image/webp,application/pdf" className="hidden" onChange={handleReplaceFile} />

      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Media Library</h1><p className="text-gray-500 text-sm">{filteredItems.length} of {items.length} files</p></div>
        <Button onClick={() => setShowUpload(true)}><Upload className="mr-2 h-4 w-4" /> Upload</Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or alt text..."
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="all">All Folders</option>
            {folders.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <div className="flex gap-1">
            {typeFilters.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${typeFilter === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </Card>

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
      ) : filteredItems.length === 0 ? (
        <Card><p className="text-center py-12 text-gray-500">{items.length === 0 ? 'No files uploaded yet' : 'No files match your search'}</p></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-all">
              <button onClick={() => setPreviewItem(item)} className="block w-full text-left">
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
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => startReplace(item)}
                className="absolute top-2 right-10 h-7 w-7 rounded-lg bg-white shadow text-gray-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Replace file"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">{previewItem.name}</h2>
              <button onClick={() => setPreviewItem(null)} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-5 w-5" /></button>
            </div>
            <div className="rounded-xl bg-gray-50 flex items-center justify-center mb-4 overflow-hidden">
              {previewItem.type === 'image' ? (
                <img src={previewItem.url} alt={previewItem.alt_text || previewItem.name} className="max-h-[50vh] w-full object-contain" />
              ) : previewItem.type === 'video' ? (
                <video src={previewItem.url} controls className="max-h-[50vh] w-full" />
              ) : (
                <div className="py-16 text-gray-300">{getFileIcon(previewItem.type)}</div>
              )}
            </div>
            <div className="text-sm text-gray-500 space-y-1 mb-4">
              <p><span className="font-medium text-dark-navy">Folder:</span> {previewItem.folder}</p>
              <p><span className="font-medium text-dark-navy">Type:</span> {previewItem.mime_type || previewItem.type}</p>
              <p><span className="font-medium text-dark-navy">Size:</span> {formatSize(previewItem.size)}</p>
              {previewItem.alt_text && <p><span className="font-medium text-dark-navy">Alt Text:</span> {previewItem.alt_text}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyUrl(previewItem.url)}>
                {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => startReplace(previewItem)}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Replace
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
