#!/usr/bin/env node
/**
 * One-time admin account setup — run manually, never committed with real credentials.
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_URL = "https://your-project.supabase.co"
 *   $env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"   # Project Settings -> API -> service_role
 *   $env:ADMIN_EMAIL = "you@example.com"
 *   $env:ADMIN_PASSWORD = "a-strong-password"
 *   node scripts/seed-admin.mjs
 *
 * Usage (bash):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed-admin.mjs
 *
 * The service role key bypasses RLS and can create auth users directly — never expose it to the
 * frontend, never commit it. This script only reads it from the environment at run time.
 * Safe to re-run: if the email already exists, its password is left alone and only the profile
 * role is ensured to be 'admin'.
 */

import { createClient } from '@supabase/supabase-js'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing required environment variables. See the usage comment at the top of this script.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserByEmail(email) {
  let page = 1
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    if (match) return match
    if (data.users.length < 200) return null
    page += 1
  }
}

async function main() {
  let user = await findUserByEmail(ADMIN_EMAIL)

  if (user) {
    console.log(`User ${ADMIN_EMAIL} already exists (id: ${user.id}) — leaving password unchanged.`)
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    })
    if (error) throw error
    user = data.user
    console.log(`Created auth user ${ADMIN_EMAIL} (id: ${user.id}).`)
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, email: ADMIN_EMAIL, full_name: 'Admin', role: 'admin' })
  if (profileError) throw profileError

  console.log(`Profile role ensured as 'admin' for ${ADMIN_EMAIL}. You can now sign in at /admin/login.`)
}

main().catch((err) => {
  console.error('Failed to seed admin account:', err.message || err)
  process.exit(1)
})
