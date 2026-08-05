import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile } from '../lib/profile.js'
import { TRANSVERSAL_EXERCISES } from '../data/behaviors.js'

const EXERCISE_SECONDS = 90

export default function Sos() {
  const navigate = useNavigate()
  const [profile] = useState(() => loadProfile())
  const behaviors = profile?.plan.behaviors ?? []
  const [behaviorId, setBehaviorId] = useState(behaviors.length === 1 ? behaviors[0]?.id : null)
  const [phase, setPhase] = useState(behaviors.length === 1 ? 'instruction' : 'select')
  const [secondsLeft, setSecondsLeft] = useState(EXERCISE_SECONDS)
  const vibrated = useRef(false)

  const behavior = behaviors.find((b) => b.id === behaviorId)
  const exercise = behavior?.exercises?.[0]
  const compassion = useMemo(
    () => TRANSVERSAL_EXERCISES.find((e) => e.title === 'Auto-compassion guidée'),
    []
  )

  useEffect(() => {
    if (phase !== 'running') return
    if (!vibrated.current && 'vibrate' in navigator) {
      try {
        navigator.vibrate(80)
      } catch {
        // pas grave, purement cosmétique
      }
    }
    vibrated.current = true
  }, [phase])

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

  function selectBehavior(id) {
    setBehaviorId(id)
    setPhase('instruction')
  }

  function startTimer() {
    setSecondsLeft(EXERCISE_SECONDS)
    vibrated.current = false
    setPhase('running')
  }

  const progress = 1 - secondsLeft / EXERCISE_SECONDS

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center bg-sage-50 px-6 py-10 text-center dark:bg-ink-900">
      {phase === 'select' && (
        <>
          <h1 className="text-xl font-bold text-ink-800 dark:text-sand-100">
            Qu'est-ce qui se passe là ?
          </h1>
          <p className="mt-2 max-w-sm text-ink-800/60 dark:text-sand-100/60">
            Choisis le comportement concerné, on te donne l'exercice adapté.
          </p>
          <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
            {behaviors.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => selectBehavior(b.id)}
                className="w-full rounded-2xl border-2 border-sage-200 bg-white px-5 py-4 text-left font-semibold text-ink-800 transition-colors hover:border-sage-300 dark:border-sage-700 dark:bg-ink-800 dark:text-sand-100"
              >
                {b.label}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === 'instruction' && exercise && (
        <>
          <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">{behavior.label}</p>
          <h1 className="mt-2 max-w-sm text-xl font-bold text-ink-800 dark:text-sand-100">
            {exercise.title}
          </h1>
          {exercise.steps ? (
            <ol className="mt-4 flex w-full max-w-sm flex-col gap-2 text-left">
              {exercise.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink-800/80 dark:text-sand-100/80">
                  <span className="shrink-0 font-semibold text-coral-500">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 max-w-sm text-ink-800/70 dark:text-sand-100/70">{exercise.detail}</p>
          )}
          <p className="mt-4 text-sm text-ink-800/50 dark:text-sand-100/50">
            Lis bien les étapes, installe-toi, puis lance le chrono quand tu es prêt·e.
          </p>

          <Button className="mt-8 w-full max-w-sm" onClick={startTimer}>
            Je suis prêt·e, lancer
          </Button>
          {behaviors.length > 1 && (
            <Button variant="ghost" className="mt-3" onClick={() => setPhase('select')}>
              Changer de comportement
            </Button>
          )}
        </>
      )}

      {phase === 'running' && exercise && (
        <>
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
              Noter ce moment
            </Button>
          </div>
        </>
      )}
    </main>
  )
}
