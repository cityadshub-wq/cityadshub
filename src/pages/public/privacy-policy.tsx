import { motion } from 'framer-motion'
import { SEO } from '@/components/shared/seo'

export function PrivacyPolicyPage() {
  return (
    <>
      <SEO title="Privacy Policy" description="City Ads Hub privacy policy. Learn how we collect, use, and protect your personal information." />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-dark-navy mb-8">Privacy Policy</h1>
            <div className="prose max-w-none text-gray-600 space-y-6">
              <p>Last updated: January 2024</p>
              <h2 className="text-xl font-semibold text-dark-navy">1. Introduction</h2>
              <p>City Ads Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
              <h2 className="text-xl font-semibold text-dark-navy">2. Information We Collect</h2>
              <p>We collect information you provide directly to us, including your name, email address, phone number, and business details when you fill out forms on our website or communicate with us.</p>
              <h2 className="text-xl font-semibold text-dark-navy">3. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services; to communicate with you; to send you marketing communications; and to comply with legal obligations.</p>
              <h2 className="text-xl font-semibold text-dark-navy">4. Data Protection</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              <h2 className="text-xl font-semibold text-dark-navy">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at hello@cityadshub.com.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
