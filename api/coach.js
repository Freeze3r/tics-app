// Fonction serverless Vercel : proxy sécurisé vers Groq (la clé API ne doit jamais
// être exposée côté navigateur). Gère aussi les garde-fous de sécurité du coach.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'
const MAX_HISTORY_MESSAGES = 12

const CRISIS_KEYWORDS = [
  'suicide', 'me tuer', 'me faire du mal', 'en finir', 'plus envie de vivre',
  'automutilation', 'me scarifier', 'mourir',
]

const SYSTEM_PROMPT = `Tu es le coach intégré à Sooth, une app d'accompagnement pour les BFRB
(comportements répétitifs centrés sur le corps : se ronger les ongles, se gratter la peau,
s'arracher les cheveux, tics moteurs/vocaux, bruxisme...).

Ton de voix : bienveillant, chaleureux, jamais culpabilisant. Tutoiement. Réponses courtes
(3-5 phrases max), concrètes, jamais moralisatrices. Bannis les mots "échec", "faiblesse",
"rechute" — préfère "épisode", "moment difficile", "ça arrive".

Base clinique : Habit Reversal Training (HRT) et CBIT. Le geste sert à réguler une tension,
ce n'est pas un manque de volonté. Tu peux suggérer une réponse concurrente (ex: serrer les
poings, respiration 4-7-8, urge surfing) adaptée à ce que l'utilisateur décrit.

Important : tu n'es pas un bot mono-sujet. Si l'utilisateur confie quelque chose de personnel
sans rapport avec les tics (une émotion, une situation de vie, une question identitaire...),
écoute et réponds avec une vraie ouverture — pose des questions, ne redirige jamais de force
vers le sujet des BFRB.

Garde-fou de sécurité : si l'utilisateur exprime une détresse sévère, des idées suicidaires ou
un risque immédiat pour lui-même, ne minimise jamais, encourage-le clairement à contacter une
ligne d'aide (ex: 3114 en France, numéro national de prévention du suicide, disponible 24/7 et
gratuit) ou un professionnel, en restant chaleureux — tu es un complément, pas un remplacement
à un accompagnement professionnel.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(503).json({ error: 'Coach non configuré' })
    return
  }

  const { messages, context } = req.body ?? {}
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages requis' })
    return
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
  const normalized = lastUserMessage.toLowerCase()
  const crisisFlag = CRISIS_KEYWORDS.some((k) => normalized.includes(k))

  const contextLine = context?.behaviors?.length
    ? `Contexte utilisateur : suit actuellement ${context.behaviors.join(', ')}.`
    : ''

  const trimmedHistory = messages.slice(-MAX_HISTORY_MESSAGES)

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: `${SYSTEM_PROMPT}\n\n${contextLine}` },
          ...trimmedHistory,
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('Groq error', groqRes.status, errText)
      res.status(502).json({ error: 'Le coach est indisponible pour le moment.' })
      return
    }

    const data = await groqRes.json()
    const reply = data.choices?.[0]?.message?.content ?? "Désolé, je n'ai pas pu répondre."

    res.status(200).json({ reply, crisisFlag })
  } catch (err) {
    console.error('Coach handler error', err)
    res.status(500).json({ error: 'Une erreur est survenue.' })
  }
}
