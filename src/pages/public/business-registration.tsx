import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, FileText, Shield, Clock, CheckCircle, ChevronRight, ArrowRight } from 'lucide-react'
import { Button, Input, Textarea, Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { cn } from '@/lib/utils'

const services = [
  { id: 'msme', name: 'MSME Registration', description: 'Micro, Small & Medium Enterprise registration for government benefits.', benefits: ['Government subsidies', 'Priority sector lending', 'Tax benefits', 'Lower interest rates'], eligibility: 'All businesses regardless of sector', documents: ['Aadhaar Card', 'PAN Card', 'Business address proof', 'Bank details'], processing: '2-3 working days' },
  { id: 'gst', name: 'GST Registration', description: 'Goods and Services Tax registration for your business.', benefits: ['Legal compliance', 'Input tax credit', 'Inter-state trading', 'E-commerce selling'], eligibility: 'Businesses with turnover above ₹20L', documents: ['PAN Card', 'Aadhaar Card', 'Address proof', 'Bank statement', 'Photographs'], processing: '5-7 working days' },
  { id: 'fssai', name: 'FSSAI Registration', description: 'Food Safety license for food businesses.', benefits: ['Legal compliance', 'Consumer trust', 'Business growth', 'Quality certification'], eligibility: 'All food business operators', documents: ['Business details', 'Food safety plan', 'Address proof', 'ID proof'], processing: '7-10 working days' },
  { id: 'trademark', name: 'Trademark Registration', description: 'Protect your brand identity with trademark registration.', benefits: ['Brand protection', 'Legal rights', 'Business asset', 'Nationwide protection'], eligibility: 'Any brand or logo owner', documents: ['Logo/Brand name', 'Applicant details', 'Business proof', 'Use claim'], processing: '12-18 months' },
  { id: 'shop', name: 'Shop License', description: 'Shop & Establishment Act license for commercial businesses.', benefits: ['Legal operation', 'Employee benefits', 'Compliance', 'Business legitimacy'], eligibility: 'All commercial establishments', documents: ['Business details', 'Address proof', 'ID proof', 'Employee details'], processing: '7-15 working days' },
  { id: 'iec', name: 'IEC Registration', description: 'Import Export Code for international trade.', benefits: ['International trade', 'Global reach', 'Duty benefits', 'Business expansion'], eligibility: 'Businesses wanting to import/export', documents: ['PAN Card', 'Address proof', 'Bank certificate', 'Business proof'], processing: '2-3 working days' },
]

const registrationSchema = z.object({
  service_type: z.string().min(1, 'Select a service'),
  applicant_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone required'),
  business_name: z.string().min(2, 'Business name required'),
  notes: z.string().optional(),
})

type RegistrationForm = z.infer<typeof registrationSchema>

export function BusinessRegistrationPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = (data: RegistrationForm) => {
    console.log('Registration:', data)
  }

  const service = services.find(s => s.id === selectedService)

  return (
    <>
      <SEO title="Business Registration" description="Register your business online. MSME, GST, FSSAI, Trademark, Shop License, IEC registration services." />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Business <span className="text-primary">Registration</span>
            </h1>
            <p className="text-lg text-gray-600">
              Get your business legally registered with our end-to-end assistance. Fast, reliable, and hassle-free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((svc, idx) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer h-full',
                    selectedService === svc.id && 'ring-2 ring-primary'
                  )}
                  onClick={() => { setSelectedService(svc.id); setShowForm(false) }}
                >
                  <Building2 className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-dark-navy mb-2">{svc.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{svc.description}</p>
                  <Badge variant="green">{svc.processing}</Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          {service && !showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="max-w-4xl mx-auto mb-8">
                <h2 className="text-2xl font-bold text-dark-navy mb-6">{service.name}</h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-dark-navy mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green" /> Benefits
                    </h3>
                    <ul className="space-y-2">
                      {service.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                          <ChevronRight className="h-4 w-4 text-primary" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-navy mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" /> Required Documents
                    </h3>
                    <ul className="space-y-2">
                      {service.documents.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-gray-600">
                          <ChevronRight className="h-4 w-4 text-primary" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-600">Processing Time: <strong>{service.processing}</strong></span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-green" />
                  <span className="text-sm font-medium text-green">Eligibility: {service.eligibility}</span>
                </div>

                <Button size="lg" onClick={() => setShowForm(true)}>
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </motion.div>
          )}

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <h2 className="text-2xl font-bold text-dark-navy mb-6">Application Form</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <input type="hidden" value={selectedService || ''} {...register('service_type')} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="applicant_name" label="Full Name" error={errors.applicant_name?.message} {...register('applicant_name')} />
                    <Input id="email" label="Email" type="email" error={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="phone" label="Phone" error={errors.phone?.message} {...register('phone')} />
                    <Input id="business_name" label="Business Name" error={errors.business_name?.message} {...register('business_name')} />
                  </div>
                  <Textarea id="notes" label="Additional Notes" {...register('notes')} />
                  <Button type="submit" size="lg">Submit Application</Button>
                </form>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
