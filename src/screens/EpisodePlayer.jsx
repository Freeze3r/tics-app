import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile } from '../lib/profile.js'
import { getBehavior } from '../data/behaviors.js'
import { getSeasons } from '../lib/seasons.js'
import { markEpisodeComplete, getCompletedEpisodeIds } from '../lib/seasonProgress.js'
import { markPracticeToday } from '../lib/profile.js'

const TYPE_LABELS = { lesson: 'Leçon', exercise: 'Exercice' }

export default function EpisodePlayer() {
  const navigate = useNavigate()
  const { behaviorId, episodeId } = useParams()
  const [profile] = useState(() => loadProfile())
  const [done, setDone] = useState(() => getCompletedEpisodeIds(behaviorId).includes(episodeId))

  if (!profile) {
    navigate('/', { replace: true })
    return null
  }

  const behavior = getBehavior(behaviorId)
  const season = behavior ? getSeasons(behavior).find((s) => s.episodes.some((e) => e.id === episodeId)) : null
  const episode = season?.episodes.find((e) => e.id === episodeId)
  const index = season ? season.episodes.findIndex((e) => e.id === episodeId) : -1

  if (!behavior || !season || !episode) {
    return (
      <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-navy-800 dark:text-sand-100">Cet épisode est introuvable.</p>
        <Button onClick={() => navigate('/tracker')}>Retour au tracker</Button>
      </main>
    )
  }

  function handleComplete() {
    markEpisodeComplete(behaviorId, episodeId)
    markPracticeToday()
    setDone(true)
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <Button variant="ghost" onClick={() => navigate('/tracker')}>
          ← Retour au tracker
        </Button>

        <p className="mt-4 text-sm font-semibold text-teal-600 dark:text-teal-400">
          {season.title} · Épisode {index + 1}/{season.episodes.length}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-teal-700/30 dark:text-teal-300">
            {TYPE_LABELS[episode.type]}
          </span>
          <span className="text-xs text-navy-800/50 dark:text-sand-100/50">{episode.duration}</span>
        </div>

        <h1 className="mt-3 text-2xl font-bold text-navy-800 dark:text-sand-100">{episode.title}</h1>
        <p className="mt-4 leading-relaxed text-navy-800/80 dark:text-sand-100/80">{episode.content}</p>

        <Button
          className="mt-8 w-full"
          variant={done ? 'secondary' : 'primary'}
          disabled={done}
          onClick={handleComplete}
        >
          {done ? 'Terminé ✓' : 'Marquer comme terminé'}
        </Button>
      </div>
    </main>
  )
}
