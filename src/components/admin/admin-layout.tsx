import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, Briefcase, FileText, Star, MessageSquare, Gift, BarChart3, LogOut, Menu, X, Settings, UserCog, FolderOpen, DollarSign, CreditCard, Globe, ChevronRight, Home, Layout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui'

const sidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/clients', label: 'Clients', icon: UserCog },
  { path: '/admin/employees', label: 'Employees', icon: Users },
  { path: '/admin/leads', label: 'Leads', icon: BarChart3 },
  { separator: 'Content' },
  { path: '/admin/services', label: 'Services', icon: Briefcase },
  { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { path: '/admin/portfolio', label: 'Portfolio', icon: Building2 },
  { path: '/admin/blogs', label: 'Blog Posts', icon: FileText },
  { path: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { path: '/admin/hero-cards', label: 'Hero Cards', icon: Layout },
  { separator: 'Finance' },
  { path: '/admin/invoices', label: 'Invoices', icon: DollarSign },
  { path: '/admin/payments', label: 'Payments', icon: CreditCard },
  { separator: 'CRM' },
  { path: '/admin/business-registration', label: 'Registration', icon: Globe },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/referrals', label: 'Referrals', icon: Gift },
  { separator: 'Insights' },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { separator: 'System' },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/clients': 'Clients',
  '/admin/employees': 'Employees',
  '/admin/leads': 'Leads',
  '/admin/services': 'Services',
  '/admin/projects': 'Projects',
  '/admin/portfolio': 'Portfolio',
  '/admin/blogs': 'Blog Posts',
  '/admin/testimonials': 'Testimonials',
  '/admin/invoices': 'Invoices',
  '/admin/payments': 'Payments',
  '/admin/business-registration': 'Business Registration',
  '/admin/messages': 'Messages',
  '/admin/referrals': 'Referrals',
  '/admin/analytics': 'Analytics',
  '/admin/hero-cards': 'Hero Cards',
  '/admin/settings': 'Settings',
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { signOut, profile } = useAuth()
  const pageTitle = pageTitles[location.pathname] || 'Admin'

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-dark-navy text-white transition-transform duration-200 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">CA</span>
            </div>
            <span className="font-bold">City<span className="text-primary">Ads</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {sidebarLinks.map((link) => {
            if ('separator' in link) {
              return (
                <div key={link.separator} className="px-3 pt-4 pb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{link.separator}</span>
                </div>
              )
            }
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="text-white font-medium">{profile?.full_name || 'Admin'}</div>
              <div className="text-gray-400 text-xs capitalize">{profile?.role}</div>
            </div>
            <button onClick={signOut} className="p-2 text-gray-400 hover:text-white transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-dark-navy hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
            <Link to="/admin/dashboard" className="hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="text-dark-navy font-medium">{pageTitle}</span>
          </nav>
          <div className="flex-1" />
          <Link to="/">
            <Button variant="ghost" size="sm">View Site</Button>
          </Link>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
