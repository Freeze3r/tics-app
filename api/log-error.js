// Reçoit les erreurs JavaScript de l'app (voir src/lib/errorReporting.js) et les écrit
// dans les logs Vercel (Dashboard > projet > Logs), pour savoir quand quelque chose
// plante chez les utilisateurs — sans compte tiers type Sentry.
// On ne reçoit volontairement AUCUNE donnée personnelle ni de santé : seulement le
// message d'erreur, la pile technique, la page (sans paramètres) et le navigateur.

const MAX = 1500

function clip(value) {
  return String(value ?? '').slice(0, MAX)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { message, stack, page, userAgent } = req.body ?? {}
  console.error(
    '[CLIENT_ERROR]',
    JSON.stringify({
      message: clip(message),
      stack: clip(stack),
      page: clip(page),
      userAgent: clip(userAgent).slice(0, 200),
    }),
  )

  res.status(204).end()
}
