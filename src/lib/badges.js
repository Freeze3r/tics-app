import { getPracticeDays, loadProfile } from './profile.js'
import { listEpisodes } from './episodes.js'
import { listJournalEntries } from './journal.js'
import { countChecked } from './checklist.js'
import { listPosts } from './community.js'
import { getSeasons } from './seasons.js'
import { getCompletedEpisodeIds } from './seasonProgress.js'

function countCompletedContentEpisodes() {
  const profile = loadProfile()
  if (!profile) return 0
  return profile.plan.behaviors.reduce((sum, b) => {
    const season = getSeasons(b)[0]
    const completed = getCompletedEpisodeIds(b.id).filter((id) => season.episodes.some((e) => e.id === id))
    return sum + completed.length
  }, 0)
}

// Badges de compétence ("tu as essayé ceci"), jamais de performance pure
// (pas de "streak parfait" ni de classement) — cohérent avec le ton non-punitif de l'app.
// Chaque badge inclut sa progression exacte pour que la fiche de détail soit claire.
export function getBadges() {
  const practiceDays = getPracticeDays().length
  const episodes = listEpisodes().length
  const journalEntries = listJournalEntries().length
  const checkedBarriers = countChecked()
  const coachUsed = localStorage.getItem('ticsCoachUsed') === '1'
  const libraryVisited = localStorage.getItem('ticsLibraryVisited') === '1'
  const myPosts = listPosts().filter((p) => p.isMine).length
  const completedContentEpisodes = countCompletedContentEpisodes()

  return [
    {
      id: 'first-step',
      icon: '🌱',
      label: 'Premier pas',
      detail: 'Marque ton premier jour de pratique',
      unlocked: practiceDays >= 1,
      progress: { current: Math.min(practiceDays, 1), target: 1 },
    },
    {
      id: 'observer',
      icon: '📝',
      label: 'Observateur·rice',
      detail: 'Note un premier moment difficile dans le tracker',
      unlocked: episodes >= 1,
      progress: { current: Math.min(episodes, 1), target: 1 },
    },
    {
      id: 'explorer',
      icon: '📚',
      label: 'Exploratrice·eur',
      detail: 'Consulte la bibliothèque',
      unlocked: libraryVisited,
      progress: { current: libraryVisited ? 1 : 0, target: 1 },
    },
    {
      id: 'toolkit',
      icon: '🧰',
      label: 'Boîte à outils prête',
      detail: 'Essaie 3 barrières physiques',
      unlocked: checkedBarriers >= 3,
      progress: { current: Math.min(checkedBarriers, 3), target: 3 },
    },
    {
      id: 'episodes-5',
      icon: '🎧',
      label: 'Sur la bonne voie',
      detail: 'Termine 5 épisodes de ta saison',
      unlocked: completedContentEpisodes >= 5,
      progress: { current: Math.min(completedContentEpisodes, 5), target: 5 },
    },
    {
      id: 'episodes-10',
      icon: '🏁',
      label: 'Saison bien avancée',
      detail: 'Termine 10 épisodes de ta saison',
      unlocked: completedContentEpisodes >= 10,
      progress: { current: Math.min(completedContentEpisodes, 10), target: 10 },
    },
    {
      id: 'week',
      icon: '🗓️',
      label: 'Une semaine de pratique',
      detail: 'Cumule 7 jours de pratique (pas forcément d’affilée)',
      unlocked: practiceDays >= 7,
      progress: { current: Math.min(practiceDays, 7), target: 7 },
    },
    {
      id: 'month',
      icon: '🌕',
      label: 'Un mois de pratique',
      detail: 'Cumule 30 jours de pratique',
      unlocked: practiceDays >= 30,
      progress: { current: Math.min(practiceDays, 30), target: 30 },
    },
    {
      id: 'journal',
      icon: '💭',
      label: 'Voix intérieure',
      detail: 'Écris 3 entrées de journal',
      unlocked: journalEntries >= 3,
      progress: { current: Math.min(journalEntries, 3), target: 3 },
    },
    {
      id: 'coach',
      icon: '💬',
      label: 'Premier échange',
      detail: 'Utilise le coach au moins une fois',
      unlocked: coachUsed,
      progress: { current: coachUsed ? 1 : 0, target: 1 },
    },
    {
      id: 'community',
      icon: '🤝',
      label: 'Petite victoire partagée',
      detail: 'Publie un post dans la communauté',
      unlocked: myPosts >= 1,
      progress: { current: Math.min(myPosts, 1), target: 1 },
    },
    {
      id: 'community-3',
      icon: '🌟',
      label: 'Voix de la communauté',
      detail: 'Publie 3 posts dans la communauté',
      unlocked: myPosts >= 3,
      progress: { current: Math.min(myPosts, 3), target: 3 },
    },
  ]
}
