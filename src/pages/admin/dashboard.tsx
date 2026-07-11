import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Layers, Briefcase, FileText, MessageSquare, HelpCircle, ArrowRight, Plus, Loader2, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'
import type { BlogPost, PortfolioItem, ContactMessage } from '@/types'

interface StatCard {
  label: string
  value: number
  icon: LucideIcon
  path: string
  color: string
}

type RecentBlog = Pick<BlogPost, 'id' | 'title' | 'slug' | 'created_at' | 'status'>
type RecentProject = Pick<PortfolioItem, 'id' | 'title' | 'category' | 'created_at'>
type RecentMessage = Pick<ContactMessage, 'id' | 'name' | 'email' | 'message' | 'created_at'>

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    services: 0, projects: 0, blogs: 0, testimonials: 0, faqs: 0,
  })
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([])
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])

  useEffect(() => {
    async function load() {
      const [
        servicesRes, projectsRes, blogsRes, testimonialsRes, faqsRes,
        recentBlogsRes, recentProjectsRes, recentMessagesRes,
      ] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio_items').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id, title, slug, created_at, status').order('created_at', { ascending: false }).limit(3),
        supabase.from('portfolio_items').select('id, title, category, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('contact_messages').select('id, name, email, message, created_at').order('created_at', { ascending: false }).limit(3),
      ])

      setStats({
        services: servicesRes.count || 0,
        projects: projectsRes.count || 0,
        blogs: blogsRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        faqs: faqsRes.count || 0,
      })
      setRecentBlogs((recentBlogsRes.data || []) as unknown as RecentBlog[])
      setRecentProjects((recentProjectsRes.data || []) as unknown as RecentProject[])
      setRecentMessages((recentMessagesRes.data || []) as unknown as RecentMessage[])
      setLoading(false)
    }
    load()
  }, [])

  const statCards: StatCard[] = [
    { label: 'Total Services', value: stats.services, icon: Layers, path: '/admin/services', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Projects', value: stats.projects, icon: Briefcase, path: '/admin/projects', color: 'from-green-500 to-green-600' },
    { label: 'Total Blogs', value: stats.blogs, icon: FileText, path: '/admin/blogs', color: 'from-orange-500 to-orange-600' },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare, path: '/admin/testimonials', color: 'from-purple-500 to-purple-600' },
    { label: 'FAQs', value: stats.faqs, icon: HelpCircle, path: '/admin/faqs', color: 'from-cyan-500 to-cyan-600' },
  ]

  const quickActions = [
    { label: 'New Service', path: '/admin/services/new', icon: Plus },
    { label: 'New Project', path: '/admin/projects/new', icon: Plus },
    { label: 'New Blog', path: '/admin/blogs/new', icon: Plus },
    { label: 'New Testimonial', path: '/admin/testimonials/new', icon: Plus },
  ]

  return (
    <>
      <SEO title="Admin Dashboard" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-navy">Dashboard</h1>
          <p className="text-gray-500">Overview of your website content.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={stat.path} className="block">
                <Card className="cursor-pointer hover:shadow-lg transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-2xl font-bold text-dark-navy">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">Latest Blogs</h2>
              <Link to="/admin/blogs" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : recentBlogs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No blogs yet</p>
            ) : (
              <div className="space-y-2">
                {recentBlogs.map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-dark-navy truncate">{blog.title}</div>
                      <div className="text-xs text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</div>
                    </div>
                    <Badge variant={blog.status === 'published' ? 'green' : 'default'}>{blog.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">Latest Projects</h2>
              <Link to="/admin/projects" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : recentProjects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No projects yet</p>
            ) : (
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-dark-navy truncate">{project.title}</div>
                      <div className="text-xs text-gray-500">{project.category || '—'} &middot; {new Date(project.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">Latest Messages</h2>
              <Link to="/admin/messages" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : recentMessages.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No messages yet</p>
            ) : (
              <div className="space-y-2">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start p-3 rounded-xl bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-dark-navy">{msg.name}</div>
                      <div className="text-xs text-gray-500 truncate">{msg.message}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{new Date(msg.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-lg font-semibold text-dark-navy mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.path}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-dark-navy">{action.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </>
  )
}
