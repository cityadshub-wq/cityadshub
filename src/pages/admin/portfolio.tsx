import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, ExternalLink, Calendar, Trash2 } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getPortfolioItems, createPortfolioItem, deletePortfolioItem } from '@/services/portfolio'
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
})

type FormData = z.infer<typeof schema>

export function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setItems(await getPortfolioItems()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const onSubmit = async (data: FormData) => {
    await createPortfolioItem({
      ...data,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      images: [],
      is_featured: false,
    } as any)
    reset(); setShowForm(false); load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this portfolio item?')) {
      await deletePortfolioItem(id); load()
    }
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
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">New Project</h2>
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
              <Button type="submit">Create Project</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'title', header: 'Project', render: (item: PortfolioItem) => (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
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
              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            )},
          ]}
          data={items as unknown as Record<string, unknown>[]}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
