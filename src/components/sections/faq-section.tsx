import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { getFAQs } from '@/services/faqs'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'
import type { FAQ } from '@/types'

const fallbackFAQs = [
  { id: '1', question: 'How long does SEO take to show results?', answer: 'SEO is a long-term strategy. You can typically expect to see initial results within 3-6 months, with significant improvements in rankings and traffic within 6-12 months.', category: 'SEO', order: 1, is_active: true, created_at: '' },
  { id: '2', question: 'Do you manage Meta Ads (Facebook & Instagram)?', answer: 'Yes! We create and manage comprehensive Meta Ads campaigns including audience targeting, creative strategy, A/B testing, and performance optimization.', category: 'Advertising', order: 2, is_active: true, created_at: '' },
  { id: '3', question: 'Do you build websites?', answer: 'Absolutely. We develop everything from landing pages and business websites to full e-commerce stores and custom web applications.', category: 'Development', order: 3, is_active: true, created_at: '' },
  { id: '4', question: 'What industries do you serve?', answer: 'We serve a wide range of industries including restaurants, retail, healthcare, real estate, education, logistics, fitness, and professional services.', category: 'General', order: 4, is_active: true, created_at: '' },
  { id: '5', question: 'How do payments work?', answer: 'We offer flexible payment options including monthly subscriptions, quarterly payments, and annual plans.', category: 'Pricing', order: 5, is_active: true, created_at: '' },
  { id: '6', question: 'Can I cancel my plan anytime?', answer: 'Yes, you can cancel your plan at any time with a 30-day notice period. There are no long-term contracts or hidden cancellation fees.', category: 'Pricing', order: 6, is_active: true, created_at: '' },
] as FAQ[]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const { data, isLoading, isError } = useRealtimeQuery<FAQ[]>('faqs', ['faqs'], getFAQs)

  if (isLoading) {
    return (
      <section id="faq" className="py-24 bg-gray-50">
        <div className="flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
      </section>
    )
  }

  const faqs = data ?? []
  // The CMS is reachable and simply has no FAQs configured — hide the section rather
  // than show placeholder content pretending to be real. Only fall back to the sample
  // FAQs if the query itself failed (e.g. before the database migration has been run).
  if (!isError && faqs.length === 0) return null
  const displayFaqs = isError ? fallbackFAQs : faqs

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about our services. Can't find what you're looking for? Contact us!
          </p>
        </motion.div>

        <div className="space-y-3">
          {displayFaqs.map((faq, index) => (
            <motion.div
              key={faq.id || index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-0 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300',
                      openIndex === index ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                    )}>
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-dark-navy text-sm md:text-base">{faq.question}</span>
                  </div>
                  <ChevronDown className={cn(
                    'h-5 w-5 text-gray-400 shrink-0 transition-transform duration-300',
                    openIndex === index && 'rotate-180'
                  )} />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 border-t border-gray-100">
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
