// Appelée chaque jour par le cron Vercel (voir vercel.json). Le plan gratuit de
// Supabase met un projet en pause après ~7 jours sans activité (c'est ce qui a
// coupé l'app pendant l'été) : une petite requête quotidienne suffit à l'éviter.
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    res.status(503).json({ ok: false, error: 'Supabase non configuré' })
    return
  }

  // La RLS renvoie 0 ligne à un appelant anonyme : aucune donnée n'est exposée,
  // mais la requête compte bien comme activité côté Supabase.
  const supabase = createClient(url, anonKey)
  const { error } = await supabase.from('profiles').select('id').limit(1)
  if (error) {
    console.error('Keepalive error', error)
    res.status(502).json({ ok: false })
    return
  }

  res.status(200).json({ ok: true })
}
