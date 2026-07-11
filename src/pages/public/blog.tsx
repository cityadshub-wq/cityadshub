import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, ArrowRight, Loader2 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getBlogPosts } from '@/services/blogs'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'

export function BlogPage() {
  const { data: fetchedPosts = [], isLoading } = useRealtimeQuery('blog_posts', ['blog_posts'], getBlogPosts)

  const posts = fetchedPosts
    .filter((p) => p.status === 'published')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

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

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : posts.length === 0 ? (
            <Card><p className="text-center py-12 text-gray-500">No blog posts published yet.</p></Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <Card className="h-full group overflow-hidden hover:-translate-y-1 transition-all duration-300">
                      <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-orange/10 mb-4 flex items-center justify-center overflow-hidden">
                        {post.featured_image ? (
                          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span className="text-4xl">&#128221;</span>
                        )}
                      </div>
                      <Badge variant="primary" className="mb-3">{post.category || 'General'}</Badge>
                      <h3 className="text-lg font-semibold text-dark-navy mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author || 'City Ads Hub'}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
                          {!!post.read_time && (
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.read_time} min</span>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:text-primary transition-colors" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
