import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Eye, EyeOff, X, Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button, Card, Badge, Input } from '@/components/ui'
import { SEO } from '@/components/shared/seo'
import { useAuth } from '@/contexts/AuthContext'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } from '@/services/admin-users'
import type { Profile } from '@/types'

const emptyForm = { full_name: '', email: '', password: '' }

export function AdminUsersPage() {
  const { user, resetPassword } = useAuth()
  const [admins, setAdmins] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Profile | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setAdmins(await getAdminUsers()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  function openNew() {
    setEditingAdmin(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  function openEdit(admin: Profile) {
    setEditingAdmin(admin)
    setForm({ full_name: admin.full_name || '', email: admin.email, password: '' })
    setError('')
    setShowForm(true)
  }

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      if (editingAdmin) {
        await updateAdminUser(editingAdmin.id, { full_name: form.full_name })
      } else {
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters')
        await createAdminUser({ email: form.email, password: form.password, full_name: form.full_name })
      }
      setShowForm(false)
      setEditingAdmin(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(admin: Profile) {
    await updateAdminUser(admin.id, { is_active: admin.is_active === false })
    await load()
  }

  async function handleResetPassword(admin: Profile) {
    setNotice('')
    const { error } = await resetPassword(admin.email)
    setNotice(error ? `Failed to send reset email: ${error}` : `Password reset email sent to ${admin.email}.`)
    setTimeout(() => setNotice(''), 5000)
  }

  async function handleDelete(admin: Profile) {
    if (admin.id === user?.id) return
    if (admins.length <= 1) return
    if (!confirm(`Remove admin access for ${admin.full_name || admin.email}? This cannot be undone.`)) return
    await deleteAdminUser(admin.id)
    await load()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <SEO title="Admin Users" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Admin Users</h1>
          <p className="text-gray-500 text-sm">{admins.length} administrator{admins.length === 1 ? '' : 's'}</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Admin</Button>
      </div>

      {notice && (
        <div className="text-sm p-3 rounded-lg bg-blue-50 text-blue-700 mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4" /> {notice}
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-navy">{editingAdmin ? 'Edit Admin' : 'New Admin'}</h2>
            <button onClick={() => { setShowForm(false); setEditingAdmin(null) }} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-4 max-w-md">
            <Input label="Display Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!!editingAdmin}
            />
            {editingAdmin && (
              <p className="text-xs text-gray-400 -mt-2">Email can only be changed by the admin themselves, from their own Settings page.</p>
            )}
            {!editingAdmin && (
              <Input label="Password" type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            )}
            {error && (
              <div className="text-sm p-3 rounded-lg bg-red-50 text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            <Button loading={saving} onClick={handleSave}>{editingAdmin ? 'Update' : 'Create'}</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map((admin) => {
            const isSelf = admin.id === user?.id
            const isLastAdmin = admins.length <= 1
            const active = admin.is_active !== false
            return (
              <Card key={admin.id} className="flex items-center gap-3 p-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0 overflow-hidden">
                  {admin.avatar_url ? (
                    <img src={admin.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    admin.full_name?.charAt(0)?.toUpperCase() || '?'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-dark-navy flex items-center gap-1.5">
                    {admin.full_name || 'Unnamed'}
                    {isSelf && <span className="text-xs text-gray-400">(you)</span>}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{admin.email}</div>
                </div>
                <Badge variant={active ? 'green' : 'default'}>{active ? 'Active' : 'Inactive'}</Badge>
                <button
                  onClick={() => handleResetPassword(admin)}
                  className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                  title="Send password reset email"
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(admin)}
                  disabled={isSelf}
                  className="p-1.5 text-gray-400 hover:text-green transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={isSelf ? "You can't deactivate yourself" : active ? 'Deactivate' : 'Activate'}
                >
                  {active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => openEdit(admin)} className="p-1.5 text-gray-400 hover:text-primary transition-colors" title="Edit display name">
                  <ShieldCheck className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(admin)}
                  disabled={isSelf || isLastAdmin}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={isSelf ? "You can't delete yourself" : isLastAdmin ? 'Cannot delete the last remaining admin' : 'Remove admin access'}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            )
          })}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" /> "Remove admin access" revokes their ability to sign into the Admin Panel. It does not delete their underlying account credentials.
      </p>
    </motion.div>
  )
}
