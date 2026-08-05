import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Mascot from '../components/Mascot.jsx'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-sage-50 to-sand-50 px-6 py-12 text-center dark:from-ink-900 dark:to-ink-900">
      <div
        className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-coral-200/40 blur-3xl dark:bg-coral-500/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sage-300/40 blur-3xl dark:bg-sage-600/10"
        aria-hidden="true"
      />

      <Mascot size="lg" bounce className="mb-8" />

      <h1 className="max-w-md text-3xl font-extrabold leading-tight text-ink-800 dark:text-sand-100">
        Tu n'es pas seul·e.
      </h1>
      <p className="mt-3 max-w-sm text-lg text-ink-800/80 dark:text-sand-100/80">
        1 personne sur 20 vit avec un comportement comme le tien. On est là pour t'aider à
        reprendre le contrôle, à ton rythme, sans jugement.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        <Button onClick={() => navigate('/auth')}>Commencer en douceur</Button>
        <p className="text-sm text-ink-800/50 dark:text-sand-100/50">
          2 minutes, tes données restent privées
        </p>
      </div>
    </main>
  )
}
