import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { TOP_BENEFITS, COMPARISON_TABLE } from '../data/premiumBenefits.js'
import {
  getPricing,
  getLoyaltyOffer,
  startTrial,
  acceptLoyaltyOffer,
  getSubscription,
  isPremiumActive,
} from '../lib/subscription.js'
import { nextAfterOnboarding } from '../lib/tutorial.js'

const pricing = getPricing()

export default function Premium() {
  const navigate = useNavigate()
  const existingSub = getSubscription()
  const alreadyPremium = isPremiumActive()
  const [selected, setSelected] = useState(existingSub?.plan ?? 'yearly')
  const [showComparison, setShowComparison] = useState(false)
  const loyaltyOffer = getLoyaltyOffer()

  const yearlyMonthlyEquivalent = (pricing.yearly.introPrice / 12).toFixed(2)
  const monthlyOverOneYear =
    pricing.monthly.introPrice * pricing.monthly.introMonths +
    pricing.monthly.price * (12 - pricing.monthly.introMonths)
  const yearlySavings = Math.round(monthlyOverOneYear - pricing.yearly.introPrice)

  const isChangingPlan = alreadyPremium && existingSub?.plan !== selected
  const isSamePlan = alreadyPremium && existingSub?.plan === selected

  function handleStart() {
    startTrial(selected)
    if (alreadyPremium) {
      navigate('/profil')
      return
    }
    navigate('/deep-quiz')
  }

  function handleAcceptLoyalty() {
    acceptLoyaltyOffer()
    navigate('/home')
  }

  function ctaLabel() {
    if (isSamePlan) return 'Offre déjà active'
    if (isChangingPlan) return selected === 'yearly' ? "Passer à l'annuel" : 'Passer au mensuel'
    return selected === 'monthly' ? "Commencer l'essai gratuit (3 jours)" : "S'abonner à l'annuel"
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Retour
        </Button>

        {loyaltyOffer && (
          <div className="mt-4 rounded-2xl border-2 border-coral-500 bg-coral-100/60 p-5 dark:bg-coral-500/10">
            <p className="font-semibold text-coral-600 dark:text-coral-300">
              Offre unique pour toi — {loyaltyOffer.daysLeft} jour{loyaltyOffer.daysLeft > 1 ? 's' : ''} restant{loyaltyOffer.daysLeft > 1 ? 's' : ''}
            </p>
            <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
              Passe à l'annuel pour <strong>{loyaltyOffer.price.toFixed(2)} €</strong>, garanti pendant{' '}
              {loyaltyOffer.guaranteedYears} ans — ton mois déjà payé et ta fidélité sont déduits du prix normal.
            </p>
            <Button className="mt-3 w-full" onClick={handleAcceptLoyalty}>
              Profiter de l'offre
            </Button>
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold text-navy-800 dark:text-sand-100">
          {alreadyPremium ? 'Change ou gère ton offre' : 'Va plus loin, à ton rythme'}
        </h1>
        <p className="mt-2 text-navy-800/70 dark:text-sand-100/70">
          {alreadyPremium
            ? "Choisis un autre palier — le changement prend effet tout de suite, sans nouvel essai gratuit."
            : "Essai gratuit de 3 jours sur le mensuel. On te prévient avant tout prélèvement — jamais de surprise, et tu gardes l'accès jusqu'à la fin de l'essai même si tu annules immédiatement."}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setSelected('yearly')}
            className={`rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
              selected === 'yearly'
                ? 'border-coral-500 bg-coral-100/60 dark:bg-coral-500/10'
                : 'border-teal-200 dark:border-teal-700'
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold text-navy-800 dark:text-sand-100">
                {pricing.yearly.introPrice} €
                <span className="text-sm font-normal text-navy-800/50 dark:text-sand-100/50">/an</span>
              </span>
              {existingSub?.plan === 'yearly' && (
                <span className="rounded-full bg-teal-200 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-700/40 dark:text-teal-300">
                  Offre actuelle
                </span>
              )}
            </div>
            <p className="mt-1 font-semibold text-navy-800 dark:text-sand-100">Annuel</p>
            <p className="text-sm text-coral-600 dark:text-coral-300">
              Économise {yearlySavings} € la 1ère année
            </p>
            <p className="mt-1 text-sm text-navy-800/60 dark:text-sand-100/60">
              Soit {yearlyMonthlyEquivalent} €/mois, garanti {pricing.yearly.introYears} ans, puis{' '}
              {pricing.yearly.price} €/an
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelected('monthly')}
            className={`rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
              selected === 'monthly'
                ? 'border-coral-500 bg-coral-100/60 dark:bg-coral-500/10'
                : 'border-teal-200 dark:border-teal-700'
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold text-navy-800 dark:text-sand-100">
                {pricing.monthly.introPrice} €
                <span className="text-sm font-normal text-navy-800/50 dark:text-sand-100/50">/mois</span>
              </span>
              {existingSub?.plan === 'monthly' && (
                <span className="rounded-full bg-teal-200 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-700/40 dark:text-teal-300">
                  Offre actuelle
                </span>
              )}
            </div>
            <p className="mt-1 font-semibold text-navy-800 dark:text-sand-100">Mensuel</p>
            <p className="mt-1 text-sm text-navy-800/60 dark:text-sand-100/60">
              Pendant {pricing.monthly.introMonths} mois, puis {pricing.monthly.price} €/mois
            </p>
          </button>
        </div>

        <Button className="mt-6 w-full" onClick={handleStart} disabled={isSamePlan}>
          {ctaLabel()}
        </Button>
        <button
          type="button"
          onClick={() => navigate(alreadyPremium ? '/profil' : nextAfterOnboarding())}
          className="mt-3 w-full text-center text-sm text-navy-800/50 dark:text-sand-100/50"
        >
          {alreadyPremium ? 'Retour au profil' : 'Continuer avec la version gratuite'}
        </button>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-navy-800 dark:text-sand-100">
            Ce que débloque Premium
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
            className="mt-4 text-sm font-medium text-teal-600 dark:text-teal-400"
          >
            {showComparison ? 'Masquer le comparatif' : 'Voir le comparatif complet →'}
          </button>

          {showComparison && (
            <div className="mt-4 overflow-x-auto rounded-2xl bg-white dark:bg-navy-800">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-teal-100 dark:border-teal-700/40">
                    <th className="p-3 font-semibold text-navy-800 dark:text-sand-100">Fonctionnalité</th>
                    <th className="p-3 font-semibold text-navy-800/60 dark:text-sand-100/60">Gratuit</th>
                    <th className="p-3 font-semibold text-coral-600 dark:text-coral-300">Premium</th>
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

        <p className="mt-6 text-center text-xs text-navy-800/40 dark:text-sand-100/40">
          Annulable à tout moment, en un tap depuis ton profil.
        </p>
      </div>
    </main>
  )
}
