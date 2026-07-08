import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Palette, Globe, Phone, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { Button, Card, Input, Textarea } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'

const schema = z.object({
  site_name: z.string().min(1),
  tagline: z.string().min(1),
  contact_email: z.string().email(),
  contact_phone: z.string().min(10),
  address: z.string().min(5),
  business_hours: z.string().min(1),
  whatsapp_number: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  youtube_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  meta_description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type PasswordForm = z.infer<typeof passwordSchema>

export function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [passwordResult, setPasswordResult] = useState<{ success?: string; error?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      site_name: 'City Ads Hub',
      tagline: 'Turning Local Reach Into Real Customers.',
      contact_email: 'hello@cityadshub.com',
      contact_phone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra, India',
      business_hours: 'Mon-Sat: 10:00 AM - 7:00 PM',
    },
  })

  const { register: pRegister, handleSubmit: pHandleSubmit, reset: pReset, formState: { errors: pErrors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log('Settings saved:', data)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const onChangePassword = async (data: PasswordForm) => {
    setLoading(true)
    setPasswordResult(null)
    const { error } = await supabase.auth.updateUser({ password: data.newPassword })
    if (error) setPasswordResult({ error: error.message })
    else {
      setPasswordResult({ success: 'Password changed successfully!' })
      pReset()
    }
    setLoading(false)
  }

  return (
    <>
      <SEO title="Website Settings" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-navy">Website Settings</h1>
          <p className="text-gray-500 text-sm">Manage your site configuration</p>
        </div>

        <div className="space-y-6 max-w-3xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> General</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="site_name" label="Site Name" {...register('site_name')} />
                  <Input id="tagline" label="Tagline" {...register('tagline')} />
                </div>
                <Textarea id="meta_description" label="Meta Description" {...register('meta_description')} />
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Branding</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="primary_color" label="Primary Color" type="color" defaultValue="#1565FF" />
                <Input id="secondary_color" label="Secondary Color" type="color" defaultValue="#081A3A" />
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> Contact</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="contact_email" label="Contact Email" {...register('contact_email')} />
                  <Input id="contact_phone" label="Contact Phone" {...register('contact_phone')} />
                </div>
                <Input id="whatsapp_number" label="WhatsApp Number" {...register('whatsapp_number')} />
                <Textarea id="address" label="Address" {...register('address')} />
                <Input id="business_hours" label="Business Hours" {...register('business_hours')} />
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Social Media</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="facebook_url" label="Facebook URL" {...register('facebook_url')} />
                <Input id="instagram_url" label="Instagram URL" {...register('instagram_url')} />
                <Input id="youtube_url" label="YouTube URL" {...register('youtube_url')} />
                <Input id="linkedin_url" label="LinkedIn URL" {...register('linkedin_url')} />
              </div>
            </Card>

            <div className="flex items-center gap-4 mb-6">
              <Button type="submit" size="lg"><Save className="mr-2 h-4 w-4" /> Save Settings</Button>
              {saved && <span className="text-sm text-green font-medium flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Settings saved!</span>}
            </div>
          </form>

          <Card>
            <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Change Password</h2>
            <form onSubmit={pHandleSubmit(onChangePassword)} className="space-y-4 max-w-md">
              <div className="relative">
                <Input
                  id="currentPassword"
                  label="Current Password"
                  type={showPwd ? 'text' : 'password'}
                  error={pErrors.currentPassword?.message}
                  {...pRegister('currentPassword')}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    id="newPassword"
                    label="New Password"
                    type={showPwd ? 'text' : 'password'}
                    error={pErrors.newPassword?.message}
                    {...pRegister('newPassword')}
                  />
                </div>
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showPwd ? 'text' : 'password'}
                  error={pErrors.confirmPassword?.message}
                  {...pRegister('confirmPassword')}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" onChange={() => setShowPwd(!showPwd)} className="rounded" />
                Show passwords
              </label>
              {passwordResult?.success && (
                <div className="text-sm p-3 rounded-lg bg-green-50 text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {passwordResult.success}
                </div>
              )}
              {passwordResult?.error && (
                <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600">{passwordResult.error}</div>
              )}
              <Button type="submit" loading={loading}>
                <Lock className="mr-2 h-4 w-4" /> Update Password
              </Button>
            </form>
          </Card>
        </div>
      </motion.div>
    </>
  )
}
