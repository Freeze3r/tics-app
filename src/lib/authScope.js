import { supabase } from './supabase.js'

// Toutes les données "locales" de l'app (profil, plan, journal, badges, etc.)
// vivent dans localStorage. Sans ce module, les clés étaient globales à
// l'appareil : un nouveau compte créé sur le même navigateur héritait des
// données laissées par le compte précédent (profil, quiz jamais relancé,
// tutoriel déjà marqué vu...). scopedKey() suffixe chaque clé avec l'id de
// l'utilisateur Supabase courant pour que chaque compte ait son propre espace.
let currentUserId = null

export function getScopeId() {
  return currentUserId
}

export function scopedKey(baseKey) {
  return currentUserId ? `${baseKey}:${currentUserId}` : baseKey
}

// À appeler (et attendre) avant toute lecture de données scopées — voir
// RequireAuth et Auth.jsx, les deux points d'entrée qui gardent les écrans
// dépendant du profil local.
export async function resolveAuthScope() {
  if (!supabase) {
    currentUserId = null
    return null
  }
  const { data } = await supabase.auth.getSession()
  const user = data.session?.user ?? null
  currentUserId = user?.id ?? null
  return user
}

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    currentUserId = session?.user?.id ?? null
  })
}
