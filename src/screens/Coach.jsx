import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { getCoachReply } from '../lib/coachResponses.js'
import { askCoach, canSendMessage, getRemainingMessages, getDailyLimit } from '../lib/coachApi.js'
import { loadProfile } from '../lib/profile.js'
import { isPremiumActive } from '../lib/subscription.js'

const HISTORY_KEY = 'ticsCoachHistory'
const CRISIS_RESOURCE =
  "Si tu traverses un moment vraiment difficile, tu peux appeler le 3114 (numéro national de prévention du suicide, gratuit, 24/7) ou en parler à un professionnel. Tu n'es pas seul·e."

const SUGGESTED_TOPICS = [
  "J'ai une envie forte là",
  'Je me sens honteux·se après un épisode',
  "Je m'ennuie et mes mains bougent toutes seules",
  'Je veux juste parler de ma journée',
]

function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveHistory(messages) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-40)))
}

const INTRO = {
  id: 'intro',
  from: 'coach',
  text: "Salut, je suis là si tu as besoin d'en parler — d'un épisode, d'une envie, ou juste de comment tu te sens. Aucun jugement ici.",
}

export default function Coach() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState(() => loadHistory() ?? [INTRO])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [remaining, setRemaining] = useState(() => getRemainingMessages())
  const endRef = useRef(null)
  const premium = isPremiumActive()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
    saveHistory(messages)
  }, [messages])

  async function sendMessage(text) {
    if (!text || sending) return
    if (!canSendMessage()) return

    const userMsg = { id: crypto.randomUUID(), from: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)
    localStorage.setItem('ticsCoachUsed', '1')

    const profile = loadProfile()
    const context = { behaviors: profile?.plan.behaviors.map((b) => b.label) ?? [] }
    const apiHistory = [...messages, userMsg]
      .filter((m) => m.id !== 'intro')
      .map((m) => ({ role: m.from === 'coach' ? 'assistant' : 'user', content: m.text }))

    try {
      const { reply, crisisFlag } = await askCoach(apiHistory, context)
      const coachMsg = { id: crypto.randomUUID(), from: 'coach', text: reply, crisisFlag }
      setMessages((prev) => [...prev, coachMsg])
    } catch {
      const { text: fallbackText, suggestSos } = getCoachReply(text)
      const coachMsg = {
        id: crypto.randomUUID(),
        from: 'coach',
        text: fallbackText,
        suggestSos,
        offline: true,
      }
      setMessages((prev) => [...prev, coachMsg])
    } finally {
      setSending(false)
      setRemaining(getRemainingMessages())
    }
  }

  const limitReached = !premium && remaining <= 0

  return (
    <main className="flex min-h-svh flex-1 flex-col px-6 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <h1 className="text-2xl font-bold text-navy-800 dark:text-sand-100">Coach</h1>
        <p className="mt-1 text-xs text-navy-800/40 dark:text-sand-100/40">
          {premium
            ? 'Conversations illimitées.'
            : `${remaining}/${getDailyLimit()} messages restants aujourd'hui.`}{' '}
          En cas de détresse, contacte un professionnel.
        </p>

        {messages.length <= 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => sendMessage(topic)}
                className="rounded-full border-2 border-teal-200 px-3 py-1.5 text-xs text-navy-800/70 dark:border-teal-700 dark:text-sand-100/70"
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex-1 overflow-y-auto pb-24">
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'coach'
                      ? 'bg-white text-navy-800 dark:bg-navy-800 dark:text-sand-100'
                      : 'ml-auto bg-coral-500 text-white'
                  }`}
                >
                  {m.text}
                </div>
                {m.offline && (
                  <p className="mt-1 text-xs text-navy-800/40 dark:text-sand-100/40">
                    Réponse hors-ligne (le coach n'a pas pu répondre normalement).
                  </p>
                )}
                {m.crisisFlag && (
                  <div className="mt-2 max-w-[85%] rounded-2xl bg-coral-100 px-4 py-3 text-sm text-coral-700 dark:bg-coral-500/10 dark:text-coral-300">
                    {CRISIS_RESOURCE}
                  </div>
                )}
                {m.suggestSos && (
                  <Button variant="secondary" className="mt-2" onClick={() => navigate('/sos')}>
                    Lancer l'exercice SOS
                  </Button>
                )}
              </div>
            ))}
            {sending && (
              <div className="max-w-[85%] rounded-2xl bg-white px-4 py-2.5 text-sm text-navy-800/50 dark:bg-navy-800 dark:text-sand-100/50">
                …
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-16 border-t border-teal-200 bg-teal-50/95 px-6 py-3 backdrop-blur dark:border-teal-700 dark:bg-navy-900/95">
          {limitReached ? (
            <div className="mx-auto flex max-w-md items-center justify-between gap-3 text-sm">
              <span className="text-navy-800/60 dark:text-sand-100/60">
                Limite quotidienne atteinte.
              </span>
              <Button variant="secondary" onClick={() => navigate('/premium')}>
                Passer en Premium
              </Button>
            </div>
          ) : (
            <div className="mx-auto flex max-w-md gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input.trim())}
                placeholder="Écris ce que tu ressens…"
                className="flex-1 rounded-full border-2 border-teal-200 bg-white px-4 py-2 text-sm text-navy-800 placeholder:text-navy-800/40 focus:border-teal-400 focus:outline-none dark:border-teal-700 dark:bg-navy-800 dark:text-sand-100"
              />
              <Button onClick={() => sendMessage(input.trim())} disabled={!input.trim() || sending}>
                Envoyer
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
