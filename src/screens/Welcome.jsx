import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Mascot from '../components/Mascot.jsx'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-teal-50 to-sand-50 px-6 py-12 text-center dark:from-navy-900 dark:to-navy-900">
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-coral-200/40 blur-3xl dark:bg-coral-500/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl dark:bg-teal-600/10"
        aria-hidden="true"
      />

      <Mascot size="lg" bounce className="mb-6" />

      <p className="text-sm font-bold uppercase tracking-[0.3em] text-coral-500 dark:text-coral-300">
        Sooth
      </p>
      <h1 className="mt-2 max-w-md text-3xl font-extrabold leading-tight text-navy-800 dark:text-sand-100">
        Reprends le contrôle, sans honte.
      </h1>
      <p className="mt-3 max-w-sm text-lg text-navy-800/80 dark:text-sand-100/80">
        Tu n'es pas seul·e — 1 personne sur 20 vit avec un comportement comme le tien. On est là
        pour t'aider, à ton rythme.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <Button onClick={() => navigate('/auth')}>Commencer en douceur</Button>
        <p className="text-sm text-navy-800/50 dark:text-sand-100/50">
          2 minutes, tes données restent privées
        </p>
      </div>
    </main>
  )
}
