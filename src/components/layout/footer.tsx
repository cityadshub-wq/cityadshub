import { useState } from 'react'
import { Phone, Mail, MapPin, Globe, Send, ChevronUp } from 'lucide-react'

const footerLinks = {
  services: [
    { label: 'Meta Ads', path: '/#services' },
    { label: 'Google Ads', path: '/#services' },
    { label: 'SEO', path: '/#services' },
    { label: 'Web Development', path: '/#services' },
    { label: 'Mobile Apps', path: '/#services' },
    { label: 'Business Registration', path: '/business-registration' },
  ],
  company: [
    { label: 'About Us', path: '/#about' },
    { label: 'Portfolio', path: '/#portfolio' },
    { label: 'Testimonials', path: '/#testimonials' },
    { label: 'Blog', path: '/#blog' },
    { label: 'Contact', path: '/#contact' },
  ],
  support: [
    { label: 'FAQ', path: '/#faq' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-conditions' },
    { label: 'Referral Program', path: '/referral-program' },
  ],
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-dark-navy text-white relative">
      <button
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:-translate-y-1"
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <a href="/#home" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold text-white">
                City<span className="text-primary">Ads</span>
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Turning local reach into real customers. We help businesses grow with data-driven digital marketing strategies.
            </p>
            <div className="flex items-center gap-3">
              {['facebook', 'instagram', 'youtube', 'linkedin'].map((social) => (
                <a key={social} href="#" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                  <Globe className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.path} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.path} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.path} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest tips and updates delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="text-green text-sm font-medium">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <span>hello@cityadshub.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Mumbai, Maharashtra, India</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} City Ads Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/terms-conditions" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
