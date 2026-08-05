// Rappels locaux basés sur l'API Notification du navigateur. Limite honnête :
// ça ne fonctionne que tant que l'app est ouverte quelque part (onglet actif ou
// en arrière-plan) — un vrai système de notifications quand l'app est totalement
// fermée demanderait un service worker + push serveur, hors scope pour l'instant.
const FIRED_KEY = 'ticsReminderFired'

export function isNotificationSupported() {
  return typeof Notification !== 'undefined'
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function readFired() {
  const raw = localStorage.getItem(FIRED_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function firedToday(period) {
  const data = readFired()
  return (data[todayKey()] ?? []).includes(period)
}

function markFired(period) {
  const today = todayKey()
  localStorage.setItem(FIRED_KEY, JSON.stringify({ [today]: [...(readFired()[today] ?? []), period] }))
}

export function checkAndFireReminders(settings) {
  if (!settings?.remindersEnabled || !isNotificationSupported() || Notification.permission !== 'granted') return

  const now = new Date()
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  for (const period of ['morning', 'noon', 'evening']) {
    const target = settings.reminderTimes?.[period]
    if (!target || firedToday(period)) continue
    if (hhmm >= target) {
      try {
        new Notification('Sooth', {
          body: "C'est l'heure de ton petit exercice — une minute, ça compte.",
          icon: '/favicon.svg',
        })
      } catch {
        // notification silencieusement ignorée si le navigateur refuse
      }
      markFired(period)
    }
  }
}
