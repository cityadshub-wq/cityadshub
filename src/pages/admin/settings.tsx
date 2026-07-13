import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Palette, Globe, Phone, Lock, CheckCircle2, AlertCircle, FileText, Code, User } from 'lucide-react'
import { Button, Card, Input, Textarea, ImageUpload } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getSettings, upsertSettings } from '@/services/settings'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})
type ProfileForm = z.infer<typeof profileSchema>

const schema = z.object({
  site_name: z.string().min(1),
  tagline: z.string().min(1),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  contact_email: z.string().email(),
  contact_phone: z.string().min(10),
  address: z.string().min(5),
  business_hours: z.string().min(1),
  whatsapp_number: z.string().optional(),
  success_message: z.string().optional(),
  form_title: z.string().optional(),
  footer_text: z.string().optional(),
  footer_description: z.string().optional(),
  copyright_text: z.string().optional(),
  analytics_code: z.string().optional(),
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
  const { user, profile, refreshProfile } = useAuth()
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [passwordResult, setPasswordResult] = useState<{ success?: string; error?: string } | null>(null)
  const [pwLoading, setPwLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [existingId, setExistingId] = useState<string | null>(null)

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [profileResult, setProfileResult] = useState<{ success?: string; error?: string } | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const { register: profileRegister, handleSubmit: profileHandleSubmit, reset: profileReset, formState: { errors: profileErrors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (profile) {
      profileReset({ full_name: profile.full_name || '', email: profile.email || '' })
      setAvatarUrl(profile.avatar_url || null)
    }
  }, [profile, profileReset])

  const onSaveProfile = async (data: ProfileForm) => {
    if (!user) return
    setProfileLoading(true)
    setProfileResult(null)
    try {
      let emailPending = false
      if (data.email !== user.email) {
        const { data: updated, error } = await supabase.auth.updateUser({ email: data.email })
        if (error) throw error
        emailPending = updated.user?.email !== data.email
      }

      await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          avatar_url: avatarUrl,
          ...(emailPending ? {} : { email: data.email }),
        })
        .eq('id', user.id)

      await refreshProfile()
      setProfileResult({
        success: emailPending
          ? 'Profile updated. Check your inbox to confirm your new email address — your login email will update once confirmed.'
          : 'Profile updated successfully!',
      })
    } catch (e) {
      setProfileResult({ error: e instanceof Error ? e.message : 'Failed to update profile' })
    } finally {
      setProfileLoading(false)
    }
  }

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      site_name: 'City Ads Hub',
      tagline: 'Turning Local Reach Into Real Customers.',
      contact_email: 'hello@cityadshub.com',
      contact_phone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra, India',
      business_hours: 'Mon-Sat: 10:00 AM - 7:00 PM',
      primary_color: '#1565FF',
      secondary_color: '#081A3A',
    },
  })

  const { register: pRegister, handleSubmit: pHandleSubmit, reset: pReset, formState: { errors: pErrors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    getSettings().then((data) => {
      if (data) {
        setExistingId(data.id)
        reset({
          site_name: data.site_name || '',
          tagline: data.tagline || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          logo_url: data.logo_url || '',
          favicon_url: data.favicon_url || '',
          primary_color: data.primary_color || '#1565FF',
          secondary_color: data.secondary_color || '#081A3A',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          address: data.address || '',
          business_hours: data.business_hours || '',
          whatsapp_number: data.whatsapp_number || '',
          success_message: data.success_message || '',
          form_title: data.form_title || '',
          footer_text: data.footer_text || '',
          footer_description: data.footer_description || '',
          copyright_text: data.copyright_text || '',
          analytics_code: data.analytics_code || '',
        })
      }
    }).finally(() => setLoadingSettings(false))
  }, [reset])

  const onSubmit = async (data: FormData) => {
    setSaveError('')
    try {
      await upsertSettings({ ...(existingId ? { id: existingId } : {}), ...data })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed')
    }
  }

  const onChangePassword = async (data: PasswordForm) => {
    setPwLoading(true)
    setPasswordResult(null)
    const { error } = await supabase.auth.updateUser({ password: data.newPassword })
    if (error) setPasswordResult({ error: error.message })
    else {
      setPasswordResult({ success: 'Password changed successfully!' })
      pReset()
    }
    setPwLoading(false)
  }

  if (loadingSettings) {
    return (
      <div className="space-y-6 max-w-3xl animate-pulse">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl" />)}
      </div>
    )
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
          <Card>
            <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><User className="h-5 w-5 text-primary" /> My Profile</h2>
            <form onSubmit={profileHandleSubmit(onSaveProfile)} className="space-y-4">
              <ImageUpload
                bucket="media"
                path="avatars"
                label={avatarUrl ? 'Replace Photo' : 'Upload Profile Photo (optional)'}
                value={avatarUrl}
                onChange={setAvatarUrl}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="profile_full_name" label="Display Name" error={profileErrors.full_name?.message} {...profileRegister('full_name')} />
                <Input id="profile_email" label="Email Address" type="email" error={profileErrors.email?.message} {...profileRegister('email')} />
              </div>
              {profileResult?.success && (
                <div className="text-sm p-3 rounded-lg bg-green-50 text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {profileResult.success}
                </div>
              )}
              {profileResult?.error && (
                <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600">{profileResult.error}</div>
              )}
              <Button type="submit" loading={profileLoading}><Save className="mr-2 h-4 w-4" /> Save Profile</Button>
            </form>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> General</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="site_name" label="Site Name" {...register('site_name')} />
                  <Input id="tagline" label="Tagline" {...register('tagline')} />
                </div>
                <Textarea id="meta_description" label="Meta Description" {...register('meta_description')} />
                <Input id="meta_keywords" label="Meta Keywords (comma separated)" {...register('meta_keywords')} />
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Branding</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="primary_color" label="Primary Color" type="color" {...register('primary_color')} />
                <Input id="secondary_color" label="Secondary Color" type="color" {...register('secondary_color')} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <ImageUpload
                  bucket="logos"
                  path="logo"
                  label="Logo"
                  value={watch('logo_url')}
                  onChange={(url) => setValue('logo_url', url || '')}
                />
                <ImageUpload
                  bucket="logos"
                  path="favicon"
                  label="Favicon (32x32)"
                  value={watch('favicon_url')}
                  onChange={(url) => setValue('favicon_url', url || '')}
                />
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
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input id="success_message" label="Success Message" {...register('success_message')} />
                  <Input id="form_title" label="Form Title" {...register('form_title')} />
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Footer</h2>
              <p className="text-xs text-gray-500 mb-4 -mt-2">Manage social media links from the <a href="/admin/social-links" className="text-primary hover:underline">Social Links</a> page.</p>
              <div className="space-y-4">
                <Input id="footer_text" label="Footer Text" {...register('footer_text')} />
                <Textarea id="footer_description" label="Footer Description" {...register('footer_description')} />
                <Input id="copyright_text" label="Copyright Text" {...register('copyright_text')} />
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Code className="h-5 w-5 text-primary" /> Advanced</h2>
              <div className="space-y-4">
                <Textarea id="analytics_code" label="Analytics Code (Google Analytics etc.)" rows={5} placeholder="Paste your tracking code here..." {...register('analytics_code')} />
              </div>
            </Card>

            <div className="flex items-center gap-4 mb-6">
              <Button type="submit" size="lg"><Save className="mr-2 h-4 w-4" /> Save Settings</Button>
              {saved && <span className="text-sm text-green font-medium flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Settings saved!</span>}
              {saveError && <span className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> {saveError}</span>}
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
              <Button type="submit" loading={pwLoading}>
                <Lock className="mr-2 h-4 w-4" /> Update Password
              </Button>
            </form>
          </Card>
        </div>
      </motion.div>
    </>
  )
}
