import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import { getPortfolioItems } from '@/services/portfolio'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'

const categories = ['All', 'Websites', 'Marketing', 'Branding', 'SEO']

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { data: items = [], isLoading: loading } = useRealtimeQuery('portfolio_items', ['portfolio_items'], getPortfolioItems)

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((p) => {
        const cat = p.category?.toLowerCase() || ''
        return cat === activeCategory.toLowerCase() ||
          cat.includes(activeCategory.toLowerCase())
      })

  const displayItems = filtered.length > 0 ? filtered : (
    activeCategory === 'All' && items.length === 0 ? [] : filtered
  )

  return (
    <section id="portfolio" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            Featured <span className="text-primary">Projects</span>
          </h2>
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
                'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                activeCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : displayItems.length === 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Mumbai Spice Restaurant', category: 'Marketing', description: 'Complete digital marketing campaign including Meta Ads and Google Ads resulting in 300% increase in orders.', results: '300% increase in online orders', client: 'Mumbai Spice' },
              { title: 'UrbanFIT Gym', category: 'Websites', description: 'Custom website with membership management, class booking system, and payment integration.', results: '50% increase in memberships', client: 'UrbanFIT' },
              { title: 'GreenLeaf Organic Store', category: 'Branding', description: 'Complete brand identity including logo, packaging, social media templates, and website design.', results: 'Brand launched successfully', client: 'GreenLeaf' },
              { title: 'QuickDeliver Logistics', category: 'Websites', description: 'Android and web application for real-time package tracking and delivery management.', results: '40% improvement in delivery times', client: 'QuickDeliver' },
              { title: 'Surya Dental Clinic', category: 'SEO', description: 'Local SEO and Google Ads campaign targeting dental patients in Mumbai.', results: '200% increase in appointments', client: 'Surya Dental' },
              { title: 'EcoBuild Constructions', category: 'Websites', description: 'Professional website with project portfolio, client portal, and inquiry management system.', results: '60% more project inquiries', client: 'EcoBuild' },
            ].filter((p) => activeCategory === 'All' || p.category === activeCategory).map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="group h-full overflow-hidden hover:-translate-y-1 transition-all duration-300">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-orange/10 mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange/5 group-hover:scale-110 transition-transform duration-500" />
                    <ExternalLink className="h-10 w-10 text-primary/30 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <Badge variant="primary" className="mb-3">{project.category}</Badge>
                  <h3 className="text-lg font-semibold text-dark-navy mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                    <span className="text-gray-400">{project.client}</span>
                    <span className="text-green font-medium">{project.results}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="group h-full overflow-hidden hover:-translate-y-1 transition-all duration-300">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-orange/10 mb-4 flex items-center justify-center relative overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange/5 group-hover:scale-110 transition-transform duration-500" />
                        <ExternalLink className="h-10 w-10 text-primary/30 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                      </>
                    )}
                  </div>
                  <Badge variant="primary" className="mb-3">{item.category}</Badge>
                  <h3 className="text-lg font-semibold text-dark-navy mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                    <span className="text-gray-400">{item.client_name}</span>
                    {item.results && (
                      <span className="text-green font-medium">{item.results}</span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
