import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const navLinks: ({ path: string; label: string } | { label: string; children: { path: string; label: string }[] })[] = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/pricing', label: 'Pricing' },
  {
    label: 'More',
    children: [
      { path: '/blog', label: 'Blog' },
      { path: '/testimonials', label: 'Testimonials' },
      { path: '/faq', label: 'FAQ' },
      { path: '/contact', label: 'Contact' },
    ],
  },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold text-dark-navy">
                City<span className="text-primary">Ads</span>
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if ('children' in link) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-medium text-dark-navy hover:text-primary transition-colors">
                      {link.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                              location.pathname === child.path
                                ? 'bg-primary/10 text-primary'
                                : 'text-dark-navy hover:bg-gray-50'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-dark-navy hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/business-registration">
              <Button variant="outline" size="sm">
                Register Business
              </Button>
            </Link>
            {user ? (
              <Link to={user ? '/client/dashboard' : '/auth/login'}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth/login">
                <Button size="sm">Get Started</Button>
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-dark-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="space-y-1 px-4 py-4">
            {navLinks.flatMap((link) =>
              'children' in link
                ? link.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block rounded-lg px-3 py-2 text-sm font-medium',
                        location.pathname === child.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-dark-navy hover:bg-gray-50'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))
                : (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block rounded-lg px-3 py-2 text-sm font-medium',
                        location.pathname === link.path
                          ? 'bg-primary/10 text-primary'
                          : 'text-dark-navy hover:bg-gray-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
            )}
            <div className="pt-4 space-y-2">
              <Link to="/business-registration" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">
                  Register Business
                </Button>
              </Link>
              <Link to={user ? '/client/dashboard' : '/auth/login'} onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">
                  {user ? 'Dashboard' : 'Get Started'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
