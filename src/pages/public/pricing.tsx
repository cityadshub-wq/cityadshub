import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const plans = [
  {
    name: 'Starter',
    price: '9,999',
    description: 'Perfect for small businesses starting their digital journey.',
    features: ['Social Media Management (2 platforms)', 'Basic SEO Audit', 'Monthly Performance Report', 'Email Support', '1 Social Post per Week'],
  },
  {
    name: 'Growth',
    price: '24,999',
    description: 'Ideal for growing businesses ready to scale.',
    features: ['Social Media Management (4 platforms)', 'Google Ads Management', 'Advanced SEO', 'Content Creation (8 posts/month)', 'Website Optimization', 'Priority Support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '49,999',
    description: 'Complete solution for established businesses.',
    features: ['Full Digital Marketing Suite', 'All Ad Platforms Management', 'Premium SEO + Local SEO', 'Video Production (2 videos/month)', 'Website Development', 'Dedicated Account Manager', '24/7 Priority Support'],
  },
]

export function PricingPage() {
  return (
    <>
      <SEO title="Pricing" description="View our transparent pricing plans for digital marketing services. Choose the plan that fits your business needs." />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Simple, <span className="text-primary">Transparent</span> Pricing
            </h1>
            <p className="text-lg text-gray-600">
              No hidden fees. No surprises. Choose the plan that fits your business needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-orange text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={cn('h-full pt-8', plan.popular && 'ring-2 ring-primary shadow-lg')}>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-dark-navy mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-dark-navy">₹{plan.price}</span>
                      <span className="text-gray-500 text-sm">/month</span>
                    </div>
                    <p className="text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 text-green flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/contact">
                    <Button
                      variant={plan.popular ? 'default' : 'outline'}
                      className="w-full"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 p-8 bg-gray-50 rounded-2xl"
          >
            <p className="text-gray-600 mb-4">
              Need a custom plan? We offer tailored solutions for your specific business requirements.
            </p>
            <Link to="/contact">
              <Button variant="outline">Contact Us for Custom Pricing</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ')
}
