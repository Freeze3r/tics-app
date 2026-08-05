import { useState } from 'react'
import Button from '../components/Button.jsx'
import { addJournalEntry, listJournalEntries } from '../lib/journal.js'

const MOODS = [
  { id: 'great', emoji: '😌', label: 'Bien' },
  { id: 'okay', emoji: '🙂', label: 'Ça va' },
  { id: 'meh', emoji: '😐', label: 'Neutre' },
  { id: 'low', emoji: '😔', label: 'Pas top' },
  { id: 'hard', emoji: '😣', label: 'Difficile' },
]

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.round(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'à l’instant'
  if (hours < 24) return `il y a ${hours} h`
  return `il y a ${Math.round(hours / 24)} j`
}

export default function Journal() {
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')
  const [entries, setEntries] = useState(() => listJournalEntries())

  async function handleSave() {
    if (!mood) return
    const entry = await addJournalEntry({ mood, note: note.trim() || null })
    setEntries((prev) => [entry, ...prev])
    setMood(null)
    setNote('')
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-sand-100">Journal</h1>
        <p className="mt-1 text-navy-800/60 dark:text-sand-100/60">
          Comment tu te sens là, maintenant ? Pas besoin d'un épisode pour écrire.
        </p>

        <section className="mt-6 rounded-2xl bg-white p-5 dark:bg-navy-800">
          <div className="flex justify-between">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors ${
                  mood === m.id ? 'bg-coral-100/60 dark:bg-coral-500/10' : ''
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs text-navy-800/60 dark:text-sand-100/60">{m.label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Une note si tu veux (optionnel)"
            rows={3}
            className="mt-4 w-full resize-none rounded-2xl border-2 border-teal-200 bg-transparent p-3 text-sm text-navy-800 placeholder:text-navy-800/40 focus:border-teal-400 focus:outline-none dark:border-teal-700 dark:text-sand-100 dark:placeholder:text-sand-100/40"
          />

          <Button className="mt-4 w-full" onClick={handleSave} disabled={!mood}>
            Enregistrer
          </Button>
        </section>

        {entries.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-navy-800 dark:text-sand-100">
              Tes dernières entrées
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {entries.map((e) => {
                const m = MOODS.find((mm) => mm.id === e.mood)
                return (
                  <div key={e.id} className="rounded-2xl bg-white p-4 text-sm dark:bg-navy-800">
                    <div className="flex items-center justify-between">
                      <span className="text-navy-800 dark:text-sand-100">
                        {m?.emoji} {m?.label}
                      </span>
                      <span className="text-xs text-navy-800/50 dark:text-sand-100/50">
                        {relativeTime(e.createdAt)}
                      </span>
                    </div>
                    {e.note && (
                      <p className="mt-1 text-navy-800/70 dark:text-sand-100/70">{e.note}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
