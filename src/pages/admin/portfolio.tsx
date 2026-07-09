import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, ExternalLink, Calendar, Trash2, Edit3, X, CheckCircle2, Star } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea, ImageUpload } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem } from '@/services/portfolio'
import type { PortfolioItem } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  client_name: z.string().optional(),
  results: z.string().optional(),
  completion_date: z.string().optional(),
  is_featured: z.boolean().optional(),
})
type FormData = z.infer<typeof schema>

export function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await getPortfolioItems()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openNewForm = () => {
    setEditingItem(null)
    setUploadedImages([])
    reset({ title: '', description: '', category: '', client_name: '', results: '', completion_date: '', is_featured: false })
    setShowForm(true)
  }

  const openEditForm = (item: PortfolioItem) => {
    setEditingItem(item)
    setUploadedImages(item.images || [])
    reset({
      title: item.title,
      description: item.description,
      category: item.category,
      client_name: item.client_name || '',
      results: item.results || '',
      completion_date: item.completion_date ? item.completion_date.slice(0, 10) : '',
      is_featured: item.is_featured,
    })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload: any = {
      ...data,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      images: uploadedImages,
      is_featured: data.is_featured || false,
      completion_date: data.completion_date || undefined,
    }

    if (editingItem) {
      await updatePortfolioItem(editingItem.id, payload)
    } else {
      await createPortfolioItem(payload as any)
    }
    reset(); setShowForm(false); setEditingItem(null); setUploadedImages([]); load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this portfolio item?')) {
      await deletePortfolioItem(id); load()
    }
  }

  const addImage = (url: string | null) => {
    if (url) setUploadedImages(prev => [...prev, url])
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <>
      <SEO title="Portfolio Management" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Portfolio</h1>
            <p className="text-gray-500 text-sm">{items.length} projects</p>
          </div>
          <Button onClick={openNewForm}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">{editingItem ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); setUploadedImages([]) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="title" label="Project Title" error={errors.title?.message} {...register('title')} />
                <Input id="category" label="Category" placeholder="e.g. Web Development" error={errors.category?.message} {...register('category')} />
              </div>
              <Textarea id="description" label="Description" error={errors.description?.message} {...register('description')} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="client_name" label="Client Name" {...register('client_name')} />
                <Input id="results" label="Results" placeholder="e.g. 300% increase" {...register('results')} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="completion_date" label="Completion Date" type="date" {...register('completion_date')} />
                <label className="flex items-center gap-2 pt-6">
                  <input type="checkbox" {...register('is_featured')} className="rounded border-gray-300 text-primary focus:ring-primary/20" />
                  <span className="text-sm font-medium text-dark-navy">Featured project</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-navy mb-1.5">Project Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {uploadedImages.map((url, i) => (
                    <div key={i} className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 p-0.5 bg-white/90 rounded-full shadow">
                        <X className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
                <ImageUpload bucket="portfolio" path="projects" onChange={(url) => url && addImage(url)} />
              </div>
              <Button type="submit">{editingItem ? 'Update Project' : 'Create Project'}</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'title', header: 'Project', render: (item: PortfolioItem) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                  {item.images?.[0] ? <img src={item.images[0]} alt="" className="h-full w-full object-cover" /> : <ExternalLink className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <div className="font-medium flex items-center gap-1">
                    {item.title}
                    {item.is_featured && <Star className="h-3 w-3 fill-orange text-orange" />}
                  </div>
                  <div className="text-xs text-gray-500">{item.client_name || '—'}</div>
                </div>
              </div>
            )},
            { key: 'category', header: 'Category', render: (item: PortfolioItem) => <Badge variant="primary">{item.category}</Badge> },
            { key: 'results', header: 'Results' },
            { key: 'created_at', header: 'Date', render: (item: PortfolioItem) => (
              <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(item.created_at).toLocaleDateString()}</div>
            )},
            { key: 'actions', header: '', render: (item: PortfolioItem) => (
              <div className="flex gap-1">
                <button onClick={() => openEditForm(item)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors" title="Edit"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:text-red-700" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            )},
          ]}
          data={items as unknown as Record<string, unknown>[]}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
