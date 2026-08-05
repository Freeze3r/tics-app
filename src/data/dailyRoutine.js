// Micro-exercices rattachés à des moments de la journée (brief v2 section B6).
// Chaque rappel de notification renvoie ici — jamais un rappel "pour la forme"
// sans contenu réel derrière.
export const DAILY_ROUTINE = {
  morning: {
    id: 'morning',
    period: 'morning',
    label: 'Réveil',
    icon: '🌅',
    title: 'Respiration guidée du matin',
    detail: '1 à 3 minutes pour démarrer la journée posé·e, avant que le stress ne s’installe.',
    steps: [
      'Assieds-toi confortablement, dos droit.',
      'Inspire lentement par le nez pendant 4 secondes.',
      'Expire par la bouche pendant 6 secondes.',
      'Répète ce cycle pendant 1 à 3 minutes.',
    ],
    timerSeconds: 90,
  },
  noon: {
    id: 'noon',
    period: 'noon',
    label: 'Midi',
    icon: '☀️',
    title: 'Relâchement rapide',
    detail: '30 secondes pour redescendre la tension accumulée en matinée.',
    steps: [
      'Hausse les épaules vers les oreilles, tiens 3 secondes.',
      'Relâche d’un coup.',
      'Répète 3 fois.',
      'Termine par une grande respiration.',
    ],
    timerSeconds: 30,
  },
  evening: {
    id: 'evening',
    period: 'evening',
    label: 'Soir',
    icon: '🌙',
    title: 'Détente avant de dormir',
    detail: 'La majorité des épisodes BFRB arrivent en veille passive le soir — ce rituel réduit ce risque.',
    steps: [
      'Tamise la lumière autour de toi.',
      'Pose ton téléphone hors de portée immédiate.',
      'Occupe tes mains (tissu, balle anti-stress) en respirant lentement 2 minutes.',
    ],
    timerSeconds: 120,
  },
}

export function currentPeriod(date = new Date()) {
  const hour = date.getHours()
  if (hour < 11) return 'morning'
  if (hour < 17) return 'noon'
  return 'evening'
}
