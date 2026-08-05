import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile, getPracticeStats, markPracticeToday, isPracticedToday } from '../lib/profile.js'
import { listEpisodes, topTriggerContext } from '../lib/episodes.js'
import { getBehavior, TRIGGER_CONTEXTS } from '../data/behaviors.js'
import { thoughtOfTheDay } from '../data/dailyThoughts.js'

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.round(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'à l’instant'
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  return `il y a ${days} j`
}

export default function Home() {
  const navigate = useNavigate()
  const [profile] = useState(() => loadProfile())
  const [stats, setStats] = useState(() => getPracticeStats())
  const [practicedToday, setPracticedToday] = useState(() => isPracticedToday())
  const recentEpisodes = useMemo(() => listEpisodes().slice(0, 3), [])
  const topTrigger = useMemo(() => topTriggerContext(), [])
  const topTriggerLabel = TRIGGER_CONTEXTS.find((t) => t.id === topTrigger?.id)?.label

  useEffect(() => {
    if (!profile) navigate('/', { replace: true })
  }, [profile, navigate])

  if (!profile) return null

  const { plan } = profile
  const dailyPool = [
    ...plan.dailyTraining,
    ...plan.exercisesByBehavior.flatMap((e) => e.exercises),
  ]
  const todayExercise = dailyPool[dayOfYear() % dailyPool.length]

  function handleCheckIn() {
    markPracticeToday()
    setPracticedToday(true)
    setStats(getPracticeStats())
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md">
        <p className="text-sm text-ink-800/60 dark:text-sand-100/60">Content de te revoir</p>
        <h1 className="mt-1 text-2xl font-bold text-ink-800 dark:text-sand-100">
          Comment tu te sens aujourd'hui ?
        </h1>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">
                Ta pratique cette semaine
              </p>
              <p className="mt-1 text-2xl font-bold text-ink-800 dark:text-sand-100">
                {stats.practicedThisWeek}/{stats.totalWeekDays} jours
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-sage-100 flex items-center justify-center text-xl font-bold text-sage-600 dark:bg-sage-700/30 dark:text-sage-300">
              {Math.round((stats.practicedThisWeek / stats.totalWeekDays) * 100)}%
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-800/50 dark:text-sand-100/50">
            Un jour manqué ne remet rien à zéro — on regarde la tendance, pas l'instant.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
          <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">
            Exercice du jour
          </p>
          <p className="mt-1 font-semibold text-ink-800 dark:text-sand-100">
            {todayExercise.title}
          </p>
          <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
            {todayExercise.detail}
          </p>
          <Button
            variant={practicedToday ? 'secondary' : 'primary'}
            className="mt-4 w-full"
            disabled={practicedToday}
            onClick={handleCheckIn}
          >
            {practicedToday ? 'Fait aujourd’hui ✓' : 'Marquer comme fait'}
          </Button>
        </section>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="primary" className="w-full" onClick={() => navigate('/sos')}>
            J'ai une envie forte
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/tracker?log=1')}>
            Noter un épisode
          </Button>
        </div>

        <section className="mt-6 rounded-2xl bg-sage-100/60 p-5 dark:bg-sage-700/10">
          <p className="text-sm font-semibold text-sage-700 dark:text-sage-300">Pensée du jour</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-800/80 dark:text-sand-100/80">
            {thoughtOfTheDay()}
          </p>
        </section>

        {topTrigger && (
          <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
            <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">
              Ce que le tracker remarque
            </p>
            <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
              Cette semaine, tes épisodes reviennent surtout dans un contexte de{' '}
              <strong className="text-ink-800 dark:text-sand-100">
                {topTriggerLabel?.toLowerCase()}
              </strong>
              . Ça peut valoir le coup de préparer un exercice spécifique pour ces moments-là.
            </p>
          </section>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => navigate('/journal')}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center dark:bg-ink-800"
          >
            <span className="text-xl">💭</span>
            <span className="text-xs font-medium text-ink-800 dark:text-sand-100">Journal</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/library')}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center dark:bg-ink-800"
          >
            <span className="text-xl">📚</span>
            <span className="text-xs font-medium text-ink-800 dark:text-sand-100">Bibliothèque</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center dark:bg-ink-800"
          >
            <span className="text-xl">🤝</span>
            <span className="text-xs font-medium text-ink-800 dark:text-sand-100">Communauté</span>
          </button>
        </div>

        {recentEpisodes.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-ink-800 dark:text-sand-100">
              Derniers épisodes
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {recentEpisodes.map((ep) => {
                const behavior = getBehavior(ep.behaviorId)
                return (
                  <div
                    key={ep.id}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm dark:bg-ink-800"
                  >
                    <span className="text-ink-800 dark:text-sand-100">
                      {behavior?.label ?? 'Épisode'}
                    </span>
                    <span className="text-ink-800/50 dark:text-sand-100/50">
                      {relativeTime(ep.createdAt)}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
