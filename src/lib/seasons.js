import { TRANSVERSAL_EXERCISES } from '../data/behaviors.js'

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
      "Tu as vu le mécanisme derrière ce comportement, testé plusieurs réponses concurrentes, et mis en place au moins une barrière physique. C'est la base du HRT/CBIT. La saison 2 ira plus loin — en attendant, continue ce qui a marché pour toi.",
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

function buildLockedSeason(number, title) {
  return { id: `s${number}`, number, title, locked: true, comingSoon: true, episodes: [] }
}

export function getSeasons(behavior) {
  return [
    buildSeasonOne(behavior),
    buildLockedSeason(2, 'Saison 2 : Approfondir'),
    buildLockedSeason(3, 'Saison 3 : Consolider'),
  ]
}
