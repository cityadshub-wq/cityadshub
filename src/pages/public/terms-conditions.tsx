import { motion } from 'framer-motion'
import { SEO } from '@/components/shared/seo'

export function TermsConditionsPage() {
  return (
    <>
      <SEO title="Terms & Conditions" description="City Ads Hub terms and conditions governing the use of our website and services." />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-dark-navy mb-8">Terms & Conditions</h1>
            <div className="prose max-w-none text-gray-600 space-y-6">
              <p>Last updated: January 2024</p>
              <h2 className="text-xl font-semibold text-dark-navy">1. Acceptance of Terms</h2>
              <p>By accessing or using City Ads Hub's website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
              <h2 className="text-xl font-semibold text-dark-navy">2. Services</h2>
              <p>City Ads Hub provides digital marketing, advertising, web development, and business registration services. The scope and pricing of services will be as agreed upon in the service agreement.</p>
              <h2 className="text-xl font-semibold text-dark-navy">3. Payment Terms</h2>
              <p>Payment terms are as specified in the service agreement. Late payments may result in service suspension or additional fees.</p>
              <h2 className="text-xl font-semibold text-dark-navy">4. Intellectual Property</h2>
              <p>All content, trademarks, and intellectual property on our website are owned by City Ads Hub unless otherwise stated.</p>
              <h2 className="text-xl font-semibold text-dark-navy">5. Limitation of Liability</h2>
              <p>City Ads Hub shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
              <h2 className="text-xl font-semibold text-dark-navy">6. Contact</h2>
              <p>For questions about these terms, contact us at hello@cityadshub.com.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
