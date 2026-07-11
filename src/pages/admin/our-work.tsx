import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Star } from 'lucide-react'
import { Button, Card, Input, Textarea, Badge, ImageUpload } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/services/portfolio'
import { cn } from '@/lib/utils'
import type { PortfolioItem } from '@/types'

export function AdminOurWorkPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', category: '', client_name: '', description: '', full_description: '',
    technology: '', project_url: '', completion_date: '', results: '', images: [] as string[],
    is_featured: false, sort_order: 0,
  })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await getPortfolioItems()
      setItems(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function resetForm() {
    setForm({ title: '', slug: '', category: '', client_name: '', description: '', full_description: '', technology: '', project_url: '', completion_date: '', results: '', images: [], is_featured: false, sort_order: 0 })
  }

  function openNew() { setEditing(null); resetForm(); setShowForm(true) }

  function openEdit(item: PortfolioItem) {
    setEditing(item)
    setForm({
      title: item.title, slug: item.slug, category: item.category || '', client_name: item.client_name || '',
      description: item.description, full_description: item.full_description || '',
      technology: (item.technology || []).join(', '), project_url: item.project_url || '',
      completion_date: item.completion_date || '', results: item.results || '',
      images: item.images || [], is_featured: item.is_featured, sort_order: item.sort_order || 0,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        client_name: form.client_name || '',
        description: form.description,
        full_description: form.full_description || '',
        technology: form.technology ? form.technology.split(',').map((t) => t.trim()).filter(Boolean) : [],
        project_url: form.project_url || '',
        completion_date: form.completion_date || '',
        results: form.results || '',
        images: form.images,
        is_featured: form.is_featured,
        sort_order: form.sort_order,
      }
      if (editing) {
        await updatePortfolioItem(editing.id, payload)
      } else {
        await createPortfolioItem(payload)
      }
      setShowForm(false); setEditing(null); resetForm(); await load()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this project?')) { await deletePortfolioItem(id); await load() }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Our Work" />
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Our Work</h1><p className="text-gray-500 text-sm">{items.length} projects</p></div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-navy">{editing ? 'Edit Project' : 'New Project'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
              <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Websites, Marketing" />
              <Input label="Client Name" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
            </div>
            <Textarea label="Short Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea label="Full Description" value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Technology (comma separated)" value={form.technology} onChange={(e) => setForm({ ...form, technology: e.target.value })} placeholder="React, Node.js, Tailwind" />
              <Input label="Project URL" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Completion Date" type="date" value={form.completion_date} onChange={(e) => setForm({ ...form, completion_date: e.target.value })} />
              <Input label="Results" value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} placeholder="e.g. 300% increase" />
              <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-dark-navy">Featured Project</span>
              </label>
            </div>
            <ImageUpload label="Project Image" bucket="media" value={form.images[0] || ''} onChange={(url) => setForm({ ...form, images: url ? [url] : [] })} />
            <Button loading={saving} onClick={handleSave}>{editing ? 'Update Project' : 'Create Project'}</Button>
          </div>
        </Card>
      )}

      <DataTable
        columns={[
          { key: 'title', header: 'Project', render: (p: PortfolioItem) => (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="font-medium text-dark-navy">{p.title}</span>
                {p.is_featured && <Star className="h-3.5 w-3.5 fill-orange text-orange" />}
              </div>
            </div>
          )},
          { key: 'category', header: 'Category', render: (p: PortfolioItem) => <Badge variant="primary">{p.category}</Badge> },
          { key: 'client_name', header: 'Client' },
          { key: 'is_featured', header: 'Featured', render: (p: PortfolioItem) => (
            <span className={cn('text-xs px-2 py-1 rounded-lg font-medium', p.is_featured ? 'bg-orange/10 text-orange' : 'bg-gray-100 text-gray-500')}>{p.is_featured ? 'Yes' : 'No'}</span>
          )},
          { key: 'actions', header: '', render: (p: PortfolioItem) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          )},
        ]}
        data={items}
        loading={loading}
      />
    </motion.div>
  )
}
