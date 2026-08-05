import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile, getPracticeStats } from '../lib/profile.js'
import { getBadges } from '../lib/badges.js'
import { getTheme, applyTheme } from '../lib/theme.js'
import { getUserSettings } from '../lib/userSettings.js'
import { isPremiumActive, getSubscription, cancelSubscription } from '../lib/subscription.js'
import { getSeasons } from '../lib/seasons.js'
import { getSeasonProgress, getNextEpisode } from '../lib/seasonProgress.js'
import { signOut } from '../lib/supabase.js'

const THEME_OPTIONS = [
  { id: 'light', label: 'Clair', icon: '☀️' },
  { id: 'system', label: 'Système', icon: '⚙️' },
  { id: 'dark', label: 'Sombre', icon: '🌙' },
]

const GOAL_LABELS = {
  reduction: 'Réduire progressivement',
  stop: 'Arrêter complètement',
  damage: 'Gérer les cicatrices / dégâts visibles',
  confidence: 'Reprendre confiance en moi',
}

const LOCAL_KEYS = [
  'ticsProfile',
  'ticsPracticeDays',
  'ticsEpisodes',
  'ticsJournal',
  'ticsChecklist',
  'ticsCommunityPosts',
  'ticsCoachUsed',
  'ticsLibraryVisited',
  'ticsSeasonProgress',
  'ticsSubscription',
  'ticsDeepAnswers',
  'ticsUserSettings',
  'ticsStreakRestores',
  'ticsTutorialSeen',
  'quizAnswers',
]

export default function Profile() {
  const navigate = useNavigate()
  const [profile] = useState(() => loadProfile())
  const stats = getPracticeStats()
  const badges = getBadges()
  const unlockedCount = badges.filter((b) => b.unlocked).length
  const [theme, setTheme] = useState(() => getTheme())
  const [expandedBadge, setExpandedBadge] = useState(null)
  const settings = getUserSettings()
  const [premium, setPremium] = useState(() => isPremiumActive())
  const [subscription, setSubscription] = useState(() => getSubscription())
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  function handleThemeChange(id) {
    applyTheme(id)
    setTheme(id)
  }

  if (!profile) {
    navigate('/', { replace: true })
    return null
  }

  function handleCancelSubscription() {
    const confirmed = window.confirm(
      "Annuler ton abonnement Premium ? Tu gardes l'accès jusqu'à la fin de la période en cours."
    )
    if (!confirmed) return
    cancelSubscription()
    setSubscription(getSubscription())
    setPremium(isPremiumActive())
  }

  function handleReset() {
    if (confirmText.trim().toLowerCase() !== 'supprimer') return
    LOCAL_KEYS.forEach((k) => localStorage.removeItem(k))
    navigate('/', { replace: true })
  }

  async function handleLogout() {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-2xl dark:bg-teal-700/30">
            {settings.avatarEmoji}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-navy-800 dark:text-sand-100">
                {settings.displayName || 'Ton profil'}
              </h1>
              {premium && (
                <span className="rounded-full bg-coral-100 px-2 py-0.5 text-xs font-semibold text-coral-600 dark:bg-coral-500/10 dark:text-coral-300">
                  ⭐ Premium
                </span>
              )}
            </div>
            <p className="text-xs text-navy-800/50 dark:text-sand-100/50">
              Communauté : {settings.communityPublic ? settings.communityPseudo : 'Anonyme'}
            </p>
          </div>
        </div>
        <Button variant="ghost" className="mt-3" onClick={() => navigate('/settings')}>
          Modifier mon profil
        </Button>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-navy-800">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">Ton plan</p>
          <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
            {profile.plan.durationDays} jours · objectif : {GOAL_LABELS[profile.plan.goal] ?? profile.plan.goal}
          </p>
          <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
            {stats.practicedThisWeek}/{stats.totalWeekDays} jours pratiqués cette semaine
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {profile.plan.behaviors.map((b) => {
              const season = getSeasons(b)[0]
              const progress = getSeasonProgress(b.id, season)
              const next = getNextEpisode(b.id, season)
              const percent = progress.total === 0 ? 0 : Math.round((progress.completed / progress.total) * 100)
              return (
                <div key={b.id} className="rounded-2xl bg-teal-50 p-3 dark:bg-navy-900/40">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-800 dark:text-sand-100">{b.label}</span>
                    <span className="text-xs text-navy-800/50 dark:text-sand-100/50">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-teal-200 dark:bg-teal-700/40">
                    <div className="h-1.5 rounded-full bg-coral-500" style={{ width: `${percent}%` }} />
                  </div>
                  {next && (
                    <button
                      type="button"
                      onClick={() => navigate(`/episode/${b.id}/${next.id}`)}
                      className="mt-2 text-xs font-medium text-teal-600 dark:text-teal-400"
                    >
                      Prochain : {next.title} →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-800 dark:text-sand-100">Badges</h2>
            <span className="text-sm text-navy-800/50 dark:text-sand-100/50">
              {unlockedCount}/{badges.length}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setExpandedBadge((cur) => (cur === b.id ? null : b.id))}
                className={`rounded-2xl p-4 text-center transition-opacity ${
                  b.unlocked ? 'bg-white dark:bg-navy-800' : 'bg-white/50 opacity-60 dark:bg-navy-800/50'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="mt-1 text-sm font-medium text-navy-800 dark:text-sand-100">
                  {b.label}
                </div>
                <div className="mt-0.5 text-xs text-navy-800/40 dark:text-sand-100/40">
                  {b.progress.current}/{b.progress.target}
                </div>
              </button>
            ))}
          </div>

          {expandedBadge && (
            <div className="mt-3 rounded-2xl bg-teal-100/60 p-4 dark:bg-teal-700/10">
              {(() => {
                const b = badges.find((x) => x.id === expandedBadge)
                const percent = Math.round((b.progress.current / b.progress.target) * 100)
                return (
                  <>
                    <p className="font-semibold text-navy-800 dark:text-sand-100">
                      {b.icon} {b.label} {b.unlocked && '· débloqué ✓'}
                    </p>
                    <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
                      Condition : {b.detail}
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-teal-200 dark:bg-teal-700/40">
                      <div className="h-1.5 rounded-full bg-coral-500" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-navy-800/50 dark:text-sand-100/50">
                      Progression : {b.progress.current}/{b.progress.target}
                    </p>
                  </>
                )
              })()}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-navy-800">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
            Confidentialité communauté
          </p>
          <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
            {settings.communityPublic
              ? `Public — affiché comme "${settings.communityPseudo}"`
              : `Anonyme — affiché comme "${settings.communityPseudo || 'Anonyme'}"`}
          </p>
          <Button variant="ghost" className="mt-2" onClick={() => navigate('/settings')}>
            Modifier
          </Button>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-navy-800">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">Apparence</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleThemeChange(opt.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-3 text-xs font-medium transition-colors ${
                  theme === opt.id
                    ? 'border-coral-500 bg-coral-100/60 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300'
                    : 'border-teal-200 text-navy-800/70 dark:border-teal-700 dark:text-sand-100/70'
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-coral-100/60 p-5 dark:bg-coral-500/10">
          {premium ? (
            <>
              <p className="font-semibold text-coral-600 dark:text-coral-300">
                Premium actif · {subscription?.plan === 'yearly' ? 'Annuel' : 'Mensuel'}
                {subscription?.cancelledAt && ' (annulé, actif jusqu’à la fin de l’essai)'}
              </p>
              <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
                Merci de soutenir l'app. Tu profites de tout ce que Premium débloque.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => navigate('/premium')}>
                  Changer d'offre
                </Button>
                {!subscription?.cancelledAt && (
                  <Button variant="ghost" onClick={handleCancelSubscription}>
                    Annuler mon abonnement
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold text-coral-600 dark:text-coral-300">Passer en Premium</p>
              <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
                Coach illimité, communauté complète, suivi photo, statistiques avancées.
              </p>
              <Button className="mt-3" onClick={() => navigate('/premium')}>
                Voir l'offre
              </Button>
            </>
          )}
        </section>

        <section className="mt-8">
          <Button variant="secondary" className="w-full" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </section>

        <section className="mt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="text-sm text-navy-800/40 dark:text-sand-100/40"
          >
            {showAdvanced ? 'Masquer les réglages avancés' : 'Réglages avancés'}
          </button>

          {showAdvanced && (
            <div className="mt-3 rounded-2xl border-2 border-coral-200 p-4 dark:border-coral-500/20">
              <p className="text-sm font-semibold text-coral-600 dark:text-coral-300">
                Zone à risque
              </p>
              <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
                Réinitialise ton plan, ta progression, tes badges et tes réglages sur cet appareil.
                Action irréversible.
              </p>
              <label
                htmlFor="reset-confirm"
                className="mt-3 block text-xs font-medium text-navy-800/70 dark:text-sand-100/70"
              >
                Tape "supprimer" pour confirmer
              </label>
              <input
                id="reset-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="supprimer"
                className="mt-1 w-full rounded-2xl border-2 border-teal-200 bg-transparent px-4 py-2 text-sm text-navy-800 placeholder:text-navy-800/30 focus:border-coral-400 focus:outline-none dark:border-teal-700 dark:text-sand-100"
              />
              <Button
                variant="secondary"
                className="mt-3 w-full"
                disabled={confirmText.trim().toLowerCase() !== 'supprimer'}
                onClick={handleReset}
              >
                Réinitialiser mes données
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
