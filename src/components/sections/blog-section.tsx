import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { getBlogPosts } from '@/services/blogs'
import type { BlogPost } from '@/types'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6 },
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogPosts().then((data) => {
      const published = data.filter((p) => p.status === 'published')
      setPosts(published.slice(0, 6))
    }).catch(() => {
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  type DisplayPost = BlogPost & { category?: string; author?: string; date?: string }

  const fallbackPosts: DisplayPost[] = [
    { id: '1', title: '10 Proven Ways to Boost Your Local SEO in 2024', excerpt: 'Local SEO is crucial for businesses targeting customers in specific areas. Here are 10 actionable strategies to improve your local search rankings.', content: '', slug: 'boost-local-seo', status: 'published', author_id: '', created_at: '2024-03-15', updated_at: '2024-03-15', category: 'SEO', author: 'Priya Patel', date: '2024-03-15' },
    { id: '2', title: 'Meta Ads vs Google Ads: Which is Right for Your Business?', excerpt: 'Confused between Meta Ads and Google Ads? We break down the differences, advantages, and best use cases for each platform.', content: '', slug: 'meta-ads-vs-google-ads', status: 'published', author_id: '', created_at: '2024-03-10', updated_at: '2024-03-10', category: 'Advertising', author: 'Rahul Sharma', date: '2024-03-10' },
    { id: '3', title: 'The Complete Guide to GST Registration for Small Businesses', excerpt: 'Everything you need to know about GST registration process, required documents, and compliance for small businesses.', content: '', slug: 'gst-registration-guide', status: 'published', author_id: '', created_at: '2024-03-05', updated_at: '2024-03-05', category: 'Business', author: 'Amit Singh', date: '2024-03-05' },
    { id: '4', title: 'Why Your Business Needs a Mobile App in 2024', excerpt: 'Mobile apps are no longer optional. Discover how a custom app can transform your business operations and customer engagement.', content: '', slug: 'business-mobile-app', status: 'published', author_id: '', created_at: '2024-02-28', updated_at: '2024-02-28', category: 'Technology', author: 'Neha Gupta', date: '2024-02-28' },
    { id: '5', title: '5 Facebook Ad Strategies That Actually Work', excerpt: 'Stop wasting money on Facebook ads. These 5 proven strategies will help you get the best ROI from your campaigns.', content: '', slug: 'facebook-ad-strategies', status: 'published', author_id: '', created_at: '2024-02-20', updated_at: '2024-02-20', category: 'Marketing', author: 'Priya Patel', date: '2024-02-20' },
    { id: '6', title: 'How to Get FSSAI License for Your Food Business', excerpt: 'Step-by-step guide to obtaining FSSAI registration for restaurants, food manufacturers, and food delivery businesses.', content: '', slug: 'fssai-license-guide', status: 'published', author_id: '', created_at: '2024-02-15', updated_at: '2024-02-15', category: 'Business', author: 'Amit Singh', date: '2024-02-15' },
  ]
  const displayPosts: DisplayPost[] = posts.length > 0 ? posts : fallbackPosts

  return (
    <section id="blog" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Our Blog
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-6">
            Latest <span className="text-primary">Insights</span>
          </h2>
          <p className="text-lg text-gray-600">
            Expert insights, tips, and guides to help your business grow online.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.slug || post.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full group overflow-hidden hover:-translate-y-1 transition-all duration-300">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-orange/10 mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange/5 group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-5xl opacity-30 group-hover:opacity-50 transition-opacity group-hover:scale-110">&#9998;</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary" className="text-xs">{post.category || 'General'}</Badge>
                    {post.date && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-dark-navy mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {post.excerpt || post.content || ''}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author || 'City Ads Hub'}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
