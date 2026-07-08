import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Star, Trash2 } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getTestimonials, createTestimonial, deleteTestimonial } from '@/services/testimonials'
import type { Testimonial } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  client_name: z.string().min(2),
  company: z.string().optional(),
  content: z.string().min(10),
  rating: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await getTestimonials()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const onSubmit = async (data: FormData) => {
    await createTestimonial({
      client_name: data.client_name,
      company: data.company || undefined,
      content: data.content,
      rating: parseInt(data.rating),
      image_url: undefined,
      is_active: true,
    })
    reset(); setShowForm(false); load()
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
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">New Testimonial</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="client_name" label="Client Name" error={errors.client_name?.message} {...register('client_name')} />
                <Input id="company" label="Company" {...register('company')} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="rating" label="Rating (1-5)" type="number" min="1" max="5" error={errors.rating?.message} {...register('rating')} />
              </div>
              <Textarea id="content" label="Testimonial" error={errors.content?.message} {...register('content')} />
              <Button type="submit">Save</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'client_name', header: 'Client', render: (t: Testimonial) => (
              <div>
                <div className="font-medium">{t.client_name}</div>
                <div className="text-xs text-gray-500">{t.company || '—'}</div>
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
            { key: 'actions', header: '', render: (t: Testimonial) => (
              <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            )},
          ]}
          data={items as unknown as Record<string, unknown>[]}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
