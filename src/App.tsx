import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProtectedRoute } from '@/hooks/use-protected-route'
import { AdminLayout } from '@/components/admin/admin-layout'

import { HomePage } from '@/pages/public/home'
import { BusinessRegistrationPage } from '@/pages/public/business-registration'
import { ReferralProgramPage } from '@/pages/public/referral-program'
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
import { AdminClientsPage } from '@/pages/admin/clients'
import { AdminEmployeesPage } from '@/pages/admin/employees'
import { AdminServicesPage } from '@/pages/admin/services'
import { AdminProjectsPage } from '@/pages/admin/projects'
import { AdminInvoicesPage } from '@/pages/admin/invoices'
import { AdminPaymentsPage } from '@/pages/admin/payments'
import { AdminHeroCardsPage } from '@/pages/admin/hero-cards'
import { AdminSettingsPage } from '@/pages/admin/settings'
import { AdminSiteContentPage } from '@/pages/admin/site-content'
import { AdminAboutPage } from '@/pages/admin/about'
import { AdminOurWorkPage } from '@/pages/admin/our-work'
import { AdminPricingPage } from '@/pages/admin/pricing'
import { AdminPortfolioCategoriesPage } from '@/pages/admin/portfolio-categories'
import { AdminFAQsPage } from '@/pages/admin/faqs'
import { AdminMediaPage } from '@/pages/admin/media'

import { AboutSection } from '@/components/sections/about-section'
import { ServicesSection } from '@/components/sections/services-section'
import { PortfolioSection } from '@/components/sections/portfolio-section'
import { PricingSection } from '@/components/sections/pricing-section'
import { BlogSection } from '@/components/sections/blog-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { FAQSection } from '@/components/sections/faq-section'
import { ContactSection } from '@/components/sections/contact-section'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-16">{children}</main>
  )
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <HomePage />
            <AboutSection />
            <ServicesSection />
            <PortfolioSection />
            <PricingSection />
            <BlogSection />
            <TestimonialsSection />
            <FAQSection />
            <ContactSection />
          </main>
        } />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="/services" element={<Navigate to="/#services" replace />} />
        <Route path="/portfolio" element={<Navigate to="/#portfolio" replace />} />
        <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
        <Route path="/testimonials" element={<Navigate to="/#testimonials" replace />} />
        <Route path="/blog" element={<Navigate to="/#blog" replace />} />
        <Route path="/faq" element={<Navigate to="/#faq" replace />} />
        <Route path="/contact" element={<Navigate to="/#contact" replace />} />
        <Route path="/business-registration" element={<PublicLayout><BusinessRegistrationPage /></PublicLayout>} />
        <Route path="/referral-program" element={<PublicLayout><ReferralProgramPage /></PublicLayout>} />
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
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/leads" element={<AdminLeadsPage />} />
            <Route path="/admin/business-registration" element={<AdminBusinessRegistrationPage />} />
            <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
            <Route path="/admin/blogs" element={<AdminBlogsPage />} />
            <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
            <Route path="/admin/messages" element={<AdminMessagesPage />} />
            <Route path="/admin/referrals" element={<AdminReferralsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/clients" element={<AdminClientsPage />} />
            <Route path="/admin/employees" element={<AdminEmployeesPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/projects" element={<AdminProjectsPage />} />
            <Route path="/admin/invoices" element={<AdminInvoicesPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/hero-cards" element={<AdminHeroCardsPage />} />
            <Route path="/admin/site-content" element={<AdminSiteContentPage />} />
            <Route path="/admin/about" element={<AdminAboutPage />} />
            <Route path="/admin/our-work" element={<AdminOurWorkPage />} />
            <Route path="/admin/pricing" element={<AdminPricingPage />} />
            <Route path="/admin/portfolio-categories" element={<AdminPortfolioCategoriesPage />} />
            <Route path="/admin/faqs" element={<AdminFAQsPage />} />
            <Route path="/admin/media" element={<AdminMediaPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  )
}
