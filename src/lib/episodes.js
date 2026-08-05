import { supabase, getCurrentUser } from './supabase.js'

const LOCAL_KEY = 'ticsEpisodes'

function readLocal() {
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeLocal(episodes) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(episodes))
}

// Toujours écrit en local d'abord (l'app doit rester utilisable sans connexion),
// puis tente une synchro Supabase si configuré — sans jamais bloquer l'utilisateur dessus.
export async function logEpisode({ behaviorId, triggerContext, emotion, duration }) {
  const episode = {
    id: crypto.randomUUID(),
    behaviorId,
    triggerContext,
    emotion,
    duration,
    createdAt: new Date().toISOString(),
  }

  const episodes = readLocal()
  episodes.unshift(episode)
  writeLocal(episodes)

  if (supabase) {
    try {
      const user = await getCurrentUser()
      if (!user) return episode
      await supabase.from('episodes').insert({
        user_id: user.id,
        behavior_id: episode.behaviorId,
        trigger_context: episode.triggerContext,
        emotion: episode.emotion,
        duration: episode.duration,
        created_at: episode.createdAt,
      })
    } catch {
      // pas grave : l'épisode reste enregistré localement
    }
  }

  return episode
}

export function listEpisodes() {
  return readLocal()
}

export function episodesThisWeek() {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return readLocal().filter((e) => new Date(e.createdAt).getTime() >= weekAgo)
}

export function frequencyByContext() {
  const counts = {}
  for (const e of episodesThisWeek()) {
    if (!e.triggerContext) continue
    counts[e.triggerContext] = (counts[e.triggerContext] ?? 0) + 1
  }
  return counts
}

// Retourne le déclencheur le plus fréquent cette semaine, ou null s'il n'y a pas
// encore assez de données pour dégager un pattern fiable.
export function topTriggerContext() {
  const counts = frequencyByContext()
  const entries = Object.entries(counts)
  if (entries.length === 0) return null
  const [id, count] = entries.sort((a, b) => b[1] - a[1])[0]
  if (count < 2) return null
  return { id, count }
}
