import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Mascot from '../components/Mascot.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { markTutorialSeen } from '../lib/tutorial.js'

const STEPS = [
  {
    text: "Salut, moi c'est ta petite plante compagne. Je vais te montrer les 5 trucs à connaître, ça prend 30 secondes.",
  },
  {
    text: "Le bouton SOS, en bas, c'est pour les envies fortes. Un tap, tu choisis ton comportement, on te guide.",
  },
  {
    text: "Le Tracker organise ton programme en Saisons et Épisodes — un peu comme une série, mais pour reprendre le contrôle. Tu avances à ton rythme.",
  },
  {
    text: "Le Coach est là 24/7 si tu veux en parler, même de quelque chose qui n'a rien à voir avec tes tics.",
  },
  {
    text: "Chaque jour où tu ouvres l'app et pratiques un peu, ça compte dans ta série 🔥. Un jour raté n'efface rien.",
  },
  {
    text: "Et la Communauté, c'est plein de gens comme toi qui partagent leurs petites victoires. Prêt·e ?",
  },
]

export default function Tutorial() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1

  function finish() {
    markTutorialSeen()
    navigate('/home')
  }

  function handleNext() {
    if (isLast) {
      finish()
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center bg-sage-50 px-6 py-10 text-center dark:bg-ink-900">
      <Mascot size="lg" bounce />

      <div className="mt-6 max-w-sm rounded-3xl rounded-tl-none bg-white p-5 dark:bg-ink-800">
        <p className="text-ink-800 dark:text-sand-100">{STEPS[step].text}</p>
      </div>

      <div className="mt-8">
        <ProgressDots total={STEPS.length} current={step} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button onClick={handleNext}>{isLast ? "C'est parti" : 'Suivant'}</Button>
        <button
          type="button"
          onClick={finish}
          className="text-center text-sm text-ink-800/50 dark:text-sand-100/50"
        >
          Passer
        </button>
      </div>
    </main>
  )
}
