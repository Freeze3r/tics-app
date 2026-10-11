import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Chip from '../components/Chip.jsx'
import { loadProfile } from '../lib/profile.js'
import { logEpisode, listEpisodes, frequencyByContext } from '../lib/episodes.js'
import { TRIGGER_CONTEXTS, getBehavior } from '../data/behaviors.js'
import { EMOTIONS, DURATIONS } from '../data/episodeOptions.js'
import { getSeasons, getActiveSeason } from '../lib/seasons.js'
import { getSeasonProgress, getNextEpisode, getCompletedEpisodeIds } from '../lib/seasonProgress.js'

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.round(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'à l’instant'
  if (hours < 24) return `il y a ${hours} h`
  return `il y a ${Math.round(hours / 24)} j`
}

function FrequencyChart({ counts }) {
  const entries = TRIGGER_CONTEXTS.map((t) => ({ ...t, count: counts[t.id] ?? 0 }))
  const max = Math.max(1, ...entries.map((e) => e.count))

  if (entries.every((e) => e.count === 0)) {
    return (
      <p className="text-sm text-navy-800/50 dark:text-sand-100/50">
        Pas encore assez de données cette semaine pour voir un pattern.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e) => (
        <div key={e.id} className="flex items-center gap-3">
          <span className="w-40 shrink-0 text-xs text-navy-800/60 dark:text-sand-100/60">
            {e.label}
          </span>
          <div className="h-2 flex-1 rounded-full bg-teal-100 dark:bg-teal-700/30">
            <div
              className="h-2 rounded-full bg-teal-400 dark:bg-teal-500"
              style={{ width: `${(e.count / max) * 100}%` }}
            />
          </div>
          <span className="w-4 text-xs text-navy-800/60 dark:text-sand-100/60">{e.count}</span>
        </div>
      ))}
    </div>
  )
}

function BehaviorSeasonCard({ behavior, navigate }) {
  const [openSeasonId, setOpenSeasonId] = useState(null)
  const seasons = getSeasons(behavior)
  const activeSeason = getActiveSeason(behavior)
  const progress = getSeasonProgress(behavior.id, activeSeason)
  const nextEpisode = getNextEpisode(behavior.id, activeSeason)
  const percent = progress.total === 0 ? 0 : Math.round((progress.completed / progress.total) * 100)

  return (
    <div className="rounded-2xl surface p-4">
      <p className="font-semibold text-navy-800 dark:text-sand-100">{behavior.label}</p>
      <p className="mt-0.5 text-xs text-navy-800/55 dark:text-sand-100/55">
        {activeSeason.title} · {progress.completed}/{progress.total} épisodes
      </p>

      <div className="mt-3 h-2 rounded-full bg-teal-100 dark:bg-white/10">
        <div
          className="h-2 rounded-full bg-linear-to-r from-neon-400 to-coral-400 shadow-[0_0_10px_rgba(31,209,191,0.6)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      {nextEpisode ? (
        <Button
          className="mt-3 w-full"
          variant="secondary"
          onClick={() => navigate(`/episode/${behavior.id}/${nextEpisode.id}`)}
        >
          Épisode {activeSeason.episodes.findIndex((e) => e.id === nextEpisode.id) + 1}/
          {activeSeason.episodes.length} · {nextEpisode.title}
        </Button>
      ) : (
        <p className="mt-3 text-sm text-teal-600 dark:text-neon-400">
          Programme terminé ✓ Bravo ! Tu peux rejouer n'importe quel épisode ci-dessous.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {seasons.map((s) => {
          const p = getSeasonProgress(behavior.id, s)
          const finished = p.total > 0 && p.completed === p.total
          const current = s.id === activeSeason.id
          const open = s.id === openSeasonId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenSeasonId(open ? null : s.id)}
              aria-expanded={open}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                open
                  ? 'bg-neon-400/25 font-semibold text-teal-700 ring-1 ring-neon-400/60 dark:text-neon-300'
                  : current
                    ? 'bg-teal-100 font-semibold text-teal-700 dark:bg-neon-400/15 dark:text-neon-300'
                    : 'bg-teal-100/60 text-navy-800/55 dark:bg-white/5 dark:text-sand-100/55'
              }`}
            >
              {finished ? '✓' : current ? '▶' : '○'} {s.title.split(' : ')[0]} · {p.completed}/{p.total}
            </button>
          )
        })}
      </div>

      {openSeasonId && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {seasons
            .find((s) => s.id === openSeasonId)
            .episodes.map((ep, i) => {
              const done = getCompletedEpisodeIds(behavior.id).includes(ep.id)
              return (
                <li key={ep.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/episode/${behavior.id}/${ep.id}`)}
                    className="surface-inset flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm"
                  >
                    <span className="w-5 shrink-0 text-center text-xs">{done ? '✓' : i + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-navy-800 dark:text-sand-100">{ep.title}</span>
                    <span className="shrink-0 text-xs text-navy-800/45 dark:text-sand-100/45">
                      {ep.type === 'exercise' ? 'Exercice' : 'Leçon'}
                    </span>
                  </button>
                </li>
              )
            })}
        </ul>
      )}
    </div>
  )
}

export default function Tracker() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [profile] = useState(() => loadProfile())
  const [episodes, setEpisodes] = useState(() => listEpisodes())
  const [formOpen, setFormOpen] = useState(searchParams.get('log') === '1')
  const [behaviorId, setBehaviorId] = useState(
    searchParams.get('behavior') || profile?.plan.behaviors[0]?.id
  )
  const [triggerContext, setTriggerContext] = useState(null)
  const [emotion, setEmotion] = useState(null)
  const [duration, setDuration] = useState(null)

  // episodes sert de signal de rechargement : frequencyByContext() relit le stockage local
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const counts = useMemo(() => frequencyByContext(), [episodes])

  if (!profile) return <Navigate to="/quiz" replace />

  const behaviors = profile.plan.behaviors

  function openForm() {
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setTriggerContext(null)
    setEmotion(null)
    setDuration(null)
    if (searchParams.get('log')) setSearchParams({}, { replace: true })
  }

  async function handleSave() {
    const episode = await logEpisode({ behaviorId, triggerContext, emotion, duration })
    setEpisodes((prev) => [episode, ...prev])
    closeForm()
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-sand-100">Tracker</h1>
        <p className="mt-1 text-navy-800/60 dark:text-sand-100/60">
          Ta progression saison par saison, et tes moments difficiles sans jugement.
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-navy-800 dark:text-sand-100">Tes saisons</h2>
          <div className="mt-3 flex flex-col gap-3">
            {behaviors.map((b) => (
              <BehaviorSeasonCard key={b.id} behavior={b} navigate={navigate} />
            ))}
          </div>
        </section>

        {!formOpen && (
          <Button className="mt-8 w-full" onClick={openForm}>
            J'ai eu un moment difficile
          </Button>
        )}

        {formOpen && (
          <section className="mt-6 rounded-2xl surface p-5">
            {behaviors.length > 1 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-navy-800 dark:text-sand-100">
                  Quel comportement ?
                </p>
                <div className="flex flex-wrap gap-2">
                  {behaviors.map((b) => (
                    <Chip key={b.id} selected={behaviorId === b.id} onClick={() => setBehaviorId(b.id)}>
                      {b.label}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold text-navy-800 dark:text-sand-100">
                Dans quel contexte ?
              </p>
              <div className="flex flex-wrap gap-2">
                {TRIGGER_CONTEXTS.map((t) => (
                  <Chip key={t.id} selected={triggerContext === t.id} onClick={() => setTriggerContext(t.id)}>
                    {t.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold text-navy-800 dark:text-sand-100">
                Quelle émotion juste avant ?
              </p>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.map((e) => (
                  <Chip key={e.id} selected={emotion === e.id} onClick={() => setEmotion(e.id)}>
                    {e.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-navy-800 dark:text-sand-100">
                Durée estimée
              </p>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <Chip key={d.id} selected={duration === d.id} onClick={() => setDuration(d.id)}>
                    {d.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={closeForm}>
                Annuler
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={!behaviorId}>
                Enregistrer
              </Button>
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-navy-800 dark:text-sand-100">
            Tes déclencheurs cette semaine
          </h2>
          <div className="mt-3 rounded-2xl surface p-4">
            <FrequencyChart counts={counts} />
          </div>
        </section>

        <section className="mt-8 pb-6">
          <h2 className="text-lg font-semibold text-navy-800 dark:text-sand-100">Historique</h2>
          {episodes.length === 0 ? (
            <p className="mt-3 text-sm text-navy-800/50 dark:text-sand-100/50">
              Aucun moment difficile noté pour l'instant.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {episodes.map((ep) => {
                const behavior = getBehavior(ep.behaviorId)
                const context = TRIGGER_CONTEXTS.find((t) => t.id === ep.triggerContext)
                const emo = EMOTIONS.find((e) => e.id === ep.emotion)
                return (
                  <div key={ep.id} className="rounded-2xl surface p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-navy-800 dark:text-sand-100">
                        {behavior?.label ?? 'Moment difficile'}
                      </span>
                      <span className="text-xs text-navy-800/50 dark:text-sand-100/50">
                        {relativeTime(ep.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 text-navy-800/60 dark:text-sand-100/60">
                      {[context?.label, emo?.label].filter(Boolean).join(' · ') || 'Pas de détail'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
