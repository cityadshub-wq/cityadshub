import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const REMEMBER_ME_KEY = 'city-ads-hub-remember-me'

// "Remember me" support: the flag itself always lives in localStorage (just a
// preference, not session data), but it decides which storage the actual auth
// session token gets written to — localStorage persists across browser
// restarts, sessionStorage clears when the tab/browser closes.
function getSessionStorageTarget(): Storage {
  const remember = window.localStorage.getItem(REMEMBER_ME_KEY)
  return remember === 'false' ? window.sessionStorage : window.localStorage
}

export function setRememberMe(remember: boolean) {
  window.localStorage.setItem(REMEMBER_ME_KEY, String(remember))
}

const dynamicAuthStorage = {
  getItem: (key: string) => getSessionStorageTarget().getItem(key),
  setItem: (key: string, value: string) => getSessionStorageTarget().setItem(key, value),
  removeItem: (key: string) => getSessionStorageTarget().removeItem(key),
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: dynamicAuthStorage },
})

// A throwaway client for creating new accounts (e.g. Add Admin) while already signed in —
// `supabase.auth.signUp()` on the primary client above would overwrite the current admin's
// session with the newly created user's session. This client never persists anything.
export function createScratchAuthClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
