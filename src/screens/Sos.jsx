import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Chip from '../components/Chip.jsx'
import { loadProfile } from '../lib/profile.js'
import { TRANSVERSAL_EXERCISES } from '../data/behaviors.js'

const EXERCISE_SECONDS = 90

export default function Sos() {
  const navigate = useNavigate()
  const [profile] = useState(() => loadProfile())
  const behaviors = profile?.plan.behaviors ?? []
  const [behaviorId, setBehaviorId] = useState(behaviors[0]?.id)
  const [phase, setPhase] = useState('running') // running | done
  const [secondsLeft, setSecondsLeft] = useState(EXERCISE_SECONDS)
  const vibrated = useRef(false)

  const behavior = behaviors.find((b) => b.id === behaviorId) ?? behaviors[0]
  const exercise = behavior?.exercises?.[0]
  const compassion = useMemo(
    () => TRANSVERSAL_EXERCISES.find((e) => e.title === 'Auto-compassion guidée'),
    []
  )

  useEffect(() => {
    if (!vibrated.current && 'vibrate' in navigator) {
      try {
        navigator.vibrate(80)
      } catch {
        // pas grave, purement cosmétique
      }
    }
    vibrated.current = true
  }, [])

  useEffect(() => {
    if (phase !== 'running') return
    if (secondsLeft <= 0) {
      setPhase('done')
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, secondsLeft])

  if (!profile) {
    navigate('/', { replace: true })
    return null
  }

  const progress = 1 - secondsLeft / EXERCISE_SECONDS

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center bg-sage-50 px-6 py-10 text-center dark:bg-ink-900">
      {phase === 'running' && exercise && (
        <>
          {behaviors.length > 1 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {behaviors.map((b) => (
                <Chip key={b.id} selected={behaviorId === b.id} onClick={() => setBehaviorId(b.id)}>
                  {b.label}
                </Chip>
              ))}
            </div>
          )}

          <div className="relative flex h-48 w-48 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-sage-200)" strokeWidth="6" />
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
            <span className="text-3xl font-bold text-ink-800 dark:text-sand-100">{secondsLeft}</span>
          </div>

          <h1 className="mt-8 max-w-sm text-xl font-bold text-ink-800 dark:text-sand-100">
            {exercise.title}
          </h1>
          <p className="mt-2 max-w-sm text-ink-800/70 dark:text-sand-100/70">{exercise.detail}</p>
          <p className="mt-4 text-sm text-ink-800/50 dark:text-sand-100/50">
            Cette envie va redescendre. Respire, ça passe.
          </p>

          <Button variant="ghost" className="mt-8" onClick={() => setPhase('done')}>
            Passer
          </Button>
        </>
      )}

      {phase === 'done' && (
        <>
          <div
            className="mb-6 h-20 w-20 rounded-full bg-sage-200/70 dark:bg-sage-700/40"
            style={{ animation: 'sosBreathe 4s ease-in-out infinite' }}
            aria-hidden="true"
          />
          <style>{`
            @keyframes sosBreathe {
              0%, 100% { transform: scale(1); opacity: 0.7; }
              50% { transform: scale(1.12); opacity: 1; }
            }
          `}</style>

          <h1 className="max-w-sm text-xl font-bold text-ink-800 dark:text-sand-100">
            C'était peut-être inconfortable, et c'est déjà fini.
          </h1>
          {compassion && (
            <p className="mt-3 max-w-sm text-ink-800/70 dark:text-sand-100/70">
              {compassion.detail}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Button onClick={() => navigate('/home')}>Ça va mieux</Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/tracker?log=1&behavior=${behaviorId ?? ''}`)}
            >
              Noter cet épisode
            </Button>
          </div>
        </>
      )}
    </main>
  )
}
