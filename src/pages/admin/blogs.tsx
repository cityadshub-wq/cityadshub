import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Trash2, Eye, Edit3 } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getBlogPosts, createBlogPost, deleteBlogPost } from '@/services/blogs'
import type { BlogPost } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'

const schema = z.object({
  title: z.string().min(2),
  content: z.string().min(50),
  excerpt: z.string().min(10),
  category_id: z.string().optional(),
  tags: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setPosts(await getBlogPosts()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const onSubmit = async (data: FormData) => {
    if (!user) return
    await createBlogPost({
      title: data.title,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      category_id: data.category_id || undefined,
      author_id: user.id,
      status: 'draft' as const,
      featured_image: undefined,
      scheduled_at: undefined,
      published_at: undefined,
    })
    reset(); setShowForm(false); load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) { await deleteBlogPost(id); load() }
  }

  return (
    <>
      <SEO title="Blog Management" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Blog Posts</h1>
            <p className="text-gray-500 text-sm">{posts.length} posts</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> New Post</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">Create Blog Post</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="title" label="Post Title" error={errors.title?.message} {...register('title')} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="category_id" label="Category" placeholder="e.g. SEO, Marketing" {...register('category_id')} />
                <Input id="tags" label="Tags (comma separated)" placeholder="seo, marketing, tips" {...register('tags')} />
              </div>
              <Textarea id="excerpt" label="Excerpt" error={errors.excerpt?.message} {...register('excerpt')} />
              <div>
                <label className="block text-sm font-medium text-dark-navy mb-1.5">Content</label>
                <textarea
                  {...register('content')}
                  rows={12}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-dark-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                />
                {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
              </div>
              <Button type="submit">Create Post (Draft)</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'title', header: 'Title', render: (p: BlogPost) => (
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500">{p.excerpt?.substring(0, 60)}...</div>
              </div>
            )},
            { key: 'status', header: 'Status', render: (p: BlogPost) => (
              <Badge variant={p.status === 'published' ? 'green' : p.status === 'scheduled' ? 'orange' : 'default'}>{p.status}</Badge>
            )},
            { key: 'created_at', header: 'Date', render: (p: BlogPost) => (
              <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(p.created_at).toLocaleDateString()}</div>
            )},
            { key: 'actions', header: '', render: (p: BlogPost) => (
              <div className="flex gap-1">
                <button className="p-1 text-gray-400 hover:text-primary"><Edit3 className="h-4 w-4" /></button>
                <button className="p-1 text-gray-400 hover:text-green"><Eye className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            )},
          ]}
          data={posts as unknown as Record<string, unknown>[]}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
