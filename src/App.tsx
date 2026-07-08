import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProtectedRoute } from '@/hooks/use-protected-route'
import { AdminLayout } from '@/components/admin/admin-layout'

import { HomePage } from '@/pages/public/home'
import { AboutPage } from '@/pages/public/about'
import { ServicesPage } from '@/pages/public/services'
import { PortfolioPage } from '@/pages/public/portfolio'
import { PricingPage } from '@/pages/public/pricing'
import { TestimonialsPage } from '@/pages/public/testimonials'
import { ContactPage } from '@/pages/public/contact'
import { BusinessRegistrationPage } from '@/pages/public/business-registration'
import { ReferralProgramPage } from '@/pages/public/referral-program'
import { BlogPage } from '@/pages/public/blog'
import { FAQPage } from '@/pages/public/faq'
import { PrivacyPolicyPage } from '@/pages/public/privacy-policy'
import { TermsConditionsPage } from '@/pages/public/terms-conditions'

import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { ResetPasswordPage } from '@/pages/auth/reset-password'

import { ClientDashboard } from '@/pages/client/dashboard'

import { AdminDashboard } from '@/pages/admin/dashboard'
import { AdminLeadsPage } from '@/pages/admin/leads'
import { AdminBusinessRegistrationPage } from '@/pages/admin/business-registration'
import { AdminPortfolioPage } from '@/pages/admin/portfolio'
import { AdminBlogsPage } from '@/pages/admin/blogs'
import { AdminTestimonialsPage } from '@/pages/admin/testimonials'
import { AdminMessagesPage } from '@/pages/admin/messages'
import { AdminReferralsPage } from '@/pages/admin/referrals'
import { AdminAnalyticsPage } from '@/pages/admin/analytics'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
      <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
      <Route path="/testimonials" element={<PublicLayout><TestimonialsPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
      <Route path="/business-registration" element={<PublicLayout><BusinessRegistrationPage /></PublicLayout>} />
      <Route path="/referral-program" element={<PublicLayout><ReferralProgramPage /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
      <Route path="/terms-conditions" element={<PublicLayout><TermsConditionsPage /></PublicLayout>} />

      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute allowedRoles={['client']} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/leads" element={<AdminLeadsPage />} />
          <Route path="/admin/business-registration" element={<AdminBusinessRegistrationPage />} />
          <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
          <Route path="/admin/blogs" element={<AdminBlogsPage />} />
          <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
          <Route path="/admin/messages" element={<AdminMessagesPage />} />
          <Route path="/admin/referrals" element={<AdminReferralsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
