import { motion } from 'framer-motion'
import { FileText, FolderOpen, DollarSign, MessageSquare, Bell, Download } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { SEO } from '@/components/shared/seo'

const quickActions = [
  { icon: FolderOpen, label: 'My Projects', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: FileText, label: 'Invoices', color: 'text-orange', bg: 'bg-orange/10' },
  { icon: MessageSquare, label: 'Support', color: 'text-green', bg: 'bg-green/10' },
  { icon: Download, label: 'Downloads', color: 'text-dark-navy', bg: 'bg-dark-navy/10' },
]

const recentProjects = [
  { name: 'Social Media Campaign', status: 'active', progress: 75 },
  { name: 'SEO Optimization', status: 'active', progress: 60 },
  { name: 'Website Development', status: 'completed', progress: 100 },
]

export function ClientDashboard() {
  const { profile } = useAuth()

  return (
    <>
      <SEO title="Client Dashboard" description="Your City Ads Hub client dashboard." />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-dark-navy">Welcome, {profile?.full_name || 'Client'}</h1>
              <p className="text-gray-500">Here's an overview of your account.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Active Projects', value: '3', icon: FolderOpen, color: 'text-primary', bg: 'bg-primary/10' },
                { label: 'Pending Invoices', value: '1', icon: DollarSign, color: 'text-orange', bg: 'bg-orange/10' },
                { label: 'Unread Messages', value: '2', icon: MessageSquare, color: 'text-green', bg: 'bg-green/10' },
                { label: 'Notifications', value: '4', icon: Bell, color: 'text-dark-navy', bg: 'bg-dark-navy/10' },
              ].map((item) => (
                <Card key={item.label}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-dark-navy">{item.value}</div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                    </div>
                    <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <h2 className="text-lg font-semibold text-dark-navy mb-4">Recent Projects</h2>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-dark-navy">{project.name}</span>
                        <Badge variant={project.status === 'completed' ? 'green' : 'primary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-dark-navy mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <div className={`h-10 w-10 rounded-lg ${action.bg} flex items-center justify-center`}>
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <span className="text-sm font-medium text-dark-navy">{action.label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
