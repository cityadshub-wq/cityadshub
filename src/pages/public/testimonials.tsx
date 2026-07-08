import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const testimonials = [
  { name: 'Rajesh Mehta', company: 'Mumbai Spice Restaurant', content: 'City Ads Hub transformed our online presence. Our orders have tripled since we started working with them. The team is professional, responsive, and truly cares about results.', rating: 5 },
  { name: 'Anita Desai', company: 'UrbanFIT Gym', content: 'The website they built for us is incredible. Members love the online booking system, and our membership has grown significantly. Highly recommended!', rating: 5 },
  { name: 'Vikram Patel', company: 'GreenLeaf Organics', content: 'From branding to digital marketing, City Ads Hub handled everything perfectly. Our brand now has a consistent, professional look across all platforms.', rating: 5 },
  { name: 'Priya Sharma', company: 'Surya Dental Clinic', content: 'Our Google Ads campaign has been a game-changer. Patient appointments increased by 200% in just 3 months. The ROI has been outstanding.', rating: 5 },
  { name: 'Arun Kumar', company: 'QuickDeliver Logistics', content: 'The mobile app they developed streamlined our entire delivery process. Real-time tracking and automated dispatch have saved us countless hours.', rating: 5 },
  { name: 'Sunita Reddy', company: 'EcoBuild Constructions', content: 'Professional, creative, and results-driven. City Ads Hub delivered our website on time and exceeded our expectations. The client portal is a huge plus.', rating: 5 },
]

export function TestimonialsPage() {
  return (
    <>
      <SEO title="Testimonials" description="Hear from our happy clients. Read testimonials from businesses we've helped grow with our digital marketing services." />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              What Our <span className="text-primary">Clients Say</span>
            </h1>
            <p className="text-lg text-gray-600">
              Don't take our word for it. Here's what our clients have to say about working with us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-gray-600 mb-6 leading-relaxed">{item.content}</p>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-orange text-orange" />
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-dark-navy">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.company}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
