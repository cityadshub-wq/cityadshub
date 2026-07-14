import { motion } from 'framer-motion'
import { Target, Eye, Heart, Building2, CheckCircle2, Calendar, ArrowRight } from 'lucide-react'
import { Card, ExpandableText } from '@/components/ui'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'
import { getAboutContent } from '@/services/about'
import { getGrowthTimeline } from '@/services/growth-timeline'
import { getAboutStats } from '@/services/about-stats'
import { getLucideIcon } from '@/lib/icon-map'
import type { AboutStat } from '@/types'

const sectionIcons: Record<string, typeof Target> = { mission: Target, vision: Eye, values: Heart }

const fallbackIntro = {
  title: "We're on a Mission to Transform Local Businesses",
  description: 'Founded in 2020, City Ads Hub has grown from a small team of passionate marketers to a full-service digital agency helping businesses across India achieve remarkable growth.',
}

const fallbackValues = [
  { icon: Target, title: 'Mission', description: 'To empower local businesses with cutting-edge digital strategies that drive measurable growth.' },
  { icon: Eye, title: 'Vision', description: "To be India's most trusted digital growth partner for businesses of all sizes." },
  { icon: Heart, title: 'Values', description: 'Integrity, transparency, innovation, and client success are at the core of everything we do.' },
]

const fallbackStory = [
  'City Ads Hub was born from a simple observation: local businesses were struggling to compete in the digital age. They had amazing products and services, but lacked the digital presence to reach modern customers.',
  'We started as a small Meta Ads agency in Mumbai, helping local restaurants and shops reach customers online. Our results-driven approach quickly gained attention, and we expanded to offer a full suite of digital services.',
  "Today, we're a team of 50+ passionate professionals serving 150+ clients across India. From SEO to web development, from Google Ads to business registration — we're your one-stop digital growth partner.",
]

const fallbackStats: AboutStat[] = [
  { id: '1', icon: 'Users', title: 'Team Members', value: '50+', sort_order: 1, is_active: true, created_at: '' },
  { id: '2', icon: 'Award', title: 'Projects Done', value: '150+', sort_order: 2, is_active: true, created_at: '' },
  { id: '3', icon: 'TrendingUp', title: 'Satisfaction', value: '98%', sort_order: 3, is_active: true, created_at: '' },
  { id: '4', icon: 'Building2', title: 'Clients Served', value: '500+', sort_order: 4, is_active: true, created_at: '' },
]

const fallbackAchievements = [
  { year: '2020', title: 'Founded in Mumbai', description: 'Started as a small Meta Ads agency helping local businesses.' },
  { year: '2021', title: 'Expanded Services', description: 'Added Google Ads, SEO, and web development to our offerings.' },
  { year: '2022', title: 'Team of 25+', description: 'Grew to 25+ professionals across marketing, design, and tech.' },
  { year: '2023', title: '100+ Clients', description: 'Reached 100+ satisfied clients across India.' },
  { year: '2024', title: 'Full-Service Agency', description: '50+ team members serving 150+ clients with end-to-end solutions.' },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
}

export function AboutSection() {
  const { data: aboutItems = [] } = useRealtimeQuery('about_content', ['about_content'], getAboutContent)
  const { data: timeline = [] } = useRealtimeQuery('growth_timeline', ['growth_timeline'], getGrowthTimeline)
  const { data: fetchedStats = [] } = useRealtimeQuery('about_stats', ['about_stats'], () => getAboutStats(true))

  const bySection = (section: string) => aboutItems.find((i) => i.section === section && i.is_active)
  const intro = bySection('intro')
  const introTitle = intro?.title || fallbackIntro.title
  const introDescription = intro?.description || fallbackIntro.description
  const introImage = intro?.image_url

  const values = (['mission', 'vision', 'values'] as const)
    .map((section) => {
      const item = bySection(section)
      const fallback = fallbackValues.find((v) => v.title.toLowerCase() === section)!
      return {
        icon: sectionIcons[section],
        title: item?.title || fallback.title,
        description: item?.description || fallback.description,
      }
    })

  const story = bySection('story')
  const storyBadge = story?.subtitle
  const storyHeading = story?.title || 'Our Story'
  const storyParagraphs = story?.description ? [story.description] : fallbackStory
  const storyImageUrl = story?.image_url
  const storyImageAlt = story?.image_alt || storyHeading
  const experienceValue = story?.badge_value || '5+'
  const experienceLabel = story?.badge_label || 'Years'

  const statsData = fetchedStats.length > 0 ? fetchedStats : fallbackStats

  const achievements = timeline.length > 0
    ? timeline.map((t) => ({
        year: t.year, title: t.title, description: t.description || '',
        icon: t.icon, image_url: t.image_url, button_text: t.button_text, button_link: t.button_link,
      }))
    : fallbackAchievements.map((a) => ({
        ...a,
        icon: undefined as string | undefined,
        image_url: undefined as string | undefined,
        button_text: undefined as string | undefined,
        button_link: undefined as string | undefined,
      }))

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            {introTitle}
          </h2>
          <p className="text-lg text-gray-600">
            {introDescription}
          </p>
          {introImage && (
            <div className="mt-8 rounded-2xl overflow-hidden max-w-2xl mx-auto">
              <img src={introImage} alt={introTitle} className="w-full h-64 sm:h-80 object-cover" />
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              {...stagger}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center h-full group hover:-translate-y-1 transition-transform duration-300">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <item.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-dark-navy mb-3">{item.title}</h3>
                <ExpandableText text={item.description} className="text-gray-600 leading-relaxed" />
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-orange/20 flex items-center justify-center">
                {storyImageUrl ? (
                  <img src={storyImageUrl} alt={storyImageAlt} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Building2 className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-dark-navy/60">City Ads Hub</p>
                    <p className="text-sm text-gray-500">Since 2020</p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white shadow-xl ring-4 ring-white hidden lg:flex">
                <div className="text-center">
                  <div className="text-xl font-bold leading-none">{experienceValue}</div>
                  <div className="text-[9px] font-medium opacity-80 mt-1">{experienceLabel}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            {storyBadge && (
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">{storyBadge}</span>
            )}
            <h3 className="text-2xl font-bold text-dark-navy mb-6">{storyHeading}</h3>
            <ExpandableText text={storyParagraphs.join(' ')} className="text-gray-600 leading-relaxed" />
            <div className="grid grid-cols-2 gap-4 mt-8">
              {statsData.slice(0, 4).map((stat) => {
                const Icon = getLucideIcon(stat.icon)
                return (
                  <div key={stat.id} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-dark-navy">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.title}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-dark-navy text-center mb-12">Our Growth Journey</h3>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-primary/20" />
            <div className="space-y-8">
              {achievements.map((item, index) => {
                const DotIcon = getLucideIcon(item.icon, CheckCircle2)
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex items-start gap-4 sm:gap-6"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md shrink-0 relative z-10">
                      <DotIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm flex-1">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-sm font-semibold text-primary">{item.year}</span>
                      </div>
                      <h4 className="font-semibold text-dark-navy mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      {item.button_text && item.button_link && (
                        <a href={item.button_link} className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-2 hover:underline">
                          {item.button_text} <ArrowRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-4 gap-6 mt-20"
        >
          {statsData.map((stat) => {
            const Icon = getLucideIcon(stat.icon)
            return (
              <Card key={stat.id} className="text-center py-6">
                <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-dark-navy">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.title}</div>
              </Card>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
