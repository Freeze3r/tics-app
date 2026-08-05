import { supabase, getCurrentUser } from './supabase.js'

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
}

function randomPseudoSuffix() {
  return Math.floor(1000 + Math.random() * 9000)
}

export function getUserSettings() {
  const raw = localStorage.getItem(KEY)
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

  localStorage.setItem(KEY, JSON.stringify(next))

  if (supabase) {
    try {
      const user = await getCurrentUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          display_name: next.displayName || null,
          display_name_hidden: next.displayNameHidden,
          age: next.age ? Number(next.age) : null,
          age_hidden: next.ageHidden,
          gender: next.gender || null,
          gender_hidden: next.genderHidden,
          anonymous_mode: next.anonymousMode,
          community_public: next.communityPublic,
          community_pseudo: next.communityPseudo,
          avatar_emoji: next.avatarEmoji,
          updated_at: new Date().toISOString(),
        })
      }
    } catch {
      // les réglages restent enregistrés localement
    }
  }

  return next
}

export function getCommunityDisplayName() {
  const s = getUserSettings()
  if (s.communityPublic && s.communityPseudo) return s.communityPseudo
  return s.communityPseudo || 'Anonyme'
}
