import { motion } from 'framer-motion'
import { Target, Eye, Heart, Users, Award, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const values = [
  { icon: Target, title: 'Mission', description: 'To empower local businesses with cutting-edge digital strategies that drive measurable growth.' },
  { icon: Eye, title: 'Vision', description: 'To be India\'s most trusted digital growth partner for businesses of all sizes.' },
  { icon: Heart, title: 'Values', description: 'Integrity, transparency, innovation, and client success are at the core of everything we do.' },
]

const team = [
  { name: 'Rahul Sharma', role: 'CEO & Founder', image: null },
  { name: 'Priya Patel', role: 'Head of Marketing', image: null },
  { name: 'Amit Singh', role: 'Lead Developer', image: null },
  { name: 'Neha Gupta', role: 'Creative Director', image: null },
]

export function AboutPage() {
  return (
    <>
      <SEO title="About Us" description="Learn about City Ads Hub - our mission, vision, and team. We help businesses grow with digital marketing." />

      <section className="pt-16 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              We're on a Mission to <span className="text-primary">Transform Local Businesses</span>
            </h1>
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
                transition={{ delay: index * 0.1 }}
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

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
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
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Users, value: '50+', label: 'Team Members' },
                { icon: Award, value: '150+', label: 'Projects Done' },
                { icon: TrendingUp, value: '98%', label: 'Satisfaction' },
                { icon: Target, value: '5+', label: 'Years Experience' },
              ].map((stat) => (
                <Card key={stat.label} className="text-center">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-dark-navy">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </Card>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-dark-navy text-center mb-12">Meet Our Leadership</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <Card key={member.name} className="text-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-orange/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-dark-navy">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
