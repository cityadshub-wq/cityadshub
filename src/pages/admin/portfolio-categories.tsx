import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getPortfolioCategories, createPortfolioCategory, updatePortfolioCategory, deletePortfolioCategory } from '@/services/portfolio-categories'
import { cn } from '@/lib/utils'
import type { PortfolioCategory } from '@/types'

export function AdminPortfolioCategoriesPage() {
  const [items, setItems] = useState<PortfolioCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PortfolioCategory | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', sort_order: 0, is_active: true })

  useEffect(() => { load() }, [])

  async function load() {
    try { const data = await getPortfolioCategories(); setItems(data) } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function resetForm() { setForm({ name: '', slug: '', sort_order: 0, is_active: true }) }
  function openNew() { setEditing(null); resetForm(); setShowForm(true) }
  function openEdit(item: PortfolioCategory) {
    setEditing(item)
    setForm({ name: item.name, slug: item.slug || '', sort_order: item.sort_order, is_active: item.is_active })
    setShowForm(true)
  }

  async function handleSave() {
    try {
      const payload = { name: form.name, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'), sort_order: form.sort_order, is_active: form.is_active }
      if (editing) { await updatePortfolioCategory(editing.id, payload) }
      else { await createPortfolioCategory(payload) }
      setShowForm(false); setEditing(null); resetForm(); await load()
    } catch (e) { console.error(e) }
  }

  async function handleDelete(id: string) {
    if (confirm('Delete?')) { await deletePortfolioCategory(id); await load() }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Portfolio Categories" />
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Portfolio Categories</h1><p className="text-gray-500 text-sm">{items.length} categories</p></div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Category' : 'New Category'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
              <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              <label className="flex items-center gap-2 pt-6 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </Card>
      )}

      <DataTable
        columns={[
          { key: 'name', header: 'Name', render: (c: PortfolioCategory) => <span className="font-medium">{c.name}</span> },
          { key: 'slug', header: 'Slug', render: (c: PortfolioCategory) => <span className="text-gray-500 text-sm">{c.slug}</span> },
          { key: 'sort_order', header: 'Order' },
          { key: 'is_active', header: 'Status', render: (c: PortfolioCategory) => (
            <span className={cn('text-xs px-2 py-1 rounded-lg font-medium', c.is_active ? 'bg-green/10 text-green' : 'bg-gray-100 text-gray-500')}>{c.is_active ? 'Active' : 'Inactive'}</span>
          )},
          { key: 'actions', header: '', render: (c: PortfolioCategory) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-primary"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          )},
        ]}
        data={items}
        loading={loading}
      />
    </motion.div>
  )
}
