import { scopedKey } from './authScope.js'

// Les conversations avec le coach peuvent être très personnelles. Par défaut la
// conversation en cours ne vit que le temps de la session (sessionStorage) : elle disparaît
// quand on quitte l'app. Pour la garder, la personne choisit de la sauvegarder : elle
// rejoint alors un historique (sur l'appareil uniquement) qu'elle peut rouvrir ou supprimer.
const CURRENT_KEY = 'ticsCoachCurrent'
const SAVED_KEY = 'ticsCoachSaved'
const LEGACY_KEY = 'ticsCoachHistory' // ancien stockage permanent (avant l'historique)
const MAX_SAVED = 30
const MAX_MESSAGES = 60

function readJson(storage, key, fallback) {
  try {
    const raw = storage.getItem(scopedKey(key))
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function loadCurrent() {
  const conv = readJson(sessionStorage, CURRENT_KEY, null)
  return conv && Array.isArray(conv.messages) ? conv : null
}

export function persistCurrent(conv) {
  sessionStorage.setItem(
    scopedKey(CURRENT_KEY),
    JSON.stringify({ ...conv, messages: conv.messages.slice(-MAX_MESSAGES) }),
  )
}

export function clearCurrent() {
  sessionStorage.removeItem(scopedKey(CURRENT_KEY))
}

export function listSaved() {
  const list = readJson(localStorage, SAVED_KEY, [])
  return Array.isArray(list) ? list : []
}

function writeSaved(list) {
  localStorage.setItem(scopedKey(SAVED_KEY), JSON.stringify(list.slice(0, MAX_SAVED)))
}

function titleFor(messages) {
  const first = messages.find((m) => m.from === 'user')?.text ?? 'Conversation'
  return first.length > 42 ? `${first.slice(0, 42)}…` : first
}

// Crée ou met à jour la copie gardée d'une conversation ; renvoie son identifiant.
export function saveConversation(conv) {
  const id = conv.savedId ?? crypto.randomUUID()
  const entry = {
    id,
    title: titleFor(conv.messages),
    savedAt: new Date().toISOString(),
    messages: conv.messages.slice(-MAX_MESSAGES),
  }
  writeSaved([entry, ...listSaved().filter((c) => c.id !== id)])
  return id
}

export function deleteSaved(id) {
  writeSaved(listSaved().filter((c) => c.id !== id))
}

export function deleteAllSaved() {
  localStorage.removeItem(scopedKey(SAVED_KEY))
}

// Avant l'historique, la dernière conversation était gardée en permanence. On la
// transforme en conversation gardée (rien n'est perdu en silence), puis on supprime l'ancien stockage.
export function migrateLegacyHistory() {
  const legacy = readJson(localStorage, LEGACY_KEY, null)
  if (!legacy) return
  localStorage.removeItem(scopedKey(LEGACY_KEY))
  if (Array.isArray(legacy) && legacy.some((m) => m.from === 'user')) {
    saveConversation({ savedId: null, messages: legacy })
  }
}
