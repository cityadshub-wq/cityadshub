import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, CheckCircle2 } from 'lucide-react'
import { Button, Card, Input, Textarea, ImageUpload } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getAboutContent, updateAboutContent } from '@/services/about'
import type { AboutContent } from '@/types'

export function AdminOurStoryPage() {
  const [item, setItem] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    subtitle: '', title: '', description: '', image_url: '', image_alt: '', badge_value: '', badge_label: '',
  })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const items = await getAboutContent()
      const story = items.find((i) => i.section === 'story') || null
      setItem(story)
      if (story) {
        setForm({
          subtitle: story.subtitle || '',
          title: story.title || '',
          description: story.description || '',
          image_url: story.image_url || '',
          image_alt: story.image_alt || '',
          badge_value: story.badge_value || '',
          badge_label: story.badge_label || '',
        })
      }
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  async function handleSave() {
    if (!item) return
    setSaving(true)
    try {
      await updateAboutContent(item.id, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      await load()
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-6">Our Story</h1>
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </motion.div>
    )
  }

  if (!item) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <SEO title="Our Story" />
        <h1 className="text-2xl font-bold text-dark-navy mb-6">Our Story</h1>
        <Card>
          <p className="text-sm text-gray-500">No "story" section found in About Content yet. Run the latest database migration to seed it.</p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Our Story" />
      <h1 className="text-2xl font-bold text-dark-navy mb-1">Our Story</h1>
      <p className="text-gray-500 text-sm mb-6">Controls the "Our Story" block in the homepage About section.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <Input label="Badge Text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="How We Started" />
          <Input label="Heading" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Our Story" />
          <Textarea label="Description" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Floating Badge Value" value={form.badge_value} onChange={(e) => setForm({ ...form, badge_value: e.target.value })} placeholder="5+" />
            <Input label="Floating Badge Label" value={form.badge_label} onChange={(e) => setForm({ ...form, badge_label: e.target.value })} placeholder="Years" />
          </div>
        </Card>

        <Card className="space-y-4">
          <ImageUpload
            label={form.image_url ? 'Replace Image (remove, then upload a new one)' : 'Upload Image'}
            bucket="media"
            path="about-story"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url || '' })}
          />
          <Input label="Image Alt Text" value={form.image_alt} onChange={(e) => setForm({ ...form, image_alt: e.target.value })} placeholder="Describe the image for accessibility" />
        </Card>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Button loading={saving} onClick={handleSave}><Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes</Button>
        {saved && <span className="text-sm text-green flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Saved!</span>}
      </div>
    </motion.div>
  )
}
