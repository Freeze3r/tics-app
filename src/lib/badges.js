import { getPracticeDays } from './profile.js'
import { listEpisodes } from './episodes.js'
import { listJournalEntries } from './journal.js'
import { countChecked } from './checklist.js'
import { listPosts } from './community.js'

// Badges de compétence ("tu as essayé ceci"), jamais de performance pure
// (pas de "streak parfait" ni de classement) — cohérent avec le ton non-punitif de l'app.
export function getBadges() {
  const practiceDays = getPracticeDays().length
  const episodes = listEpisodes().length
  const journalEntries = listJournalEntries().length
  const checkedBarriers = countChecked()
  const coachUsed = localStorage.getItem('ticsCoachUsed') === '1'
  const libraryVisited = localStorage.getItem('ticsLibraryVisited') === '1'
  const myPosts = listPosts().filter((p) => p.isMine).length

  return [
    {
      id: 'first-step',
      icon: '🌱',
      label: 'Premier pas',
      detail: 'Premier jour de pratique marqué',
      unlocked: practiceDays >= 1,
    },
    {
      id: 'observer',
      icon: '📝',
      label: 'Observateur·rice',
      detail: 'Premier épisode noté dans le tracker',
      unlocked: episodes >= 1,
    },
    {
      id: 'explorer',
      icon: '📚',
      label: 'Exploratrice·eur',
      detail: 'Bibliothèque consultée',
      unlocked: libraryVisited,
    },
    {
      id: 'toolkit',
      icon: '🧰',
      label: 'Boîte à outils prête',
      detail: '3 barrières physiques essayées',
      unlocked: checkedBarriers >= 3,
    },
    {
      id: 'week',
      icon: '🗓️',
      label: 'Une semaine de pratique',
      detail: '7 jours de pratique cumulés',
      unlocked: practiceDays >= 7,
    },
    {
      id: 'journal',
      icon: '💭',
      label: 'Voix intérieure',
      detail: '3 entrées de journal',
      unlocked: journalEntries >= 3,
    },
    {
      id: 'coach',
      icon: '💬',
      label: 'Premier échange',
      detail: 'Coach utilisé au moins une fois',
      unlocked: coachUsed,
    },
    {
      id: 'community',
      icon: '🤝',
      label: 'Petite victoire partagée',
      detail: 'Post publié dans la communauté',
      unlocked: myPosts >= 1,
    },
  ]
}
