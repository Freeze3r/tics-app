import { getPracticeDays, addPracticeDate, todayKey } from './profile.js'
import { isPremiumActive } from './subscription.js'

const RESTORE_KEY = 'ticsStreakRestores'
const FREE_WINDOW_DAYS = 30
const PREMIUM_WINDOW_DAYS = 7
const DAY_MS = 24 * 60 * 60 * 1000

function getRestores() {
  const raw = localStorage.getItem(RESTORE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function recordRestore() {
  const restores = getRestores()
  restores.push(new Date().toISOString())
  localStorage.setItem(RESTORE_KEY, JSON.stringify(restores))
}

// Le jour manqué qu'on peut restaurer : hier, s'il n'a pas été marqué pratiqué —
// uniquement s'il y avait une série en cours à reconnecter (un jour pratiqué avant
// hier). Sans historique antérieur, il n'y a rien à "restaurer".
export function getMissedYesterday() {
  const days = new Set(getPracticeDays())
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const key = todayKey(yesterday)
  if (days.has(key)) return null

  const hasEarlierHistory = [...days].some((d) => d < key)
  return hasEarlierHistory ? key : null
}

export function getRestoreWindowDays() {
  return isPremiumActive() ? PREMIUM_WINDOW_DAYS : FREE_WINDOW_DAYS
}

export function canRestoreStreak() {
  if (!getMissedYesterday()) return false
  const cutoff = Date.now() - getRestoreWindowDays() * DAY_MS
  return getRestores().every((r) => new Date(r).getTime() < cutoff)
}

export function restoreStreak() {
  const missed = getMissedYesterday()
  if (!missed || !canRestoreStreak()) return false
  addPracticeDate(missed)
  recordRestore()
  return true
}
