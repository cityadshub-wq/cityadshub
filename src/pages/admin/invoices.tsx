import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Download, FileText } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Invoice } from '@/types'

const schema = z.object({
  client_id: z.string().min(1),
  amount: z.string().min(1),
  due_date: z.string().min(1),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const statusColors: Record<string, 'default' | 'primary' | 'green' | 'orange' | 'red'> = {
  draft: 'default', sent: 'primary', paid: 'green', overdue: 'red', cancelled: 'orange',
}

export function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false })
    if (data) setInvoices(data as unknown as Invoice[])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    const num = `INV-${Date.now().toString(36).toUpperCase()}`
    await supabase.from('invoices').insert({
      client_id: data.client_id,
      invoice_number: num,
      amount: Number(data.amount),
      status: 'draft',
      due_date: data.due_date,
      issued_date: new Date().toISOString(),
      items: [{ description: 'Services', quantity: 1, rate: Number(data.amount), amount: Number(data.amount) }],
      notes: data.notes || null,
    })
    reset(); setShowForm(false); load()
  }

  return (
    <>
      <SEO title="Manage Invoices" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-dark-navy">Manage Invoices</h1><p className="text-gray-500 text-sm">{invoices.length} invoices</p></div>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> New Invoice</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">Create Invoice</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="client_id" label="Client ID" error={errors.client_id?.message} {...register('client_id')} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="amount" label="Amount (₹)" type="number" error={errors.amount?.message} {...register('amount')} />
                <Input id="due_date" label="Due Date" type="date" error={errors.due_date?.message} {...register('due_date')} />
              </div>
              <Textarea id="notes" label="Notes" {...register('notes')} />
              <Button type="submit">Create Invoice (Draft)</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'invoice_number', header: 'Invoice', render: (inv: Invoice) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="h-4 w-4 text-primary" /></div>
                <div><div className="font-medium font-mono text-sm">{inv.invoice_number}</div><div className="text-xs text-gray-500">{inv.client_id.slice(0, 8)}...</div></div>
              </div>
            )},
            { key: 'amount', header: 'Amount', render: (inv: Invoice) => <span className="font-semibold">₹{inv.amount.toLocaleString()}</span> },
            { key: 'status', header: 'Status', render: (inv: Invoice) => <Badge variant={statusColors[inv.status]}>{inv.status}</Badge> },
            { key: 'due_date', header: 'Due', render: (inv: Invoice) => <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(inv.due_date).toLocaleDateString()}</div> },
            { key: 'actions', header: '', render: () => <Download className="h-4 w-4 text-gray-400" /> },
          ]}
          data={invoices}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
