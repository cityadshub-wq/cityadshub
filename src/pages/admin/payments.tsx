import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Calendar, Wallet } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'
import type { Payment } from '@/types'
import { formatCurrency } from '@/lib/utils'

const statusColors: Record<string, 'default' | 'green' | 'orange' | 'red'> = {
  pending: 'orange', completed: 'green', failed: 'red', refunded: 'default',
}

export function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
    if (data) setPayments(data as unknown as Payment[])
    setLoading(false)
  }

  const totalReceived = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <>
      <SEO title="Manage Payments" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-navy">Manage Payments</h1>
          <p className="text-gray-500 text-sm">{payments.length} transactions</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{formatCurrency(totalReceived)}</div><div className="text-xs text-gray-500">Received</div></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange/10 flex items-center justify-center"><Wallet className="h-5 w-5 text-orange" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{formatCurrency(totalPending)}</div><div className="text-xs text-gray-500">Pending</div></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{formatCurrency(totalReceived + totalPending)}</div><div className="text-xs text-gray-500">Total</div></div>
            </div>
          </Card>
        </div>

        <DataTable
          columns={[
            { key: 'transaction_id', header: 'Transaction', render: (p: Payment) => (
              <div><div className="font-mono text-sm font-medium">{p.transaction_id || '—'}</div><div className="text-xs text-gray-500">{p.method}</div></div>
            )},
            { key: 'amount', header: 'Amount', render: (p: Payment) => <span className="font-semibold">{formatCurrency(p.amount)}</span> },
            { key: 'status', header: 'Status', render: (p: Payment) => <Badge variant={statusColors[p.status]}>{p.status}</Badge> },
            { key: 'paid_at', header: 'Date', render: (p: Payment) => (
              <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(p.paid_at).toLocaleDateString()}</div>
            )},
          ]}
          data={payments}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
