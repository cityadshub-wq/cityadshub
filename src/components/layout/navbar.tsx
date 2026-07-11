import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '@/assets/logo.png'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const isHomePath = (path: string) => path === '/' || path.startsWith('/#')

const sectionIds = ['home', 'about', 'services', 'portfolio', 'pricing', 'blog', 'testimonials', 'faq', 'contact']

const navLinks = [
  { path: '/#home', label: 'Home', section: 'home' },
  { path: '/#about', label: 'About', section: 'about' },
  { path: '/#services', label: 'Services', section: 'services' },
  { path: '/#portfolio', label: 'Our Work', section: 'portfolio' },
  { path: '/#pricing', label: 'Pricing', section: 'pricing' },
  { path: '/#blog', label: 'Blog', section: 'blog' },
  { path: '/#testimonials', label: 'Testimonials', section: 'testimonials' },
  { path: '/#faq', label: 'FAQs', section: 'faq' },
  { path: '/#contact', label: 'Contact', section: 'contact' },
]

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) {
    const offset = 70
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { user } = useAuth()
  const location = useLocation()
  const isHome = isHomePath(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isHome])

  useEffect(() => {
    if (!isHome) setActiveSection('')
  }, [location.pathname, isHome])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleNavClick = (e: React.MouseEvent, section?: string) => {
    if (section) {
      e.preventDefault()
      if (!isHome) {
        window.location.href = '/#' + section
        return
      }
      scrollToSection(section)
    }
    setMobileOpen(false)
  }

  const isActive = (section?: string) => {
    if (!section || !isHome) return false
    return activeSection === section
  }

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
          <a
            href="/#home"
            onClick={(e) => handleNavClick(e, 'home')}
            className="flex items-center gap-2 shrink-0"
          >
            <img
              src={logo}
              alt="City Ads Hub Logo"
              className="h-8 sm:h-9 lg:h-10 w-auto max-w-[120px] object-contain hover:scale-105 transition-transform duration-200"
            />
          </a>

          <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 gap-0.5 xl:gap-1.5 px-2">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.section)}
                className={cn(
                  'rounded-lg px-2.5 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0',
                  isActive(link.section)
                    ? 'text-primary bg-primary/5'
                    : 'text-dark-navy hover:text-primary hover:bg-gray-50'
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-1 shrink-0">
            <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')}>
              <Button size="sm" className="text-xs px-3">Contact</Button>
            </a>
            {user && (
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm" className="text-xs px-2.5">Admin</Button>
              </Link>
            )}
            {!user && (
              <Link to="/auth/login">
                <Button variant="outline" size="sm" className="text-xs px-3">Login</Button>
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
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.section)}
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm font-medium',
                  isActive(link.section)
                    ? 'bg-primary/10 text-primary'
                    : 'text-dark-navy hover:bg-gray-50 hover:text-primary'
                )}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 space-y-2 border-t border-gray-100 mt-4">
              <a href="/#contact" onClick={(e) => handleNavClick(e, 'contact')}>
                <Button className="w-full" size="sm">Contact</Button>
              </a>
              {user ? (
                <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Admin</Button>
                </Link>
              ) : (
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
