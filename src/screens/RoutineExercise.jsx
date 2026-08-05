import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { DAILY_ROUTINE } from '../data/dailyRoutine.js'
import { markPracticeToday } from '../lib/profile.js'

export default function RoutineExercise() {
  const navigate = useNavigate()
  const { period } = useParams()
  const routine = DAILY_ROUTINE[period]
  const [timerRunning, setTimerRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!timerRunning) return
    if (secondsLeft <= 0) {
      setTimerRunning(false)
      return
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timerRunning, secondsLeft])

  if (!routine) {
    return (
      <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-navy-800 dark:text-sand-100">Routine introuvable.</p>
        <Button onClick={() => navigate('/home')}>Retour à l'accueil</Button>
      </main>
    )
  }

  const progress = 1 - secondsLeft / routine.timerSeconds

  function startTimer() {
    setSecondsLeft(routine.timerSeconds)
    setTimerRunning(true)
  }

  function handleDone() {
    markPracticeToday()
    setDone(true)
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <Button variant="ghost" onClick={() => navigate('/home')}>
          ← Retour à l'accueil
        </Button>

        <p className="mt-4 text-sm font-semibold text-teal-600 dark:text-teal-400">
          {routine.icon} Routine du {routine.label.toLowerCase()}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-navy-800 dark:text-sand-100">{routine.title}</h1>
        <p className="mt-2 text-navy-800/70 dark:text-sand-100/70">{routine.detail}</p>

        <ol className="mt-5 flex flex-col gap-2">
          {routine.steps.map((step, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-white p-3 text-sm dark:bg-navy-800">
              <span className="shrink-0 font-semibold text-coral-500">{i + 1}.</span>
              <span className="text-navy-800/80 dark:text-sand-100/80">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-col items-center rounded-2xl bg-white p-6 dark:bg-navy-800">
          {timerRunning ? (
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
          ) : (
            <Button onClick={startTimer}>Lancer le minuteur ({routine.timerSeconds}s)</Button>
          )}
        </div>

        <Button className="mt-6 w-full" variant={done ? 'secondary' : 'primary'} disabled={done} onClick={handleDone}>
          {done ? 'Terminé ✓' : 'Marquer comme fait'}
        </Button>
      </div>
    </main>
  )
}
