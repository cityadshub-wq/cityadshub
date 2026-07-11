import { motion } from 'framer-motion'
import { Megaphone, Search, Globe, Smartphone, Camera, Video, Palette, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'

const services = [
  { icon: Megaphone, title: 'Meta Ads', description: 'Facebook & Instagram advertising campaigns with precise audience targeting, A/B testing, creative strategy, and performance tracking.' },
  { icon: Search, title: 'Google Ads', description: 'Search, Display, Shopping, YouTube & Performance Max campaigns with keyword research, ad copywriting, and bid management.' },
  { icon: Globe, title: 'SEO', description: 'Technical SEO, Local SEO & Google Business Profile optimization including link building, on-page optimization, and analytics.' },
  { icon: Smartphone, title: 'Web Development', description: 'Landing pages, business websites, e-commerce stores & custom web applications with responsive design and CMS integration.' },
  { icon: Megaphone, title: 'Social Media Marketing', description: 'Organic social media management, content strategy, community engagement, and influencer partnerships across all platforms.' },
  { icon: Palette, title: 'Branding', description: 'Complete brand identity including logo design, brand guidelines, visual identity, packaging design, and brand strategy.' },
  { icon: Camera, title: 'Graphic Design', description: 'Professional graphic design for print and digital including social media creatives, brochures, banners, and marketing materials.' },
  { icon: Video, title: 'Video Production', description: 'Corporate films, advertisement videos, drone footage, product demos, and professional post-production editing services.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            Everything You Need to <span className="text-primary">Grow Online</span>
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive digital services designed to take your business from local to legendary. We cover every aspect of your digital presence.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="group cursor-pointer h-full hover:-translate-y-1 transition-all duration-300">
                <div className={cn(
                  'h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300',
                  'bg-primary/10 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-lg'
                )}>
                  <service.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-dark-navy mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
