import { BEHAVIORS } from '../data/behaviors.js'

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

// Le quiz initial n'est pas figé pour toujours : on peut ajouter ou retirer un
// comportement suivi depuis le profil (brief v2 section B1).
export function addBehaviorToProfile(behaviorId) {
  const profile = loadProfile()
  const behavior = BEHAVIORS.find((b) => b.id === behaviorId)
  if (!profile || !behavior) return profile
  if (profile.plan.behaviors.some((b) => b.id === behaviorId)) return profile

  const updatedPlan = {
    ...profile.plan,
    behaviors: [...profile.plan.behaviors, behavior],
    exercisesByBehavior: [
      ...profile.plan.exercisesByBehavior,
      { behavior, exercises: behavior.exercises.slice(0, 3) },
    ],
  }
  saveProfile(profile.answers, updatedPlan)
  return loadProfile()
}

export function removeBehaviorFromProfile(behaviorId) {
  const profile = loadProfile()
  if (!profile) return profile
  if (profile.plan.behaviors.length <= 1) return profile // toujours garder au moins un comportement

  const updatedPlan = {
    ...profile.plan,
    behaviors: profile.plan.behaviors.filter((b) => b.id !== behaviorId),
    exercisesByBehavior: profile.plan.exercisesByBehavior.filter((e) => e.behavior.id !== behaviorId),
  }
  saveProfile(profile.answers, updatedPlan)
  return loadProfile()
}

// Basé sur le fuseau horaire local de l'utilisateur (dates calendaires), pas sur
// un intervalle glissant de 24h — une connexion à 23:59 puis à 00:01 le lendemain
// compte comme deux jours calendaires distincts, comme prévu (brief v2 section 14).
export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function markPracticeToday() {
  addPracticeDate(todayKey())
}

export function addPracticeDate(dateKey) {
  const days = new Set(getPracticeDays())
  days.add(dateKey)
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
