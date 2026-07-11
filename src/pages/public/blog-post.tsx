import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Clock, ArrowLeft, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getBlogPost } from '@/services/blogs'
import { useRealtimeQuery } from '@/hooks/use-realtime-query'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useRealtimeQuery(
    'blog_posts',
    ['blog_posts', slug],
    () => getBlogPost(slug!),
  )

  if (isLoading) {
    return (
      <section className="pt-16 pb-20 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </section>
    )
  }

  if (isError || !post) {
    return (
      <section className="pt-16 pb-20 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <SEO title="Post Not Found" />
        <h1 className="text-2xl font-bold text-dark-navy">Post not found</h1>
        <Link to="/blog" className="text-primary font-medium flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </section>
    )
  }

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
      />

      <article className="pt-16 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary mb-6 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Badge variant="primary">{post.category || 'General'}</Badge>
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {new Date(post.created_at).toLocaleDateString()}
              </span>
              {!!post.read_time && (
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {post.read_time} min read
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-dark-navy mb-4">{post.title}</h1>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <User className="h-4 w-4" /> {post.author || 'City Ads Hub'}
            </div>

            {post.featured_image && (
              <img src={post.featured_image} alt={post.title} className="w-full h-64 sm:h-96 object-cover rounded-2xl mb-8" />
            )}

            <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </motion.div>
        </div>
      </article>
    </>
  )
}
