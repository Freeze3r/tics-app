import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center bg-sage-50 px-6 py-12 text-center dark:bg-ink-900">
      <div
        className="mb-8 h-24 w-24 rounded-full bg-sage-200/70 dark:bg-sage-700/40"
        style={{
          animation: 'breathe 4s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.12); opacity: 1; }
        }
      `}</style>

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
