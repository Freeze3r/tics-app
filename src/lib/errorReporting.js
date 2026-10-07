// Remonte les erreurs JavaScript vers /api/log-error (logs Vercel). Aucune donnée
// personnelle : message technique, pile, chemin de la page (sans paramètres), navigateur.
const MAX_PER_SESSION = 5
const seen = new Set()

export function reportError(error) {
  try {
    if (seen.size >= MAX_PER_SESSION) return
    const message = error?.message ?? String(error)
    if (seen.has(message)) return
    seen.add(message)

    const body = JSON.stringify({
      message,
      stack: error?.stack,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
    })
    // sendBeacon survit à un rechargement de page ; fetch en secours.
    const sent = navigator.sendBeacon?.('/api/log-error', new Blob([body], { type: 'application/json' }))
    if (!sent) {
      fetch('/api/log-error', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
    }
  } catch {
    // le suivi d'erreurs ne doit jamais provoquer lui-même une erreur
  }
}

export function initErrorReporting() {
  window.addEventListener('error', (e) => reportError(e.error ?? new Error(e.message)))
  window.addEventListener('unhandledrejection', (e) => reportError(e.reason))
}
