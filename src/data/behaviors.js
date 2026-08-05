// Catalogue des comportements + bibliothèque d'exercices associée (brief section 6)
export const BEHAVIORS = [
  {
    id: 'nails',
    label: 'Ongles / peau autour des ongles',
    sublabel: 'onychophagie, dermatophagie',
    mechanism:
      "L'onychophagie est un comportement d'auto-régulation : le geste calme une tension interne (stress, ennui, concentration) via une stimulation sensorielle répétitive. Ce n'est pas un manque de volonté — c'est un circuit automatique appris, qui se désapprend avec de la répétition, pas avec de la discipline.",
    barriers: [
      'Vernis amer sur les ongles',
      'Pansements sur les doigts les plus rongés',
      'Gants fins le soir',
      'Bague ou fidget à tourner à portée de main',
    ],
    exercises: [
      { title: 'Poings serrés 90 secondes', detail: 'Dès l’envie, serre les poings fermement ou pose les mains à plat sur les cuisses pendant 90 secondes.' },
      { title: 'Objet à mâchouiller / bague à tourner', detail: 'Garde à portée un fidget oral ou une bague à tourner entre les doigts.' },
      { title: 'Barrière physique', detail: 'Vernis amer, pansements sur les doigts les plus rongés, gants fins le soir.' },
      { title: 'Conscience corporelle (2x/jour)', detail: '60 secondes devant un miroir : "est-ce que ma main est proche de ma bouche ?"' },
      { title: 'Rituel de soin des mains', detail: '2 minutes par jour de manucure/hydratation — remplace le geste de destruction par un geste de soin.' },
    ],
  },
  {
    id: 'skin',
    label: 'Peau (grattage, triturage)',
    sublabel: 'dermatillomanie',
    mechanism:
      "La dermatillomanie mêle souvent focalisation attentionnelle (chercher une imperfection) et décharge de tension. La lumière grossissante et les miroirs de salle de bain amplifient la focalisation — agir sur l'environnement réduit les occasions déclenchantes sans nécessiter d'effort de volonté constant.",
    barriers: [
      'Retirer les miroirs grossissants',
      'Éclairage tamisé dans la salle de bain',
      'Pansements sur les zones ciblées',
      'Balle anti-stress ou pâte à modeler à portée',
    ],
    exercises: [
      { title: 'Paumes pressées l’une contre l’autre', detail: '1 à 2 minutes dès l’envie.' },
      { title: 'Substitut tactile', detail: 'Balle anti-stress, pâte à modeler, tissu texturé à toucher.' },
      { title: 'Barrière physique', detail: 'Retire les miroirs grossissants, pansements sur les zones ciblées.' },
      { title: 'Règle des 5 minutes', detail: 'Dès l’envie, attends 5 minutes en respirant avant d’agir.' },
      { title: 'Body scan (5 min/jour)', detail: 'Relâche les tensions accumulées avant qu’elles ne se traduisent en grattage.' },
    ],
  },
  {
    id: 'hair',
    label: 'Cheveux / sourcils / cils',
    sublabel: 'trichotillomanie',
    mechanism:
      "La trichotillomanie a deux formes distinctes : automatique (en arrière-plan pendant une autre activité, souvent hors conscience) et focalisée (recherche active d'un cheveu précis). Les distinguer change la stratégie : la forme automatique répond aux mains occupées, la forme focalisée répond au retrait des miroirs et à la conscience corporelle.",
    barriers: [
      'Cheveux attachés en journée',
      'Bonnet léger le soir devant un écran',
      'Gants fins pendant lecture/télé',
      'Brosse ou tissu texturé à caresser à portée',
    ],
    exercises: [
      { title: 'Mains sur les genoux / poches', detail: 'Dès la sensation de vouloir toucher les cheveux.' },
      { title: 'Substitut tactile', detail: 'Brosse à cheveux, peluche, bracelet texturé au poignet.' },
      { title: 'Barrière physique', detail: 'Cheveux attachés, bonnet léger le soir, gants pendant les activités à risque.' },
      { title: 'Mains occupées', detail: 'Tricot, pâte à modeler, jeu simple pendant TV/lecture.' },
      { title: 'Carnet de triggers', detail: 'Note l’émotion précise à chaque épisode : ennui, anxiété, concentration.' },
    ],
  },
  {
    id: 'mouth',
    label: 'Joues / lèvres / bouche',
    sublabel: 'morsures répétées',
    mechanism:
      "Mordiller joues/lèvres est souvent une régulation orale de la tension, proche du bruxisme. Le corps cherche une stimulation proprioceptive dans la mâchoire — un substitut oral neutre (chewing-gum, pastille) satisfait ce besoin sensoriel sans dommage tissulaire.",
    barriers: [
      'Chewing-gum sans sucre toujours à portée',
      'Baume à lèvres pour réduire les peaux à mordiller',
      'Rappel régulier de relâcher la mâchoire',
    ],
    exercises: [
      { title: 'Substitut oral', detail: 'Chewing-gum sans sucre, bâtonnet de cannelle, pastille à sucer.' },
      { title: 'Respiration nasale consciente', detail: 'Lèvres légèrement entrouvertes et détendues, 60 secondes.' },
      { title: 'Relâchement mâchoire', detail: 'Étirement doux + massage des masséters, 2x/jour.' },
      { title: 'Alarme de conscience corporelle', detail: '3x/jour : "où est ma langue/mâchoire en ce moment ?"' },
    ],
  },
  {
    id: 'motor',
    label: 'Tics moteurs',
    sublabel: 'clignements, mouvements de tête/épaules, craquements',
    mechanism:
      "Les tics moteurs sont précédés d'une sensation prémonitoire (une tension qui monte) que le tic soulage brièvement. La méthode CBIT ne cherche pas à supprimer cette sensation, mais à lui opposer un mouvement volontaire incompatible, qui devient automatique avec la répétition.",
    barriers: [
      'Routine de sommeil régulière (la fatigue aggrave les tics)',
      'Pauses anti-stress programmées dans la journée',
      'Éviter la caféine en excès',
    ],
    exercises: [
      { title: 'Réponse concurrente ciblée', detail: 'Mouvement volontaire incompatible avec le tic, tenu 1-3 min.' },
      { title: 'Relaxation musculaire progressive', detail: '5-10 min/jour : contracter puis relâcher chaque groupe musculaire.' },
      { title: 'Cohérence cardiaque', detail: 'Respiration 5-5, 5 minutes, matin et soir.' },
      { title: 'Hygiène de sommeil', detail: 'Heure de coucher régulière — la fatigue aggrave les tics.' },
    ],
  },
  {
    id: 'vocal',
    label: 'Tics vocaux légers',
    sublabel: 'raclement de gorge, reniflement répété',
    mechanism:
      "Comme les tics moteurs, les tics vocaux légers répondent à une sensation prémonitoire dans la gorge ou le nez. Une gorge sèche ou irritée augmente la fréquence — l'hydratation régulière réduit mécaniquement les occasions du tic, en complément de la réponse concurrente.",
    barriers: ['Eau à portée de main toute la journée', 'Pastilles pour la gorge si besoin', 'Air ambiant humidifié le soir'],
    exercises: [
      { title: 'Réponse concurrente ciblée', detail: 'Respiration contrôlée douce à la place du raclement, tenue 1-3 min.' },
      { title: 'Cohérence cardiaque', detail: 'Respiration 5-5, 5 minutes, matin et soir.' },
      { title: 'Hydratation régulière', detail: 'Une gorge sèche augmente l’envie de se racler.' },
    ],
  },
  {
    id: 'bruxism',
    label: 'Serrement / grincement des dents',
    sublabel: 'bruxisme diurne',
    mechanism:
      "Le bruxisme diurne est très lié au stress accumulé dans la journée — la mâchoire devient un point de décharge de tension inconsciente. Le repositionnement régulier (langue au palais, dents desserrées) associé à une gestion du stress en amont réduit la fréquence sans nécessiter d'y penser en permanence.",
    barriers: [
      'Rappel visuel toutes les 2h (post-it, alarme douce)',
      'Éviter de mâcher du chewing-gum en excès (peut renforcer la tension)',
      'Compresse chaude sur la mâchoire le soir',
    ],
    exercises: [
      { title: 'Rappel toutes les 2h', detail: '"Langue au palais, dents desserrées, épaules basses."' },
      { title: 'Étirement mâchoire + massage masséter', detail: 'Matin et soir.' },
      { title: 'Gestion du stress', detail: 'Cohérence cardiaque, scan corporel.' },
    ],
  },
]

export const TRANSVERSAL_EXERCISES = [
  { title: 'Urge surfing', detail: '3-5 min : observe l’envie comme une vague qui monte, culmine puis redescend, sans agir.' },
  { title: 'Respiration 4-7-8', detail: 'Inspire 4s, retiens 7s, expire 8s — dès qu’une envie forte se présente.' },
  { title: 'Routine du soir anti-épisode', detail: '10 min avant de dormir : mains occupées, lumière tamisée, pas d’écran juste avant.' },
  { title: 'Auto-compassion guidée', detail: '2 min audio à lancer juste après un épisode pour couper le cercle honte → stress → nouvel épisode.' },
]

export function getBehavior(id) {
  return BEHAVIORS.find((b) => b.id === id)
}

export const TRIGGER_CONTEXTS = [
  { id: 'stress', label: 'Stress' },
  { id: 'boredom', label: 'Ennui' },
  { id: 'focus', label: 'Concentration' },
  { id: 'bedtime', label: 'Avant de dormir' },
  { id: 'screens', label: 'Réseaux sociaux / écran' },
  { id: 'social', label: 'Situations sociales anxiogènes' },
]
