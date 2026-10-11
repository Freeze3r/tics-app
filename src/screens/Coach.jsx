import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { getCoachReply } from '../lib/coachResponses.js'
import { askCoach, canSendMessage, getRemainingMessages, getDailyLimit } from '../lib/coachApi.js'
import { loadProfile } from '../lib/profile.js'
import { isPremiumActive } from '../lib/subscription.js'
import { scopedKey } from '../lib/authScope.js'
import {
  loadCurrent,
  persistCurrent,
  clearCurrent,
  listSaved,
  saveConversation,
  deleteSaved,
  deleteAllSaved,
  migrateLegacyHistory,
} from '../lib/coachHistory.js'

const CRISIS_RESOURCE =
  "Si tu traverses un moment vraiment difficile, tu peux appeler le 3114 (numéro national de prévention du suicide, gratuit, 24/7) ou en parler à un professionnel. Tu n'es pas seul·e."

const SUGGESTED_TOPICS = [
  "J'ai une envie forte là",
  'Je me sens honteux·se après un épisode',
  "Je m'ennuie et mes mains bougent toutes seules",
  'Je veux juste parler de ma journée',
]

const INTRO = {
  id: 'intro',
  from: 'coach',
  text: "Salut, je suis là si tu as besoin d'en parler — d'un épisode, d'une envie, ou juste de comment tu te sens. Aucun jugement ici.",
}

const newConversation = () => ({ id: crypto.randomUUID(), savedId: null, messages: [INTRO] })

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function Coach() {
  const navigate = useNavigate()
  const [conv, setConv] = useState(() => {
    migrateLegacyHistory()
    return loadCurrent() ?? newConversation()
  })
  const [saved, setSaved] = useState(() => listSaved())
  const [showHistory, setShowHistory] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [remaining, setRemaining] = useState(() => getRemainingMessages())
  const endRef = useRef(null)
  const premium = isPremiumActive()
  const messages = conv.messages

  const setMessages = (updater) =>
    setConv((prev) => ({ ...prev, messages: typeof updater === 'function' ? updater(prev.messages) : updater }))

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
    persistCurrent(conv)
    // Une conversation gardée reste à jour tant qu'on continue de discuter.
    if (conv.savedId) {
      saveConversation(conv)
      setSaved(listSaved())
    }
  }, [conv])

  function handleNew() {
    clearCurrent()
    setConv(newConversation())
    setShowHistory(false)
  }

  function handleToggleKeep() {
    if (conv.savedId) {
      deleteSaved(conv.savedId)
      setConv((c) => ({ ...c, savedId: null }))
    } else {
      const id = saveConversation(conv)
      setConv((c) => ({ ...c, savedId: id }))
    }
    setSaved(listSaved())
  }

  function handleOpen(item) {
    setConv({ id: item.id, savedId: item.id, messages: item.messages })
    setShowHistory(false)
  }

  function handleDelete(item) {
    deleteSaved(item.id)
    if (conv.savedId === item.id) setConv((c) => ({ ...c, savedId: null }))
    setSaved(listSaved())
  }

  function handleDeleteAll() {
    if (!window.confirm('Supprimer toutes les conversations gardées ? Cette action est définitive.')) return
    deleteAllSaved()
    setConv((c) => ({ ...c, savedId: null }))
    setSaved([])
  }

  async function sendMessage(text) {
    if (!text || sending) return
    if (!canSendMessage()) return

    const userMsg = { id: crypto.randomUUID(), from: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)
    localStorage.setItem(scopedKey('ticsCoachUsed'), '1')

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
  const hasConversation = messages.length > 1

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

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={handleNew} className="choice rounded-full px-3 py-1.5 text-xs">
            ＋ Nouvelle
          </button>
          {hasConversation && (
            <button
              type="button"
              onClick={handleToggleKeep}
              className={`rounded-full px-3 py-1.5 text-xs ${conv.savedId ? 'choice-selected' : 'choice'}`}
            >
              {conv.savedId ? 'Gardée ✓' : 'Garder'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowHistory((s) => !s)}
            className={`rounded-full px-3 py-1.5 text-xs ${showHistory ? 'choice-selected' : 'choice'}`}
          >
            Historique ({saved.length})
          </button>
        </div>

        <p className="mt-2 text-xs text-navy-800/45 dark:text-sand-100/45">
          {conv.savedId
            ? 'Cette conversation est gardée sur ton appareil (retire-la avec « Gardée ✓»).'
            : "Cette conversation s'efface quand tu quittes l'app, sauf si tu la gardes."}
        </p>

        {showHistory && (
          <section className="surface mt-3 rounded-2xl p-3">
            {saved.length === 0 ? (
              <p className="text-sm text-navy-800/60 dark:text-sand-100/60">
                Aucune conversation gardée pour l'instant.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {saved.map((item) => (
                  <li key={item.id} className="surface-inset flex items-center gap-2 rounded-xl px-3 py-2">
                    <button
                      type="button"
                      onClick={() => handleOpen(item)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-medium text-navy-800 dark:text-sand-100">
                        {item.title}
                      </span>
                      <span className="text-xs text-navy-800/50 dark:text-sand-100/50">
                        {formatDate(item.savedAt)} · {item.messages.length - 1} messages
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      aria-label={`Supprimer la conversation ${item.title}`}
                      className="shrink-0 rounded-full px-2 py-1 text-xs text-coral-600 dark:text-coral-300"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {saved.length > 1 && (
              <button
                type="button"
                onClick={handleDeleteAll}
                className="mt-3 text-xs text-coral-600 dark:text-coral-300"
              >
                Tout supprimer
              </button>
            )}
          </section>
        )}

        {!hasConversation && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => sendMessage(topic)}
                className="choice rounded-full px-3 py-1.5 text-xs"
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
                    m.from === 'coach' ? 'surface' : 'ml-auto bg-coral-500 text-white'
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
              <div className="max-w-[85%] rounded-2xl surface px-4 py-2.5 text-sm text-navy-800/50 dark:text-sand-100/50">
                …
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-[5.25rem] glass-bar px-6 py-3">
          {limitReached ? (
            <div className="mx-auto flex max-w-md items-center justify-between gap-3 text-sm">
              <span className="text-navy-800/60 dark:text-sand-100/60">
                Limite quotidienne atteinte — on se retrouve demain 💛
              </span>
              <Button variant="secondary" onClick={() => navigate('/sos')}>
                Exercice SOS
              </Button>
            </div>
          ) : (
            <div className="mx-auto flex max-w-md gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input.trim())}
                placeholder="Écris ce que tu ressens…"
                className="field flex-1 rounded-full px-4 py-2 text-sm"
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
