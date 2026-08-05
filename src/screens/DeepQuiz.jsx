import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { saveDeepAnswers } from '../lib/profile.js'

const QUESTIONS = [
  {
    key: 'hardest',
    title: "Depuis que tu y penses, qu'est-ce qui te semble le plus dur avec ce comportement ?",
    placeholder: 'Prends ton temps, il n’y a pas de mauvaise réponse…',
  },
  {
    key: 'easierMoments',
    title: 'Il y a sûrement des moments où c’est plus facile pour toi. Lesquels ?',
    placeholder: 'Un moment de la journée, une activité, une personne autour de toi…',
  },
  {
    key: 'successLooksLike',
    title: 'Dans 60 jours, qu’est-ce qui te ferait dire que ça valait le coup ?',
    placeholder: 'Ça peut être petit — moins de honte, moins de marques, plus de calme…',
  },
  {
    key: 'comment',
    title: 'Tu veux ajouter quelque chose sur ta situation ?',
    placeholder: 'Optionnel — dis-nous ce que tu veux, on lit tout.',
    optional: true,
  },
]

export default function DeepQuiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const question = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1

  function handleNext() {
    if (isLast) {
      saveDeepAnswers(answers)
      navigate('/home')
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <main className="flex min-h-svh flex-1 flex-col bg-sage-50 px-6 py-8 dark:bg-ink-900">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <p className="text-center text-sm font-semibold text-sage-600 dark:text-sage-400">
          Ton plan détaillé
        </p>
        <div className="mt-3">
          <ProgressDots total={QUESTIONS.length} current={step} />
        </div>

        <div className="mt-8 flex-1">
          <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">{question.title}</h1>

          <textarea
            value={answers[question.key] ?? ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [question.key]: e.target.value }))}
            placeholder={question.placeholder}
            rows={6}
            className="mt-6 w-full resize-none rounded-2xl border-2 border-sage-200 bg-transparent p-4 text-ink-800 placeholder:text-ink-800/40 focus:border-sage-400 focus:outline-none dark:border-sage-700 dark:text-sand-100 dark:placeholder:text-sand-100/40"
          />
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => (step === 0 ? navigate('/home') : setStep((s) => s - 1))}>
            {step === 0 ? 'Passer pour l’instant' : 'Retour'}
          </Button>
          <Button onClick={handleNext}>{isLast ? 'Terminer' : 'Continuer'}</Button>
        </div>
      </div>
    </main>
  )
}
