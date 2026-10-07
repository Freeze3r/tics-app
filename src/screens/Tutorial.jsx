import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Mascot from '../components/Mascot.jsx'
import ProgressDots from '../components/ProgressDots.jsx'
import { markTutorialSeen } from '../lib/tutorial.js'
import { NAV_ITEMS, navItemClass } from '../data/navItems.js'
import { NavFrame } from '../components/NavBar.jsx'

const STEPS = [
  {
    icon: '👋',
    menu: null,
    title: 'Salut !',
    text: "Moi c'est ta petite pousse compagne. Je vais te montrer les 5 menus en bas de l'écran, en quelques secondes chacun.",
  },
  {
    icon: '🏠',
    menu: 'Accueil',
    title: 'Accueil',
    text: "Ta série de pratique, ton exercice du jour, et un accès direct à SOS ou au tracker. C'est ton point de départ à chaque ouverture.",
  },
  {
    icon: '🌿',
    menu: 'SOS',
    title: 'SOS',
    text: "Envie forte là, maintenant ? Un tap ici, tu choisis ton comportement, on t'affiche l'exercice et tu lances le chrono quand tu es prêt·e.",
  },
  {
    icon: '📝',
    menu: 'Tracker',
    title: 'Tracker',
    text: 'Ton programme rangé en Saisons et Épisodes, comme une série à suivre à ton rythme. Tu peux aussi y noter un moment difficile, sans jugement.',
  },
  {
    icon: '💬',
    menu: 'Coach',
    title: 'Coach',
    text: "Dispo 24/7 pour en parler — d'un épisode, d'une envie, ou d'autre chose. Il t'écoute vraiment, pas juste un bot mono-sujet.",
  },
  {
    icon: '🙂',
    menu: 'Profil',
    title: 'Profil',
    text: 'Tes badges, ton titre, tes réglages de confidentialité, tes données. Tout se passe là si tu veux ajuster quelque chose.',
  },
]

export default function Tutorial() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

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
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center px-6 py-10 pb-32 text-center">
      <Mascot size="lg" bounce />

      <div className="mt-6 max-w-sm surface rounded-3xl rounded-tl-none p-5">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">{current.icon}</span>
          <p className="font-semibold text-navy-800 dark:text-sand-100">{current.title}</p>
        </div>
        <p className="mt-2 text-navy-800/80 dark:text-sand-100/80">{current.text}</p>
      </div>

      <div className="mt-8">
        <ProgressDots total={STEPS.length} current={step} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button onClick={handleNext}>{isLast ? "C'est parti" : 'Suivant'}</Button>
        <button
          type="button"
          onClick={finish}
          className="text-center text-sm text-navy-800/50 dark:text-sand-100/50"
        >
          Passer
        </button>
      </div>

      {/* Maquette de la vraie barre de nav : la mascotte doit pointer vers un
          menu qu'on voit réellement à l'écran, pas juste en décrire un dans le
          vide — l'item correspondant à l'étape courante s'illumine. */}
      <NavFrame>
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === current.menu
          return (
            <div
              key={item.to}
              className={`${navItemClass({ active: false, emphasis: item.emphasis })} ${
                isActive
                  ? "nav-item-spotlight"
                  : "opacity-60"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </div>
          )
        })}
      </NavFrame>
    </main>
  )
}
