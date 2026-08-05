const KEY = 'ticsSeasonProgress'

function readAll() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function writeAll(all) {
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function getCompletedEpisodeIds(behaviorId) {
  return readAll()[behaviorId]?.completed ?? []
}

export function markEpisodeComplete(behaviorId, episodeId) {
  const all = readAll()
  all[behaviorId] = all[behaviorId] ?? { completed: [] }
  if (!all[behaviorId].completed.includes(episodeId)) {
    all[behaviorId].completed.push(episodeId)
  }
  writeAll(all)
}

export function getSeasonProgress(behaviorId, season) {
  const completedIds = new Set(getCompletedEpisodeIds(behaviorId))
  const completed = season.episodes.filter((ep) => completedIds.has(ep.id)).length
  return { completed, total: season.episodes.length }
}

// Prochain épisode non terminé de la saison, ou null si elle est complète.
export function getNextEpisode(behaviorId, season) {
  const completedIds = new Set(getCompletedEpisodeIds(behaviorId))
  return season.episodes.find((ep) => !completedIds.has(ep.id)) ?? null
}
