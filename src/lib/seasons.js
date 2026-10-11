import { TRANSVERSAL_EXERCISES } from '../data/behaviors.js'
import { buildSeasonTwoEpisodes, buildSeasonThreeEpisodes } from '../data/seasonContent.js'
import { getCompletedEpisodeIds } from './seasonProgress.js'

// Construit la Saison 1 d'un comportement à partir du contenu déjà vérifié
// (mécanisme, barrières, exercices) plutôt que d'inventer 50 contenus cliniques
// non validés. La saison grandira au fil du temps — le nombre total d'épisodes
// reflète honnêtement ce qui existe vraiment, pas un chiffre marketing.
function buildSeasonOne(behavior) {
  const episodes = []

  episodes.push({
    id: 'lesson-intro',
    type: 'lesson',
    title: `Comprendre : ${behavior.label}`,
    duration: '3 min',
    content: behavior.mechanism,
  })

  behavior.exercises.forEach((ex, i) => {
    episodes.push({
      id: `exercise-${i}`,
      type: 'exercise',
      title: ex.title,
      duration: ex.timerSeconds ? `${Math.round(ex.timerSeconds / 60) || 1} min` : '2 min',
      content: ex.detail,
      steps: ex.steps,
      timerSeconds: ex.timerSeconds,
    })
  })

  episodes.push({
    id: 'lesson-barriers',
    type: 'lesson',
    title: 'Mets en place tes barrières',
    duration: '3 min',
    content: `Quelques ajustements simples de ton environnement qui font une vraie différence : ${behavior.barriers.join(' · ')}.`,
  })

  TRANSVERSAL_EXERCISES.forEach((ex, i) => {
    episodes.push({
      id: `transversal-${i}`,
      type: 'exercise',
      title: ex.title,
      duration: ex.timerSeconds ? `${Math.round(ex.timerSeconds / 60) || 1} min` : '3-5 min',
      content: ex.detail,
      steps: ex.steps,
      timerSeconds: ex.timerSeconds,
    })
  })

  episodes.push({
    id: 'lesson-bilan',
    type: 'lesson',
    title: 'Bilan de la saison 1',
    duration: '2 min',
    content:
      "Tu as vu le mécanisme derrière ce comportement, testé plusieurs réponses concurrentes, et mis en place au moins une barrière physique. C'est la base du HRT/CBIT. La saison 2 t'apprend à repérer tes déclencheurs et à te préparer — elle t'attend juste après.",
  })

  return {
    id: 's1',
    number: 1,
    title: 'Saison 1 : Les bases',
    locked: false,
    comingSoon: false,
    episodes,
  }
}

function buildSeason(number, title, episodes) {
  return { id: `s${number}`, number, title, locked: false, comingSoon: false, episodes }
}

export function getSeasons(behavior) {
  return [
    buildSeasonOne(behavior),
    buildSeason(2, 'Saison 2 : Approfondir', buildSeasonTwoEpisodes(behavior.id)),
    buildSeason(3, 'Saison 3 : Consolider', buildSeasonThreeEpisodes(behavior.id)),
  ]
}

// La saison "en cours" : la première pas encore terminée (la dernière si tout est fini).
export function getActiveSeason(behavior) {
  const seasons = getSeasons(behavior)
  const done = new Set(getCompletedEpisodeIds(behavior.id))
  return seasons.find((s) => s.episodes.some((e) => !done.has(e.id))) ?? seasons[seasons.length - 1]
}

// Épisode qui précède celui-ci (dans la saison, puis à la fin de la saison précédente).
export function getEpisodeBefore(behavior, episodeId) {
  const seasons = getSeasons(behavior)
  for (let i = 0; i < seasons.length; i++) {
    const idx = seasons[i].episodes.findIndex((e) => e.id === episodeId)
    if (idx === -1) continue
    if (idx > 0) return seasons[i].episodes[idx - 1]
    return seasons[i - 1]?.episodes.at(-1) ?? null
  }
  return null
}

// Épisode qui suit celui-ci (dans la saison, puis au début de la saison suivante).
export function getEpisodeAfter(behavior, episodeId) {
  const seasons = getSeasons(behavior)
  for (let i = 0; i < seasons.length; i++) {
    const idx = seasons[i].episodes.findIndex((e) => e.id === episodeId)
    if (idx === -1) continue
    return seasons[i].episodes[idx + 1] ?? seasons[i + 1]?.episodes[0] ?? null
  }
  return null
}
