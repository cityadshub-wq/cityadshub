import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, X, Share2 } from 'lucide-react'
import { Button, Card, Badge, Input } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '@/services/social-links'
import { getLucideIcon } from '@/lib/icon-map'
import type { SocialLink } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  platform: z.string().min(2),
  url: z.string().min(1),
  icon: z.string().optional(),
  sort_order: z.string().optional(),
  is_active: z.boolean().optional(),
})
type FormData = z.infer<typeof schema>

export function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SocialLink | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setLinks(await getSocialLinks()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openNewForm = () => {
    setEditing(null)
    reset({ platform: '', url: '', icon: 'Globe', sort_order: '0', is_active: true })
    setShowForm(true)
  }

  const openEditForm = (link: SocialLink) => {
    setEditing(link)
    reset({
      platform: link.platform,
      url: link.url,
      icon: link.icon || 'Globe',
      sort_order: String(link.sort_order || 0),
      is_active: link.is_active,
    })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    const payload = {
      platform: data.platform,
      url: data.url,
      icon: data.icon || 'Globe',
      sort_order: data.sort_order ? parseInt(data.sort_order) : 0,
      is_active: data.is_active ?? true,
    }
    if (editing) {
      await updateSocialLink(editing.id, payload)
    } else {
      await createSocialLink(payload)
    }
    reset(); setShowForm(false); setEditing(null); load()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this social link?')) { await deleteSocialLink(id); load() }
  }

  return (
    <>
      <SEO title="Social Links" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Social Links</h1>
            <p className="text-gray-500 text-sm">{links.length} links &middot; shown in the site footer</p>
          </div>
          <Button onClick={openNewForm}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">{editing ? 'Edit Social Link' : 'New Social Link'}</h2>
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="platform" label="Platform" placeholder="facebook, instagram, x..." error={errors.platform?.message} {...register('platform')} />
                <Input id="url" label="URL" placeholder="https://..." error={errors.url?.message} {...register('url')} />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Input id="icon" label="Icon Name (lucide-react)" placeholder="Globe" {...register('icon')} />
                <Input id="sort_order" label="Display Order" type="number" {...register('sort_order')} />
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input type="checkbox" {...register('is_active')} className="rounded border-gray-300" />
                  <span className="text-sm font-medium text-dark-navy">Active</span>
                </label>
              </div>
              <Button type="submit">{editing ? 'Update Link' : 'Create Link'}</Button>
            </form>
          </Card>
        )}

        <DataTable
          columns={[
            { key: 'platform', header: 'Platform', render: (l: SocialLink) => {
              const Icon = getLucideIcon(l.icon)
              return (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="h-4 w-4 text-primary" /></div>
                  <span className="font-medium capitalize">{l.platform}</span>
                </div>
              )
            }},
            { key: 'url', header: 'URL', render: (l: SocialLink) => <span className="text-sm text-gray-500 truncate block max-w-xs">{l.url}</span> },
            { key: 'is_active', header: 'Status', render: (l: SocialLink) => (
              <Badge variant={l.is_active ? 'green' : 'default'}>{l.is_active ? 'Active' : 'Inactive'}</Badge>
            )},
            { key: 'actions', header: '', render: (l: SocialLink) => (
              <div className="flex gap-1">
                <button onClick={() => openEditForm(l)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors" title="Edit"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(l.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red/5 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            )},
          ]}
          data={links}
          loading={loading}
        />
        {links.length === 0 && !loading && (
          <Card className="mt-4">
            <p className="text-center py-8 text-gray-500 flex flex-col items-center gap-2">
              <Share2 className="h-6 w-6 text-gray-300" />
              No social links yet. Add one above.
            </p>
          </Card>
        )}
      </motion.div>
    </>
  )
}
