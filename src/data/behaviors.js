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
      {
        title: 'Poings serrés 90 secondes',
        detail: 'Dès l’envie, serre les poings fermement ou pose les mains à plat sur les cuisses pendant 90 secondes.',
        steps: [
          'Remarque l’envie, sans la juger.',
          'Serre les deux poings aussi fort que possible.',
          'Garde-les serrés (ou les mains à plat sur tes cuisses) pendant 90 secondes.',
          'Relâche doucement et observe : l’envie a probablement baissé.',
        ],
        timerSeconds: 90,
      },
      {
        title: 'Objet à mâchouiller / bague à tourner',
        detail: 'Garde à portée un fidget oral ou une bague à tourner entre les doigts.',
        steps: [
          'Repère un objet à portée de main (bague, fidget, stylo).',
          'Dès l’envie, prends-le en main.',
          'Tourne-le ou manipule-le pendant 1 minute au lieu du geste habituel.',
        ],
        timerSeconds: 60,
      },
      {
        title: 'Barrière physique',
        detail: 'Vernis amer, pansements sur les doigts les plus rongés, gants fins le soir.',
        steps: [
          'Choisis une barrière : vernis amer, pansement ou gants fins.',
          'Applique-la sur les doigts les plus concernés, idéalement le soir.',
          'Laisse la sensation physique te rappeler ton objectif si le geste commence.',
        ],
      },
      {
        title: 'Conscience corporelle (2x/jour)',
        detail: '60 secondes devant un miroir : "est-ce que ma main est proche de ma bouche ?"',
        steps: [
          'Place-toi devant un miroir, matin et soir.',
          'Observe tes mains 60 secondes sans rien faire d’autre.',
          'Demande-toi : "est-ce que ma main est proche de ma bouche en ce moment ?"',
        ],
        timerSeconds: 60,
      },
      {
        title: 'Rituel de soin des mains',
        detail: '2 minutes par jour de manucure/hydratation — remplace le geste de destruction par un geste de soin.',
        steps: [
          'Prends une crème ou une huile pour les mains.',
          'Masse chaque doigt pendant environ 2 minutes.',
          'Termine en observant tes mains avec un peu de fierté, pas de jugement.',
        ],
        timerSeconds: 120,
      },
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
      {
        title: 'Paumes pressées l’une contre l’autre',
        detail: '1 à 2 minutes dès l’envie.',
        steps: [
          'Joins tes deux paumes devant toi, comme pour prier.',
          'Presse-les fermement l’une contre l’autre.',
          'Maintiens la pression pendant 1 à 2 minutes en respirant calmement.',
        ],
        timerSeconds: 90,
      },
      {
        title: 'Substitut tactile',
        detail: 'Balle anti-stress, pâte à modeler, tissu texturé à toucher.',
        steps: [
          'Garde un objet texturé à portée (balle, pâte à modeler, tissu).',
          'Dès l’envie, prends-le et manipule-le activement.',
          'Continue au moins 1 minute, le temps que la sensation redescende.',
        ],
        timerSeconds: 60,
      },
      {
        title: 'Barrière physique',
        detail: 'Retire les miroirs grossissants, pansements sur les zones ciblées.',
        steps: [
          'Identifie la zone la plus souvent concernée.',
          'Mets un pansement dessus, ou retire le miroir grossissant proche.',
          'Range l’éclairage trop fort de la salle de bain si besoin.',
        ],
      },
      {
        title: 'Règle des 5 minutes',
        detail: 'Dès l’envie, attends 5 minutes en respirant avant d’agir.',
        steps: [
          'Dès l’envie, note l’heure ou lance un minuteur de 5 minutes.',
          'Respire lentement, occupe tes mains autrement pendant ce temps.',
          'Au bout de 5 minutes, observe si l’envie est toujours aussi forte.',
        ],
        timerSeconds: 300,
      },
      {
        title: 'Body scan (5 min/jour)',
        detail: 'Relâche les tensions accumulées avant qu’elles ne se traduisent en grattage.',
        steps: [
          'Assieds-toi ou allonge-toi confortablement.',
          'Parcours mentalement ton corps des pieds à la tête.',
          'Relâche consciemment chaque zone de tension que tu remarques.',
        ],
        timerSeconds: 300,
      },
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
      {
        title: 'Mains sur les genoux / poches',
        detail: 'Dès la sensation de vouloir toucher les cheveux.',
        steps: [
          'Dès l’envie, pose consciemment tes mains sur tes genoux ou dans tes poches.',
          'Garde-les là pendant au moins 60 secondes.',
          'Respire pendant ce temps plutôt que de résister en tension.',
        ],
        timerSeconds: 60,
      },
      {
        title: 'Substitut tactile',
        detail: 'Brosse à cheveux, peluche, bracelet texturé au poignet.',
        steps: [
          'Garde un objet texturé à portée (bracelet, peluche, brosse).',
          'Dès l’envie, touche ou manipule cet objet à la place.',
          'Continue jusqu’à ce que l’envie redescende.',
        ],
      },
      {
        title: 'Barrière physique',
        detail: 'Cheveux attachés, bonnet léger le soir, gants pendant les activités à risque.',
        steps: [
          'Attache tes cheveux avant les moments à risque identifiés.',
          'Le soir devant un écran, mets un bonnet léger ou des gants fins.',
          'Adapte la barrière selon le moment de la journée le plus difficile.',
        ],
      },
      {
        title: 'Mains occupées',
        detail: 'Tricot, pâte à modeler, jeu simple pendant TV/lecture.',
        steps: [
          'Avant de commencer une activité à risque (TV, lecture), prépare une occupation manuelle.',
          'Garde tes mains actives : tricot, pâte à modeler, petit jeu.',
          'Change d’activité manuelle si l’envie revient malgré tout.',
        ],
      },
      {
        title: 'Carnet de triggers',
        detail: 'Note l’émotion précise à chaque épisode : ennui, anxiété, concentration.',
        steps: [
          'Juste après un épisode, prends 30 secondes.',
          'Note l’émotion précise ressentie juste avant (ennui, anxiété, concentration…).',
          'Note aussi le contexte : où tu étais, ce que tu faisais.',
        ],
      },
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
      {
        title: 'Substitut oral',
        detail: 'Chewing-gum sans sucre, bâtonnet de cannelle, pastille à sucer.',
        steps: [
          'Garde toujours un chewing-gum ou une pastille sur toi.',
          'Dès l’envie de mordiller, utilise-le à la place.',
          'Continue jusqu’à ce que l’envie passe.',
        ],
      },
      {
        title: 'Respiration nasale consciente',
        detail: 'Lèvres légèrement entrouvertes et détendues, 60 secondes.',
        steps: [
          'Détends volontairement ta mâchoire et tes lèvres.',
          'Laisse tes lèvres légèrement entrouvertes, sans les serrer.',
          'Respire par le nez, lentement, pendant 60 secondes.',
        ],
        timerSeconds: 60,
      },
      {
        title: 'Relâchement mâchoire',
        detail: 'Étirement doux + massage des masséters, 2x/jour.',
        steps: [
          'Ouvre doucement la bouche au maximum confortable, tiens 5 secondes.',
          'Masse les muscles de la mâchoire (masséters) du bout des doigts.',
          'Répète matin et soir.',
        ],
      },
      {
        title: 'Alarme de conscience corporelle',
        detail: '3x/jour : "où est ma langue/mâchoire en ce moment ?"',
        steps: [
          'Programme 3 rappels dans ta journée.',
          'À chaque rappel, demande-toi où sont ta langue et ta mâchoire.',
          'Relâche consciemment si tu les sens crispées.',
        ],
      },
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
      {
        title: 'Réponse concurrente ciblée',
        detail: 'Mouvement volontaire incompatible avec le tic, tenu 1-3 min.',
        steps: [
          'Repère la sensation prémonitoire qui précède ton tic.',
          'Dès que tu la sens, fais le mouvement opposé (ex : pousse les épaules vers le bas).',
          'Maintiens ce mouvement volontaire pendant 1 à 3 minutes.',
        ],
        timerSeconds: 120,
      },
      {
        title: 'Relaxation musculaire progressive',
        detail: '5-10 min/jour : contracter puis relâcher chaque groupe musculaire.',
        steps: [
          'Installe-toi confortablement, assis ou allongé.',
          'Contracte un groupe musculaire (ex : épaules) 5 secondes, puis relâche.',
          'Répète en remontant tout le corps, pieds à tête, pendant 5 à 10 minutes.',
        ],
        timerSeconds: 300,
      },
      {
        title: 'Cohérence cardiaque',
        detail: 'Respiration 5-5, 5 minutes, matin et soir.',
        steps: [
          'Inspire lentement pendant 5 secondes.',
          'Expire lentement pendant 5 secondes.',
          'Répète ce cycle pendant 5 minutes, matin et soir.',
        ],
        timerSeconds: 300,
      },
      {
        title: 'Hygiène de sommeil',
        detail: 'Heure de coucher régulière — la fatigue aggrave les tics.',
        steps: [
          'Choisis une heure de coucher fixe, réaliste pour toi.',
          'Évite les écrans dans les 30 minutes avant.',
          'Garde ce rythme même le week-end autant que possible.',
        ],
      },
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
      {
        title: 'Réponse concurrente ciblée',
        detail: 'Respiration contrôlée douce à la place du raclement, tenue 1-3 min.',
        steps: [
          'Dès la sensation dans la gorge, ferme la bouche doucement.',
          'Respire lentement par le nez au lieu de te racler.',
          'Maintiens cette respiration contrôlée 1 à 3 minutes.',
        ],
        timerSeconds: 120,
      },
      {
        title: 'Cohérence cardiaque',
        detail: 'Respiration 5-5, 5 minutes, matin et soir.',
        steps: [
          'Inspire lentement pendant 5 secondes.',
          'Expire lentement pendant 5 secondes.',
          'Répète ce cycle pendant 5 minutes, matin et soir.',
        ],
        timerSeconds: 300,
      },
      {
        title: 'Hydratation régulière',
        detail: 'Une gorge sèche augmente l’envie de se racler.',
        steps: [
          'Garde une bouteille d’eau à portée toute la journée.',
          'Bois une gorgée dès que tu sens ta gorge sèche.',
          'Ajoute une pastille pour la gorge si besoin.',
        ],
      },
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
      {
        title: 'Rappel toutes les 2h',
        detail: '"Langue au palais, dents desserrées, épaules basses."',
        steps: [
          'Programme une alarme douce toutes les 2 heures.',
          'À chaque rappel, place ta langue contre ton palais.',
          'Desserre les dents et abaisse consciemment les épaules.',
        ],
      },
      {
        title: 'Étirement mâchoire + massage masséter',
        detail: 'Matin et soir.',
        steps: [
          'Ouvre doucement la bouche au maximum confortable, tiens 5 secondes.',
          'Masse les muscles de la mâchoire (masséters) du bout des doigts, 1 minute.',
          'Répète matin et soir.',
        ],
        timerSeconds: 60,
      },
      {
        title: 'Gestion du stress',
        detail: 'Cohérence cardiaque, scan corporel.',
        steps: [
          'Prends 5 minutes au calme.',
          'Respire lentement en cycles de 5 secondes inspire / 5 secondes expire.',
          'Termine par un scan rapide : mâchoire, épaules, mains — relâche ce qui est tendu.',
        ],
        timerSeconds: 300,
      },
    ],
  },
]

export const TRANSVERSAL_EXERCISES = [
  {
    title: 'Urge surfing',
    detail: '3-5 min : observe l’envie comme une vague qui monte, culmine puis redescend, sans agir.',
    steps: [
      'Assieds-toi confortablement et ferme les yeux si tu le peux.',
      'Observe l’envie sans agir dessus, comme une vague qui monte.',
      'Note qu’elle atteint un pic, puis redescend — elle ne reste jamais à son maximum.',
      'Reste avec cette sensation 3 à 5 minutes, sans lutter contre elle.',
    ],
    timerSeconds: 240,
  },
  {
    title: 'Respiration 4-7-8',
    detail: 'Inspire 4s, retiens 7s, expire 8s — dès qu’une envie forte se présente.',
    steps: [
      'Inspire par le nez pendant 4 secondes.',
      'Retiens ta respiration pendant 7 secondes.',
      'Expire lentement par la bouche pendant 8 secondes.',
      'Répète le cycle 3 à 4 fois.',
    ],
    timerSeconds: 76,
  },
  {
    title: 'Routine du soir anti-épisode',
    detail: '10 min avant de dormir : mains occupées, lumière tamisée, pas d’écran juste avant.',
    steps: [
      'Tamise les lumières 10 minutes avant de dormir.',
      'Pose ton téléphone hors de portée immédiate.',
      'Occupe tes mains avec quelque chose de calme (livre papier, tricot, étirements doux).',
    ],
    timerSeconds: 600,
  },
  {
    title: 'Auto-compassion guidée',
    detail: '2 min audio à lancer juste après un épisode pour couper le cercle honte → stress → nouvel épisode.',
    steps: [
      'Pose une main sur ton cœur ou ton bras.',
      'Dis-toi intérieurement : "ce moment est difficile, et ça arrive à beaucoup de monde".',
      'Respire calmement 2 minutes, sans te juger pour ce qui vient de se passer.',
    ],
    timerSeconds: 120,
  },
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
