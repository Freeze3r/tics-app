import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { supabase, getCurrentUser, signUpWithEmail, signInWithEmail, signInWithGoogle } from '../lib/supabase.js'
import { loadProfile } from '../lib/profile.js'

const ERROR_MESSAGES = {
  'Invalid login credentials': 'Email ou mot de passe incorrect.',
  'User already registered': 'Un compte existe déjà avec cet email — essaie de te connecter.',
  'Password should be at least 6 characters.': 'Le mot de passe doit faire au moins 6 caractères.',
}

function friendlyError(message) {
  return ERROR_MESSAGES[message] ?? message ?? "Un problème est survenu, réessaie."
}

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('signup') // signup | login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        navigate(loadProfile() ? '/home' : '/quiz', { replace: true })
      } else {
        setCheckingSession(false)
      }
    })
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!supabase) {
      setError("La connexion n'est pas encore configurée sur cet environnement.")
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }
      const user = await getCurrentUser()
      if (!user) {
        setError('Vérifie ta boîte mail pour confirmer ton compte, puis reviens te connecter.')
        return
      }
      if (loadProfile()) {
        navigate('/home')
      } else if (mode === 'signup') {
        navigate('/settings?onboarding=1')
      } else {
        navigate('/quiz')
      }
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      setError("La connexion Google n'est pas encore activée sur cette app.")
    }
  }

  if (checkingSession) return null

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center bg-sage-50 px-6 py-12 dark:bg-ink-900">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-ink-800 dark:text-sand-100">
          {mode === 'signup' ? 'Crée ton espace' : 'Bon retour'}
        </h1>
        <p className="mt-2 text-center text-ink-800/60 dark:text-sand-100/60">
          Pour garder ton plan et ta progression en sécurité, où que tu te connectes.
        </p>

        <Button variant="secondary" className="mt-8 w-full" onClick={handleGoogle}>
          Continuer avec Google
        </Button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-sage-200 dark:bg-sage-700" />
          <span className="text-xs text-ink-800/40 dark:text-sand-100/40">ou</span>
          <div className="h-px flex-1 bg-sage-200 dark:bg-sage-700" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-2xl border-2 border-sage-200 bg-white px-4 py-3 text-sm text-ink-800 placeholder:text-ink-800/40 focus:border-sage-400 focus:outline-none dark:border-sage-700 dark:bg-ink-800 dark:text-sand-100"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="rounded-2xl border-2 border-sage-200 bg-white px-4 py-3 text-sm text-ink-800 placeholder:text-ink-800/40 focus:border-sage-400 focus:outline-none dark:border-sage-700 dark:bg-ink-800 dark:text-sand-100"
          />

          {error && <p className="text-sm text-coral-600 dark:text-coral-300">{error}</p>}

          <Button type="submit" className="mt-1 w-full" disabled={loading}>
            {loading ? 'Un instant…' : mode === 'signup' ? 'Créer mon compte' : 'Me connecter'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'signup' ? 'login' : 'signup'))
            setError(null)
          }}
          className="mt-5 w-full text-center text-sm text-sage-600 dark:text-sage-400"
        >
          {mode === 'signup' ? 'Déjà un compte ? Se connecter' : "Pas encore de compte ? S'inscrire"}
        </button>
      </div>
    </main>
  )
}
