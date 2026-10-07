import { scopedKey } from './authScope.js'

// Source unique de toutes les données de la personne stockées sur l'appareil. Sert à la
// sauvegarde, à la restauration ET à la suppression du compte : toute nouvelle clé locale
// doit être ajoutée ici, sinon elle survivrait à une suppression de compte.
export const USER_DATA_KEYS = [
  'ticsProfile',
  'ticsPracticeDays',
  'ticsEpisodes',
  'ticsJournal',
  'ticsChecklist',
  'ticsCommunityPosts',
  'ticsCoachUsed',
  'ticsCoachHistory',
  'ticsCoachDailyCount',
  'ticsLibraryVisited',
  'ticsSeasonProgress',
  'ticsSubscription',
  'ticsDeepAnswers',
  'ticsUserSettings',
  'ticsStreakRestores',
  'ticsTutorialSeen',
  'ticsReminderFired',
]

const BACKUP_FORMAT = 'sooth-backup'
const MAX_BACKUP_BYTES = 5 * 1024 * 1024

export function exportUserData() {
  const data = {}
  for (const key of USER_DATA_KEYS) {
    const value = localStorage.getItem(scopedKey(key))
    if (value !== null) data[key] = value
  }
  return JSON.stringify(
    { app: BACKUP_FORMAT, version: 1, exportedAt: new Date().toISOString(), data },
    null,
    2,
  )
}

export function downloadBackup() {
  const blob = new Blob([exportUserData()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `sooth-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

// Restaure une sauvegarde dans le compte connecté (fonctionne aussi d'un téléphone à
// l'autre, ou d'un compte à l'autre). Seules les clés connues sont acceptées, et chaque
// valeur doit être du JSON valide : un fichier modifié ou étranger ne peut rien casser.
export function importUserData(text) {
  if (text.length > MAX_BACKUP_BYTES) throw new Error('Ce fichier est trop volumineux.')

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error("Ce fichier est illisible.")
  }
  if (parsed?.app !== BACKUP_FORMAT || typeof parsed.data !== 'object' || parsed.data === null) {
    throw new Error("Ce fichier n'est pas une sauvegarde Sooth.")
  }

  const entries = Object.entries(parsed.data).filter(
    ([key, value]) => USER_DATA_KEYS.includes(key) && typeof value === 'string',
  )
  if (entries.length === 0) throw new Error('Cette sauvegarde ne contient aucune donnée.')

  const checked = entries.map(([key, value]) => {
    let json
    try {
      json = JSON.parse(value)
    } catch {
      throw new Error('Cette sauvegarde est abîmée.')
    }
    return [key, value, json]
  })

  const profile = checked.find(([key]) => key === 'ticsProfile')?.[2]
  if (profile && !Array.isArray(profile?.plan?.behaviors)) {
    throw new Error('Le plan de cette sauvegarde est invalide.')
  }

  for (const [key, value] of checked) localStorage.setItem(scopedKey(key), value)
  return checked.length
}

export function eraseUserData() {
  for (const key of USER_DATA_KEYS) localStorage.removeItem(scopedKey(key))
  sessionStorage.removeItem('quizAnswers')
}
