import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, X, Megaphone } from 'lucide-react'
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
  const [editingService, setEditingService] = useState<Service | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false })
    if (data) setServices(data as unknown as Service[])
    setLoading(false)
  }

  const openNewForm = () => {
    setEditingService(null)
    reset({ name: '', description: '', category: '', icon: 'Megaphone', slug: '' })
    setShowForm(true)
  }

  const openEditForm = (svc: Service) => {
    setEditingService(svc)
    reset({
      name: svc.name,
      description: svc.description,
      category: svc.category,
      icon: svc.icon || 'Megaphone',
      slug: svc.slug,
    })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = {
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      category: data.category,
      icon: data.icon || 'Megaphone',
    }

    if (editingService) {
      await supabase.from('services').update(payload).eq('id', editingService.id)
    } else {
      await supabase.from('services').insert({ ...payload, is_active: true })
    }
    reset(); setShowForm(false); setEditingService(null); load()
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
          <Button onClick={openNewForm}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">{editingService ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => { setShowForm(false); setEditingService(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="name" label="Service Name" error={errors.name?.message} {...register('name')} />
                <Input id="category" label="Category" placeholder="e.g. Digital Marketing" error={errors.category?.message} {...register('category')} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="icon" label="Icon Name (lucide-react)" placeholder="Megaphone" {...register('icon')} />
                <Input id="slug" label="Slug" placeholder="Auto-generated if empty" {...register('slug')} />
              </div>
              <Textarea id="description" label="Description" error={errors.description?.message} {...register('description')} />
              <Button type="submit">{editingService ? 'Update Service' : 'Create Service'}</Button>
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
              <div className="flex gap-1">
                <button onClick={() => openEditForm(s)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors" title="Edit"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-500 hover:text-red-700" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            )},
          ]}
          data={services}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
