import { supabase } from './supabase.js'

// Titres d'ancienneté du compte, distincts des badges (section B3 v3) : récompensent
// le temps passé avec un compte actif, pas une action précise. Thème plante, cohérent
// avec la mascotte.
export const TENURE_TITLES = [
  { id: 't7', days: 7, label: 'Graine', icon: '🌱' },
  { id: 't30', days: 30, label: 'Pousse', icon: '🌿' },
  { id: 't90', days: 90, label: 'Jeune tige', icon: '🌾' },
  { id: 't180', days: 180, label: 'Branche', icon: '🍃' },
  { id: 't365', days: 365, label: 'Arbre', icon: '🌳' },
  { id: 't730', days: 730, label: 'Racines profondes', icon: '🌲' },
  { id: 't1825', days: 1825, label: 'Canopée', icon: '🌴' },
  { id: 't3650', days: 3650, label: 'Forêt ancienne', icon: '🏔️' },
]

export async function getAccountCreatedAt() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.user?.created_at ?? null
}

export function getUnlockedTitles(accountCreatedAt) {
  if (!accountCreatedAt) return []
  const daysSince = (Date.now() - new Date(accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24)
  return TENURE_TITLES.filter((t) => daysSince >= t.days)
}
