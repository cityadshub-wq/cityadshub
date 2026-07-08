import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'

export function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    wonLeads: 0,
    totalClients: 0,
    totalMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [leadsRes, clientsRes, messagesRes] = await Promise.all([
          supabase.from('leads').select('*'),
          supabase.from('profiles').select('*').eq('role', 'client'),
          supabase.from('contact_messages').select('*'),
        ])
        const leads = leadsRes.data as unknown as { status: string }[] || []
        setStats({
          totalLeads: leads.length,
          wonLeads: leads.filter(l => l.status === 'won').length,
          totalClients: clientsRes.data?.length || 0,
          totalMessages: messagesRes.data?.length || 0,
        })
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    loadStats()
  }, [])

  const metrics = [
    { label: 'Total Leads', value: stats.totalLeads, change: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary/10', up: true },
    { label: 'Converted (Won)', value: stats.wonLeads, change: `${stats.totalLeads ? Math.round(stats.wonLeads / stats.totalLeads * 100) : 0}%`, icon: Target, color: 'text-green', bg: 'bg-green/10', up: true },
    { label: 'Total Clients', value: stats.totalClients, change: '+8%', icon: TrendingUp, color: 'text-orange', bg: 'bg-orange/10', up: true },
    { label: 'Contact Messages', value: stats.totalMessages, change: '+5%', icon: DollarSign, color: 'text-dark-navy', bg: 'bg-dark-navy/10', up: true },
  ]

  return (
    <>
      <SEO title="Analytics" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-navy">Analytics</h1>
          <p className="text-gray-500 text-sm">Platform performance overview</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m) => (
            <Card key={m.label}>
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${m.up ? 'text-green' : 'text-red-500'}`}>
                  {m.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {m.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-dark-navy">{m.value}</div>
              <div className="text-xs text-gray-500">{m.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-lg font-semibold text-dark-navy mb-4">Lead Conversion</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-dark-navy">{stats.totalLeads ? Math.round(stats.wonLeads / stats.totalLeads * 100) : 0}%</span>
                </div>
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-green transition-all" style={{ width: `${stats.totalLeads ? (stats.wonLeads / stats.totalLeads * 100) : 0}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Won: {stats.wonLeads}</span>
                <span className="text-gray-600">Lost: {stats.totalLeads - stats.wonLeads}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-dark-navy mb-4">Platform Growth</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-sm text-gray-600">Total Clients</span>
                <span className="text-lg font-bold text-dark-navy">{stats.totalClients}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-sm text-gray-600">Total Leads</span>
                <span className="text-lg font-bold text-dark-navy">{stats.totalLeads}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="text-sm text-gray-600">Contact Messages</span>
                <span className="text-lg font-bold text-dark-navy">{stats.totalMessages}</span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </>
  )
}
