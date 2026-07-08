import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, TrendingUp, Users, Wallet, Calendar } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'
import type { Referral } from '@/types'

export function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data } = await supabase.from('referrals').select('*').order('created_at', { ascending: false })
      if (data) setReferrals(data as unknown as Referral[])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const totalCommission = referrals.reduce((sum, r) => sum + (r.commission || 0), 0)
  const converted = referrals.filter(r => r.status === 'converted' || r.status === 'paid').length

  return (
    <>
      <SEO title="Referral Management" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-navy">Referral Program</h1>
          <p className="text-gray-500 text-sm">{referrals.length} total referrals</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Gift className="h-5 w-5 text-primary" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{referrals.length}</div><div className="text-xs text-gray-500">Total Referrals</div></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-green" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{converted}</div><div className="text-xs text-gray-500">Converted</div></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange/10 flex items-center justify-center"><Wallet className="h-5 w-5 text-orange" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">₹{totalCommission.toLocaleString()}</div><div className="text-xs text-gray-500">Total Commission</div></div>
            </div>
          </Card>
        </div>

        <DataTable
          columns={[
            { key: 'referred_name', header: 'Referred', render: (r: Referral) => (
              <div><div className="font-medium">{r.referred_name || 'Anonymous'}</div><div className="text-xs text-gray-500">{r.referred_email}</div></div>
            )},
            { key: 'status', header: 'Status', render: (r: Referral) => (
              <Badge variant={r.status === 'paid' ? 'green' : r.status === 'converted' ? 'primary' : 'default'}>{r.status}</Badge>
            )},
            { key: 'commission', header: 'Commission', render: (r: Referral) => r.commission ? `₹${r.commission}` : '-' },
            { key: 'created_at', header: 'Date', render: (r: Referral) => (
              <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(r.created_at).toLocaleDateString()}</div>
            )},
          ]}
          data={referrals as unknown as Record<string, unknown>[]}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
