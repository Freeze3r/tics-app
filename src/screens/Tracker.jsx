import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Chip from '../components/Chip.jsx'
import { loadProfile } from '../lib/profile.js'
import { logEpisode, listEpisodes, frequencyByContext } from '../lib/episodes.js'
import { TRIGGER_CONTEXTS, getBehavior } from '../data/behaviors.js'
import { EMOTIONS, DURATIONS } from '../data/episodeOptions.js'

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
      <p className="text-sm text-ink-800/50 dark:text-sand-100/50">
        Pas encore assez de données cette semaine pour voir un pattern.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((e) => (
        <div key={e.id} className="flex items-center gap-3">
          <span className="w-40 shrink-0 text-xs text-ink-800/60 dark:text-sand-100/60">
            {e.label}
          </span>
          <div className="h-2 flex-1 rounded-full bg-sage-100 dark:bg-sage-700/30">
            <div
              className="h-2 rounded-full bg-sage-400 dark:bg-sage-500"
              style={{ width: `${(e.count / max) * 100}%` }}
            />
          </div>
          <span className="w-4 text-xs text-ink-800/60 dark:text-sand-100/60">{e.count}</span>
        </div>
      ))}
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

  const counts = useMemo(() => frequencyByContext(), [episodes])

  if (!profile) {
    navigate('/', { replace: true })
    return null
  }

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
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Tracker</h1>
        <p className="mt-1 text-ink-800/60 dark:text-sand-100/60">
          Chaque épisode noté t'aide à repérer tes déclencheurs. Aucun jugement, juste des
          données.
        </p>

        {!formOpen && (
          <Button className="mt-6 w-full" onClick={openForm}>
            J'ai eu un épisode
          </Button>
        )}

        {formOpen && (
          <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-ink-800">
            {behaviors.length > 1 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-ink-800 dark:text-sand-100">
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
              <p className="mb-2 text-sm font-semibold text-ink-800 dark:text-sand-100">
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
              <p className="mb-2 text-sm font-semibold text-ink-800 dark:text-sand-100">
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
              <p className="mb-2 text-sm font-semibold text-ink-800 dark:text-sand-100">
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
          <h2 className="text-lg font-semibold text-ink-800 dark:text-sand-100">
            Tes déclencheurs cette semaine
          </h2>
          <div className="mt-3 rounded-2xl bg-white p-4 dark:bg-ink-800">
            <FrequencyChart counts={counts} />
          </div>
        </section>

        <section className="mt-8 pb-6">
          <h2 className="text-lg font-semibold text-ink-800 dark:text-sand-100">Historique</h2>
          {episodes.length === 0 ? (
            <p className="mt-3 text-sm text-ink-800/50 dark:text-sand-100/50">
              Aucun épisode noté pour l'instant.
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-2">
              {episodes.map((ep) => {
                const behavior = getBehavior(ep.behaviorId)
                const context = TRIGGER_CONTEXTS.find((t) => t.id === ep.triggerContext)
                const emo = EMOTIONS.find((e) => e.id === ep.emotion)
                return (
                  <div key={ep.id} className="rounded-2xl bg-white p-4 text-sm dark:bg-ink-800">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink-800 dark:text-sand-100">
                        {behavior?.label ?? 'Épisode'}
                      </span>
                      <span className="text-xs text-ink-800/50 dark:text-sand-100/50">
                        {relativeTime(ep.createdAt)}
                      </span>
                    </div>
                    <div className="mt-1 text-ink-800/60 dark:text-sand-100/60">
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
