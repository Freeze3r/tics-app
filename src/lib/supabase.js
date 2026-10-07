import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export async function getCurrentUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}

export async function signUpWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data.user
}

export async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}

// Nécessite qu'un fournisseur Google OAuth soit configuré côté Supabase
// (Authentication > Providers > Google) — pas encore branché.
export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/quiz` },
  })
  if (error) throw error
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function requestPasswordReset(email) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(newPassword) {
  if (!supabase) throw new Error('Supabase non configuré')
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
