import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X } from 'lucide-react'
import { Button, Card, Input, Textarea, Badge } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '@/services/faqs'
import { cn } from '@/lib/utils'
import type { FAQ } from '@/types'

export function AdminFAQsPage() {
  const [items, setItems] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [form, setForm] = useState({ question: '', answer: '', category: '', order: 0, is_active: true })

  useEffect(() => { load() }, [])

  async function load() {
    try { const data = await getAllFAQs(); setItems(data) } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function resetForm() { setForm({ question: '', answer: '', category: '', order: 0, is_active: true }) }
  function openNew() { setEditing(null); resetForm(); setShowForm(true) }
  function openEdit(item: FAQ) {
    setEditing(item)
    setForm({ question: item.question, answer: item.answer, category: item.category || '', order: item.order, is_active: item.is_active })
    setShowForm(true)
  }

  async function handleSave() {
    try {
      const payload = {
        question: form.question, answer: form.answer,
        category: form.category || '', order: form.order, is_active: form.is_active,
      }
      if (editing) { await updateFAQ(editing.id, payload) }
      else { await createFAQ(payload) }
      setShowForm(false); setEditing(null); resetForm(); await load()
    } catch (e) { console.error(e) }
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this FAQ?')) { await deleteFAQ(id); await load() }
  }

  async function toggleActive(item: FAQ) {
    await updateFAQ(item.id, { is_active: !item.is_active })
    await load()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="FAQs" />
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">FAQs</h1><p className="text-gray-500 text-sm">{items.length} questions</p></div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add FAQ</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4">
            <Input label="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            <Textarea label="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="General, Pricing, etc." />
              <Input label="Order" type="number" value={String(form.order)} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
              <div className="pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300" />
                  <span className="text-sm font-medium">Active</span>
                </label>
                {!form.is_active && <p className="text-xs text-orange mt-1">Inactive FAQs are hidden from the website.</p>}
              </div>
            </div>
            <Button onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </Card>
      )}

      <DataTable
        columns={[
          { key: 'question', header: 'Question', render: (f: FAQ) => <span className="line-clamp-1">{f.question}</span> },
          { key: 'category', header: 'Category', render: (f: FAQ) => f.category ? <Badge variant="primary">{f.category}</Badge> : '-' },
          { key: 'order', header: 'Order' },
          { key: 'is_active', header: 'Status', render: (f: FAQ) => (
            <button onClick={() => toggleActive(f)} className={cn('text-xs px-2 py-1 rounded-lg font-medium', f.is_active ? 'bg-green/10 text-green' : 'bg-gray-100 text-gray-500')}>
              {f.is_active ? 'Active' : 'Inactive'}
            </button>
          )},
          { key: 'actions', header: '', render: (f: FAQ) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(f)} className="p-1.5 text-gray-400 hover:text-primary"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          )},
        ]}
        data={items}
        loading={loading}
      />
    </motion.div>
  )
}
