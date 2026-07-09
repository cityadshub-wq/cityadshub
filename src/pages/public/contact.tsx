import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, Clock, Send, ArrowRight } from 'lucide-react'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone required'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

const contactInfo = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
  { icon: Mail, label: 'Email', value: 'hello@cityadshub.com' },
  { icon: MapPin, label: 'Address', value: 'Mumbai, Maharashtra, India' },
  { icon: Clock, label: 'Business Hours', value: 'Mon-Sat: 10:00 AM - 7:00 PM' },
]

export function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = (data: ContactForm) => {
    console.log('Contact form:', data)
    reset()
  }

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with City Ads Hub. Contact us for digital marketing services, business registration, or a free consultation." />

      <section className="pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Let's <span className="text-primary">Talk Business</span>
            </h1>
            <p className="text-lg text-gray-600">
              Ready to grow your business? Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2">
              <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="name" label="Full Name" placeholder="Your name" error={errors.name?.message} {...register('name')} />
                    <Input id="email" label="Email Address" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="phone" label="Phone Number" placeholder="+91 98765 43210" error={errors.phone?.message} {...register('phone')} />
                    <Input id="subject" label="Subject" placeholder="What's this about?" error={errors.subject?.message} {...register('subject')} />
                  </div>
                  <Textarea id="message" label="Message" placeholder="Tell us about your project..." error={errors.message?.message} {...register('message')} />
                  <Button type="submit" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item) => (
                <Card key={item.label}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="text-sm font-medium text-dark-navy">{item.value}</div>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="h-48 rounded-2xl bg-gray-100 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
