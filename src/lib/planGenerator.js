import { BEHAVIORS, TRANSVERSAL_EXERCISES } from '../data/behaviors.js'

const FREQUENCY_DAYS = {
  occasional: 30,
  daily: 60,
  constant: 90,
}

// Seuils indicatifs de sévérité (brief section 8) : ne posent jamais de diagnostic,
// orientent seulement vers un accompagnement professionnel quand plusieurs signaux se cumulent.
function computeSeverity(answers) {
  let score = 0
  if (answers.frequency === 'constant') score += 2
  if (answers.frequency === 'daily') score += 1
  if (answers.yearsSince === 'over5') score += 1
  if (answers.visibleDamage) score += 2
  if (answers.emotionalImpact) score += 2
  if (answers.goal === 'confidence') score += 1
  return score
}

export function generatePlan(answers) {
  const selectedBehaviors = BEHAVIORS.filter((b) =>
    answers.behaviors?.includes(b.id)
  )

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
  }
}
