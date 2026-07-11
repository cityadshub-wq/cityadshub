import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Star, Trash2, Edit3, X } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea, ImageUpload } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/services/testimonials'
import type { Testimonial } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  client_name: z.string().min(2),
  company: z.string().optional(),
  content: z.string().min(10),
  rating: z.string().min(1),
  is_active: z.boolean().optional(),
})
type FormData = z.infer<typeof schema>

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await getTestimonials()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openNewForm = () => {
    setEditingItem(null)
    setImageUrl(null)
    reset({ client_name: '', company: '', content: '', rating: '5', is_active: true })
    setShowForm(true)
  }

  const openEditForm = (item: Testimonial) => {
    setEditingItem(item)
    setImageUrl(item.image_url || null)
    reset({
      client_name: item.client_name,
      company: item.company || '',
      content: item.content,
      rating: String(item.rating),
      is_active: item.is_active,
    })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload: Omit<Testimonial, 'id' | 'created_at'> = {
      client_name: data.client_name,
      company: data.company || undefined,
      content: data.content,
      rating: parseInt(data.rating),
      image_url: imageUrl || undefined,
      is_active: data.is_active ?? true,
    }

    if (editingItem) {
      await updateTestimonial(editingItem.id, payload)
    } else {
      await createTestimonial(payload)
    }
    reset(); setShowForm(false); setEditingItem(null); setImageUrl(null); load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete?')) { await deleteTestimonial(id); load() }
  }

  return (
    <>
      <SEO title="Testimonials" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Testimonials</h1>
            <p className="text-gray-500 text-sm">{items.length} testimonials</p>
          </div>
          <Button onClick={openNewForm}><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">{editingItem ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => { setShowForm(false); setEditingItem(null); setImageUrl(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="client_name" label="Client Name" error={errors.client_name?.message} {...register('client_name')} />
                <Input id="company" label="Company" {...register('company')} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="rating" label="Rating (1-5)" type="number" min="1" max="5" error={errors.rating?.message} {...register('rating')} />
                <label className="flex items-center gap-2 pt-6">
                  <input type="checkbox" {...register('is_active')} className="rounded border-gray-300 text-primary focus:ring-primary/20" />
                  <span className="text-sm font-medium text-dark-navy">Active</span>
                </label>
              </div>
              <Textarea id="content" label="Testimonial" error={errors.content?.message} {...register('content')} />
              <ImageUpload bucket="gallery" path="testimonials" label="Client Photo" value={editingItem?.image_url || null} onChange={(url) => setImageUrl(url)} />
              <Button type="submit">{editingItem ? 'Update Testimonial' : 'Save'}</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'client_name', header: 'Client', render: (t: Testimonial) => (
              <div className="flex items-center gap-3">
                {t.image_url ? (
                  <img src={t.image_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{t.client_name.charAt(0)}</div>
                )}
                <div>
                  <div className="font-medium">{t.client_name}</div>
                  <div className="text-xs text-gray-500">{t.company || '—'}</div>
                </div>
              </div>
            )},
            { key: 'content', header: 'Content', render: (t: Testimonial) => (
              <div className="text-sm text-gray-600 max-w-xs truncate">{t.content}</div>
            )},
            { key: 'rating', header: 'Rating', render: (t: Testimonial) => (
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />
                ))}
              </div>
            )},
            { key: 'is_active', header: 'Status', render: (t: Testimonial) => (
              <Badge variant={t.is_active ? 'green' : 'default'}>{t.is_active ? 'Active' : 'Inactive'}</Badge>
            )},
            { key: 'actions', header: '', render: (t: Testimonial) => (
              <div className="flex gap-1">
                <button onClick={() => openEditForm(t)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors" title="Edit"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-500 hover:text-red-700" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            )},
          ]}
          data={items}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
