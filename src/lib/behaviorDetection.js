import { BEHAVIORS, TRANSVERSAL_EXERCISES } from '../data/behaviors.js'

const KEYWORD_MAP = {
  nails: ['ongle', 'ongles', 'doigt', 'peau autour'],
  skin: ['peau', 'bouton', 'gratt', 'triture', 'croûte', 'croute'],
  hair: ['cheveu', 'cheveux', 'sourcil', 'cils', 'arrache', 'arrach'],
  mouth: ['joue', 'levre', 'lèvre', 'bouche', 'mord', 'mordill'],
  motor: ['clignement', 'cligne', 'tête', 'tete', 'épaule', 'epaule', 'craqu', 'articulation'],
  vocal: ['gorge', 'reniflement', 'racle', 'raclement', 'toux'],
  bruxism: ['dent', 'dents', 'mâchoire', 'machoire', 'serre', 'grince', 'grincement'],
}

export function detectBehaviorFromText(text) {
  if (!text) return null
  const normalized = text.toLowerCase()
  for (const [behaviorId, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((k) => normalized.includes(k))) return behaviorId
  }
  return null
}

// Comportement générique généré à la volée quand aucune catégorie existante ne
// correspond — pour ne jamais laisser l'utilisateur sans plan ni exercices.
export function buildCustomBehavior(text) {
  const label = text?.trim() ? text.trim().slice(0, 60) : 'Ton comportement'
  return {
    id: 'custom',
    label,
    sublabel: 'comportement personnalisé',
    mechanism:
      "Ce que tu décris ressemble à un comportement répétitif centré sur le corps (BFRB) : un geste automatique qui régule une tension, une émotion ou de l'ennui. Les mêmes principes s'appliquent, même sans case toute faite.",
    barriers: [
      'Repérer le moment exact où le geste arrive (avant de dormir, en travaillant, devant un écran...)',
      'Occuper tes mains avec un objet neutre (fidget, balle anti-stress, pâte à modeler)',
      'Mettre une barrière physique simple si possible (gants, pansement, vêtement)',
    ],
    exercises: TRANSVERSAL_EXERCISES,
  }
}

// Résout la liste de comportements choisis, y compris le pseudo-choix "other" :
// remplacé par une vraie catégorie détectée dans le texte libre, ou sinon par un
// comportement personnalisé généré à la volée (jamais de dead-end).
export function resolveBehaviors(behaviorIds, freeText) {
  const resolved = []
  const seen = new Set()

  for (const id of behaviorIds ?? []) {
    if (id !== 'other') {
      if (seen.has(id)) continue
      const behavior = BEHAVIORS.find((b) => b.id === id)
      if (behavior) {
        seen.add(id)
        resolved.push(behavior)
      }
      continue
    }

    const detected = detectBehaviorFromText(freeText)
    if (detected) {
      if (seen.has(detected)) continue
      seen.add(detected)
      resolved.push(BEHAVIORS.find((b) => b.id === detected))
    } else if (!seen.has('custom')) {
      seen.add('custom')
      resolved.push(buildCustomBehavior(freeText))
    }
  }

  return resolved
}
