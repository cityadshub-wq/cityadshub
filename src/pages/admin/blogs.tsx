import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Trash2, Eye, Edit3, X, CheckCircle2, Send } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea, ImageUpload } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/services/blogs'
import type { BlogPost } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'

const schema = z.object({
  title: z.string().min(2),
  content: z.string().min(50),
  excerpt: z.string().min(10),
  category: z.string().optional(),
  tags: z.string().optional(),
  author: z.string().optional(),
  read_time: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  sort_order: z.string().optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduled_at: z.string().optional(),
})
type FormData = z.infer<typeof schema> & { featured_image?: string }

export function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [viewingPost, setViewingPost] = useState<BlogPost | null>(null)
  const [saved, setSaved] = useState(false)
  const { user } = useAuth()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft' },
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setPosts(await getBlogPosts()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openNewForm = () => {
    setEditingPost(null)
    reset({ title: '', content: '', excerpt: '', category: '', tags: '', author: '', read_time: '', seo_title: '', seo_description: '', sort_order: '0', is_featured: false, status: 'draft', scheduled_at: '' })
    setShowForm(true)
  }

  const openEditForm = (post: BlogPost) => {
    setEditingPost(post)
    reset({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category || '',
      tags: post.tags?.join(', ') || '',
      author: post.author || '',
      read_time: post.read_time ? String(post.read_time) : '',
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      sort_order: String(post.sort_order || 0),
      is_featured: post.is_featured || false,
      status: post.status,
      scheduled_at: post.scheduled_at ? post.scheduled_at.slice(0, 16) : '',
    })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    if (!user) return
    const payload: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author_id'> = {
      title: data.title,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      category: data.category || undefined,
      author: data.author || undefined,
      read_time: data.read_time ? parseInt(data.read_time) : undefined,
      seo_title: data.seo_title || undefined,
      seo_description: data.seo_description || undefined,
      sort_order: data.sort_order ? parseInt(data.sort_order) : 0,
      is_featured: data.is_featured || false,
      status: data.status,
      scheduled_at: data.status === 'scheduled' && data.scheduled_at ? new Date(data.scheduled_at).toISOString() : undefined,
      published_at: data.status === 'published' ? new Date().toISOString() : undefined,
    }

    if (editingPost) {
      await updateBlogPost(editingPost.id, payload)
    } else {
      await createBlogPost({ ...payload, author_id: user.id })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    reset(); setShowForm(false); setEditingPost(null); load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) { await deleteBlogPost(id); load() }
  }

  const handlePublishNow = async (post: BlogPost) => {
    await updateBlogPost(post.id, { status: 'published', published_at: new Date().toISOString() })
    load()
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
          <Button onClick={openNewForm}><Plus className="mr-2 h-4 w-4" /> New Post</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">{editingPost ? 'Edit Post' : 'Create Blog Post'}</h2>
              <button onClick={() => { setShowForm(false); setEditingPost(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="title" label="Post Title" error={errors.title?.message} {...register('title')} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="category" label="Category" placeholder="e.g. SEO, Marketing" {...register('category')} />
                <Input id="tags" label="Tags (comma separated)" placeholder="seo, marketing, tips" {...register('tags')} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input id="author" label="Author" placeholder="e.g. Priya Patel" {...register('author')} />
                <Input id="read_time" label="Read Time (minutes)" type="number" {...register('read_time')} />
                <Input id="sort_order" label="Display Order" type="number" {...register('sort_order')} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-navy mb-1.5">Status</label>
                  <select {...register('status')} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-dark-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                  {watch('status') !== 'published' && (
                    <p className="text-xs text-orange mt-1">Only Published posts are visible on the website.</p>
                  )}
                </div>
                {watch('status') === 'scheduled' && (
                  <Input id="scheduled_at" label="Schedule Date" type="datetime-local" {...register('scheduled_at')} />
                )}
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input type="checkbox" {...register('is_featured')} className="rounded border-gray-300" />
                  <span className="text-sm font-medium text-dark-navy">Featured</span>
                </label>
              </div>
              <ImageUpload
                bucket="blog-images"
                path="featured"
                label="Featured Image"
                value={editingPost?.featured_image || null}
                onChange={(url) => setValue('featured_image', url || undefined)}
              />
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
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="seo_title" label="SEO Title" placeholder="Leave empty to use post title" {...register('seo_title')} />
                <Input id="seo_description" label="SEO Description" placeholder="Leave empty to use excerpt" {...register('seo_description')} />
              </div>
              <div className="flex items-center gap-4">
                <Button type="submit">{editingPost ? 'Update Post' : 'Create Post'}</Button>
                {saved && <span className="text-sm text-green flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Saved!</span>}
              </div>
            </form>
          </Card>
        )}

        {viewingPost && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewingPost(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <Badge variant={viewingPost.status === 'published' ? 'green' : 'default'}>{viewingPost.status}</Badge>
                <button onClick={() => setViewingPost(null)} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-5 w-5" /></button>
              </div>
              {viewingPost.featured_image && (
                <img src={viewingPost.featured_image} alt={viewingPost.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <h2 className="text-xl font-bold text-dark-navy mb-2">{viewingPost.title}</h2>
              <div className="text-xs text-gray-400 mb-4">
                {viewingPost.tags?.join(', ')} &middot; {new Date(viewingPost.created_at).toLocaleDateString()}
              </div>
              <p className="text-sm text-gray-500 italic mb-4">{viewingPost.excerpt}</p>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-dark-navy">{viewingPost.content}</div>
            </div>
          </div>
        )}

        <DataTable
          columns={[
            { key: 'title', header: 'Title', render: (p: BlogPost) => (
              <div className="flex items-center gap-3">
                {p.featured_image && (
                  <img src={p.featured_image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                )}
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.excerpt?.substring(0, 60)}...</div>
                </div>
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
                {p.status !== 'published' && (
                  <button onClick={() => handlePublishNow(p)} className="p-1.5 text-gray-400 hover:text-green rounded-lg hover:bg-green/5 transition-colors" title="Publish now"><Send className="h-4 w-4" /></button>
                )}
                <button onClick={() => openEditForm(p)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors" title="Edit"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => setViewingPost(p)} className="p-1.5 text-gray-400 hover:text-green rounded-lg hover:bg-green/5 transition-colors" title="Preview"><Eye className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red/5 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            )},
          ]}
          data={posts}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
