const KEY = 'ticsTutorialSeen'

export function hasSeenTutorial() {
  return localStorage.getItem(KEY) === '1'
}

export function markTutorialSeen() {
  localStorage.setItem(KEY, '1')
}

export function nextAfterOnboarding() {
  return hasSeenTutorial() ? '/home' : '/tutorial'
}
