import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, Clock, Send, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { useSettings } from '@/hooks/use-settings'
import { createContactMessage } from '@/services/contact'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone required'),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

const fallbackContactInfo = {
  address: 'Mumbai, Maharashtra, India',
  contact_phone: '+91 98765 43210',
  contact_email: 'hello@cityadshub.com',
  business_hours: 'Mon-Sat: 10:00 AM - 7:00 PM',
}

const services = ['Meta Ads', 'Google Ads', 'SEO', 'Web Development', 'Social Media Marketing', 'Branding', 'Graphic Design', 'Video Production', 'Business Registration', 'Other']

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

export function ContactSection() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })
  const { data: settings } = useSettings()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: settings?.address || fallbackContactInfo.address },
    { icon: Phone, label: 'Phone', value: settings?.contact_phone || fallbackContactInfo.contact_phone },
    { icon: Mail, label: 'Email', value: settings?.contact_email || fallbackContactInfo.contact_email },
    { icon: Clock, label: 'Working Hours', value: settings?.business_hours || fallbackContactInfo.business_hours },
  ]

  const onSubmit = async (data: ContactForm) => {
    setSubmitError(null)
    try {
      const subject = data.service ? `Inquiry: ${data.service}` : 'Contact Form Submission'
      const message = data.company ? `Company: ${data.company}\n\n${data.message}` : data.message
      await createContactMessage({ name: data.name, email: data.email, phone: data.phone, subject, message })
      setSubmitted(true)
      reset()
    } catch (e) {
      console.error(e)
      setSubmitError('Something went wrong sending your message. Please try again.')
    }
  }

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            Let's <span className="text-primary">Talk Business</span>
          </h2>
          <p className="text-lg text-gray-600">
            Ready to grow your business? Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((item) => (
              <Card key={item.label} className="hover:-translate-y-0.5 transition-transform duration-200">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-semibold text-dark-navy">{item.value}</div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="h-48 rounded-2xl bg-gradient-to-br from-primary/10 to-orange/10 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary/40 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Find us on Google Maps</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-semibold text-dark-navy mb-5">{settings?.form_title || 'Send us a Message'}</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="name" label="Full Name" placeholder="Your name" error={errors.name?.message} {...register('name')} />
                  <Input id="email" label="Email Address" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="phone" label="Phone Number" placeholder="+91 98765 43210" error={errors.phone?.message} {...register('phone')} />
                  <Input id="company" label="Company (Optional)" placeholder="Your company name" {...register('company')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-navy mb-1.5">Service Interested In (Optional)</label>
                  <select
                    {...register('service')}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Textarea id="message" label="Message" placeholder="Tell us about your project..." error={errors.message?.message} {...register('message')} />
                {submitted && (
                  <p className="flex items-center gap-2 text-sm font-medium text-green">
                    <CheckCircle2 className="h-4 w-4" /> {settings?.success_message || 'Thank you! We will get back to you within 24 hours.'}
                  </p>
                )}
                {submitError && <p className="text-sm font-medium text-red-500">{submitError}</p>}
                <Button type="submit" size="lg" className="w-full sm:w-auto" loading={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
