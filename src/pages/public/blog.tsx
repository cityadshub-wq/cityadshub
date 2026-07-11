import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'

const posts = [
  { title: '10 Proven Ways to Boost Your Local SEO in 2024', excerpt: 'Local SEO is crucial for businesses targeting customers in specific areas. Here are 10 actionable strategies to improve your local search rankings.', category: 'SEO', author: 'Priya Patel', date: '2024-03-15', slug: 'boost-local-seo' },
  { title: 'Meta Ads vs Google Ads: Which is Right for Your Business?', excerpt: 'Confused between Meta Ads and Google Ads? We break down the differences, advantages, and best use cases for each platform.', category: 'Advertising', author: 'Rahul Sharma', date: '2024-03-10', slug: 'meta-ads-vs-google-ads' },
  { title: 'The Complete Guide to GST Registration for Small Businesses', excerpt: 'Everything you need to know about GST registration process, required documents, and compliance for small businesses.', category: 'Business', author: 'Amit Singh', date: '2024-03-05', slug: 'gst-registration-guide' },
  { title: 'Why Your Business Needs a Mobile App in 2024', excerpt: 'Mobile apps are no longer optional. Discover how a custom app can transform your business operations and customer engagement.', category: 'Technology', author: 'Neha Gupta', date: '2024-02-28', slug: 'business-mobile-app' },
  { title: '5 Facebook Ad Strategies That Actually Work', excerpt: 'Stop wasting money on Facebook ads. These 5 proven strategies will help you get the best ROI from your campaigns.', category: 'Marketing', author: 'Priya Patel', date: '2024-02-20', slug: 'facebook-ad-strategies' },
  { title: 'How to Get FSSAI License for Your Food Business', excerpt: 'Step-by-step guide to obtaining FSSAI registration for restaurants, food manufacturers, and food delivery businesses.', category: 'Business', author: 'Amit Singh', date: '2024-02-15', slug: 'fssai-license-guide' },
]

export function BlogPage() {
  return (
    <>
      <SEO title="Blog" description="Read expert articles on digital marketing, SEO, Google Ads, Meta Ads, business registration, and more." />

      <section className="pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-navy mb-6">
              Our <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg text-gray-600">
              Expert insights, tips, and guides to help your business grow online.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full group">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-orange/10 mb-4 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                  <Badge variant="primary" className="mb-3">{post.category}</Badge>
                  <h3 className="text-lg font-semibold text-dark-navy mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:text-primary transition-colors" />
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
