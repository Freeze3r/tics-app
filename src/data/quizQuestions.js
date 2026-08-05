import { BEHAVIORS, TRIGGER_CONTEXTS } from './behaviors.js'

export const QUIZ_QUESTIONS = [
  {
    key: 'behaviors',
    type: 'multi',
    title: 'Quel(s) comportement(s) te concernent ?',
    subtitle: 'Tu peux en choisir plusieurs.',
    options: [
      ...BEHAVIORS.map((b) => ({ value: b.id, label: b.label, sublabel: b.sublabel })),
      { value: 'other', label: 'Autre / Je ne sais pas trop', sublabel: 'On va t’aider à trouver ensemble' },
    ],
  },
  {
    key: 'freeText',
    type: 'text',
    title: 'Si tu veux, décris ce que tu fais avec tes mots',
    subtitle: 'Optionnel — ça nous aide surtout si rien ne correspondait vraiment juste avant.',
  },
  {
    key: 'frequency',
    type: 'single',
    title: 'À quelle fréquence ça arrive ?',
    options: [
      { value: 'occasional', label: 'Occasionnel', sublabel: 'quelques fois par semaine' },
      { value: 'daily', label: 'Quotidien', sublabel: 'presque tous les jours' },
      { value: 'constant', label: 'Quasi permanent', sublabel: 'plusieurs fois par jour' },
    ],
  },
  {
    key: 'triggers',
    type: 'multi',
    title: 'Dans quels contextes ça arrive le plus ?',
    subtitle: 'Choisis ceux qui te parlent le plus.',
    options: TRIGGER_CONTEXTS.map((t) => ({ value: t.id, label: t.label })),
  },
  {
    key: 'yearsSince',
    type: 'single',
    title: 'Depuis combien de temps ?',
    options: [
      { value: 'recent', label: 'Moins d’un an' },
      { value: '1to5', label: 'Entre 1 et 5 ans' },
      { value: 'over5', label: 'Plus de 5 ans' },
    ],
  },
  {
    key: 'goal',
    type: 'single',
    title: 'Quel est ton objectif ?',
    subtitle: 'Il n’y a pas de bonne ou mauvaise réponse.',
    options: [
      { value: 'reduction', label: 'Réduire progressivement' },
      { value: 'stop', label: 'Arrêter complètement' },
      { value: 'damage', label: 'Gérer les cicatrices / dégâts visibles' },
      { value: 'confidence', label: 'Reprendre confiance en moi' },
    ],
  },
  {
    key: 'visibleDamage',
    type: 'boolean',
    title: 'Est-ce que ça laisse des marques ou dégâts visibles sur ta peau, tes ongles ou tes cheveux ?',
  },
  {
    key: 'emotionalImpact',
    type: 'boolean',
    title: 'Est-ce que ça t’affecte émotionnellement au quotidien (stress, anxiété, honte) ?',
  },
]
