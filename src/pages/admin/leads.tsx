import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Mail, Phone, Calendar, ArrowUpRight } from 'lucide-react'
import { Button, Input, Badge, Card } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getLeads, updateLead, createLead } from '@/services/leads'
import type { Lead } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  service: z.string().min(1),
  source: z.string().optional(),
  notes: z.string().optional(),
})

type LeadForm = z.infer<typeof leadSchema>

const statusColors: Record<string, 'default' | 'primary' | 'green' | 'orange' | 'red'> = {
  new: 'primary',
  contacted: 'orange',
  qualified: 'green',
  proposal: 'default',
  won: 'green',
  lost: 'red',
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
  })

  useEffect(() => { loadLeads() }, [])

  async function loadLeads() {
    try {
      const data = await getLeads()
      setLeads(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const filtered = leads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const onSubmit = async (data: LeadForm) => {
    await createLead({ ...data, status: 'new', assigned_to: null } as unknown as Lead)
    reset()
    setShowForm(false)
    loadLeads()
  }

  const handleStatusChange = async (id: string, status: Lead['status']) => {
    await updateLead(id, { status })
    loadLeads()
  }

  return (
    <>
      <SEO title="Lead Management" description="Admin lead management" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Lead Management</h1>
            <p className="text-gray-500 text-sm">{filtered.length} leads found</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">New Lead</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input id="name" label="Name" error={errors.name?.message} {...register('name')} />
              <Input id="email" label="Email" error={errors.email?.message} {...register('email')} />
              <Input id="phone" label="Phone" error={errors.phone?.message} {...register('phone')} />
              <Input id="service" label="Service Interested" error={errors.service?.message} {...register('service')} />
              <Input id="source" label="Source" {...register('source')} />
              <div className="flex items-end gap-2">
                <Button type="submit" size="sm">Save Lead</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); reset() }}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {['all', 'new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'name', header: 'Name', render: (l: Lead) => (
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-gray-500">{l.email}</div>
              </div>
            )},
            { key: 'service', header: 'Service' },
            { key: 'phone', header: 'Phone' },
            { key: 'source', header: 'Source' },
            { key: 'status', header: 'Status', render: (l: Lead) => (
              <select
                value={l.status}
                onChange={(e) => handleStatusChange(l.id, e.target.value as Lead['status'])}
                className="text-xs rounded-lg border border-gray-200 px-2 py-1 font-medium"
                style={{ color: l.status === 'won' ? '#39B54A' : l.status === 'lost' ? '#dc2626' : '#1565FF' }}
              >
                {['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )},
            { key: 'created_at', header: 'Date', render: (l: Lead) => (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                {new Date(l.created_at).toLocaleDateString()}
              </div>
            )},
            { key: 'actions', header: '', render: (l: Lead) => (
              <button onClick={() => setSelectedLead(l)} className="text-primary hover:text-primary/80">
                <ArrowUpRight className="h-4 w-4" />
              </button>
            )},
          ]}
          data={filtered}
          loading={loading}
        />

        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
            <Card className="max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark-navy">{selectedLead.name}</h2>
                <Badge variant={statusColors[selectedLead.status]}>{selectedLead.status}</Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> {selectedLead.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> {selectedLead.phone}</div>
                <div><span className="font-medium">Service:</span> {selectedLead.service}</div>
                <div><span className="font-medium">Source:</span> {selectedLead.source || 'Direct'}</div>
                {selectedLead.notes && <div><span className="font-medium">Notes:</span> <p className="text-gray-600 mt-1">{selectedLead.notes}</p></div>}
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="green" size="sm" onClick={() => { handleStatusChange(selectedLead.id, 'won'); setSelectedLead(null) }}>Mark Won</Button>
                <Button variant="outline" size="sm" onClick={() => { handleStatusChange(selectedLead.id, 'lost'); setSelectedLead(null) }}>Mark Lost</Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>Close</Button>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </>
  )
}
