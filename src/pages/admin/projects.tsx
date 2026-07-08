import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Calendar, FolderOpen } from 'lucide-react'
import { Button, Card, Badge, Input, Textarea } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getProjects, createProject, updateProject, deleteProject } from '@/services/projects'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Project } from '@/types'

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  client_id: z.string().min(1),
  budget: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const statusColors: Record<string, 'default' | 'primary' | 'green'> = { active: 'primary', completed: 'green', on_hold: 'default' }

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => { load() }, [])

  async function load() {
    try { setProjects(await getProjects()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const onSubmit = async (data: FormData) => {
    await createProject({
      title: data.title,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      description: data.description,
      category: data.category,
      client_id: data.client_id,
      status: 'active',
      start_date: data.start_date || new Date().toISOString(),
      end_date: data.end_date,
      budget: data.budget ? Number(data.budget) : undefined,
    })
    reset(); setShowForm(false); load()
  }

  const handleStatusChange = async (id: string, status: Project['status']) => {
    await updateProject(id, { status }); load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete project?')) { await deleteProject(id); load() }
  }

  return (
    <>
      <SEO title="Manage Projects" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-dark-navy">Manage Projects</h1><p className="text-gray-500 text-sm">{projects.length} projects</p></div>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> New Project</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-dark-navy mb-4">New Project</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="title" label="Project Title" error={errors.title?.message} {...register('title')} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="category" label="Category" error={errors.category?.message} {...register('category')} />
                <Input id="client_id" label="Client ID" error={errors.client_id?.message} {...register('client_id')} />
              </div>
              <Textarea id="description" label="Description" error={errors.description?.message} {...register('description')} />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input id="budget" label="Budget (₹)" type="number" {...register('budget')} />
                <Input id="start_date" label="Start Date" type="date" {...register('start_date')} />
                <Input id="end_date" label="End Date" type="date" {...register('end_date')} />
              </div>
              <Button type="submit">Create Project</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'title', header: 'Project', render: (p: Project) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><FolderOpen className="h-4 w-4 text-primary" /></div>
                <div><div className="font-medium">{p.title}</div><div className="text-xs text-gray-500">{p.category} • {p.client_id.slice(0, 8)}</div></div>
              </div>
            )},
            { key: 'status', header: 'Status', render: (p: Project) => (
              <select value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value as Project['status'])}
                className="text-xs rounded-lg border border-gray-200 px-2 py-1 font-medium">
                <option value="active">active</option><option value="completed">completed</option><option value="on_hold">on hold</option>
              </select>
            )},
            { key: 'budget', header: 'Budget', render: (p: Project) => p.budget ? `₹${p.budget.toLocaleString()}` : '-' },
            { key: 'start_date', header: 'Start', render: (p: Project) => <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(p.start_date).toLocaleDateString()}</div> },
            { key: 'actions', header: '', render: (p: Project) => (
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            )},
          ]}
          data={projects}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
