import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { supabase, signUpWithEmail, signInWithEmail, requestPasswordReset } from '../lib/supabase.js'
import { resolveAuthScope } from '../lib/authScope.js'
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
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'login' ? 'login' : 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [resetSent, setResetSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    resolveAuthScope().then((user) => {
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
      const user = await resolveAuthScope()
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

  async function handleResetRequest(e) {
    e.preventDefault()
    setError(null)
    if (!supabase) {
      setError("La connexion n'est pas encore configurée sur cet environnement.")
      return
    }
    setLoading(true)
    try {
      await requestPasswordReset(email)
      setResetSent(true)
    } catch (err) {
      setError(friendlyError(err.message))
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) return null

  if (mode === 'reset') {
    return (
      <main className="flex min-h-svh flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-center text-2xl font-bold text-navy-800 dark:text-sand-100">
            Mot de passe oublié
          </h1>
          <p className="mt-2 text-center text-navy-800/60 dark:text-sand-100/60">
            {resetSent
              ? 'Si un compte existe avec cet email, un lien de réinitialisation vient de partir — vérifie ta boîte mail.'
              : 'Indique ton email, on t\'envoie un lien pour choisir un nouveau mot de passe.'}
          </p>

          {!resetSent && (
            <form onSubmit={handleResetRequest} className="mt-6 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="reset-email"
                  className="mb-1 block text-sm font-medium text-navy-800 dark:text-sand-100"
                >
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@exemple.com"
                  className="field w-full rounded-2xl px-4 py-3 text-sm"
                />
              </div>

              {error && <p className="text-sm text-coral-600 dark:text-coral-300">{error}</p>}

              <Button type="submit" className="mt-1 w-full" disabled={loading}>
                {loading ? 'Un instant…' : 'Envoyer le lien'}
              </Button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
              setResetSent(false)
            }}
            className="mt-5 w-full text-center text-sm text-teal-600 dark:text-neon-400"
          >
            ← Retour à la connexion
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-navy-800 dark:text-sand-100">
          {mode === 'signup' ? 'Crée ton compte' : 'Bon retour'}
        </h1>
        <p className="mt-2 text-center text-navy-800/60 dark:text-sand-100/60">
          {mode === 'signup'
            ? 'Pour garder ton plan et ta progression en sécurité, où que tu te connectes.'
            : 'Connecte-toi pour retrouver ton plan et ta progression.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1 block text-sm font-medium text-navy-800 dark:text-sand-100"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="field w-full rounded-2xl px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1 block text-sm font-medium text-navy-800 dark:text-sand-100"
            >
              Mot de passe
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              className="field w-full rounded-2xl px-4 py-3 text-sm"
            />
          </div>

          {mode === 'login' && (
            <button
              type="button"
              onClick={() => {
                setMode('reset')
                setError(null)
              }}
              className="-mt-2 self-end text-xs text-teal-600 dark:text-neon-400"
            >
              Mot de passe oublié ?
            </button>
          )}

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
          className="mt-5 w-full text-center text-sm text-teal-600 dark:text-neon-400"
        >
          {mode === 'signup' ? 'Déjà un compte ? Se connecter' : "Pas encore de compte ? Créer un compte"}
        </button>
      </div>
    </main>
  )
}
