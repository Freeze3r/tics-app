import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'

const FEATURES = [
  'Coach illimité, à toute heure',
  'Communauté complète et modérée',
  'Suivi photo privé et chiffré (optionnel)',
  'Statistiques avancées et détection de patterns',
  'Bibliothèque complète d’exercices par comportement',
]

const PLANS = [
  { id: 'weekly', label: 'Hebdo', price: '4,99 €/semaine' },
  { id: 'monthly', label: 'Mensuel', price: '12,99 €/mois', highlight: true },
  { id: 'yearly', label: 'Annuel', price: '69,99 €/an' },
]

export default function Premium() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('monthly')
  const [message, setMessage] = useState('')

  function handleStart() {
    // Mock volontaire : aucune vraie transaction n'est déclenchée ici.
    // À intégrer plus tard avec Stripe (ou RevenueCat pour du mobile natif).
    setMessage(
      'Aperçu uniquement — le paiement réel (Stripe) reste à intégrer avant le lancement.'
    )
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Retour
        </Button>

        <h1 className="mt-4 text-2xl font-bold text-ink-800 dark:text-sand-100">
          Va plus loin, à ton rythme
        </h1>
        <p className="mt-2 text-ink-800/70 dark:text-sand-100/70">
          7 jours d'essai gratuit. On te prévient avant tout prélèvement — jamais de surprise.
        </p>

        <ul className="mt-6 flex flex-col gap-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-800/80 dark:text-sand-100/80">
              <span className="text-sage-500">✓</span> {f}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
                selected === p.id
                  ? 'border-coral-500 bg-coral-100/60 dark:bg-coral-500/10'
                  : 'border-sage-200 dark:border-sage-700'
              }`}
            >
              <span className="font-semibold text-ink-800 dark:text-sand-100">
                {p.label} {p.highlight && '· le plus choisi'}
              </span>
              <span className="text-ink-800/70 dark:text-sand-100/70">{p.price}</span>
            </button>
          ))}
        </div>

        <Button className="mt-6 w-full" onClick={handleStart}>
          Commencer l'essai gratuit
        </Button>
        {message && (
          <p className="mt-3 text-center text-xs text-ink-800/50 dark:text-sand-100/50">
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-xs text-ink-800/40 dark:text-sand-100/40">
          Annulable à tout moment, en un tap, avant la fin de l'essai.
        </p>
      </div>
    </main>
  )
}
