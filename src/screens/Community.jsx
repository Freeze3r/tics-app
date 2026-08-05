import { useMemo, useState } from 'react'
import Button from '../components/Button.jsx'
import Chip from '../components/Chip.jsx'
import { BEHAVIORS, getBehavior } from '../data/behaviors.js'
import { listPosts, addPost } from '../lib/community.js'
import { loadProfile } from '../lib/profile.js'

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.round(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'à l’instant'
  if (hours < 24) return `il y a ${hours} h`
  return `il y a ${Math.round(hours / 24)} j`
}

export default function Community() {
  const [profile] = useState(() => loadProfile())
  const [filter, setFilter] = useState('all')
  const [posts, setPosts] = useState(() => listPosts())
  const [formOpen, setFormOpen] = useState(false)
  const [text, setText] = useState('')
  const [behaviorId, setBehaviorId] = useState(profile?.plan.behaviors[0]?.id ?? BEHAVIORS[0].id)

  const filtered = useMemo(
    () => (filter === 'all' ? posts : posts.filter((p) => p.behaviorId === filter)),
    [posts, filter]
  )

  const categories = profile?.plan.behaviors ?? BEHAVIORS

  function handlePublish() {
    if (!text.trim()) return
    const post = addPost({ behaviorId, text: text.trim() })
    setPosts((prev) => [post, ...prev])
    setText('')
    setFormOpen(false)
  }

  return (
    <main className="px-6 py-8">
      <div className="mx-auto max-w-md pb-6">
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Communauté</h1>
        <p className="mt-1 text-ink-800/60 dark:text-sand-100/60">
          Des petites victoires, pas de compétition de streak. Aperçu local — la vraie communauté
          multi-utilisateurs arrive plus tard.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Chip selected={filter === 'all'} onClick={() => setFilter('all')}>
            Tout
          </Chip>
          {categories.map((b) => (
            <Chip key={b.id} selected={filter === b.id} onClick={() => setFilter(b.id)}>
              {b.label}
            </Chip>
          ))}
        </div>

        {!formOpen ? (
          <Button className="mt-4 w-full" variant="secondary" onClick={() => setFormOpen(true)}>
            Partager une petite victoire
          </Button>
        ) : (
          <section className="mt-4 rounded-2xl bg-white p-4 dark:bg-ink-800">
            <div className="mb-3 flex flex-wrap gap-2">
              {categories.map((b) => (
                <Chip key={b.id} selected={behaviorId === b.id} onClick={() => setBehaviorId(b.id)}>
                  {b.label}
                </Chip>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Une petite victoire, un déclic, un truc qui a marché…"
              rows={3}
              className="w-full resize-none rounded-2xl border-2 border-sage-200 bg-transparent p-3 text-sm text-ink-800 placeholder:text-ink-800/40 focus:border-sage-400 focus:outline-none dark:border-sage-700 dark:text-sand-100"
            />
            <div className="mt-3 flex gap-3">
              <Button variant="ghost" onClick={() => setFormOpen(false)}>
                Annuler
              </Button>
              <Button className="flex-1" onClick={handlePublish} disabled={!text.trim()}>
                Publier
              </Button>
            </div>
          </section>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {filtered.map((post) => {
            const behavior = getBehavior(post.behaviorId)
            return (
              <div key={post.id} className="rounded-2xl bg-white p-4 dark:bg-ink-800">
                <div className="flex items-center justify-between text-xs text-ink-800/50 dark:text-sand-100/50">
                  <span className="font-medium text-sage-600 dark:text-sage-400">
                    {post.author} {post.isMine && '· toi'}
                  </span>
                  <span>{relativeTime(post.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-ink-800/80 dark:text-sand-100/80">{post.text}</p>
                <p className="mt-2 text-xs text-ink-800/40 dark:text-sand-100/40">
                  {behavior?.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
