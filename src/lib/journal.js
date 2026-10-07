import { scopedKey } from './authScope.js'

// Données de santé/humeur : elles restent uniquement sur l'appareil de la personne,
// jamais envoyées à un serveur (minimisation des données, RGPD art. 9).
const LOCAL_KEY = 'ticsJournal'

function readLocal() {
  const raw = localStorage.getItem(scopedKey(LOCAL_KEY))
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeLocal(entries) {
  localStorage.setItem(scopedKey(LOCAL_KEY), JSON.stringify(entries))
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
  return entry
}

export function listJournalEntries() {
  return readLocal()
}
