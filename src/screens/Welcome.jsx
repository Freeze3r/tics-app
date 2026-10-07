import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Mascot from '../components/Mascot.jsx'

// Petites cartes flottantes décoratives : rappellent les outils de l'app sans rien promettre.
const FLOATERS = [
  { icon: '🫁', label: 'Respirer', className: 'left-[6%] top-[14%] float-slow' },
  { icon: '✊', label: 'Poings serrés', className: 'right-[5%] top-[22%] float-slower' },
  { icon: '🌿', label: 'SOS', className: 'left-[9%] bottom-[22%] float-slower' },
  { icon: '📈', label: 'Ta progression', className: 'right-[7%] bottom-[16%] float-slow' },
]

const PILLS = ['Sans jugement', 'À ton rythme', 'Données sur ton appareil']

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      {FLOATERS.map((f) => (
        <div
          key={f.label}
          className={`surface absolute hidden items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold sm:flex ${f.className}`}
          aria-hidden="true"
        >
          <span className="text-base">{f.icon}</span>
          {f.label}
        </div>
      ))}

      <Mascot size="lg" bounce className="mb-8 scale-125" />

      <p className="text-gradient text-sm font-bold uppercase tracking-[0.45em]">Sooth</p>
      <h1 className="mt-3 max-w-md text-4xl font-bold leading-[1.1] text-navy-800 dark:text-sand-100">
        Reprends le contrôle, <span className="text-gradient">sans honte.</span>
      </h1>
      <p className="mt-4 max-w-sm text-lg text-navy-800/75 dark:text-sand-100/75">
        Tu n'es pas seul·e — 1 personne sur 20 vit avec un comportement comme le tien. On est là
        pour t'aider, à ton rythme.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {PILLS.map((p) => (
          <span key={p} className="surface rounded-full px-3 py-1 text-xs font-medium">
            {p}
          </span>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <Button className="px-10 py-4 text-lg" onClick={() => navigate('/auth')}>
          Commencer en douceur
        </Button>
        <p className="text-sm text-navy-800/55 dark:text-sand-100/55">
          2 minutes, tes données restent privées
        </p>
      </div>

      <div className="mt-10 flex gap-4 text-xs text-navy-800/45 dark:text-sand-100/45">
        <button type="button" onClick={() => navigate('/legal/mentions-legales')}>
          Mentions légales
        </button>
        <button type="button" onClick={() => navigate('/legal/cgu')}>
          CGU
        </button>
        <button type="button" onClick={() => navigate('/legal/confidentialite')}>
          Confidentialité
        </button>
      </div>
    </main>
  )
}
