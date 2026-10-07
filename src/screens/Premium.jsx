import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Mascot from '../components/Mascot.jsx'
import { TOP_BENEFITS, COMPARISON_TABLE } from '../data/premiumBenefits.js'

// Premium n'est pas encore ouvert : tout Sooth est gratuit pour l'instant. Cet écran
// présente ce qui viendra, sans aucun paiement (voir PREMIUM_LAUNCHED dans subscription.js).
export default function Premium() {
  const navigate = useNavigate()
  const [showComparison, setShowComparison] = useState(false)

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Retour
        </Button>

        <div className="mt-4 flex flex-col items-center text-center">
          <Mascot size="lg" bounce />
          <span className="mt-4 rounded-full bg-coral-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-coral-600 dark:bg-coral-500/10 dark:text-coral-300">
            Bientôt disponible
          </span>
          <h1 className="mt-3 text-2xl font-bold text-navy-800 dark:text-sand-100">
            Sooth Premium arrive
          </h1>
          <p className="mt-2 text-navy-800/70 dark:text-sand-100/70">
            Pour l'instant, <strong>tout Sooth est gratuit</strong> : coach, exercices, suivi,
            bibliothèque, communauté. Premium viendra plus tard, pour aller encore plus loin — on
            te préviendra bien avant.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-navy-800 dark:text-sand-100">
            Ce qui est prévu avec Premium
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {TOP_BENEFITS.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-navy-800/80 dark:text-sand-100/80">
                <span className="text-teal-500">✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setShowComparison((s) => !s)}
            className="mt-4 text-sm font-medium text-teal-600 dark:text-neon-400"
          >
            {showComparison ? 'Masquer le comparatif' : 'Voir le comparatif complet →'}
          </button>

          {showComparison && (
            <div className="mt-4 overflow-x-auto rounded-2xl surface">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-teal-100 dark:border-teal-700/40">
                    <th className="p-3 font-semibold text-navy-800 dark:text-sand-100">Fonctionnalité</th>
                    <th className="p-3 font-semibold text-navy-800/60 dark:text-sand-100/60">Aujourd'hui</th>
                    <th className="p-3 font-semibold text-coral-600 dark:text-coral-300">Plus tard</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_TABLE.map((row) => (
                    <tr key={row.feature} className="border-b border-teal-100 last:border-0 dark:border-teal-700/40">
                      <td className="p-3 text-navy-800 dark:text-sand-100">{row.feature}</td>
                      <td className="p-3 text-navy-800/60 dark:text-sand-100/60">{row.free}</td>
                      <td className="p-3 text-coral-600 dark:text-coral-300">{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <Button className="mt-8 w-full" onClick={() => navigate('/home')}>
          Retour à l'app
        </Button>
      </div>
    </main>
  )
}
