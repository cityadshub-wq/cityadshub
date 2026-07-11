import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Save } from 'lucide-react'
import { Button, Card, Input, Textarea, ImageUpload } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getAboutContent, updateAboutContent } from '@/services/about'
import { getGrowthTimeline, createGrowthTimeline, updateGrowthTimeline, deleteGrowthTimeline } from '@/services/growth-timeline'
import type { AboutContent, GrowthTimeline } from '@/types'

export function AdminAboutPage() {
  const [aboutItems, setAboutItems] = useState<AboutContent[]>([])
  const [timeline, setTimeline] = useState<GrowthTimeline[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', description: '', image_url: '' })
  const [saving, setSaving] = useState(false)

  const [showTLForm, setShowTLForm] = useState(false)
  const [editingTL, setEditingTL] = useState<GrowthTimeline | null>(null)
  const [tlForm, setTlForm] = useState({ year: '', title: '', description: '', icon: '', image_url: '' })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [a, t] = await Promise.all([getAboutContent(), getGrowthTimeline()])
      setAboutItems(a)
      setTimeline(t)
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

  function openNewTL() {
    setEditingTL(null)
    setTlForm({ year: '', title: '', description: '', icon: '', image_url: '' })
    setShowTLForm(true)
  }

  function openEditTL(item: GrowthTimeline) {
    setEditingTL(item)
    setTlForm({ year: item.year, title: item.title, description: item.description || '', icon: item.icon || '', image_url: item.image_url || '' })
    setShowTLForm(true)
  }

  async function saveTL() {
    setSaving(true)
    try {
      if (editingTL) {
        await updateGrowthTimeline(editingTL.id, tlForm)
      } else {
        await createGrowthTimeline({ ...tlForm, sort_order: timeline.length + 1, is_active: true })
      }
      setShowTLForm(false)
      setEditingTL(null)
      await load()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  async function handleDeleteTL(id: string) {
    if (confirm('Delete this timeline entry?')) {
      await deleteGrowthTimeline(id)
      await load()
    }
  }

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-6">About Sections</h1>
      <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="About Sections" />
      <h1 className="text-2xl font-bold text-dark-navy mb-6">About Sections</h1>

      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-dark-navy mb-4">About Content</h2>
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

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-navy">Growth Timeline</h2>
          <Button size="sm" onClick={openNewTL}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add Entry</Button>
        </div>

        {showTLForm && (
          <div className="border border-gray-100 rounded-xl p-4 mb-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-dark-navy">{editingTL ? 'Edit Timeline Entry' : 'New Timeline Entry'}</h3>
              <button onClick={() => { setShowTLForm(false); setEditingTL(null) }} className="text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Year" value={tlForm.year} onChange={(e) => setTlForm({ ...tlForm, year: e.target.value })} />
              <Input label="Title" value={tlForm.title} onChange={(e) => setTlForm({ ...tlForm, title: e.target.value })} />
            </div>
            <Textarea label="Description" value={tlForm.description} onChange={(e) => setTlForm({ ...tlForm, description: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Icon Name" value={tlForm.icon} onChange={(e) => setTlForm({ ...tlForm, icon: e.target.value })} placeholder="lucide-icon-name" />
              <ImageUpload label="Image" bucket="media" value={tlForm.image_url} onChange={(url) => setTlForm({ ...tlForm, image_url: url || '' })} />
            </div>
            <Button size="sm" loading={saving} onClick={saveTL}>{editingTL ? 'Update' : 'Create'}</Button>
          </div>
        )}

        <DataTable
          columns={[
            { key: 'year', header: 'Year', render: (t: GrowthTimeline) => <span className="font-semibold text-primary">{t.year}</span> },
            { key: 'title', header: 'Title' },
            { key: 'description', header: 'Description', render: (t: GrowthTimeline) => <span className="text-gray-500 text-sm line-clamp-1">{t.description}</span> },
            { key: 'actions', header: '', render: (t: GrowthTimeline) => (
              <div className="flex gap-1">
                <button onClick={() => openEditTL(t)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => handleDeleteTL(t.id)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
              </div>
            )},
          ]}
          data={timeline}
        />
      </Card>
    </motion.div>
  )
}
