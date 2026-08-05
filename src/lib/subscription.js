// Abonnement "mock" — aucun vrai paiement n'est traité (Stripe sera branché plus tard,
// une fois le produit validé). Cette couche existe pour pouvoir tester tout le flow
// (essai, fidélité, gating premium) avant d'intégrer un vrai processeur de paiement.
const KEY = 'ticsSubscription'
const DAY_MS = 24 * 60 * 60 * 1000

const PRICING = {
  monthly: { introPrice: 2.99, price: 5.99, introMonths: 3, label: 'Mensuel' },
  yearly: { introPrice: 34.99, price: 44.99, introYears: 2, label: 'Annuel' },
}

const TRIAL_DAYS = 3
const LOYALTY_WINDOW_START_DAYS = 30 // fin du 1er mois
const LOYALTY_WINDOW_END_DAYS = 33 // + 3 jours de fenêtre
const LOYALTY_PRICE = 29.99 // 34.99 - 3 (mois déjà payé) - 2 (fidélité)

function read() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function write(sub) {
  localStorage.setItem(KEY, JSON.stringify(sub))
}

export function getSubscription() {
  return read()
}

export function startTrial(plan) {
  const now = Date.now()
  const sub = {
    plan, // 'monthly' | 'yearly'
    startedAt: new Date(now).toISOString(),
    trialEndsAt: plan === 'monthly' ? new Date(now + TRIAL_DAYS * DAY_MS).toISOString() : null,
    cancelledAt: null,
    loyaltyOfferUsed: false,
  }
  write(sub)
  return sub
}

export function cancelSubscription() {
  const sub = read()
  if (!sub) return null
  // L'accès premium reste actif jusqu'à la fin de l'essai/période en cours,
  // pas de coupure immédiate (brief section 6).
  sub.cancelledAt = new Date().toISOString()
  write(sub)
  return sub
}

export function isPremiumActive() {
  const sub = read()
  if (!sub) return false
  if (!sub.cancelledAt) return true
  if (sub.plan === 'monthly' && sub.trialEndsAt) {
    return Date.now() < new Date(sub.trialEndsAt).getTime()
  }
  return false
}

// Fenêtre de 3 jours juste après la fin du premier mois, réservée aux abonnés mensuel
// non déjà passés à l'annuel (brief section 6 — offre de fidélité).
export function getLoyaltyOffer() {
  const sub = read()
  if (!sub || sub.plan !== 'monthly' || sub.loyaltyOfferUsed) return null

  const daysSinceStart = (Date.now() - new Date(sub.startedAt).getTime()) / DAY_MS
  if (daysSinceStart < LOYALTY_WINDOW_START_DAYS || daysSinceStart > LOYALTY_WINDOW_END_DAYS) {
    return null
  }

  return {
    price: LOYALTY_PRICE,
    guaranteedYears: 2,
    daysLeft: Math.max(0, Math.ceil(LOYALTY_WINDOW_END_DAYS - daysSinceStart)),
  }
}

export function acceptLoyaltyOffer() {
  const sub = read()
  if (!sub) return null
  sub.plan = 'yearly'
  sub.loyaltyOfferUsed = true
  sub.cancelledAt = null
  write(sub)
  return sub
}

export function getPricing() {
  return PRICING
}
