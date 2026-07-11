import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { cn } from '@/lib/utils'

const categories = ['All', 'Web Development', 'Mobile Apps', 'Marketing', 'Branding']

const projects = [
  { title: 'Mumbai Spice Restaurant', category: 'Marketing', description: 'Complete digital marketing campaign including Meta Ads and Google Ads resulting in 300% increase in orders.', results: '300% increase in online orders', client: 'Mumbai Spice', date: '2024' },
  { title: 'UrbanFIT Gym', category: 'Web Development', description: 'Custom website with membership management, class booking system, and payment integration.', results: '50% increase in memberships', client: 'UrbanFIT', date: '2024' },
  { title: 'GreenLeaf Organic Store', category: 'Branding', description: 'Complete brand identity including logo, packaging, social media templates, and website design.', results: 'Brand launched successfully', client: 'GreenLeaf', date: '2023' },
  { title: 'QuickDeliver Logistics', category: 'Mobile Apps', description: 'Android and web application for real-time package tracking and delivery management.', results: '40% improvement in delivery times', client: 'QuickDeliver', date: '2024' },
  { title: 'Surya Dental Clinic', category: 'Marketing', description: 'Local SEO and Google Ads campaign targeting dental patients in Mumbai.', results: '200% increase in appointments', client: 'Surya Dental', date: '2023' },
  { title: 'EcoBuild Constructions', category: 'Web Development', description: 'Professional website with project portfolio, client portal, and inquiry management system.', results: '60% more project inquiries', client: 'EcoBuild', date: '2024' },
]

export function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      <SEO title="Portfolio" description="View our portfolio of successful digital marketing projects, websites, and brand campaigns." />

      <section className="pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Our <span className="text-primary">Work</span>
            </h1>
            <p className="text-lg text-gray-600">
              Real projects, real results. See how we've helped businesses transform their digital presence.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-medium transition-all',
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group h-full">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-orange/10 mb-4 flex items-center justify-center">
                    <ExternalLink className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
                  </div>
                  <Badge variant="primary" className="mb-3">{project.category}</Badge>
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{project.client} • {project.date}</span>
                    <span className="text-green font-medium">{project.results}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
