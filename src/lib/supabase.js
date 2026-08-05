import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export async function getOrCreateAnonUser() {
  if (!supabase) return null
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData.session?.user) return sessionData.session.user
  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.user
}

// Enregistre les réponses au quiz + le plan généré, rattachés à un utilisateur anonyme.
// Échoue silencieusement côté appelant si Supabase n'est pas configuré (mode local uniquement).
export async function savePlan(answers, plan) {
  if (!supabase) return { skipped: true }

  const user = await getOrCreateAnonUser()
  const { error } = await supabase.from('quiz_responses').insert({
    user_id: user.id,
    answers,
    plan_summary: {
      durationDays: plan.durationDays,
      behaviors: plan.behaviors.map((b) => b.id),
      goal: plan.goal,
      suggestProfessional: plan.suggestProfessional,
    },
  })

  if (error) throw error
  return { skipped: false }
}
