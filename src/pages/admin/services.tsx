import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Megaphone } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Service } from '@/types'

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  icon: z.string().optional(),
  slug: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false })
    if (data) setServices(data as unknown as Service[])
    setLoading(false)
  }

  const onSubmit = async (data: FormData) => {
    await supabase.from('services').insert({
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      category: data.category,
      icon: data.icon || 'Megaphone',
      is_active: true,
    })
    reset(); setShowForm(false); load()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('services').update({ is_active: !current }).eq('id', id)
    load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this service?')) { await supabase.from('services').delete().eq('id', id); load() }
  }

  return (
    <>
      <SEO title="Manage Services" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-dark-navy">Manage Services</h1><p className="text-gray-500 text-sm">{services.length} services</p></div>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">New Service</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="name" label="Service Name" error={errors.name?.message} {...register('name')} />
                <Input id="category" label="Category" placeholder="e.g. Digital Marketing" error={errors.category?.message} {...register('category')} />
              </div>
              <Input id="icon" label="Icon Name (lucide-react)" placeholder="Megaphone" {...register('icon')} />
              <Textarea id="description" label="Description" error={errors.description?.message} {...register('description')} />
              <Button type="submit">Create Service</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'name', header: 'Service', render: (s: Service) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Megaphone className="h-4 w-4 text-primary" /></div>
                <div><div className="font-medium">{s.name}</div><div className="text-xs text-gray-500">{s.slug}</div></div>
              </div>
            )},
            { key: 'category', header: 'Category', render: (s: Service) => <Badge variant="primary">{s.category}</Badge> },
            { key: 'is_active', header: 'Status', render: (s: Service) => (
              <button onClick={() => toggleActive(s.id, s.is_active)} className={`text-xs px-2 py-1 rounded-lg font-medium ${s.is_active ? 'bg-green/10 text-green' : 'bg-gray-100 text-gray-500'}`}>
                {s.is_active ? 'Active' : 'Inactive'}
              </button>
            )},
            { key: 'actions', header: '', render: (s: Service) => (
              <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            )},
          ]}
          data={services}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
