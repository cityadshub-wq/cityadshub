import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Calendar, Shield, Users, Plus, X } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getEmployees, updateEmployee } from '@/services/employees'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'employee' | 'admin'>('employee')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try { setEmployees(await getEmployees()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setCreating(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role } },
      })
      if (signUpError) throw new Error(signUpError.message)
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
        })
      }
      setSuccess(`${fullName} added as ${role}`)
      setEmail(''); setFullName(''); setPassword(''); setRole('employee')
      setShowForm(false)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setCreating(false)
    }
  }

  const handleRoleChange = async (id: string, newRole: Profile['role']) => {
    await updateEmployee(id, { role: newRole })
    load()
  }

  return (
    <>
      <SEO title="Manage Employees" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Manage Employees</h1>
            <p className="text-gray-500 text-sm">{employees.length} team members</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-4 w-4" /> Add Employee</Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-navy">Add Employee</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-dark-navy"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 max-w-md">
              <Input id="fullName" label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <div>
                <label className="block text-sm font-medium text-dark-navy mb-1.5">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-dark-navy focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green">{success}</p>}
              <Button type="submit" loading={creating}>Add Employee</Button>
            </form>
          </Card>
        )}

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{employees.length}</div><div className="text-xs text-gray-500">Team Members</div></div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-green/10 flex items-center justify-center"><Shield className="h-5 w-5 text-green" /></div>
              <div><div className="text-2xl font-bold text-dark-navy">{employees.filter(e => e.role === 'admin').length}</div><div className="text-xs text-gray-500">Admins</div></div>
            </div>
          </Card>
        </div>

        <DataTable
          columns={[
            { key: 'full_name', header: 'Name', render: (e: Profile) => (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{e.full_name?.charAt(0) || '?'}</div>
                <div className="font-medium">{e.full_name}</div>
              </div>
            )},
            { key: 'email', header: 'Contact', render: (e: Profile) => (
              <div><div className="flex items-center gap-1 text-sm"><Mail className="h-3 w-3 text-gray-400" />{e.email}</div>{e.phone && <div className="text-xs text-gray-400">{e.phone}</div>}</div>
            )},
            { key: 'role', header: 'Role', render: (e: Profile) => (
              <select
                value={e.role}
                onChange={(e2) => handleRoleChange(e.id, e2.target.value as Profile['role'])}
                className="text-xs rounded-lg border border-gray-200 px-2 py-1 font-medium"
              >
                <option value="admin">admin</option>
                <option value="employee">employee</option>
                <option value="client">client</option>
              </select>
            )},
            { key: 'created_at', header: 'Joined', render: (e: Profile) => (
              <div className="flex items-center gap-1 text-xs text-gray-400"><Calendar className="h-3 w-3" />{new Date(e.created_at).toLocaleDateString()}</div>
            )},
          ]}
          data={employees}
          loading={loading}
        />
      </motion.div>
    </>
  )
}
