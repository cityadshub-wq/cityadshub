import { motion } from 'framer-motion'
import { Users, TrendingUp, DollarSign, Target, BarChart3, Activity } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const stats = [
  { label: 'Total Clients', value: '156', change: '+12%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Revenue (MTD)', value: '₹12.5L', change: '+18%', icon: DollarSign, color: 'text-green', bg: 'bg-green/10' },
  { label: 'Active Leads', value: '48', change: '+8%', icon: Target, color: 'text-orange', bg: 'bg-orange/10' },
  { label: 'Conversion Rate', value: '32%', change: '+5%', icon: TrendingUp, color: 'text-dark-navy', bg: 'bg-dark-navy/10' },
]

const recentLeads = [
  { name: 'Rajesh Mehta', email: 'rajesh@example.com', service: 'Google Ads', status: 'new', date: '2 hours ago' },
  { name: 'Priya Sharma', email: 'priya@example.com', service: 'SEO', status: 'contacted', date: '5 hours ago' },
  { name: 'Amit Kumar', email: 'amit@example.com', service: 'Web Dev', status: 'qualified', date: '1 day ago' },
  { name: 'Neha Gupta', email: 'neha@example.com', service: 'Meta Ads', status: 'proposal', date: '2 days ago' },
]

export function AdminDashboard() {
  return (
    <>
      <SEO title="Admin Dashboard" description="City Ads Hub admin dashboard." />

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-dark-navy">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your business operations.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-dark-navy">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                    <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-green font-medium">{stat.change}</span>
                    <span className="text-xs text-gray-400 ml-1">vs last month</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-dark-navy">Recent Leads</h2>
                  <Badge variant="primary">48 total</Badge>
                </div>
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div key={lead.email} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div>
                        <div className="font-medium text-sm text-dark-navy">{lead.name}</div>
                        <div className="text-xs text-gray-500">{lead.email} • {lead.service}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={lead.status === 'new' ? 'primary' : lead.status === 'contacted' ? 'orange' : lead.status === 'qualified' ? 'green' : 'default'}>
                          {lead.status}
                        </Badge>
                        <div className="text-xs text-gray-400 mt-1">{lead.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-dark-navy mb-4">Revenue Overview</h2>
                <div className="space-y-4">
                  {[
                    { label: 'This Month', value: '₹12,50,000', change: '+18%' },
                    { label: 'Last Month', value: '₹10,60,000', change: '+12%' },
                    { label: 'This Quarter', value: '₹35,00,000', change: '+22%' },
                    { label: 'This Year', value: '₹1,20,00,000', change: '+35%' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-dark-navy">{item.value}</div>
                        <div className="text-xs text-green">{item.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-32 rounded-xl bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
