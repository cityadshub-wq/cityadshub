import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, GripVertical, X, CheckCircle2, AlertCircle, Megaphone, Search, Globe, Smartphone, Camera, BarChart3, Building2, Target, TrendingUp, Zap, Users, Palette, ShoppingBag } from 'lucide-react'
import { Button, Card, Badge, Input, ImageUpload } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { getHeroCards, createHeroCard, updateHeroCard, deleteHeroCard, reorderHeroCards } from '@/services/hero-cards'
import type { HeroCard } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const iconOptions = [
  { name: 'Megaphone', icon: Megaphone },
  { name: 'Search', icon: Search },
  { name: 'Globe', icon: Globe },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Camera', icon: Camera },
  { name: 'BarChart3', icon: BarChart3 },
  { name: 'Building2', icon: Building2 },
  { name: 'Target', icon: Target },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Zap', icon: Zap },
  { name: 'Users', icon: Users },
  { name: 'Palette', icon: Palette },
  { name: 'ShoppingBag', icon: ShoppingBag },
]

const cardColors = [
  { value: '#FF6B00', label: 'Orange' },
  { value: '#0066FF', label: 'Blue' },
  { value: '#22C55E', label: 'Green' },
  { value: '#EF4444', label: 'Red' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#14B8A6', label: 'Teal' },
  { value: '#111111', label: 'Black' },
]

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  icon_name: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  image_url: z.string().optional(),
  link: z.string().optional(),
})
type FormData = z.infer<typeof schema>

function HeroCardPreview({ cards, loading }: { cards: HeroCard[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  const activeCards = cards.filter(c => c.is_active)

  if (activeCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
        No active hero cards. Add and publish cards to see them here.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {activeCards.map((card, i) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="bg-white/80 rounded-xl h-24 flex items-center border border-gray-100 shadow-sm overflow-hidden">
            {card.image_url ? (
              <img src={card.image_url} alt={card.title} className="h-full w-full object-cover" />
            ) : (
              <div className="text-center w-full p-4">
                {(() => {
                  const found = iconOptions.find(o => o.name === card.icon_name)
                  const Icon = found?.icon || Megaphone
                  return <Icon className="h-6 w-6 mx-auto mb-1" style={{ color: card.color }} />
                })()}
                <span className="text-xs font-medium block text-dark-navy">{card.title}</span>
                {card.subtitle && (
                  <span className="text-[10px] text-gray-400 block mt-0.5">{card.subtitle}</span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function AdminHeroCardsPage() {
  const [cards, setCards] = useState<HeroCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<HeroCard | null>(null)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('Megaphone')
  const [selectedColor, setSelectedColor] = useState('#FF6B00')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [undoCard, setUndoCard] = useState<{ id: string; data: any } | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => { load() }, [])

  async function load() {
    try { setCards(await getHeroCards()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const openNewForm = () => {
    setEditingCard(null)
    setSelectedIcon('Megaphone')
    setSelectedColor('#FF6B00')
    setImageUrl(null)
    reset({ title: '', subtitle: '', icon_name: 'Megaphone', color: '#FF6B00', image_url: '', link: '' })
    setShowForm(true)
  }

  const openEditForm = (card: HeroCard) => {
    setEditingCard(card)
    setSelectedIcon(card.icon_name)
    setSelectedColor(card.color)
    setImageUrl(card.image_url || null)
    reset({
      title: card.title,
      subtitle: card.subtitle || '',
      icon_name: card.icon_name,
      color: card.color,
      image_url: card.image_url || '',
      link: card.link || '',
    })
    setShowForm(true)
  }

  const onSubmit = async (data: FormData) => {
    setSaveError('')
    try {
      if (editingCard) {
        await updateHeroCard(editingCard.id, {
          title: data.title,
          subtitle: data.subtitle || undefined,
          icon_name: data.icon_name,
          color: data.color,
          image_url: imageUrl || undefined,
          link: data.link || undefined,
        })
      } else {
        await createHeroCard({
          title: data.title,
          subtitle: data.subtitle || undefined,
          icon_name: data.icon_name,
          color: data.color,
          image_url: imageUrl || undefined,
          link: data.link || undefined,
          sort_order: cards.length,
          is_active: true,
        })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      reset(); setShowForm(false); setEditingCard(null); setImageUrl(null); load()
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save')
    }
  }

  const handleToggle = async (card: HeroCard) => {
    await updateHeroCard(card.id, { is_active: !card.is_active })
    load()
  }

  const handleDelete = async (id: string) => {
    const card = cards.find(c => c.id === id)
    if (!card) return
    setUndoCard({ id, data: card })
    await deleteHeroCard(id)
    load()
    setTimeout(() => setUndoCard(null), 5000)
  }

  const handleUndo = async () => {
    if (!undoCard) return
    await createHeroCard(undoCard.data)
    setUndoCard(null)
    load()
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const newCards = [...cards]
    ;[newCards[index - 1], newCards[index]] = [newCards[index], newCards[index - 1]]
    setCards(newCards)
    await reorderHeroCards(newCards.map(c => c.id))
  }

  const handleMoveDown = async (index: number) => {
    if (index === cards.length - 1) return
    const newCards = [...cards]
    ;[newCards[index], newCards[index + 1]] = [newCards[index + 1], newCards[index]]
    setCards(newCards)
    await reorderHeroCards(newCards.map(c => c.id))
  }

  return (
    <>
      <SEO title="Hero Cards" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Homepage Hero Cards</h1>
            <p className="text-gray-500 text-sm">{cards.filter(c => c.is_active).length} active &middot; {cards.length} total</p>
          </div>
          <Button onClick={openNewForm} disabled={cards.length >= 6}><Plus className="mr-2 h-4 w-4" /> Add Card</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">{editingCard ? 'Edit Card' : 'New Hero Card'}</h2>
              <button onClick={() => { setShowForm(false); setEditingCard(null); setImageUrl(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="title" label="Card Title" error={errors.title?.message} {...register('title')} />
                <Input id="subtitle" label="Subtitle" {...register('subtitle')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-navy mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(opt => {
                    const Icon = opt.icon
                    const isSelected = selectedIcon === opt.name
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => {
                          setSelectedIcon(opt.name)
                          setValue('icon_name', opt.name)
                        }}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                          isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {opt.name}
                      </button>
                    )
                  })}
                </div>
                <input type="hidden" {...register('icon_name')} value={selectedIcon} />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-navy mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {cardColors.map(c => {
                    const isSelected = selectedColor === c.value
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          setSelectedColor(c.value)
                          reset({ ...register('color'), color: c.value })
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                          isSelected ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
                        }`}
                      >
                        <div className="h-4 w-4 rounded-full border border-white/50" style={{ backgroundColor: c.value }} />
                        {c.label}
                      </button>
                    )
                  })}
                </div>
                <input type="hidden" {...register('color')} value={selectedColor} />
              </div>

              <ImageUpload
                bucket="gallery"
                path="hero-cards"
                label="Card Image (optional)"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
              />

              <Input id="link" label="Link (optional)" placeholder="/services" {...register('link')} />

              {saveError && (
                <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {saveError}
                </div>
              )}

              <div className="flex items-center gap-4">
                <Button type="submit">{editingCard ? 'Update Card' : 'Add Card'}</Button>
                {saved && <span className="text-sm text-green flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Saved!</span>}
              </div>
            </form>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                <Megaphone className="h-10 w-10 mx-auto mb-2 text-gray-200" />
                <p className="text-sm">No hero cards yet. Click "Add Card" to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cards.map((card, index) => (
                  <Card key={card.id} className="flex items-center gap-3 p-4">
                    <div className="text-gray-300 cursor-grab">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50" style={card.image_url ? {} : { backgroundColor: `${card.color}15` }}>
                      {card.image_url ? (
                        <img src={card.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (() => {
                        const found = iconOptions.find(o => o.name === card.icon_name)
                        const Icon = found?.icon || Megaphone
                        return <Icon className="h-5 w-5" style={{ color: card.color }} />
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-dark-navy">{card.title}</div>
                      <div className="text-xs text-gray-400 truncate">{card.subtitle || 'No subtitle'}</div>
                    </div>
                    <Badge variant={card.is_active ? 'green' : 'default'}>{card.is_active ? 'Active' : 'Inactive'}</Badge>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-dark-navy disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleMoveDown(index)} disabled={index === cards.length - 1} className="p-1.5 text-gray-400 hover:text-dark-navy disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDown className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => handleToggle(card)} className="p-1.5 text-gray-400 hover:text-green transition-colors" title={card.is_active ? 'Deactivate' : 'Activate'}>
                      {card.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => openEditForm(card)} className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(card.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <Card className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-green" />
                <h3 className="text-sm font-semibold text-dark-navy">Live Preview</h3>
                <span className="text-xs text-gray-400 ml-auto">As seen on homepage</span>
              </div>
              <div className="bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 rounded-2xl p-6">
                <div className="relative">
                  <div className="w-full rounded-xl bg-gradient-to-br from-primary/[0.08] to-orange/[0.08] p-6">
                    <HeroCardPreview cards={cards} loading={loading} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Cards are shown in order. Use the arrows to reorder. Only active cards appear on the live site.
              </p>
            </Card>
          </div>
        </div>
      </motion.div>

      {undoCard && (
        <div className="fixed bottom-6 right-6 z-50 bg-dark-navy text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 animate-fade-in-up">
          <span className="text-sm">Card deleted</span>
          <button onClick={handleUndo} className="text-primary font-semibold text-sm hover:underline">Undo</button>
          <button onClick={() => setUndoCard(null)} className="text-gray-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  )
}
