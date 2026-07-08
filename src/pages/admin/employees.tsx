import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Calendar, Shield, Users } from 'lucide-react'
import { Card, Badge, Button, Input } from '@/components/ui'
import { DataTable } from '@/components/admin/data-table'
import { SEO } from '@/components/shared/seo'
import { getEmployees, updateEmployee } from '@/services/employees'
import type { Profile } from '@/types'

export function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try { setEmployees(await getEmployees()) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleRoleChange = async (id: string, role: Profile['role']) => {
    await updateEmployee(id, { role })
    load()
  }

  return (
    <>
      <SEO title="Manage Employees" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-navy">Manage Employees</h1>
          <p className="text-gray-500 text-sm">{employees.length} team members</p>
        </div>

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
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{e.full_name.charAt(0)}</div>
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
