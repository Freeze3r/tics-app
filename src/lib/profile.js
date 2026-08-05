const PROFILE_KEY = 'ticsProfile'
const PRACTICE_KEY = 'ticsPracticeDays'
const DEEP_ANSWERS_KEY = 'ticsDeepAnswers'

// Le "profil actif" = dernières réponses au quiz + plan généré, gardés en local
// pour que Home/Tracker/SOS puissent les retrouver sans repasser par le quiz.
export function saveProfile(answers, plan) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ answers, plan, savedAt: Date.now() }))
}

export function loadProfile() {
  const raw = localStorage.getItem(PROFILE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Réponses du quiz approfondi (post-achat premium, brief section 6) : plus personnel,
// avec un commentaire libre optionnel — distinct du quiz rapide gratuit.
export function saveDeepAnswers(answers) {
  localStorage.setItem(DEEP_ANSWERS_KEY, JSON.stringify({ answers, savedAt: Date.now() }))
}

export function loadDeepAnswers() {
  const raw = localStorage.getItem(DEEP_ANSWERS_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function markPracticeToday() {
  const days = new Set(getPracticeDays())
  days.add(todayKey())
  localStorage.setItem(PRACTICE_KEY, JSON.stringify([...days]))
}

export function getPracticeDays() {
  const raw = localStorage.getItem(PRACTICE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function isPracticedToday() {
  return getPracticeDays().includes(todayKey())
}

// Stats non punitives : combien de jours pratiqués sur les 7 derniers,
// et une série "en cours" tolérante (ne compte pas les jours avant aujourd'hui
// comme une rupture s'il en manque un ou deux, contrairement à un streak classique).
export function getPracticeStats() {
  const days = new Set(getPracticeDays())
  const last7 = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    last7.push(todayKey(d))
  }
  const practicedThisWeek = last7.filter((d) => days.has(d)).length

  let streak = 0
  for (let i = 0; i < 60; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    if (days.has(todayKey(d))) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  return { practicedThisWeek, totalWeekDays: 7, streak }
}
