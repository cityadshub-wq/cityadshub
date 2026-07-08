import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Calendar, Trash2, Users } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getClients, deleteClient } from '@/services/clients'
import type { Profile } from '@/types'

export function AdminClientsPage() {
  const [clients, setClients] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setClients(await getClients()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this client?')) { await deleteClient(id); load() }
  }

  return (
    <>
      <SEO title="Manage Clients" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Manage Clients</h1>
            <p className="text-gray-500 text-sm">{clients.length} registered clients</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{clients.length}</div><div className="text-xs text-gray-500">Total Clients</div></div>
            </div>
          </Card>
        </div>

        <DataTable
          columns={[
            { key: 'full_name', header: 'Client', render: (c: Profile) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {c.full_name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{c.full_name}</div>
                  <div className="text-xs text-gray-500">ID: {c.id.slice(0, 8)}...</div>
                </div>
              </div>
            )},
            { key: 'email', header: 'Contact', render: (c: Profile) => (
              <div><div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3 text-gray-400" />{c.email}</div>{c.phone && <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><Phone className="h-3 w-3" />{c.phone}</div>}</div>
            )},
            { key: 'role', header: 'Role', render: () => <Badge variant="primary">client</Badge> },
            { key: 'created_at', header: 'Registered', render: (c: Profile) => (
              <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(c.created_at).toLocaleDateString()}</div>
            )},
            { key: 'actions', header: '', render: (c: Profile) => (
              <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            )},
          ]}
          data={clients}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
