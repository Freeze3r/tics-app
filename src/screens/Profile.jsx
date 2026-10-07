import { useEffect, useRef, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { loadProfile, getPracticeStats, addBehaviorToProfile, removeBehaviorFromProfile } from '../lib/profile.js'
import { BEHAVIORS } from '../data/behaviors.js'
import { getBadges } from '../lib/badges.js'
import { getTheme, applyTheme } from '../lib/theme.js'
import { getUserSettings, saveUserSettings } from '../lib/userSettings.js'
import { getAccountCreatedAt, getUnlockedTitles, TENURE_TITLES } from '../lib/tenure.js'
import { getSeasons } from '../lib/seasons.js'
import { getSeasonProgress, getNextEpisode } from '../lib/seasonProgress.js'
import { signOut, supabase } from '../lib/supabase.js'
import { downloadBackup, importUserData, eraseUserData } from '../lib/dataBackup.js'

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

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(() => loadProfile())
  const [showAddBehavior, setShowAddBehavior] = useState(false)
  const [unlockedTitles, setUnlockedTitles] = useState([])
  const [settings, setSettingsState] = useState(() => getUserSettings())
  const stats = getPracticeStats()

  useEffect(() => {
    getAccountCreatedAt().then((createdAt) => {
      setUnlockedTitles(getUnlockedTitles(createdAt))
    })
  }, [])

  const selectedTitle = TENURE_TITLES.find((t) => t.id === settings.selectedTitleId)
  const badges = getBadges()
  const unlockedCount = badges.filter((b) => b.unlocked).length
  const [theme, setTheme] = useState(() => getTheme())
  const [expandedBadge, setExpandedBadge] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [backupMessage, setBackupMessage] = useState(null) // { ok, text }
  const fileInputRef = useRef(null)

  function handleThemeChange(id) {
    applyTheme(id)
    setTheme(id)
  }

  if (!profile) return <Navigate to="/quiz" replace />

  function handleDownloadBackup() {
    downloadBackup()
    setBackupMessage({ ok: true, text: 'Sauvegarde téléchargée. Garde-la dans un endroit sûr.' })
  }

  async function handleRestoreFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const count = importUserData(await file.text())
      setBackupMessage({ ok: true, text: `Sauvegarde restaurée (${count} éléments). Rechargement…` })
      setTimeout(() => window.location.assign('/home'), 900)
    } catch (err) {
      setBackupMessage({ ok: false, text: err.message ?? 'La restauration a échoué.' })
    }
  }

  async function handleReset() {
    if (confirmText.trim().toLowerCase() !== 'supprimer') return

    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession()
        const token = data.session?.access_token
        if (token) {
          await fetch('/api/delete-account', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          })
        }
      } catch {
        // La suppression côté serveur peut échouer (ex: pas encore configurée) —
        // on efface quand même les données locales pour ne rien laisser sur cet appareil.
      }
      await signOut()
    }

    eraseUserData()
    navigate('/', { replace: true })
  }

  async function handleLogout() {
    await signOut()
    navigate('/', { replace: true })
  }

  function handleAddBehavior(behaviorId) {
    setProfile(addBehaviorToProfile(behaviorId))
    setShowAddBehavior(false)
  }

  function handleRemoveBehavior(behaviorId, label) {
    if (profile.plan.behaviors.length <= 1) return
    const confirmed = window.confirm(`Retirer "${label}" de tes comportements suivis ?`)
    if (!confirmed) return
    setProfile(removeBehaviorFromProfile(behaviorId))
  }

  const trackedIds = new Set(profile.plan.behaviors.map((b) => b.id))
  const availableToAdd = BEHAVIORS.filter((b) => !trackedIds.has(b.id))

  async function handleSelectTitle(titleId) {
    const next = await saveUserSettings({ selectedTitleId: titleId })
    setSettingsState(next)
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
              {selectedTitle && (
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-700/30 dark:text-neon-300">
                  {selectedTitle.icon} {selectedTitle.label}
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

        {unlockedTitles.length > 0 && (
          <section className="mt-6 rounded-2xl surface p-5">
            <p className="text-sm font-semibold text-teal-600 dark:text-neon-400">
              Ton titre d'ancienneté
            </p>
            <p className="mt-1 text-xs text-navy-800/50 dark:text-sand-100/50">
              Choisis lequel afficher — indépendant des badges, ça récompense juste le temps passé avec nous.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {unlockedTitles.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTitle(t.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    settings.selectedTitleId === t.id
                      ? 'choice-selected'
                      : 'choice'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl surface p-5">
          <p className="text-sm font-semibold text-teal-600 dark:text-neon-400">Ton plan</p>
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
                <div key={b.id} className="surface-inset rounded-2xl p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-800 dark:text-sand-100">{b.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-navy-800/50 dark:text-sand-100/50">
                        {progress.completed}/{progress.total}
                      </span>
                      {profile.plan.behaviors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBehavior(b.id, b.label)}
                          title="Retirer ce comportement"
                          className="text-navy-800/30 hover:text-coral-500 dark:text-sand-100/30"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-teal-200 dark:bg-teal-700/40">
                    <div className="h-1.5 rounded-full bg-linear-to-r from-neon-400 to-coral-400" style={{ width: `${percent}%` }} />
                  </div>
                  {next && (
                    <button
                      type="button"
                      onClick={() => navigate(`/episode/${b.id}/${next.id}`)}
                      className="mt-2 text-xs font-medium text-teal-600 dark:text-neon-400"
                    >
                      Prochain : {next.title} →
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {availableToAdd.length > 0 && (
            <div className="mt-3">
              {!showAddBehavior ? (
                <button
                  type="button"
                  onClick={() => setShowAddBehavior(true)}
                  className="text-sm font-medium text-teal-600 dark:text-neon-400"
                >
                  + Ajouter un comportement
                </button>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableToAdd.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleAddBehavior(b.id)}
                      className="choice rounded-full px-3 py-1.5 text-xs"
                    >
                      + {b.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAddBehavior(false)}
                    className="text-xs text-navy-800/40 dark:text-sand-100/40"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}
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
                  b.unlocked ? 'surface' : 'surface opacity-60'
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
                      <div className="h-1.5 rounded-full bg-linear-to-r from-neon-400 to-coral-400" style={{ width: `${percent}%` }} />
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

        <section className="mt-6 rounded-2xl surface p-5">
          <p className="text-sm font-semibold text-teal-600 dark:text-neon-400">
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

        <section className="mt-6 rounded-2xl surface p-5">
          <p className="text-sm font-semibold text-teal-600 dark:text-neon-400">Apparence</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleThemeChange(opt.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl py-3 text-xs font-medium transition-colors ${
                  theme === opt.id
                    ? 'choice-selected'
                    : 'choice'
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-coral-100/60 p-5 dark:bg-coral-500/10">
          <p className="font-semibold text-coral-600 dark:text-coral-300">
            Premium · bientôt disponible
          </p>
          <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
            Tout Sooth est gratuit pour l'instant. Découvre ce qui est prévu pour la suite.
          </p>
          <Button className="mt-3" variant="secondary" onClick={() => navigate('/premium')}>
            Voir ce qui arrive
          </Button>
        </section>

        <section className="mt-6 rounded-2xl surface p-5">
          <p className="text-sm font-semibold text-teal-600 dark:text-neon-400">
            Sauvegarde de tes données
          </p>
          <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
            Ton plan, ton journal et ta progression restent uniquement sur cet appareil. Télécharge
            une sauvegarde de temps en temps : si tu changes de téléphone ou perds tes données, tu
            pourras tout retrouver.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="secondary" className="w-full" onClick={handleDownloadBackup}>
              Télécharger ma sauvegarde
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => fileInputRef.current?.click()}>
              Restaurer depuis un fichier
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleRestoreFile}
              aria-label="Choisir un fichier de sauvegarde Sooth"
            />
          </div>
          {backupMessage && (
            <p
              role="status"
              className={`mt-3 text-sm ${backupMessage.ok ? 'text-teal-600 dark:text-neon-400' : 'text-coral-600 dark:text-coral-300'}`}
            >
              {backupMessage.text}
            </p>
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
            <div className="mt-3 rounded-2xl border border-coral-400/40 bg-coral-500/5 p-4">
              <p className="text-sm font-semibold text-coral-600 dark:text-coral-300">
                Zone à risque
              </p>
              <p className="mt-1 text-sm text-navy-800/70 dark:text-sand-100/70">
                Supprime définitivement ton compte et toutes tes données (plan, progression,
                badges, réglages), sur cet appareil et sur nos serveurs. Action irréversible — tu
                devras créer un nouveau compte pour réutiliser l'app.
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
                className="field mt-1 w-full rounded-2xl px-4 py-2 text-sm"
              />
              <Button
                variant="secondary"
                className="mt-3 w-full"
                disabled={confirmText.trim().toLowerCase() !== 'supprimer'}
                onClick={handleReset}
              >
                Supprimer mon compte
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
