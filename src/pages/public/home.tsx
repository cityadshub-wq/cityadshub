import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Megaphone, Smartphone, Camera, Globe, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getHeroCards } from '@/services/hero-cards'
import { getSiteContent } from '@/services/site-content'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'
import { getLucideIcon } from '@/lib/icon-map'
import type { SiteContent } from '@/types'

function HeroIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Icon = getLucideIcon(name, Megaphone)
  return <Icon className={className} style={style} />
}

function getContent(items: SiteContent[], key: string, fallback: string) {
  const item = items.find((i) => i.key === key)
  return item?.value || fallback
}

export function HomePage() {
  const { data: heroCards = [], isLoading: cardsLoading } = useRealtimeQuery('hero_cards', ['hero_cards'], () => getHeroCards(true))
  const { data: content = [], isLoading: contentLoading } = useRealtimeQuery('site_content', ['site_content', 'home'], () => getSiteContent('home'))

  const defaultHeroTitle = 'Build Powerful<br /><span class="text-primary">Influencer</span><br />Campaigns That<br />Drive <span class="text-orange">Real Growth</span>'
  const defaultHeroSubtitle = 'We connect your brand with trusted creators to increase awareness, build customer trust, and generate measurable business growth through strategic influencer marketing campaigns.'

  const badge = contentLoading ? 'Trusted Influencer Marketing Agency' : getContent(content, 'badge', 'Trusted Influencer Marketing Agency')
  const heroTitle = contentLoading ? defaultHeroTitle : getContent(content, 'title', defaultHeroTitle)
  const heroSubtitle = contentLoading ? defaultHeroSubtitle : getContent(content, 'subtitle', defaultHeroSubtitle)
  const btn1Text = getContent(content, 'button_1_text', 'Explore Services')
  const btn1Link = getContent(content, 'button_1_link', '/#services')
  const btn2Text = getContent(content, 'button_2_text', 'Get a Free Quote')
  const btn2Link = getContent(content, 'button_2_link', '/#contact')

  const stats = [
    { value: getContent(content, 'stat_1_value', '150+'), label: getContent(content, 'stat_1_label', 'Projects Completed') },
    { value: getContent(content, 'stat_2_value', '98%'), label: getContent(content, 'stat_2_label', 'Client Satisfaction') },
    { value: getContent(content, 'stat_3_value', '50+'), label: getContent(content, 'stat_3_label', 'Team Members') },
    { value: getContent(content, 'stat_4_value', '5+'), label: getContent(content, 'stat_4_label', 'Years Experience') },
  ]

  return (
    <>
      <SEO title="City Ads Hub - Digital Marketing Agency" description="City Ads Hub - Turning Local Reach Into Real Customers. Digital marketing agency specializing in Meta Ads, Google Ads, SEO, web development and business registration." />

      <section id="home" className="relative min-h-screen flex items-center" data-section="hero">
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
                {badge}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-navy leading-tight mb-6" dangerouslySetInnerHTML={{ __html: heroTitle }} />
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                {heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={btn1Link}>
                  <Button size="xl">
                    {btn1Text}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href={btn2Link}>
                  <Button variant="outline" size="xl">
                    {btn2Text}
                  </Button>
                </a>
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
    </>
  )
}
