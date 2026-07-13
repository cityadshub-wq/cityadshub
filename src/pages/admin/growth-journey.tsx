import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, X, CheckCircle2 } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea, ImageUpload } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getGrowthTimeline, createGrowthTimeline, updateGrowthTimeline, deleteGrowthTimeline, reorderGrowthTimeline } from '@/services/growth-timeline'
import { iconMap, getLucideIcon } from '@/lib/icon-map'
import type { GrowthTimeline } from '@/types'

const iconOptions = Object.entries(iconMap).map(([name, icon]) => ({ name, icon }))

const emptyForm = { year: '', title: '', description: '', icon: 'CheckCircle2', image_url: '', button_text: '', button_link: '' }

export function AdminGrowthJourneyPage() {
  const [items, setItems] = useState<GrowthTimeline[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<GrowthTimeline | null>(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await getGrowthTimeline()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  function openNew() {
    setEditingItem(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(item: GrowthTimeline) {
    setEditingItem(item)
    setForm({
      year: item.year,
      title: item.title,
      description: item.description || '',
      icon: item.icon || 'CheckCircle2',
      image_url: item.image_url || '',
      button_text: item.button_text || '',
      button_link: item.button_link || '',
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editingItem) {
        await updateGrowthTimeline(editingItem.id, form)
      } else {
        await createGrowthTimeline({ ...form, sort_order: items.length, is_active: true })
      }
      setShowForm(false)
      setEditingItem(null)
      await load()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this timeline entry?')) return
    await deleteGrowthTimeline(id)
    await load()
  }

  async function handleToggle(item: GrowthTimeline) {
    await updateGrowthTimeline(item.id, { is_active: !item.is_active })
    await load()
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return
    const newItems = [...items]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    setItems(newItems)
    await reorderGrowthTimeline(newItems.map((i) => i.id))
  }

  async function handleMoveDown(index: number) {
    if (index === items.length - 1) return
    const newItems = [...items]
    ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    setItems(newItems)
    await reorderGrowthTimeline(newItems.map((i) => i.id))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Growth Journey" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Growth Journey</h1>
          <p className="text-gray-500 text-sm">Controls the "Our Growth Journey" timeline in the homepage About section.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Milestone</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-navy">{editingItem ? 'Edit Milestone' : 'New Milestone'}</h2>
            <button onClick={() => { setShowForm(false); setEditingItem(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
              <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Milestone title" />
            </div>
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <div>
              <label className="block text-sm font-medium text-dark-navy mb-2">Icon</label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = form.icon === opt.name
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => setForm({ ...form, icon: opt.name })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                        isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {opt.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <ImageUpload
              label={form.image_url ? 'Replace Image (remove, then upload a new one)' : 'Upload Image (optional)'}
              bucket="media"
              path="growth-journey"
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url || '' })}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Button Text (optional)" value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} placeholder="Learn More" />
              <Input label="Button Link (optional)" value={form.button_link} onChange={(e) => setForm({ ...form, button_link: e.target.value })} placeholder="/blog/our-story" />
            </div>

            <div className="flex items-center gap-4">
              <Button loading={saving} onClick={handleSave}>{editingItem ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No milestones yet. Click "Add Milestone" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const Icon = getLucideIcon(item.icon, CheckCircle2)
            return (
              <Card key={item.id} className="flex items-center gap-3 p-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/5 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-dark-navy">{item.year} — {item.title}</div>
                  <div className="text-xs text-gray-400 truncate">{item.description || 'No description'}</div>
                </div>
                <Badge variant={item.is_active ? 'green' : 'default'}>{item.is_active ? 'Active' : 'Inactive'}</Badge>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-dark-navy disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleMoveDown(index)} disabled={index === items.length - 1} className="p-1.5 text-gray-400 hover:text-dark-navy disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDown className="h-3.5 w-3.5" /></button>
                </div>
                <button onClick={() => handleToggle(item)} className="p-1.5 text-gray-400 hover:text-green transition-colors" title={item.is_active ? 'Deactivate' : 'Activate'}>
                  {item.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
              </Card>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
