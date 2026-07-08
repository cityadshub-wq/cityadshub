import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Globe } from 'lucide-react'

const footerLinks = {
  services: [
    { label: 'Meta Ads', path: '/services' },
    { label: 'Google Ads', path: '/services' },
    { label: 'SEO', path: '/services' },
    { label: 'Web Development', path: '/services' },
    { label: 'Mobile Apps', path: '/services' },
    { label: 'Business Registration', path: '/business-registration' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ],
  support: [
    { label: 'FAQ', path: '/faq' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-conditions' },
    { label: 'Referral Program', path: '/referral-program' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-dark-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <span className="text-xl font-bold text-white">
                City<span className="text-primary">Ads</span>
              </span>
            </Link>
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
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
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
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
