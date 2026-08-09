import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { supabase, updatePassword } from '../lib/supabase.js'

// Le lien reçu par email place l'utilisateur dans une session "recovery"
// temporaire (géré automatiquement par supabase-js via l'URL) — on attend
// cet événement avant d'autoriser le changement de mot de passe.
export default function ResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await updatePassword(password)
      setDone(true)
    } catch (err) {
      setError(err.message ?? "Un problème est survenu, réessaie.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center bg-teal-50 px-6 py-12 dark:bg-navy-900">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold text-navy-800 dark:text-sand-100">
          Nouveau mot de passe
        </h1>

        {done ? (
          <>
            <p className="mt-2 text-center text-navy-800/60 dark:text-sand-100/60">
              Ton mot de passe a été changé — tu peux te reconnecter.
            </p>
            <Button className="mt-6 w-full" onClick={() => navigate('/auth?mode=login')}>
              Aller à la connexion
            </Button>
          </>
        ) : !ready ? (
          <p className="mt-2 text-center text-navy-800/60 dark:text-sand-100/60">
            Ce lien n'est plus valide ou a déjà été utilisé — redemande un lien depuis l'écran de
            connexion.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block text-sm font-medium text-navy-800 dark:text-sand-100"
              >
                Nouveau mot de passe
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="w-full rounded-2xl border-2 border-teal-200 bg-white px-4 py-3 text-sm text-navy-800 placeholder:text-navy-800/40 focus:border-teal-400 focus:outline-none dark:border-teal-700 dark:bg-navy-800 dark:text-sand-100"
              />
            </div>

            {error && <p className="text-sm text-coral-600 dark:text-coral-300">{error}</p>}

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? 'Un instant…' : 'Changer mon mot de passe'}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}
