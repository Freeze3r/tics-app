import { scopedKey } from './authScope.js'

const KEY = 'ticsTutorialSeen'

export function hasSeenTutorial() {
  return localStorage.getItem(scopedKey(KEY)) === '1'
}

export function markTutorialSeen() {
  localStorage.setItem(scopedKey(KEY), '1')
}

export function nextAfterOnboarding() {
  return hasSeenTutorial() ? '/home' : '/tutorial'
}
