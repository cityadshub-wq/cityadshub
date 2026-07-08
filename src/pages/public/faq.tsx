import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { cn } from '@/lib/utils'

const faqs = [
  { category: 'General', qa: [
    { q: 'What services does City Ads Hub offer?', a: 'We offer a comprehensive range of digital services including Meta Ads, Google Ads, SEO, website development, mobile app development, video production, photography, branding, and business registration services.' },
    { q: 'How can I get started with City Ads Hub?', a: 'Simply contact us through our website, call us, or visit our office. We\'ll schedule a free consultation to understand your business needs and create a customized strategy.' },
    { q: 'How long does it take to see results?', a: 'Results vary depending on the service. Generally, you can expect to see initial results within 2-4 weeks for ads, 3-6 months for SEO, and 2-4 weeks for website development.' },
  ]},
  { category: 'Pricing & Payments', qa: [
    { q: 'How much do your services cost?', a: 'Our pricing starts from ₹9,999/month for our Starter plan. We also offer custom plans tailored to your specific needs. Contact us for a detailed quote.' },
    { q: 'Do you offer refunds?', a: 'Yes, we offer a satisfaction guarantee. If you\'re not happy with our services within the first 14 days, we\'ll provide a full refund.' },
    { q: 'What payment methods do you accept?', a: 'We accept bank transfers, UPI, credit/debit cards, and other digital payment methods.' },
  ]},
  { category: 'Business Registration', qa: [
    { q: 'What documents are needed for MSME registration?', a: 'You need your Aadhaar Card, PAN Card, business address proof, and bank account details.' },
    { q: 'How long does GST registration take?', a: 'GST registration typically takes 5-7 working days after submitting all required documents.' },
    { q: 'Do I need a trademark for my business?', a: 'While not mandatory, trademark registration is highly recommended to protect your brand identity and prevent others from using your name or logo.' },
  ]},
  { category: 'Support', qa: [
    { q: 'How can I contact support?', a: 'You can reach us via phone at +91 98765 43210, email at hello@cityadshub.com, or visit our office during business hours.' },
    { q: 'What are your business hours?', a: 'We operate Monday through Saturday, from 10:00 AM to 7:00 PM. We\'re closed on Sundays and public holidays.' },
  ]},
]

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  return (
    <>
      <SEO title="FAQ" description="Frequently asked questions about City Ads Hub services, pricing, business registration, and support." />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about our services. Can't find what you're looking for? Contact us!
            </p>
          </motion.div>

          {faqs.map((group) => (
            <div key={group.category} className="mb-10">
              <h2 className="text-xl font-bold text-dark-navy mb-4">{group.category}</h2>
              <div className="space-y-3">
                {group.qa.map((item) => {
                  const id = `${group.category}-${item.q}`
                  const isOpen = openIndex === id
                  return (
                    <Card key={id} className="p-0 overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-medium text-dark-navy pr-4">{item.q}</span>
                        <ChevronDown className={cn('h-5 w-5 text-gray-400 flex-shrink-0 transition-transform', isOpen && 'rotate-180')} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="text-gray-600">{item.a}</p>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
