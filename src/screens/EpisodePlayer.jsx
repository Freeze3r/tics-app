import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile } from '../lib/profile.js'
import { getBehavior } from '../data/behaviors.js'
import { getSeasons } from '../lib/seasons.js'
import { markEpisodeComplete, getCompletedEpisodeIds } from '../lib/seasonProgress.js'
import { markPracticeToday } from '../lib/profile.js'

const TYPE_LABELS = { lesson: 'Leçon', exercise: 'Exercice' }
const GOAL_BY_TYPE = {
  exercise: "But : t'entraîner à une réponse concurrente, pour que ton corps l'apprenne par la répétition.",
  lesson: 'But : mieux comprendre ce qui se passe, pour agir avec plus de conscience la prochaine fois.',
}

export default function EpisodePlayer() {
  const navigate = useNavigate()
  const { behaviorId, episodeId } = useParams()
  const [profile] = useState(() => loadProfile())
  const [done, setDone] = useState(() => getCompletedEpisodeIds(behaviorId).includes(episodeId))
  const [timerRunning, setTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const behavior = getBehavior(behaviorId)
  const season = behavior ? getSeasons(behavior).find((s) => s.episodes.some((e) => e.id === episodeId)) : null
  const episode = season?.episodes.find((e) => e.id === episodeId)
  const index = season ? season.episodes.findIndex((e) => e.id === episodeId) : -1

  useEffect(() => {
    if (!timerRunning) return
    if (secondsLeft <= 0) {
      setTimerRunning(false)
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timerRunning, secondsLeft])

  if (!profile) {
    navigate('/', { replace: true })
    return null
  }

  if (!behavior || !season || !episode) {
    return (
      <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-navy-800 dark:text-sand-100">Cet épisode est introuvable.</p>
        <Button onClick={() => navigate('/tracker')}>Retour au tracker</Button>
      </main>
    )
  }

  function startTimer() {
    setSecondsLeft(episode.timerSeconds)
    setTimerRunning(true)
  }

  function handleComplete() {
    markEpisodeComplete(behaviorId, episodeId)
    markPracticeToday()
    setDone(true)
  }

  const progress = episode.timerSeconds ? 1 - secondsLeft / episode.timerSeconds : 0

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
        <p className="mt-2 text-sm italic text-navy-800/60 dark:text-sand-100/60">
          {GOAL_BY_TYPE[episode.type]}
        </p>
        <p className="mt-4 leading-relaxed text-navy-800/80 dark:text-sand-100/80">{episode.content}</p>

        {episode.steps && (
          <ol className="mt-5 flex flex-col gap-2">
            {episode.steps.map((step, i) => (
              <li key={i} className="flex gap-3 rounded-2xl bg-white p-3 text-sm dark:bg-navy-800">
                <span className="shrink-0 font-semibold text-coral-500">{i + 1}.</span>
                <span className="text-navy-800/80 dark:text-sand-100/80">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {episode.timerSeconds && (
          <div className="mt-6 flex flex-col items-center rounded-2xl bg-white p-6 dark:bg-navy-800">
            {timerRunning ? (
              <>
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-teal-200)" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="var(--color-coral-500)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <span className="text-2xl font-bold text-navy-800 dark:text-sand-100">{secondsLeft}</span>
                </div>
                {secondsLeft === 0 && (
                  <p className="mt-3 text-sm font-medium text-teal-600 dark:text-teal-400">
                    Terminé — bien joué.
                  </p>
                )}
              </>
            ) : (
              <Button onClick={startTimer}>Lancer le minuteur ({episode.timerSeconds}s)</Button>
            )}
          </div>
        )}

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
