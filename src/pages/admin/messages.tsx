import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Calendar, CheckCheck } from 'lucide-react'
import { Badge, Card, Button } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getContactMessages, markMessageRead } from '@/services/contact'
import type { ContactMessage } from '@/types'

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try { setMessages(await getContactMessages()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleMarkRead = async (id: string) => {
    await markMessageRead(id); load()
  }

  return (
    <>
      <SEO title="Contact Messages" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-navy">Contact Messages</h1>
          <p className="text-gray-500 text-sm">{messages.filter(m => !m.is_read).length} unread</p>
        </div>

        <DataTable
          columns={[
            { key: 'name', header: 'Sender', render: (m: ContactMessage) => (
              <div className="flex items-center gap-2">
                {!m.is_read && <div className="h-2 w-2 rounded-full bg-primary" />}
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.email}</div>
                </div>
              </div>
            )},
            { key: 'subject', header: 'Subject' },
            { key: 'phone', header: 'Phone' },
            { key: 'created_at', header: 'Date', render: (m: ContactMessage) => (
              <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(m.created_at).toLocaleDateString()}</div>
            )},
            { key: 'is_read', header: '', render: (m: ContactMessage) => (
              !m.is_read ? (
                <button onClick={() => handleMarkRead(m.id)} className="text-primary hover:text-primary/80"><CheckCheck className="h-4 w-4" /></button>
              ) : null
            )},
          ]}
          data={messages}
          loading={loading}
          onRowClick={(m) => setSelected(m as unknown as ContactMessage)}
        />

        {selected && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <Card className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark-navy">{selected.subject}</h2>
                {!selected.is_read && <Badge variant="primary">New</Badge>}
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> {selected.email}</div>
                {selected.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> {selected.phone}</div>}
                <div className="pt-2">
                  <p className="text-gray-700">{selected.message}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { handleMarkRead(selected.id); setSelected(null) }}>Mark as Read</Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </>
  )
}
