import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'
import { getTestimonials } from '@/services/testimonials'
import type { Testimonial } from '@/types'

const fallbackTestimonials = [
  { id: '1', client_name: 'Rajesh Mehta', company: 'Mumbai Spice Restaurant', content: 'City Ads Hub transformed our online presence. Our orders have tripled since we started working with them. The team is professional, responsive, and truly cares about results.', rating: 5, image_url: '' },
  { id: '2', client_name: 'Anita Desai', company: 'UrbanFIT Gym', content: 'The website they built for us is incredible. Members love the online booking system, and our membership has grown significantly. Highly recommended!', rating: 5, image_url: '' },
  { id: '3', client_name: 'Vikram Patel', company: 'GreenLeaf Organics', content: 'From branding to digital marketing, City Ads Hub handled everything perfectly. Our brand now has a consistent, professional look across all platforms.', rating: 5, image_url: '' },
  { id: '4', client_name: 'Priya Sharma', company: 'Surya Dental Clinic', content: 'Our Google Ads campaign has been a game-changer. Patient appointments increased by 200% in just 3 months. The ROI has been outstanding.', rating: 5, image_url: '' },
] as Testimonial[]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

export function TestimonialsSection() {
  const { data, isLoading, isError } = useRealtimeQuery('testimonials', ['testimonials'], getTestimonials)
  const [current, setCurrent] = useState(0)

  const raw = data ?? []
  const active = raw.filter((t) => t.is_active !== false)
  const testimonials = !isError && active.length > 0 ? active : fallbackTestimonials
  const loading = isLoading

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length, next])

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </section>
    )
  }

  const t = testimonials[current]
  if (!t) return null

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="text-lg text-gray-600">
            Don't take our word for it. Here's what our clients have to say about working with us.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="text-center py-12 px-8 md:px-16">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-orange/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">
                  {(t.client_name || 'C')[0]}
                </span>
              </div>
              <Quote className="h-10 w-10 text-primary/10 mx-auto mb-6" />
              <p className="text-lg text-gray-600 mb-8 leading-relaxed italic">
                "{t.content}"
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange text-orange" />
                ))}
              </div>
              <div>
                <div className="text-lg font-semibold text-dark-navy">{t.client_name}</div>
                {t.company && (
                  <div className="text-sm text-gray-500">{t.company}</div>
                )}
              </div>
            </Card>
          </motion.div>

          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-primary hover:text-primary transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      i === current ? 'w-8 bg-primary' : 'w-2 bg-gray-300'
                    )}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-primary hover:text-primary transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
