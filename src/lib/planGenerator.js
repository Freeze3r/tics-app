import { TRANSVERSAL_EXERCISES } from '../data/behaviors.js'
import { resolveBehaviors } from './behaviorDetection.js'

const FREQUENCY_DAYS = {
  occasional: 30,
  daily: 60,
  constant: 90,
}

const DERMATO_BEHAVIORS = new Set(['nails', 'skin', 'hair'])
const NEURO_BEHAVIORS = new Set(['motor', 'vocal'])
const DENTAL_BEHAVIORS = new Set(['bruxism', 'mouth'])

// Seuils indicatifs de sévérité (brief section 8) : ne posent jamais de diagnostic,
// orientent seulement vers un accompagnement professionnel quand plusieurs signaux
// forts se cumulent — pas juste "quotidien + un peu d'impact émotionnel", pour éviter
// de suggérer une consultation lourde à quelqu'un avec un tic léger.
function computeSeverity(answers) {
  let score = 0
  if (answers.frequency === 'constant') score += 2
  if (answers.yearsSince === 'over5') score += 1
  if (answers.visibleDamage) score += 2
  if (answers.emotionalImpact) score += 1
  return score
}

// Construit une recommandation de professionnel adaptée aux comportements réels
// (pas de "consulte un dermatologue" pour un tic moteur qui ne concerne pas la peau).
function buildProfessionalSuggestion(behaviors) {
  const ids = new Set(behaviors.map((b) => b.id))
  const specialists = []
  if ([...ids].some((id) => DERMATO_BEHAVIORS.has(id))) specialists.push('un dermatologue')
  if ([...ids].some((id) => NEURO_BEHAVIORS.has(id))) specialists.push('un neurologue ou un psychologue spécialisé CBIT')
  if ([...ids].some((id) => DENTAL_BEHAVIORS.has(id))) specialists.push('un dentiste')
  if (specialists.length === 0) specialists.push('un psychologue spécialisé TCC/CBIT')

  const uniqueSpecialists = [...new Set(specialists)]
  const list =
    uniqueSpecialists.length === 1
      ? uniqueSpecialists[0]
      : `${uniqueSpecialists.slice(0, -1).join(', ')} ou ${uniqueSpecialists.at(-1)}`

  return `Vu ce que tu nous as partagé, ça pourrait vraiment t'aider d'en parler aussi à ${list}. L'app reste un bon complément, pas un remplacement.`
}

export function generatePlan(answers) {
  const selectedBehaviors = resolveBehaviors(answers.behaviors, answers.freeText)

  const durationDays = FREQUENCY_DAYS[answers.frequency] ?? 30

  const exercisesByBehavior = selectedBehaviors.map((b) => ({
    behavior: b,
    exercises: b.exercises.slice(0, 3),
  }))

  const severityScore = computeSeverity(answers)
  const suggestProfessional = severityScore >= 4

  return {
    durationDays,
    behaviors: selectedBehaviors,
    exercisesByBehavior,
    dailyTraining: TRANSVERSAL_EXERCISES.slice(0, 2),
    triggers: answers.triggers ?? [],
    goal: answers.goal,
    suggestProfessional,
    professionalSuggestion: suggestProfessional ? buildProfessionalSuggestion(selectedBehaviors) : null,
  }
}
