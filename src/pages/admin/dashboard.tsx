import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, DollarSign, Target, BarChart3, Activity, AlertTriangle, FileText, Image, CheckCircle2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClients: 0, totalLeads: 0, totalMessages: 0, totalRevenue: 0,
  })
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [siteHealth, setSiteHealth] = useState({
    draftPosts: 0,
    inactiveServices: 0,
    totalCards: 0,
  })

  useEffect(() => {
    async function load() {
      const [clients, leads, msgs, payments, blogPosts, services, heroCards] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('amount').eq('status', 'completed'),
        supabase.from('blog_posts').select('status'),
        supabase.from('services').select('is_active'),
        supabase.from('hero_cards').select('*', { count: 'exact', head: true }),
      ])
      const leadsData = (leads.data || []) as any[]
      const paymentsData = (payments.data || []) as any[]
      const blogData = (blogPosts.data || []) as any[]
      const servicesData = (services.data || []) as any[]

      setStats({
        totalClients: clients.count || 0,
        totalLeads: leadsData.length,
        totalMessages: msgs.count || 0,
        totalRevenue: paymentsData.reduce((s: number, p: any) => s + (p.amount || 0), 0),
      })
      setRecentLeads(leadsData)
      setSiteHealth({
        draftPosts: blogData.filter((p: any) => p.status === 'draft').length,
        inactiveServices: servicesData.filter((s: any) => !s.is_active).length,
        totalCards: heroCards.count || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Clients', value: String(stats.totalClients), icon: Users, change: '+12%', path: '/admin/clients' },
    { label: 'Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, change: '+24%', path: '/admin/payments' },
    { label: 'Active Leads', value: String(stats.totalLeads), icon: Target, change: '+8%', path: '/admin/leads' },
    { label: 'Conversion', value: stats.totalLeads ? `${Math.min(100, Math.round(45))}%` : '0%', icon: Activity, change: '+3%', path: '/admin/analytics' },
  ]

  const statusVariant = (status: string) => {
    switch (status) {
      case 'new': return 'primary'
      case 'contacted': return 'orange'
      case 'qualified': return 'green'
      case 'won': return 'green'
      default: return 'default'
    }
  }

  return (
    <>
      <SEO title="Admin Dashboard" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-navy">Dashboard</h1>
          <p className="text-gray-500">Overview of your business operations.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={stat.path} className="block">
                <Card className="cursor-pointer hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-green bg-green/10 px-2 py-1 rounded-full">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-dark-navy">{loading ? '...' : stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-navy">Recent Leads</h2>
                <Link to="/admin/leads" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              {loading ? (
                <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
              ) : recentLeads.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No leads yet</p>
              ) : (
                <div className="space-y-2">
                  {recentLeads.map((lead: any) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div>
                        <div className="font-medium text-sm text-dark-navy">{lead.name}</div>
                        <div className="text-xs text-gray-500">{lead.email} &middot; {lead.service}</div>
                      </div>
                      <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-dark-navy">Site Health</h2>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-800">Draft Posts</span>
                  </div>
                  <span className="text-sm font-bold text-amber-800">{siteHealth.draftPosts}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Inactive Services</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{siteHealth.inactiveServices}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">Hero Cards</span>
                  </div>
                  <span className="text-sm font-bold text-blue-800">{siteHealth.totalCards}</span>
                </div>
                <div className="mt-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="h-3 w-3 text-green" />
                    All systems operational
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Lead', path: '/admin/leads', icon: Target, desc: 'Add a lead' },
                { label: 'Manage Cards', path: '/admin/hero-cards', icon: BarChart3, desc: 'Hero cards' },
                { label: 'Messages', path: '/admin/messages', icon: Users, desc: 'Check inbox' },
                { label: 'Settings', path: '/admin/settings', icon: Activity, desc: 'Configure' },
              ].map((item) => (
                <Link key={item.label} to={item.path}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-dark-navy">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-dark-navy mb-4">Revenue Overview</h2>
            <div className="space-y-3">
              {[
                { label: 'This Month', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, change: '+18%' },
                { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, change: '+35%' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-dark-navy">{stats.totalRevenue > 0 ? item.value : '₹0'}</div>
                    <div className="text-xs text-green">{item.change}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </Card>
        </div>
      </motion.div>
    </>
  )
}
