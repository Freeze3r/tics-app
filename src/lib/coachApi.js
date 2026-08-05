import { isPremiumActive } from './subscription.js'

const LIMIT_KEY = 'ticsCoachDailyCount'
const FREE_DAILY_LIMIT = 15

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function readCount() {
  const raw = localStorage.getItem(LIMIT_KEY)
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
  localStorage.setItem(LIMIT_KEY, JSON.stringify(next))
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
export async function askCoach(messages, context) {
  if (!isPremiumActive()) bumpCount()

  const res = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  })

  if (!res.ok) {
    throw new Error('coach_unavailable')
  }

  return res.json()
}
