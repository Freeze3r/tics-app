import { isPremiumActive } from './subscription.js'
import { scopedKey } from './authScope.js'
import { supabase } from './supabase.js'

const LIMIT_KEY = 'ticsCoachDailyCount'
// Tout est gratuit pour l'instant : ce plafond n'est qu'un garde-fou technique pour ne
// pas épuiser le quota gratuit de l'IA (il est large, un usage normal ne l'atteint pas).
const FREE_DAILY_LIMIT = 60

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function readCount() {
  const raw = localStorage.getItem(scopedKey(LIMIT_KEY))
  if (!raw) return { date: todayKey(), count: 0 }
  try {
    const parsed = JSON.parse(raw)
    return parsed.date === todayKey() ? parsed : { date: todayKey(), count: 0 }
  } catch {
    return { date: todayKey(), count: 0 }
  }
}

function bumpCount() {
  const current = readCount()
  const next = { date: todayKey(), count: current.count + 1 }
  localStorage.setItem(scopedKey(LIMIT_KEY), JSON.stringify(next))
  return next.count
}

export function getRemainingMessages() {
  if (isPremiumActive()) return Infinity
  return Math.max(0, FREE_DAILY_LIMIT - readCount().count)
}

export function canSendMessage() {
  return getRemainingMessages() > 0
}

export function getDailyLimit() {
  return FREE_DAILY_LIMIT
}

// Appelle le coach via la fonction serverless (clé Groq jamais exposée au client).
// Le token de session est transmis pour que le serveur vérifie l'authentification
// avant d'appeler Groq (sinon l'endpoint serait ouvert à n'importe qui).
export async function askCoach(messages, context) {
  const { data } = supabase ? await supabase.auth.getSession() : { data: {} }
  const token = data.session?.access_token
  if (!token) throw new Error('coach_unavailable')

  const res = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ messages, context }),
  })

  if (!res.ok) {
    throw new Error('coach_unavailable')
  }

  if (!isPremiumActive()) bumpCount()
  return res.json()
}
