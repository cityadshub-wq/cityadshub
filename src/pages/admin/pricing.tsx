import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, X, Star } from 'lucide-react'
import { Button, Card, Input, Textarea } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getAllPricingPlans, createPricingPlan, updatePricingPlan, deletePricingPlan } from '@/services/pricing'
import { cn } from '@/lib/utils'
import type { PricingPlan } from '@/types'

export function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PricingPlan | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', price: 0, original_price: 0, currency: 'INR', interval: 'month',
    description: '', features: '', is_popular: false, button_text: 'Get Started',
    sort_order: 0, is_active: true,
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { const data = await getAllPricingPlans(); setPlans(data) } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  function resetForm() { setForm({ name: '', price: 0, original_price: 0, currency: 'INR', interval: 'month', description: '', features: '', is_popular: false, button_text: 'Get Started', sort_order: 0, is_active: true }) }
  function openNew() { setEditing(null); resetForm(); setShowForm(true) }
  function openEdit(p: PricingPlan) {
    setEditing(p)
    setForm({
      name: p.name, price: p.price, original_price: p.original_price || 0, currency: p.currency,
      interval: p.interval, description: p.description || '', features: (p.features || []).join(', '),
      is_popular: p.is_popular, button_text: p.button_text, sort_order: p.sort_order, is_active: p.is_active,
    })
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        price: form.price, original_price: form.original_price || undefined,
        currency: form.currency, interval: form.interval,
        description: form.description, features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        is_popular: form.is_popular, button_text: form.button_text,
        sort_order: form.sort_order, is_active: form.is_active,
      }
      if (editing) { await updatePricingPlan(editing.id, payload) }
      else { await createPricingPlan(payload) }
      setShowForm(false); setEditing(null); resetForm(); await load()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this plan?')) { await deletePricingPlan(id); await load() }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Pricing Plans" />
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Pricing Plans</h1><p className="text-gray-500 text-sm">{plans.length} plans</p></div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Plan</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-navy">{editing ? 'Edit Plan' : 'New Plan'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Price" type="number" value={String(form.price)} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Original Price" type="number" value={String(form.original_price)} onChange={(e) => setForm({ ...form, original_price: parseFloat(e.target.value) || 0 })} />
              <Input label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              <Input label="Interval" value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} />
            </div>
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea label="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Feature 1, Feature 2, Feature 3" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Button Text" value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} />
              <Input label="Sort Order" type="number" value={String(form.sort_order)} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-dark-navy">Popular Badge</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-dark-navy">Active</span>
              </label>
            </div>
            <Button loading={saving} onClick={handleSave}>{editing ? 'Update Plan' : 'Create Plan'}</Button>
          </div>
        </Card>
      )}

      <DataTable
        columns={[
          { key: 'name', header: 'Plan', render: (p: PricingPlan) => (
            <div className="flex items-center gap-2">
              <span className="font-medium">{p.name}</span>
              {p.is_popular && <Star className="h-3.5 w-3.5 fill-orange text-orange" />}
            </div>
          )},
          { key: 'price', header: 'Price', render: (p: PricingPlan) => (
            <div className="flex items-center gap-2">
              <span className="font-semibold">₹{p.price}</span>
              {p.original_price && <span className="text-xs text-gray-400 line-through">₹{p.original_price}</span>}
              <span className="text-xs text-gray-500">/{p.interval}</span>
            </div>
          )},
          { key: 'is_popular', header: 'Popular', render: (p: PricingPlan) => (
            <span className={cn('text-xs px-2 py-1 rounded-lg font-medium', p.is_popular ? 'bg-orange/10 text-orange' : 'bg-gray-100 text-gray-500')}>{p.is_popular ? 'Yes' : 'No'}</span>
          )},
          { key: 'sort_order', header: 'Order' },
          { key: 'is_active', header: 'Status', render: (p: PricingPlan) => (
            <span className={cn('text-xs px-2 py-1 rounded-lg font-medium', p.is_active ? 'bg-green/10 text-green' : 'bg-gray-100 text-gray-500')}>{p.is_active ? 'Active' : 'Inactive'}</span>
          )},
          { key: 'actions', header: '', render: (p: PricingPlan) => (
            <div className="flex gap-1">
              <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-primary"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          )},
        ]}
        data={plans}
        loading={loading}
      />
    </motion.div>
  )
}
