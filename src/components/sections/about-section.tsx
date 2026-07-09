import { motion } from 'framer-motion'
import { Target, Eye, Heart, Users, Award, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui'

const values = [
  { icon: Target, title: 'Mission', description: 'To empower local businesses with cutting-edge digital strategies that drive measurable growth.' },
  { icon: Eye, title: 'Vision', description: 'To be India\'s most trusted digital growth partner for businesses of all sizes.' },
  { icon: Heart, title: 'Values', description: 'Integrity, transparency, innovation, and client success are at the core of everything we do.' },
]

const stats = [
  { icon: Users, value: '50+', label: 'Team Members' },
  { icon: Award, value: '150+', label: 'Projects Done' },
  { icon: TrendingUp, value: '98%', label: 'Satisfaction' },
  { icon: Target, value: '5+', label: 'Years Experience' },
]

export function AboutSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50" data-section="about">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            We're on a Mission to <span className="text-primary">Transform Local Businesses</span>
          </h2>
          <p className="text-lg text-gray-600">
            Founded in 2020, City Ads Hub has grown from a small team of passionate marketers to a full-service digital agency helping businesses across India achieve remarkable growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center h-full">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-dark-navy mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-dark-navy mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                City Ads Hub was born from a simple observation: local businesses were struggling to compete in the digital age. They had amazing products and services, but lacked the digital presence to reach modern customers.
              </p>
              <p>
                We started as a small Meta Ads agency in Mumbai, helping local restaurants and shops reach customers online. Our results-driven approach quickly gained attention, and we expanded to offer a full suite of digital services.
              </p>
              <p>
                Today, we're a team of 50+ passionate professionals serving 150+ clients across India. From SEO to web development, from Google Ads to business registration — we're your one-stop digital growth partner.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-dark-navy">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
