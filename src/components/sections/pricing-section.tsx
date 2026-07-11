import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Loader2 } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { getPricingPlans } from '@/services/pricing'
import type { PricingPlan } from '@/types'

const fallbackPlans = [
  { id: '1', name: 'Starter', slug: 'starter', price: 9999, currency: 'INR', interval: 'month', description: 'Perfect for small businesses starting their digital journey.', features: ['Social Media Management (2 platforms)', 'Basic SEO Audit', 'Monthly Performance Report', 'Email Support', '1 Social Post per Week'], is_popular: false, button_text: 'Get Started', sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '2', name: 'Business', slug: 'business', price: 24999, currency: 'INR', interval: 'month', description: 'Ideal for growing businesses ready to scale to the next level.', features: ['Social Media Management (4 platforms)', 'Google Ads Management', 'Advanced SEO', 'Content Creation (8 posts/month)', 'Website Optimization', 'Priority Support'], is_popular: true, button_text: 'Get Started', sort_order: 2, is_active: true, created_at: '', updated_at: '' },
  { id: '3', name: 'Enterprise', slug: 'enterprise', price: 49999, currency: 'INR', interval: 'month', description: 'Complete solution for established businesses with premium needs.', features: ['Full Digital Marketing Suite', 'All Ad Platforms Management', 'Premium SEO + Local SEO', 'Video Production (2 videos/month)', 'Website Development', 'Dedicated Account Manager', '24/7 Priority Support'], is_popular: false, button_text: 'Get Started', sort_order: 3, is_active: true, created_at: '', updated_at: '' },
] as PricingPlan[]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

export function PricingSection() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPricingPlans().then((data) => {
      setPlans(data.length > 0 ? data : fallbackPlans)
    }).catch(() => {
      setPlans(fallbackPlans)
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <section id="pricing" className="py-24 bg-white">
        <div className="flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
      </section>
    )
  }

  const displayPlans = plans.length > 0 ? plans : fallbackPlans

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            Simple, <span className="text-primary">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-gray-600">
            No hidden fees. No surprises. Choose the plan that fits your business needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {displayPlans.map((plan, index) => (
            <motion.div
              key={plan.id || plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <span className="bg-orange text-white text-xs font-semibold px-5 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <Card className={cn(
                'h-full pt-8 relative overflow-hidden',
                plan.is_popular && 'ring-2 ring-primary shadow-xl scale-[1.02]'
              )}>
                {plan.is_popular && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                )}
                <div className="text-center mb-6 relative">
                  <h3 className="text-xl font-bold text-dark-navy mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-dark-navy">₹{plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.interval}</span>
                    {plan.original_price && (
                      <span className="text-gray-400 text-sm line-through ml-2">₹{plan.original_price}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                <div className="space-y-3 mb-8 relative">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-green/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-green" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="#contact">
                  <Button
                    variant={plan.is_popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {plan.button_text || 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
