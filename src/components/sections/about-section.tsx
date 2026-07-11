import { motion } from 'framer-motion'
import { Target, Eye, Heart, Users, Award, TrendingUp, Building2, CheckCircle2, Calendar } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'
import { getAboutContent } from '@/services/about'
import { getGrowthTimeline } from '@/services/growth-timeline'

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

const stats = [
  { icon: Users, value: '50+', label: 'Team Members' },
  { icon: Award, value: '150+', label: 'Projects Done' },
  { icon: TrendingUp, value: '98%', label: 'Satisfaction' },
  { icon: Building2, value: '500+', label: 'Clients Served' },
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

  const bySection = (section: string) => aboutItems.find((i) => i.section === section && i.is_active)
  const intro = bySection('intro')
  const introTitle = intro?.title || fallbackIntro.title
  const introDescription = intro?.description || fallbackIntro.description

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
  const storyParagraphs = story?.description ? [story.description] : fallbackStory

  const achievements = timeline.length > 0
    ? timeline.map((t) => ({ year: t.year, title: t.title, description: t.description || '' }))
    : fallbackAchievements

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
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
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
              <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-orange/20 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-dark-navy/60">City Ads Hub</p>
                  <p className="text-sm text-gray-500">Since 2020</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl hidden lg:flex">
                <div className="text-center">
                  <div className="text-3xl font-bold">5+</div>
                  <div className="text-xs font-medium opacity-80">Years</div>
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
            <h3 className="text-2xl font-bold text-dark-navy mb-6">Our Story</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {storyParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              {stats.slice(0, 4).map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-dark-navy">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
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
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2 hidden md:block" />
            <div className="space-y-8">
              {achievements.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'flex flex-col md:flex-row gap-4 md:gap-8',
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                >
                  <div className="hidden md:flex md:w-1/2 justify-end items-center">
                    {index % 2 === 0 ? (
                      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="text-sm font-semibold text-primary">{item.year}</span>
                        </div>
                        <h4 className="font-semibold text-dark-navy mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex md:w-1/2 items-center">
                    {index % 2 !== 0 ? (
                      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="text-sm font-semibold text-primary">{item.year}</span>
                        </div>
                        <h4 className="font-semibold text-dark-navy mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex md:hidden items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-md shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-primary">{item.year}</span>
                      </div>
                      <h4 className="font-semibold text-dark-navy text-sm mb-0.5">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-4 gap-6 mt-20"
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center py-6">
              <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-dark-navy">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
