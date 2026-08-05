import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { generatePlan } from '../lib/planGenerator.js'
import { savePlan } from '../lib/supabase.js'
import { saveProfile } from '../lib/profile.js'

export default function Plan() {
  const location = useLocation()
  const navigate = useNavigate()
  const [saveState, setSaveState] = useState('idle')

  const answers = useMemo(() => {
    if (location.state?.answers) return location.state.answers
    const stored = sessionStorage.getItem('quizAnswers')
    return stored ? JSON.parse(stored) : null
  }, [location.state])

  const plan = useMemo(() => (answers ? generatePlan(answers) : null), [answers])

  useEffect(() => {
    if (!plan) return
    saveProfile(answers, plan)
    setSaveState('saving')
    savePlan(answers, plan)
      .then((result) => setSaveState(result.skipped ? 'local-only' : 'saved'))
      .catch(() => setSaveState('error'))
  }, [plan, answers])

  if (!answers || !plan) {
    return (
      <main className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 bg-sage-50 px-6 text-center dark:bg-ink-900">
        <p className="text-ink-800 dark:text-sand-100">On n'a pas retrouvé tes réponses.</p>
        <Button onClick={() => navigate('/quiz')}>Refaire le quiz</Button>
      </main>
    )
  }

  return (
    <main className="min-h-svh flex-1 bg-sage-50 px-6 py-10 dark:bg-ink-900">
      <div className="mx-auto max-w-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-sage-600 dark:text-sage-400">
          Ton plan personnalisé
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink-800 dark:text-sand-100">
          {plan.durationDays} jours de pratique consciente
        </h1>
        <p className="mt-2 text-ink-800/70 dark:text-sand-100/70">
          Pas de compteur qui repart à zéro. On regarde ta progression sur la durée, pas un
          instant isolé.
        </p>

        {plan.suggestProfessional && (
          <div className="mt-6 rounded-2xl bg-coral-100 px-4 py-3 text-sm text-coral-600 dark:bg-coral-500/10 dark:text-coral-300">
            Vu ce que tu nous as partagé, ça pourrait vraiment t'aider d'en parler aussi à un
            professionnel (dermatologue ou psychologue spécialisé TCC/CBIT). L'app reste un bon
            complément, pas un remplacement.
          </div>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink-800 dark:text-sand-100">
            Tes exercices recommandés
          </h2>
          <div className="mt-3 flex flex-col gap-4">
            {plan.exercisesByBehavior.map(({ behavior, exercises }) => (
              <div key={behavior.id} className="rounded-2xl bg-white p-4 dark:bg-ink-800">
                <div className="font-semibold text-ink-800 dark:text-sand-100">{behavior.label}</div>
                <ul className="mt-2 flex flex-col gap-2">
                  {exercises.map((ex) => (
                    <li key={ex.title} className="text-sm text-ink-800/70 dark:text-sand-100/70">
                      <span className="font-medium text-ink-800 dark:text-sand-100">{ex.title}</span>
                      {' — '}
                      {ex.detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink-800 dark:text-sand-100">
            Entraînement quotidien (3-5 min)
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {plan.dailyTraining.map((ex) => (
              <div key={ex.title} className="rounded-2xl bg-white p-4 text-sm dark:bg-ink-800">
                <span className="font-medium text-ink-800 dark:text-sand-100">{ex.title}</span>
                {' — '}
                <span className="text-ink-800/70 dark:text-sand-100/70">{ex.detail}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex justify-center">
          <Button onClick={() => navigate('/home')}>Continuer vers l'app</Button>
        </div>

        <p className="mt-4 text-center text-xs text-ink-800/40 dark:text-sand-100/40">
          {saveState === 'saved' && 'Plan enregistré.'}
          {saveState === 'saving' && 'Enregistrement…'}
          {saveState === 'error' && 'Pas de connexion — ton plan reste disponible ici.'}
          {saveState === 'local-only' && 'Plan disponible sur cet appareil uniquement.'}
        </p>
      </div>
    </main>
  )
}
