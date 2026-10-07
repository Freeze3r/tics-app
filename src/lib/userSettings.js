import { scopedKey } from './authScope.js'

const KEY = 'ticsUserSettings'

const DEFAULTS = {
  displayName: '',
  displayNameHidden: false,
  age: '',
  ageHidden: false,
  gender: '',
  genderHidden: false,
  anonymousMode: false,
  communityPublic: false,
  communityPseudo: '',
  avatarEmoji: '🌿',
  selectedTitleId: null,
  remindersEnabled: false,
  reminderTimes: { morning: '08:00', noon: '13:00', evening: '21:00' },
}

function randomPseudoSuffix() {
  return Math.floor(1000 + Math.random() * 9000)
}

export function getUserSettings() {
  const raw = localStorage.getItem(scopedKey(KEY))
  if (!raw) return { ...DEFAULTS }
  try {
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

// Le "profil interne" (prénom, âge, genre) sert uniquement à personnaliser l'app —
// jamais visible par d'autres utilisateurs. L'"identité communauté" (pseudo public
// ou anonyme) est un réglage séparé et indépendant (brief v2 section 4).
export async function saveUserSettings(partial) {
  const current = getUserSettings()
  const next = { ...current, ...partial }

  if (next.communityPublic && !next.communityPseudo) {
    next.communityPseudo = `${next.displayName || 'Membre'}`
  }
  if (!next.communityPseudo) {
    next.communityPseudo = `Anonyme#${randomPseudoSuffix()}`
  }

  // Prénom, âge, genre : gardés uniquement sur l'appareil (jamais envoyés au serveur).
  localStorage.setItem(scopedKey(KEY), JSON.stringify(next))
  return next
}

export function getCommunityDisplayName() {
  const s = getUserSettings()
  if (s.communityPublic && s.communityPseudo) return s.communityPseudo
  return s.communityPseudo || 'Anonyme'
}
