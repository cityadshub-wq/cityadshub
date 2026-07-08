import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Building2, Download, Calendar } from 'lucide-react'
import { Input, Badge, Card, Button } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getRegistrationRequests, updateRegistrationRequest } from '@/services/business-registration'
import type { BusinessRegistrationRequest } from '@/types'

const statusColors: Record<string, 'default' | 'primary' | 'green' | 'orange' | 'red'> = {
  pending: 'orange',
  processing: 'primary',
  completed: 'green',
  rejected: 'red',
}

export function AdminBusinessRegistrationPage() {
  const [requests, setRequests] = useState<BusinessRegistrationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<BusinessRegistrationRequest | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await getRegistrationRequests()
      setRequests(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const filtered = requests.filter((r) =>
    r.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.service_type.toLowerCase().includes(search.toLowerCase())
  )

  const handleStatus = async (id: string, status: BusinessRegistrationRequest['status']) => {
    await updateRegistrationRequest(id, { status })
    load()
  }

  return (
    <>
      <SEO title="Business Registration" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-navy">Business Registration Requests</h1>
          <p className="text-gray-500 text-sm">{filtered.length} requests</p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'applicant_name', header: 'Applicant', render: (r: BusinessRegistrationRequest) => (
              <div><div className="font-medium">{r.applicant_name}</div><div className="text-xs text-gray-500">{r.email}</div></div>
            )},
            { key: 'service_type', header: 'Service', render: (r: BusinessRegistrationRequest) => (
              <Badge variant="primary">{r.service_type.toUpperCase()}</Badge>
            )},
            { key: 'phone', header: 'Phone' },
            { key: 'business_name', header: 'Business' },
            { key: 'status', header: 'Status', render: (r: BusinessRegistrationRequest) => (
              <select
                value={r.status}
                onChange={(e) => handleStatus(r.id, e.target.value as BusinessRegistrationRequest['status'])}
                className="text-xs rounded-lg border border-gray-200 px-2 py-1 font-medium"
              >
                {['pending', 'processing', 'completed', 'rejected'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )},
            { key: 'created_at', header: 'Date', render: (r: BusinessRegistrationRequest) => (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />{new Date(r.created_at).toLocaleDateString()}
              </div>
            )},
          ]}
          data={filtered as unknown as Record<string, unknown>[]}
          loading={loading}
          onRowClick={(r) => setSelected(r as unknown as BusinessRegistrationRequest)}
        />

        {selected && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <Card className="max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark-navy">{selected.applicant_name}</h2>
                <Badge variant={statusColors[selected.status]}>{selected.status}</Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="font-medium">Service:</span> <Badge variant="primary">{selected.service_type}</Badge></div>
                <div><span className="font-medium">Email:</span> {selected.email}</div>
                <div><span className="font-medium">Phone:</span> {selected.phone}</div>
                <div><span className="font-medium">Business:</span> {selected.business_name || 'N/A'}</div>
                {selected.notes && <div><span className="font-medium">Notes:</span> <p className="text-gray-600 mt-1">{selected.notes}</p></div>}
                <div><span className="font-medium">Documents:</span> {selected.documents?.length || 0} files</div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button size="sm" variant="green" onClick={() => { handleStatus(selected.id, 'completed'); setSelected(null) }}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </>
  )
}
