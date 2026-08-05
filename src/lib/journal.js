import { supabase, getOrCreateAnonUser } from './supabase.js'

const LOCAL_KEY = 'ticsJournal'

function readLocal() {
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeLocal(entries) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(entries))
}

export async function addJournalEntry({ mood, note }) {
  const entry = {
    id: crypto.randomUUID(),
    mood,
    note,
    createdAt: new Date().toISOString(),
  }

  const entries = readLocal()
  entries.unshift(entry)
  writeLocal(entries)

  if (supabase) {
    try {
      const user = await getOrCreateAnonUser()
      await supabase.from('journal_entries').insert({
        user_id: user.id,
        mood: entry.mood,
        note: entry.note,
        created_at: entry.createdAt,
      })
    } catch {
      // l'entrée reste enregistrée localement
    }
  }

  return entry
}

export function listJournalEntries() {
  return readLocal()
}
