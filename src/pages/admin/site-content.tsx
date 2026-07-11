import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw } from 'lucide-react'
import { Button, Card, Input, Textarea } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getSiteContent, upsertSiteContent } from '@/services/site-content'
import type { SiteContent } from '@/types'

export function AdminSiteContentPage() {
  const [items, setItems] = useState<SiteContent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await getSiteContent('home')
      setItems(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function handleSave(item: SiteContent, value: string) {
    setSaving(item.id)
    try {
      await upsertSiteContent({ page: 'home', section: item.section, key: item.key, value, type: item.type })
      await load()
    } catch (e) { console.error(e) } finally { setSaving(null) }
  }

  const sections = items.reduce<Record<string, SiteContent[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold text-dark-navy mb-6">Hero Content</h1>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    </motion.div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Hero Content" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Hero Content</h1>
          <p className="text-gray-500 text-sm">Manage homepage hero section text</p>
        </div>
        <Button variant="ghost" onClick={load}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
      </div>

      {Object.entries(sections).map(([section, sectionItems]) => (
        <Card key={section} className="mb-6">
          <h2 className="text-lg font-semibold text-dark-navy mb-4 capitalize">{section.replace('_', ' ')}</h2>
          <div className="space-y-4">
            {sectionItems.map((item) => (
              <EditableField
                key={item.id}
                item={item}
                saving={saving === item.id}
                onSave={handleSave}
              />
            ))}
          </div>
        </Card>
      ))}

      {items.length === 0 && !loading && (
        <Card>
          <p className="text-gray-500 text-center py-8">No content found. Run the database migration to seed default content.</p>
        </Card>
      )}
    </motion.div>
  )
}

function EditableField({ item, saving, onSave }: { item: SiteContent; saving: boolean; onSave: (item: SiteContent, value: string) => void }) {
  const [value, setValue] = useState(item.value)
  const [edited, setEdited] = useState(false)

  useEffect(() => { setValue(item.value); setEdited(false) }, [item.value])

  const isLong = value && value.length > 120
  const label = item.key.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())

  return (
    <div>
      <label className="block text-sm font-medium text-dark-navy mb-1.5">{label}</label>
      {isLong ? (
        <Textarea value={value} onChange={(e) => { setValue(e.target.value); setEdited(true) }} />
      ) : (
        <Input value={value} onChange={(e) => { setValue(e.target.value); setEdited(true) }} />
      )}
      {edited && (
        <div className="flex justify-end mt-2">
          <Button size="sm" loading={saving} onClick={() => onSave(item, value)}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save
          </Button>
        </div>
      )}
    </div>
  )
}
