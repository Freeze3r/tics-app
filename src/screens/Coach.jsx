import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import { getCoachReply } from '../lib/coachResponses.js'

const INTRO = {
  id: 'intro',
  from: 'coach',
  text: "Salut, je suis là si tu as besoin d'en parler — d'un épisode, d'une envie, ou juste de comment tu te sens. Aucun jugement ici.",
}

export default function Coach() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([INTRO])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: crypto.randomUUID(), from: 'user', text }
    const { text: replyText, suggestSos } = getCoachReply(text)
    const coachMsg = { id: crypto.randomUUID(), from: 'coach', text: replyText, suggestSos }

    setMessages((prev) => [...prev, userMsg, coachMsg])
    setInput('')
    localStorage.setItem('ticsCoachUsed', '1')
  }

  return (
    <main className="flex min-h-svh flex-1 flex-col px-6 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <h1 className="text-2xl font-bold text-ink-800 dark:text-sand-100">Coach</h1>
        <p className="mt-1 text-xs text-ink-800/40 dark:text-sand-100/40">
          Réponses automatiques bienveillantes (pas une vraie IA pour l'instant) — en cas de
          détresse, contacte un professionnel.
        </p>

        <div className="mt-4 flex-1 overflow-y-auto pb-24">
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.from === 'coach'
                      ? 'bg-white text-ink-800 dark:bg-ink-800 dark:text-sand-100'
                      : 'ml-auto bg-coral-500 text-white'
                  }`}
                >
                  {m.text}
                </div>
                {m.suggestSos && (
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={() => navigate('/sos')}
                  >
                    Lancer l'exercice SOS
                  </Button>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-16 border-t border-sage-200 bg-sage-50/95 px-6 py-3 backdrop-blur dark:border-sage-700 dark:bg-ink-900/95">
          <div className="mx-auto flex max-w-md gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Écris ce que tu ressens…"
              className="flex-1 rounded-full border-2 border-sage-200 bg-white px-4 py-2 text-sm text-ink-800 placeholder:text-ink-800/40 focus:border-sage-400 focus:outline-none dark:border-sage-700 dark:bg-ink-800 dark:text-sand-100"
            />
            <Button onClick={handleSend} disabled={!input.trim()}>
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
