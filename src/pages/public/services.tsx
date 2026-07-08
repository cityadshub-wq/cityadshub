import { motion } from 'framer-motion'
import { Megaphone, Search, Globe, Camera, Video, Smartphone, BarChart3, Building2, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const serviceCategories = [
  {
    title: 'Digital Marketing',
    icon: Megaphone,
    services: [
      { name: 'Meta Ads', description: 'Facebook & Instagram advertising campaigns with precise targeting.', features: ['Audience targeting', 'A/B testing', 'Creative strategy', 'Performance tracking'] },
      { name: 'Google Ads', description: 'Search, Display, Shopping, YouTube & Performance Max campaigns.', features: ['Keyword research', 'Ad copywriting', 'Bid management', 'Conversion tracking'] },
      { name: 'SEO', description: 'Technical SEO, Local SEO & Google Business Profile optimization.', features: ['Keyword research', 'On-page optimization', 'Link building', 'Local SEO'] },
      { name: 'YouTube Ads', description: 'Video advertising campaigns on YouTube for maximum reach.', features: ['Video strategy', 'Targeting', 'Performance analytics', 'Retargeting'] },
    ],
  },
  {
    title: 'Creative Production',
    icon: Camera,
    services: [
      { name: 'Photography', description: 'Commercial, food, product & event photography.', features: ['Professional equipment', 'Editing & retouching', 'Product shoots', 'Event coverage'] },
      { name: 'Video Production', description: 'Corporate, advertisement, drone videos & editing.', features: ['Script writing', 'Professional filming', 'Drone footage', 'Post-production'] },
    ],
  },
  {
    title: 'Technology Solutions',
    icon: Smartphone,
    services: [
      { name: 'Website Development', description: 'Landing pages, business websites, e-commerce & web apps.', features: ['Responsive design', 'SEO optimized', 'Fast performance', 'CMS integration'] },
      { name: 'Mobile App Development', description: 'Android & cross-platform business applications.', features: ['Native Android', 'Cross-platform', 'UI/UX design', 'App store deployment'] },
    ],
  },
  {
    title: 'Business Services',
    icon: Building2,
    services: [
      { name: 'Business Registration', description: 'MSME, GST, FSSAI, Trademark, Trade License & more.', features: ['End-to-end support', 'Document assistance', 'Fast processing', 'Compliance'] },
      { name: 'Branding', description: 'Complete branding solutions for your business.', features: ['Logo design', 'Brand guidelines', 'Visual identity', 'Brand strategy'] },
    ],
  },
]

export function ServicesPage() {
  return (
    <>
      <SEO title="Services" description="Explore our comprehensive digital marketing services including Meta Ads, Google Ads, SEO, web development, and business registration." />

      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Comprehensive <span className="text-primary">Digital Solutions</span>
            </h1>
            <p className="text-lg text-gray-600">
              From marketing to technology, we provide everything your business needs to thrive in the digital world.
            </p>
          </motion.div>

          {serviceCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark-navy">{category.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {category.services.map((service) => (
                  <Card key={service.name}>
                    <h3 className="text-xl font-semibold text-dark-navy mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle2 className="h-4 w-4 text-green flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-dark-navy text-white rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              We tailor our services to meet your specific business needs and goals.
            </p>
            <Link to="/contact">
              <Button size="xl" variant="green">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
