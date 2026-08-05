import { SEED_POSTS } from '../data/communityPosts.js'

const LOCAL_KEY = 'ticsCommunityPosts'

function readLocalPosts() {
  const raw = localStorage.getItem(LOCAL_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeLocalPosts(posts) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(posts))
}

// Démo locale, pas de vrai backend multi-utilisateurs : les posts "seed" simulent
// une communauté, et ce que l'utilisateur ajoute reste visible seulement sur son appareil.
export function listPosts() {
  const seed = SEED_POSTS.map((p) => ({
    ...p,
    createdAt: new Date(Date.now() - p.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    isMine: false,
  }))
  const local = readLocalPosts()
  return [...local, ...seed].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function addPost({ behaviorId, text }) {
  const post = {
    id: crypto.randomUUID(),
    behaviorId,
    author: 'Toi',
    text,
    createdAt: new Date().toISOString(),
    isMine: true,
  }
  const posts = readLocalPosts()
  posts.unshift(post)
  writeLocalPosts(posts)
  return post
}
