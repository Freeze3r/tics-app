const KEY = 'ticsChecklist'

function readAll() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function isChecked(behaviorId, item) {
  const all = readAll()
  return Boolean(all[behaviorId]?.[item])
}

export function toggleChecked(behaviorId, item) {
  const all = readAll()
  all[behaviorId] = all[behaviorId] ?? {}
  all[behaviorId][item] = !all[behaviorId][item]
  localStorage.setItem(KEY, JSON.stringify(all))
  return all[behaviorId][item]
}

export function countChecked() {
  const all = readAll()
  return Object.values(all).reduce(
    (sum, items) => sum + Object.values(items).filter(Boolean).length,
    0
  )
}
