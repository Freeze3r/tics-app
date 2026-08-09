// Fonction serverless Vercel : suppression réelle et complète du compte (RGPD,
// droit à l'effacement). Le reset côté client ne vidait que le localStorage —
// les lignes restaient dans Supabase et le compte restait connectable. Ici on
// supprime le compte auth lui-même via la clé service_role (jamais exposée au
// navigateur) : le schéma déclare déjà "on delete cascade" sur user_id pour
// quiz_responses/episodes/journal_entries/profiles, donc tout part avec.
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    res.status(503).json({ error: 'Suppression de compte non configurée' })
    return
  }

  const authHeader = req.headers.authorization ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    res.status(401).json({ error: 'Authentification requise' })
    return
  }

  const authClient = createClient(supabaseUrl, anonKey)
  const { data: userData, error: userError } = await authClient.auth.getUser(token)
  if (userError || !userData?.user) {
    res.status(401).json({ error: 'Authentification invalide' })
    return
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userData.user.id)
  if (deleteError) {
    console.error('Account deletion error', deleteError)
    res.status(500).json({ error: 'La suppression a échoué, réessaie.' })
    return
  }

  res.status(200).json({ deleted: true })
}
