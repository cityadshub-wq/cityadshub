import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import logo from '@/assets/logo.png'
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
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeDropdown = useCallback(() => setDropdownOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDropdown()
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [dropdownOpen, closeDropdown])

  useEffect(() => {
    setDropdownOpen(false)
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 transition-all duration-300',
      scrolled ? 'shadow-sm' : ''
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={cn(
          'flex items-center justify-between transition-all duration-300',
          scrolled ? 'h-14' : 'h-16'
        )}>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="City Ads Hub Logo"
              className="h-8 sm:h-9 lg:h-10 w-auto max-w-[120px] object-contain hover:scale-105 transition-transform duration-200"
            />
          </Link>

          <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 gap-0.5 xl:gap-1.5 px-2">
            {navLinks.map((link) => {
              if ('children' in link) {
                return (
                  <div
                    key={link.label}
                    className="relative shrink-0"
                    ref={dropdownRef}
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => {
                      if (!dropdownOpen) return
                    }}
                  >
                    <button
                      onClick={() => setDropdownOpen(prev => !prev)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setDropdownOpen(prev => !prev)
                        }
                      }}
                      className="flex items-center gap-0.5 rounded-lg px-2.5 py-2 text-sm font-medium text-dark-navy hover:text-primary hover:bg-gray-50 transition-colors whitespace-nowrap"
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                    </button>
                    {dropdownOpen && (
                      <div
                        className="absolute top-full left-0 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg z-50 animate-fade-in-up origin-top"
                        role="menu"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={closeDropdown}
                            role="menuitem"
                            className={cn(
                              'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                              location.pathname === child.path
                                ? 'bg-primary/10 text-primary'
                                : 'text-dark-navy hover:bg-gray-50 hover:text-primary'
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
                    'rounded-lg px-2.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0',
                    location.pathname === link.path
                      ? 'text-primary bg-primary/5'
                      : 'text-dark-navy hover:text-primary hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <Link to="/business-registration">
              <Button variant="ghost" size="sm" className="text-xs whitespace-nowrap px-2.5">
                Register Business
              </Button>
            </Link>
            {user ? (
              <Link to="/client/dashboard">
                <Button size="sm" className="text-xs px-3">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth/login">
                <Button size="sm" className="text-xs px-3">Get Started</Button>
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-dark-navy hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => {
              if ('children' in link) {
                return (
                  <div key={link.label}>
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'block rounded-lg px-3 py-2.5 text-sm font-medium',
                          location.pathname === child.path
                            ? 'bg-primary/10 text-primary'
                            : 'text-dark-navy hover:bg-gray-50 hover:text-primary'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm font-medium',
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-dark-navy hover:bg-gray-50 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-4 space-y-2 border-t border-gray-100 mt-4">
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
