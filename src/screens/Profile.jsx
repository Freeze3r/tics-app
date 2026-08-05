import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile, getPracticeStats } from '../lib/profile.js'
import { getBadges } from '../lib/badges.js'
import { getTheme, applyTheme } from '../lib/theme.js'
import { getUserSettings } from '../lib/userSettings.js'
import { isPremiumActive, getSubscription } from '../lib/subscription.js'
import { getSeasons } from '../lib/seasons.js'
import { getSeasonProgress, getNextEpisode } from '../lib/seasonProgress.js'

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
  const premium = isPremiumActive()
  const subscription = getSubscription()

  function handleThemeChange(id) {
    applyTheme(id)
    setTheme(id)
  }

  if (!profile) {
    navigate('/', { replace: true })
    return null
  }

  function handleReset() {
    const confirmed = window.confirm(
      'Réinitialiser toutes tes données locales (plan, progression, badges, réglages) ? Cette action est irréversible.'
    )
    if (!confirmed) return
    LOCAL_KEYS.forEach((k) => localStorage.removeItem(k))
    navigate('/', { replace: true })
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-2xl dark:bg-sage-700/30">
            {settings.avatarEmoji}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-ink-800 dark:text-sand-100">
                {settings.displayName || 'Ton profil'}
              </h1>
              {premium && (
                <span className="rounded-full bg-coral-100 px-2 py-0.5 text-xs font-semibold text-coral-600 dark:bg-coral-500/10 dark:text-coral-300">
                  ⭐ Premium
                </span>
              )}
            </div>
            <p className="text-xs text-ink-800/50 dark:text-sand-100/50">
              Communauté : {settings.communityPublic ? settings.communityPseudo : 'Anonyme'}
            </p>
          </div>
        </div>
        <Button variant="ghost" className="mt-3" onClick={() => navigate('/settings')}>
          Modifier mon profil
        </Button>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
          <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">Ton plan</p>
          <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
            {profile.plan.durationDays} jours · objectif : {GOAL_LABELS[profile.plan.goal] ?? profile.plan.goal}
          </p>
          <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
            {stats.practicedThisWeek}/{stats.totalWeekDays} jours pratiqués cette semaine
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {profile.plan.behaviors.map((b) => {
              const season = getSeasons(b)[0]
              const progress = getSeasonProgress(b.id, season)
              const next = getNextEpisode(b.id, season)
              const percent = progress.total === 0 ? 0 : Math.round((progress.completed / progress.total) * 100)
              return (
                <div key={b.id} className="rounded-2xl bg-sage-50 p-3 dark:bg-ink-900/40">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-800 dark:text-sand-100">{b.label}</span>
                    <span className="text-xs text-ink-800/50 dark:text-sand-100/50">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-sage-200 dark:bg-sage-700/40">
                    <div className="h-1.5 rounded-full bg-coral-500" style={{ width: `${percent}%` }} />
                  </div>
                  {next && (
                    <button
                      type="button"
                      onClick={() => navigate(`/episode/${b.id}/${next.id}`)}
                      className="mt-2 text-xs font-medium text-sage-600 dark:text-sage-400"
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
            <h2 className="text-lg font-semibold text-ink-800 dark:text-sand-100">Badges</h2>
            <span className="text-sm text-ink-800/50 dark:text-sand-100/50">
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
                  b.unlocked ? 'bg-white dark:bg-ink-800' : 'bg-white/50 opacity-50 dark:bg-ink-800/50'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="mt-1 text-sm font-medium text-ink-800 dark:text-sand-100">
                  {b.label}
                </div>
              </button>
            ))}
          </div>

          {expandedBadge && (
            <div className="mt-3 rounded-2xl bg-sage-100/60 p-4 dark:bg-sage-700/10">
              {(() => {
                const b = badges.find((x) => x.id === expandedBadge)
                return (
                  <>
                    <p className="font-semibold text-ink-800 dark:text-sand-100">
                      {b.icon} {b.label} {b.unlocked && '· débloqué ✓'}
                    </p>
                    <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
                      {b.detail}
                    </p>
                  </>
                )
              })()}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
          <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">
            Confidentialité communauté
          </p>
          <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
            {settings.communityPublic
              ? `Public — affiché comme "${settings.communityPseudo}"`
              : `Anonyme — affiché comme "${settings.communityPseudo || 'Anonyme'}"`}
          </p>
          <Button variant="ghost" className="mt-2" onClick={() => navigate('/settings')}>
            Modifier
          </Button>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
          <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">Apparence</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleThemeChange(opt.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 py-3 text-xs font-medium transition-colors ${
                  theme === opt.id
                    ? 'border-coral-500 bg-coral-100/60 text-coral-600 dark:bg-coral-500/10 dark:text-coral-300'
                    : 'border-sage-200 text-ink-800/70 dark:border-sage-700 dark:text-sand-100/70'
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
              </p>
              <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
                Merci de soutenir l'app. Tu profites de tout ce que Premium débloque.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-coral-600 dark:text-coral-300">Passer en Premium</p>
              <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
                Coach illimité, communauté complète, suivi photo, statistiques avancées.
              </p>
              <Button className="mt-3" onClick={() => navigate('/premium')}>
                Voir l'offre
              </Button>
            </>
          )}
        </section>

        <section className="mt-8">
          <Button variant="ghost" onClick={handleReset}>
            Réinitialiser mes données
          </Button>
        </section>
      </div>
    </main>
  )
}
