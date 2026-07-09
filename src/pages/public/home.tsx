import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Globe, Megaphone, Search, Smartphone, Camera, Video, Building2, ChevronRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getHeroCards } from '@/services/hero-cards'
import type { HeroCard } from '@/types'
import { AboutSection } from '@/components/sections/about-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { PricingSection } from '@/components/sections/pricing-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'

const iconMap: Record<string, any> = {
  Megaphone, Search, Globe, Smartphone, Camera, BarChart3,
  Building2, Target: Megaphone, TrendingUp: BarChart3, Zap: Megaphone,
  Users: Megaphone, Palette: Globe, ShoppingBag: Building2,
}

function HeroIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = iconMap[name] || Megaphone
  return <Icon className={className} style={style} />
}

const services = [
  { icon: Megaphone, title: 'Meta Ads', description: 'Facebook & Instagram advertising to reach your target audience.' },
  { icon: Search, title: 'Google Ads', description: 'Search, Display, Shopping & Performance Max campaigns.' },
  { icon: Globe, title: 'SEO', description: 'Technical SEO, Local SEO & Google Business optimization.' },
  { icon: Camera, title: 'Photography', description: 'Commercial, product & event photography services.' },
  { icon: Video, title: 'Video Production', description: 'Corporate, advertisement & drone videos.' },
  { icon: Smartphone, title: 'Web & Mobile', description: 'Websites, e-commerce & mobile app development.' },
  { icon: BarChart3, title: 'Analytics', description: 'Data-driven insights & performance reporting.' },
  { icon: Building2, title: 'Business Registration', description: 'MSME, GST, FSSAI, Trademark & more.' },
]

const stats = [
  { value: '150+', label: 'Projects Completed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '50+', label: 'Team Members' },
  { value: '5+', label: 'Years Experience' },
]

export function HomePage() {
  const [heroCards, setHeroCards] = useState<HeroCard[]>([])
  const [cardsLoading, setCardsLoading] = useState(true)

  useEffect(() => {
    getHeroCards(true).then((data) => {
      setHeroCards(data)
    }).catch(() => {
      // fallback to default cards
    }).finally(() => {
      setCardsLoading(false)
    })
  }, [])

  return (
    <>
      <SEO title="Home" description="City Ads Hub - Turning Local Reach Into Real Customers. Digital marketing agency specializing in Meta Ads, Google Ads, SEO, web development and business registration." />

      <section className="relative min-h-screen flex items-center" data-section="hero">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-orange/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <BarChart3 className="h-4 w-4" />
                Trusted Digital Marketing Agency
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-navy leading-tight mb-6">
                Turning{' '}
                <span className="text-primary">Local Reach</span>
                <br />
                Into{' '}
                <span className="text-orange">Real Customers</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                We help businesses grow with data-driven marketing strategies, cutting-edge technology, and creative excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services">
                  <Button size="xl">
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="xl">
                    Get a Free Quote
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-8 mt-12 pt-8 border-t border-gray-200">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl sm:text-3xl font-bold text-dark-navy">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-orange/20 p-8">
                  {cardsLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : heroCards.length === 0 ? (
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="space-y-4">
                        <div className="glass rounded-xl p-4 h-24 flex items-center">
                          <div className="text-center w-full">
                            <Megaphone className="h-6 w-6 text-primary mx-auto mb-1" />
                            <span className="text-xs font-medium">Meta Ads</span>
                          </div>
                        </div>
                        <div className="glass rounded-xl p-4 h-24 flex items-center">
                          <div className="text-center w-full">
                            <Globe className="h-6 w-6 text-green mx-auto mb-1" />
                            <span className="text-xs font-medium">SEO</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4 pt-8">
                        <div className="glass rounded-xl p-4 h-24 flex items-center">
                          <div className="text-center w-full">
                            <Smartphone className="h-6 w-6 text-orange mx-auto mb-1" />
                            <span className="text-xs font-medium">Web Dev</span>
                          </div>
                        </div>
                        <div className="glass rounded-xl p-4 h-24 flex items-center">
                          <div className="text-center w-full">
                            <Camera className="h-6 w-6 text-primary mx-auto mb-1" />
                            <span className="text-xs font-medium">Media</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {heroCards.map((card, i) => {
                        const col1 = i % 2 === 0
                        return (
                          <div key={card.id} className={col1 ? 'space-y-4' : 'space-y-4 pt-8'}>
                            <div className="glass rounded-xl p-4 h-24 flex items-center">
                              <div className="text-center w-full">
                                <HeroIcon name={card.icon_name} className="h-6 w-6 mx-auto mb-1" style={{ color: card.color }} />
                                <span className="text-xs font-medium block">{card.title}</span>
                                {card.subtitle && (
                                  <span className="text-[10px] text-gray-500 block mt-0.5">{card.subtitle}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AboutSection />

      <section className="py-20 bg-white" data-section="services">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-4">
              Everything You Need to <span className="text-primary">Grow Online</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive digital marketing services designed to take your business from local to legendary.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="group cursor-pointer h-full">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <PortfolioSection />

      <PricingSection />

      <section className="py-20 bg-gradient-to-br from-dark-navy to-blue-900 text-white" data-section="cta">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Scale Your Business?
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Let's create a custom marketing strategy that drives real results for your business.
              </p>
              <div className="space-y-4">
                {['Free strategy consultation', 'Custom marketing plan', 'Dedicated account manager', 'Transparent reporting'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-green/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-green" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="mt-8 inline-block">
                <Button size="xl" variant="green">
                  Schedule a Call
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="glass-dark rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green mb-1">98%</div>
                  <div className="text-gray-400">Client Satisfaction Rate</div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Meta Ads', value: 85 },
                    { label: 'Google Ads', value: 78 },
                    { label: 'SEO', value: 92 },
                    { label: 'Web Development', value: 95 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-white font-medium">{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
    </>
  )
}
