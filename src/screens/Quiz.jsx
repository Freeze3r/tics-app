import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { QUIZ_QUESTIONS } from '../data/quizQuestions.js'

function OptionCard({ selected, onClick, label, sublabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition-colors duration-150 ${
        selected
          ? 'border-coral-500 bg-coral-100/60 dark:bg-coral-500/10'
          : 'border-sage-200 hover:border-sage-300 dark:border-sage-700 dark:hover:border-sage-600'
      }`}
    >
      <div className="font-semibold text-ink-800 dark:text-sand-100">{label}</div>
      {sublabel && (
        <div className="mt-0.5 text-sm text-ink-800/60 dark:text-sand-100/60">{sublabel}</div>
      )}
    </button>
  )
}

export default function Quiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ behaviors: [], triggers: [] })

  const question = QUIZ_QUESTIONS[step]
  const isLast = step === QUIZ_QUESTIONS.length - 1

  function toggleMulti(key, value) {
    setAnswers((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  function setSingle(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function isAnswered() {
    const value = answers[question.key]
    if (question.type === 'text') return true
    if (question.type === 'multi') return (value ?? []).length > 0
    return value !== undefined && value !== null
  }

  function handleNext() {
    if (isLast) {
      sessionStorage.setItem('quizAnswers', JSON.stringify(answers))
      navigate('/plan', { state: { answers } })
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <main className="flex min-h-svh flex-1 flex-col bg-sage-50 px-6 py-8 dark:bg-ink-900">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <ProgressDots total={QUIZ_QUESTIONS.length} current={step} />

        <div className="mt-8 flex-1">
          <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">{question.title}</h1>
          {question.subtitle && (
            <p className="mt-2 text-ink-800/60 dark:text-sand-100/60">{question.subtitle}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {question.type === 'text' ? (
              <textarea
                value={answers[question.key] ?? ''}
                onChange={(e) => setSingle(question.key, e.target.value)}
                placeholder="Par exemple : je tire sur la peau autour de mes ongles quand je stresse…"
                rows={4}
                className="w-full resize-none rounded-2xl border-2 border-sage-200 bg-transparent p-4 text-ink-800 placeholder:text-ink-800/40 focus:border-sage-400 focus:outline-none dark:border-sage-700 dark:text-sand-100 dark:placeholder:text-sand-100/40"
              />
            ) : question.type === 'boolean' ? (
              <div className="flex gap-3">
                {[
                  { value: true, label: 'Oui' },
                  { value: false, label: 'Non' },
                ].map((opt) => (
                  <OptionCard
                    key={String(opt.value)}
                    label={opt.label}
                    selected={answers[question.key] === opt.value}
                    onClick={() => setSingle(question.key, opt.value)}
                  />
                ))}
              </div>
            ) : (
              question.options.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  sublabel={opt.sublabel}
                  selected={
                    question.type === 'multi'
                      ? (answers[question.key] ?? []).includes(opt.value)
                      : answers[question.key] === opt.value
                  }
                  onClick={() =>
                    question.type === 'multi'
                      ? toggleMulti(question.key, opt.value)
                      : setSingle(question.key, opt.value)
                  }
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => (step === 0 ? navigate('/') : setStep((s) => s - 1))}>
            Retour
          </Button>
          <Button onClick={handleNext} disabled={!isAnswered()}>
            {isLast ? 'Voir mon plan' : 'Continuer'}
          </Button>
        </div>
      </div>
    </main>
  )
}
