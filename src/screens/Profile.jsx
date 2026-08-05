import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile, getPracticeStats } from '../lib/profile.js'
import { getBadges } from '../lib/badges.js'
import { getTheme, applyTheme } from '../lib/theme.js'

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
  'quizAnswers',
]

export default function Profile() {
  const navigate = useNavigate()
  const [profile] = useState(() => loadProfile())
  const stats = getPracticeStats()
  const badges = getBadges()
  const unlockedCount = badges.filter((b) => b.unlocked).length
  const [theme, setTheme] = useState(() => getTheme())

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
      'Réinitialiser toutes tes données locales (plan, épisodes, journal, badges) ? Cette action est irréversible.'
    )
    if (!confirmed) return
    LOCAL_KEYS.forEach((k) => localStorage.removeItem(k))
    navigate('/', { replace: true })
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Ton profil</h1>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
          <p className="text-sm font-semibold text-sage-600 dark:text-sage-400">Ton plan</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.plan.behaviors.map((b) => (
              <span
                key={b.id}
                className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700 dark:bg-sage-700/30 dark:text-sage-300"
              >
                {b.label}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-ink-800/70 dark:text-sand-100/70">
            {profile.plan.durationDays} jours · objectif : {GOAL_LABELS[profile.plan.goal] ?? profile.plan.goal}
          </p>
          <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
            {stats.practicedThisWeek}/{stats.totalWeekDays} jours pratiqués cette semaine
          </p>
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
              <div
                key={b.id}
                className={`rounded-2xl p-4 text-center ${
                  b.unlocked
                    ? 'bg-white dark:bg-ink-800'
                    : 'bg-white/50 opacity-50 dark:bg-ink-800/50'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="mt-1 text-sm font-medium text-ink-800 dark:text-sand-100">
                  {b.label}
                </div>
                <div className="mt-0.5 text-xs text-ink-800/50 dark:text-sand-100/50">
                  {b.detail}
                </div>
              </div>
            ))}
          </div>
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
          <p className="font-semibold text-coral-600 dark:text-coral-300">Passer en Premium</p>
          <p className="mt-1 text-sm text-ink-800/70 dark:text-sand-100/70">
            Coach illimité, communauté complète, suivi photo, statistiques avancées.
          </p>
          <Button className="mt-3" onClick={() => navigate('/premium')}>
            Voir l'offre
          </Button>
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
