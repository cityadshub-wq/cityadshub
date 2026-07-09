import { motion } from 'framer-motion'
import { Gift, Users, TrendingUp, Wallet, Share2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const steps = [
  { icon: Share2, title: 'Share Your Link', description: 'Get your unique referral link and share it with friends and colleagues.' },
  { icon: Users, title: 'They Sign Up', description: 'When they register for any of our services using your link.' },
  { icon: Wallet, title: 'You Earn Commission', description: 'Receive 10% commission on every successful referral.' },
]

const commissions = [
  { plan: 'Starter', commission: '₹999', example: '₹9,999 package' },
  { plan: 'Growth', commission: '₹2,500', example: '₹24,999 package' },
  { plan: 'Enterprise', commission: '₹5,000', example: '₹49,999 package' },
]

export function ReferralProgramPage() {
  return (
    <>
      <SEO title="Referral Program" description="Join City Ads Hub referral program. Earn commissions by referring businesses to our digital marketing services." />

      <section className="pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5 text-sm font-medium text-orange mb-4">
              <Gift className="h-4 w-4" />
              Earn While You Refer
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Refer & <span className="text-primary">Earn</span>
            </h1>
            <p className="text-lg text-gray-600">
              Love our services? Share the love and earn up to ₹5,000 per referral!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">Step {index + 1}</div>
                  <h3 className="text-lg font-semibold text-dark-navy mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-2xl font-bold text-dark-navy text-center mb-8">Commission Structure</h2>
            <div className="space-y-4">
              {commissions.map((item) => (
                <Card key={item.plan} className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-dark-navy">{item.plan} Plan</span>
                    <span className="text-sm text-gray-500 ml-2">({item.example})</span>
                  </div>
                  <div className="text-xl font-bold text-green">{item.commission}</div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-center bg-gradient-to-br from-dark-navy to-blue-900 text-white rounded-2xl p-12"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Referring?</h2>
            <p className="text-gray-300 mb-8">Sign up to get your unique referral link and start earning today!</p>
            <Link to="/auth/register">
              <Button size="xl" variant="green">
                Join the Program
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
