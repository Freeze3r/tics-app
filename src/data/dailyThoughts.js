export const DAILY_THOUGHTS = [
  "Un jour difficile ne défait pas les jours où ça a bien été. La tendance compte plus que l'instant.",
  "Ce geste a longtemps servi à quelque chose — calmer, occuper, apaiser. Le remplacer prend du temps, pas de la volonté pure.",
  "Tu n'as pas besoin d'un jour parfait. Juste d'un prochain petit pas.",
  "La honte fait durer le cycle plus que le geste lui-même. Sois aussi doux·ce avec toi qu'avec un ami.",
  "Remarquer une envie sans y céder, c'est déjà un exercice réussi — même si le geste arrive quand même parfois.",
  "Le corps cherche une sensation, pas un problème. Lui en donner une autre est une stratégie, pas un échec si ça prend plusieurs essais.",
  "Chaque fois que tu notes un épisode sans te juger, tu apprends un peu plus sur tes propres déclencheurs.",
  "Le progrès dans les BFRB n'est presque jamais linéaire. C'est normal, attendu, et ça n'efface rien de ce que tu as déjà fait.",
]

export function thoughtOfTheDay() {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  return DAILY_THOUGHTS[dayIndex % DAILY_THOUGHTS.length]
}
