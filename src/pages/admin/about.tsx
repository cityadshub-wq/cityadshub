import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save } from 'lucide-react'
import { Button, Card, Input, Textarea, ImageUpload } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getAboutContent, updateAboutContent } from '@/services/about'
import type { AboutContent } from '@/types'

export function AdminAboutPage() {
  const [aboutItems, setAboutItems] = useState<AboutContent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', description: '', image_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const a = await getAboutContent()
      setAboutItems(a.filter((item) => item.section !== 'story'))
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function openEdit(section: AboutContent) {
    setEditingSection(section.id)
    setEditForm({ title: section.title || '', subtitle: section.subtitle || '', description: section.description || '', image_url: section.image_url || '' })
  }

  async function saveSection(id: string) {
    setSaving(true)
    try {
      await updateAboutContent(id, editForm)
      setEditingSection(null)
      await load()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">Mission, Vision &amp; Values</h1>
      <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Mission, Vision & Values" />
      <h1 className="text-2xl font-bold text-dark-navy mb-1">Mission, Vision &amp; Values</h1>
      <p className="text-gray-500 text-sm mb-6">Controls the "About Us" intro and the Mission / Vision / Values cards on the homepage.</p>

      <Card>
        <div className="space-y-4">
          {aboutItems.map((item) => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4">
              {editingSection === item.id ? (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                    <Input label="Subtitle" value={editForm.subtitle} onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })} />
                  </div>
                  <Textarea label="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                  <ImageUpload label="Image" bucket="media" value={editForm.image_url} onChange={(url) => setEditForm({ ...editForm, image_url: url || '' })} />
                  <div className="flex gap-2">
                    <Button size="sm" loading={saving} onClick={() => saveSection(item.id)}><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingSection(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.section}</span>
                      {item.title && <span className="text-sm text-gray-500">— {item.title}</span>}
                    </div>
                    {item.description && <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>}
                  </div>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors shrink-0"><Edit3 className="h-4 w-4" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
