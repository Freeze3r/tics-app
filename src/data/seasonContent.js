// Contenu des saisons 2 et 3. Les épisodes "communs" s'appliquent à tous les
// comportements ; chaque comportement ajoute ses propres épisodes (2 par saison).
// Base : HRT/CBIT (prise de conscience, réponse concurrente), pleine conscience,
// acceptation (ACT), plans "si-alors". Aucun épisode ne promet de guérison et les
// situations médicales renvoient toujours vers un professionnel.

const ex = (id, title, duration, content, steps, timerSeconds) => ({
  id,
  type: 'exercise',
  title,
  duration,
  content,
  steps,
  timerSeconds,
})

const lesson = (id, title, duration, content) => ({ id, type: 'lesson', title, duration, content })

// ───────────────────────── SAISON 2 : APPROFONDIR ─────────────────────────

const S2 = {
  triggers: lesson(
    's2-triggers',
    'Cartographier tes déclencheurs',
    '3 min',
    "Un geste automatique a presque toujours un déclencheur. Il y en a quatre familles : sensoriels (une aspérité, une texture, une démangeaison), émotionnels (stress, ennui, frustration, même la joie), situationnels (un lieu, une activité, un moment de la journée) et mentaux (une pensée du type « il faut que je règle ça »). Repérer lesquels reviennent chez toi est la moitié du travail : ce qu'on connaît, on peut s'y préparer.",
  ),
  diary: ex(
    's2-diary',
    'Le carnet de la semaine',
    '2 min par jour',
    "Pendant 7 jours, note chaque moment où le geste apparaît, sans chercher à le changer. Tu observes, c'est tout.",
    [
      "Ouvre le Tracker dès que tu remarques le geste (même après coup).",
      "Note le contexte, l'émotion du moment et la durée approximative.",
      "Ne te juge pas : un moment noté est un moment compris.",
      "Au bout de 7 jours, regarde quel contexte revient le plus.",
    ],
    120,
  ),
  automatic: lesson(
    's2-automatic',
    'Automatique ou conscient ?',
    '3 min',
    "Chez beaucoup de personnes, il existe deux versions du même geste. L'une est automatique : tu t'en rends compte après coup, en lisant, devant un écran, en pensant à autre chose. L'autre est consciente : tu sens l'envie monter, parfois pour calmer une tension ou une émotion. Les deux sont courantes, souvent chez la même personne, et ne demandent pas la même aide : la première se travaille surtout par la prise de conscience, la seconde par la réponse concurrente et l'accueil de l'émotion.",
  ),
  awareness: ex(
    's2-awareness',
    "Prise de conscience en 3 temps",
    '2 min',
    "Exercice central de la HRT : apprendre à te surprendre en train de le faire, ou juste avant.",
    [
      "Assieds-toi et mime lentement le geste, sans le terminer.",
      "Décris à voix haute ce que font ta main, ton corps, ton regard.",
      "Repère la sensation juste avant : tension, picotement, besoin de toucher.",
      "Recommence deux fois. Plus tu connais la séquence, plus tu la repères tôt.",
    ],
    120,
  ),
  competing: ex(
    's2-competing',
    'Ta réponse concurrente sur mesure',
    '2 min',
    "Une bonne réponse concurrente est un geste discret, impossible à faire en même temps que l'autre, et que tu peux tenir environ une minute.",
    [
      "Choisis un geste incompatible avec le tien (serrer un objet, mains à plat, croiser les doigts).",
      "Vérifie qu'il est discret et confortable, tu dois pouvoir le faire n'importe où.",
      "Entraîne-toi trois fois, 30 secondes à chaque fois.",
      "Dès que tu sens l'envie ou le geste commencer, utilise-le pendant une minute.",
    ],
    90,
  ),
  shame: lesson(
    's2-shame',
    'Quand la honte s’en mêle',
    '3 min',
    "Le cercle est bien connu : le geste arrive, la honte ou la culpabilité suit, le stress monte… et le stress nourrit le geste. Se juger durement n'aide pas à s'en sortir, au contraire. Ce qui aide : remarquer la honte, la nommer (« là, il y a de la honte »), et te parler comme tu parlerais à une personne que tu aimes. Ce n'est ni un manque de volonté ni un défaut de caractère : c'est un automatisme appris, et il se désapprend.",
  ),
  defusion: ex(
    's2-defusion',
    'Défusion : « j’ai la pensée que… »',
    '2 min',
    "Une technique de la thérapie d'acceptation : prendre de la distance avec une pensée au lieu de lui obéir.",
    [
      "Repère une pensée qui pousse au geste (« je n'y arriverai jamais », « juste une fois »).",
      "Reformule-la : « J'ai la pensée que je n'y arriverai jamais ».",
      "Ajoute : « Je remarque que j'ai la pensée que… ».",
      "Observe : la pensée est là, mais tu n'es pas obligé·e d'agir dessus.",
    ],
    90,
  ),
  sensory: ex(
    's2-sensory',
    'Un autre besoin sensoriel',
    '2 min',
    "Souvent, le geste répond à un besoin de sensation. On peut le nourrir autrement, sans abîmer.",
    [
      "Prépare 2 ou 3 alternatives : eau fraîche sur les mains, objet texturé, balle souple, pression des paumes.",
      "Dès l'envie, essaie-en une pendant une minute.",
      "Note laquelle t'apaise le plus, et garde-la à portée de main.",
    ],
    60,
  ),
  ifthen: lesson(
    's2-ifthen',
    'Se préparer aux moments à risque',
    '3 min',
    "Décider à l'avance, c'est plus fiable que compter sur sa volonté sur le moment. On appelle ça un plan « si… alors… » : « Si je suis assis·e devant un écran, alors je garde un objet dans la main ». Il doit être précis, court, et lié à une situation que tu connais déjà grâce à ton carnet.",
  ),
  ifthenPlan: ex(
    's2-ifthen-plan',
    'Écris tes plans si-alors',
    '3 min',
    "Transforme ce que tu as appris sur toi en trois phrases simples et utilisables.",
    [
      "Choisis les 3 situations les plus fréquentes dans ton carnet.",
      "Pour chacune, écris : « Si [situation], alors [ma réponse concurrente ou mon alternative] ».",
      "Relis-les à voix haute.",
      "Garde-les dans tes notes ou en fond d'écran pour la semaine.",
    ],
    180,
  ),
  bilan: lesson(
    's2-bilan',
    'Bilan de la saison 2',
    '2 min',
    "Tu sais maintenant repérer tes déclencheurs, te surprendre dans le geste, disposer d'une réponse concurrente à toi et de plans pour les moments à risque. C'est le cœur d'un travail sérieux sur ces comportements. La saison 3 sert à tenir dans le temps. Si certains épisodes t'ont paru difficiles, reviens-y : tout est fait pour être refait.",
  ),
}

const SPECIFIC_S2 = {
  nails: [
    lesson(
      's2-nails-risk',
      'Tes moments à risque (ongles)',
      '3 min',
      "Les ongles se rongent surtout quand les mains sont libres et l'attention ailleurs : écran, lecture, réunion, trajet, attente. Repère 3 situations où ta main monte vers ta bouche. Une même situation revient souvent : c'est une bonne nouvelle, car elle se prépare.",
    ),
    ex(
      's2-nails-hands',
      'Mains occupées en situation',
      '2 min',
      "Associe un objet ou une position à chaque situation à risque, au lieu de lutter à chaque fois.",
      [
        "Écran : pose les mains à plat sur le clavier ou la table.",
        "Réunion ou cours : tiens un stylo ou une petite balle souple.",
        "Trajet : garde les mains dans les poches ou tiens un objet.",
        "Teste chaque association une minute pour sentir laquelle te convient.",
      ],
      90,
    ),
  ],
  skin: [
    lesson(
      's2-skin-mirror',
      'Miroir, lumière, texture',
      '3 min',
      "Le grattage de peau est souvent déclenché par ce qu'on voit ou sent : un miroir grossissant, une lumière crue, une petite aspérité sous le doigt. Plus on cherche, plus on trouve. Limiter le temps devant le miroir et la lumière trop vive réduit nettement les occasions de commencer.",
    ),
    ex(
      's2-skin-timer',
      'La règle des 2 minutes au miroir',
      '2 min',
      "Un cadre simple pour les moments devant la glace.",
      [
        "Lance un minuteur de 2 minutes avant de te regarder dans le miroir.",
        "Quand il sonne, quitte la pièce, même si tu n'as pas fini.",
        "Mets les mains sous l'eau fraîche ou occupe-les 1 minute.",
        "Évite les miroirs grossissants et les lumières très vives.",
      ],
      120,
    ),
  ],
  hair: [
    lesson(
      's2-hair-aware',
      'Tirer en automatique ou en conscience',
      '3 min',
      "L'arrachage se passe souvent pendant une activité calme : lecture, ordinateur, trajet, lit, télévision. Beaucoup de personnes ne le remarquent qu'une fois le cheveu en main. Apprendre à repérer le moment où la main monte vers la tête est la première étape, avant même de chercher à arrêter.",
    ),
    ex(
      's2-hair-hands',
      "Autres gestes pour tes mains",
      '2 min',
      "Prévois une alternative pour chaque moment calme de la journée.",
      [
        "Garde un stylo, une balle souple ou un fidget à portée de main.",
        "Pendant la lecture ou l'écran, pose une main sur l'autre ou sur un coussin.",
        "Un foulard, un bonnet ou une coiffure attachée rendent le geste moins accessible.",
        "Essaie chaque option pendant une minute.",
      ],
      90,
    ),
  ],
  mouth: [
    lesson(
      's2-mouth-spot',
      'Repérer le mordillement dans la journée',
      '3 min',
      "Mordre l'intérieur des joues ou des lèvres arrive souvent pendant la concentration, le stress ou la conduite, sans qu'on s'en rende compte. Se poser trois ou quatre fois par jour la question « où sont mes dents, ma langue, ma mâchoire ? » aide à attraper le geste tôt.",
    ),
    ex(
      's2-mouth-rest',
      'La position de repos',
      '1 min',
      "Une position qui rend le mordillement difficile.",
      [
        "Ferme les lèvres sans les serrer.",
        "Écarte légèrement les dents, la mâchoire est détendue.",
        "Pose la langue contre le palais, derrière les dents du haut.",
        "Respire par le nez 30 secondes dans cette position.",
      ],
      60,
    ),
  ],
  motor: [
    lesson(
      's2-motor-urge',
      "La sensation avant le tic",
      '3 min',
      "Beaucoup de personnes ressentent une gêne, une tension ou une envie juste avant un tic : on l'appelle la sensation prémonitoire. Un tic n'est pas un caprice : il est en grande partie involontaire. Apprendre à repérer cette sensation permet d'essayer, sans se forcer ni se faire mal, une réponse concurrente douce.",
    ),
    ex(
      's2-motor-competing',
      'Entraîner une réponse concurrente',
      '2 min',
      "Un geste doux et discret, incompatible avec le tic, à utiliser à la sensation.",
      [
        "Repère la sensation qui précède ton tic principal.",
        "Choisis un mouvement incompatible et doux (ex : épaules vers le bas si le tic est un haussement).",
        "Fais-le calmement pendant une minute, sans crispation.",
        "Si c'est inconfortable ou fatigant, arrête : le but n'est jamais de te contraindre.",
      ],
      60,
    ),
  ],
  vocal: [
    lesson(
      's2-vocal-urge',
      "Repérer l'envie avant le son",
      '3 min',
      "Les tics vocaux légers (raclement de gorge, reniflement) sont souvent précédés d'une gêne dans la gorge ou le nez. La repérer donne un court instant pour essayer une autre réponse. Il n'est pas question de te retenir à tout prix : un tic retenu trop fort peut d'ailleurs fatiguer.",
    ),
    ex(
      's2-vocal-breath',
      'Respiration comme réponse concurrente',
      '2 min',
      "Une respiration lente occupe le même système que le tic et apaise la tension.",
      [
        "À la sensation, ferme la bouche et inspire doucement par le nez.",
        "Relâche la mâchoire et les épaules.",
        "Expire lentement, plus longtemps que l'inspiration.",
        "Répète 5 à 6 respirations.",
      ],
      90,
    ),
  ],
  bruxism: [
    lesson(
      's2-brux-rest',
      'Dents desserrées, lèvres fermées',
      '3 min',
      "Au repos, les dents du haut et du bas ne devraient pas se toucher : la bonne position est lèvres fermées, dents légèrement écartées, langue au palais. Beaucoup de personnes serrent sans le savoir. Des rappels visuels (petit autocollant sur l'écran, alarme discrète) aident à se resynchroniser plusieurs fois par jour.",
    ),
    ex(
      's2-brux-check',
      'Le check-in mâchoire',
      '1 min',
      "Un réflexe à répéter plusieurs fois par jour.",
      [
        "Vérifie : tes dents se touchent-elles ?",
        "Desserre, laisse un petit espace entre les dents du haut et du bas.",
        "Pose la langue au palais et baisse les épaules.",
        "Respire 3 fois lentement.",
      ],
      45,
    ),
  ],
}

// ───────────────────────── SAISON 3 : CONSOLIDER ─────────────────────────

const S3 = {
  lapse: lesson(
    's3-lapse',
    "Un écart n'efface pas ton chemin",
    '3 min',
    "Après un moment difficile, la pensée « tout est fichu » est la plus dangereuse : c'est elle, plus que l'écart, qui relance le cycle. Un épisode est une information, pas un verdict. Tu regardes ce qui s'est passé (où, quand, quelle émotion), tu t'accordes de la douceur, et tu reprends à ton prochain geste. Ce qui compte, c'est la tendance sur des semaines.",
  ),
  review: ex(
    's3-review',
    'Relire ta progression',
    '2 min',
    "On remarque surtout ce qui ne va pas. Cet exercice rétablit l'équilibre.",
    [
      "Ouvre ton Tracker et ton Profil.",
      "Cherche trois choses qui ont changé, même petites (moins de moments, plus de conscience, plus d'outils).",
      "Dis-toi à voix haute : « Voilà ce que j'ai déjà fait ».",
    ],
    120,
  ),
  urgesReturn: lesson(
    's3-urges-return',
    'Pourquoi les envies reviennent',
    '3 min',
    "Même après des semaines calmes, il est normal que les envies reviennent, surtout en période de stress, de fatigue ou de changement. Ce n'est pas un retour à zéro : tu as maintenant des outils que tu n'avais pas. Prévoir ce retour à l'avance le rend beaucoup moins déstabilisant.",
  ),
  warning: ex(
    's3-warning',
    "Tes signaux d'alerte",
    '3 min',
    "Un retour des envies s'annonce presque toujours avant : on peut s'y préparer.",
    [
      "Repère 3 signes qui apparaissent quand tu vas moins bien (sommeil court, plus de tension, plus d'écrans…).",
      "À côté de chacun, écris une petite action de soutien (marcher dix minutes, appeler quelqu'un, couper les écrans plus tôt).",
      "Garde cette liste dans tes notes : elle servira les jours où tu n'auras pas envie d'y réfléchir.",
    ],
    180,
  ),
  bodyScan: ex(
    's3-bodyscan',
    'Scan corporel de 5 minutes',
    '5 min',
    "Un exercice de pleine conscience qui apprend à repérer la tension avant qu'elle ne se transforme en geste.",
    [
      "Allonge-toi ou assieds-toi confortablement et ferme les yeux si tu le souhaites.",
      "Passe en revue ton corps, des pieds jusqu'à la tête, en observant simplement les sensations.",
      "Quand tu repères une tension, respire vers elle sans chercher à la changer.",
      "Termine par trois respirations lentes.",
    ],
    300,
  ),
  lifestyle: lesson(
    's3-lifestyle',
    'Sommeil, écrans, tension',
    '3 min',
    "Le manque de sommeil, trop de caféine ou des soirées devant les écrans peuvent augmenter la tension de fond, et avec elle les envies. Personne n'a besoin d'une vie parfaite : choisis un seul levier (se coucher un peu plus tôt, couper les écrans avant de dormir, limiter le café l'après-midi) et observe l'effet sur deux semaines.",
  ),
  visualisation: ex(
    's3-visualisation',
    'Répéter mentalement une journée réussie',
    '3 min',
    "La répétition mentale prépare le cerveau comme une vraie répétition.",
    [
      "Ferme les yeux et imagine une journée type, heure par heure.",
      "À chaque moment à risque, vois-toi utiliser ta réponse concurrente ou ton alternative.",
      "Ressens le calme et la fierté qui suivent.",
      "Ouvre les yeux et note un point à retenir.",
    ],
    180,
  ),
  help: lesson(
    's3-help',
    "Quand demander de l'aide",
    '3 min',
    "Ce programme est un outil d'accompagnement, pas un remplacement d'un suivi. Parle à un médecin ou à un·e psychologue formé·e aux thérapies cognitivo-comportementales si le geste cause des lésions, gêne ta vie quotidienne, te pèse beaucoup émotionnellement ou persiste malgré tes efforts. Des ressources existent aussi auprès d'associations spécialisées, comme la TLC Foundation for BFRBs (en anglais). Demander de l'aide est un signe de force, pas d'échec. En cas de détresse, tu peux appeler le 3114 (gratuit, 24 h/24).",
  ),
  letter: ex(
    's3-letter',
    'Une lettre à toi dans trois mois',
    '4 min',
    "Écrire à la personne que tu seras aide à garder le cap.",
    [
      "Écris ce que tu as appris sur toi et ce qui t'a aidé·e.",
      "Écris ce que tu voudrais te rappeler les jours difficiles.",
      "Termine par un mot bienveillant, comme à un·e ami·e.",
      "Garde la lettre : relis-la dans trois mois.",
    ],
    240,
  ),
  maintain: lesson(
    's3-maintain',
    'Garder ce qui marche',
    '3 min',
    "Pour tenir dans le temps, garde un rituel léger plutôt qu'un grand programme : un point de cinq minutes par semaine pour relire ton Tracker, ajuster tes barrières, relire tes plans si-alors, et te féliciter. Un petit rituel régulier vaut mieux qu'un gros effort ponctuel.",
  ),
  bilan: lesson(
    's3-bilan',
    'Fin de la saison 3',
    '2 min',
    "Tu as parcouru l'ensemble du programme : comprendre, repérer, répondre autrement, et tenir dans la durée. Les envies pourront revenir, et tu sais maintenant quoi faire quand elles reviennent. Tu peux refaire n'importe quel épisode quand tu en as besoin. Fier·ère de toi pour le chemin parcouru.",
  ),
}

const SPECIFIC_S3 = {
  nails: [
    lesson(
      's3-nails-care',
      'Prendre soin de tes mains',
      '3 min',
      "Des ongles qui repoussent demandent du temps, plusieurs mois pour qu'ils retrouvent leur longueur. Un peu de soin (crème, huile pour cuticules, ongles limés propres) donne envie de les préserver et enlève des aspérités qui attirent le geste. Si la peau autour est abîmée ou infectée (rougeur qui s'étend, douleur, pus), demande conseil à un médecin ou un pharmacien.",
    ),
    ex(
      's3-nails-ritual',
      'Rituel de soin des mains',
      '2 min',
      "Un moment calme qui remplace le geste et valorise tes mains.",
      [
        "Lave-toi les mains et sèche-les doucement.",
        "Applique de la crème ou de l'huile sur chaque doigt, en massant l'ongle et les cuticules.",
        "Observe tes mains avec bienveillance, sans chercher les défauts.",
      ],
      120,
    ),
  ],
  skin: [
    lesson(
      's3-skin-heal',
      "Laisser la peau cicatriser",
      '3 min',
      "Une peau abîmée cicatrise mieux quand on n'y touche plus : nettoyer doucement, hydrater, ne pas arracher les croûtes. Un pansement hydrocolloïde ou un simple pansement protège la zone et coupe l'accès au geste. Si une plaie rougit, gonfle, fait mal, a du pus ou s'accompagne de fièvre, consulte un médecin sans attendre.",
    ),
    ex(
      's3-skin-cover',
      'Protéger une zone sensible',
      '1 min',
      "Rendre la zone inaccessible pendant qu'elle guérit.",
      [
        "Nettoie la zone avec de l'eau et un savon doux, sans frotter.",
        "Applique un soin apaisant ou une crème cicatrisante adaptée.",
        "Couvre avec un pansement, et change-le quand il est sale ou mouillé.",
      ],
      60,
    ),
  ],
  hair: [
    lesson(
      's3-hair-regrow',
      'Accepter la repousse, à ton rythme',
      '3 min',
      "Les cheveux repoussent lentement, quelques centimètres par an, et la repousse n'est pas toujours régulière. Se comparer ou se surveiller sans cesse entretient la tension. Coiffures, foulards ou accessoires peuvent t'aider à te sentir bien en attendant. Si certaines zones ne repoussent pas ou si la peau est irritée, un avis dermatologique est utile.",
    ),
    ex(
      's3-hair-mirror',
      "Auto-compassion devant le miroir",
      '2 min',
      "Un moment pour te regarder avec douceur, sans traquer ni chercher les défauts.",
      [
        "Place-toi devant un miroir, sans lumière trop vive.",
        "Regarde ton visage et dis-toi : « Je fais de mon mieux, et c'est déjà beaucoup ».",
        "Respire trois fois et quitte le miroir sans inspecter.",
      ],
      120,
    ),
  ],
  mouth: [
    lesson(
      's3-mouth-heal',
      "Laisser l'intérieur de la bouche guérir",
      '3 min',
      "Les petites plaies à l'intérieur de la bouche cicatrisent en quelques jours si on les laisse tranquilles. Évite les aliments très acides, épicés ou durs, et rince-toi doucement. Si une plaie dure plus de deux semaines, saigne souvent ou te semble inhabituelle, consulte un dentiste ou un médecin.",
    ),
    ex(
      's3-mouth-alt',
      'Une alternative apaisante',
      '2 min',
      "Un geste simple quand l'envie de mordiller monte.",
      [
        "Bois une gorgée d'eau fraîche ou garde un glaçon dans la bouche quelques secondes.",
        "Replace la mâchoire en position de repos.",
        "Respire doucement par le nez 1 minute.",
      ],
      90,
    ),
  ],
  motor: [
    lesson(
      's3-motor-waxing',
      'Les tics vont et viennent',
      '3 min',
      "Les tics varient naturellement : plus fréquents certains jours, presque absents d'autres, souvent plus forts avec la fatigue, le stress ou l'excitation. Ça ne veut pas dire que tu régresses. Si des tics apparaissent brutalement, deviennent douloureux ou limitent ta vie quotidienne, parles-en à un médecin (un·e neurologue peut t'orienter).",
    ),
    ex(
      's3-motor-relax',
      'Relaxation musculaire progressive',
      '4 min',
      "Alterner contraction et relâchement apprend au corps à se détendre.",
      [
        "Assieds-toi confortablement.",
        "Contracte un groupe musculaire (poings, épaules, mâchoire…) pendant 5 secondes, sans douleur.",
        "Relâche d'un coup et sens la différence pendant 10 secondes.",
        "Passe au groupe suivant, jusqu'aux pieds.",
      ],
      240,
    ),
  ],
  vocal: [
    lesson(
      's3-vocal-talk',
      'En parler autour de toi',
      '3 min',
      "Pouvoir expliquer simplement ce que tu vis allège beaucoup de tension. Tu n'as rien à justifier, mais une phrase prête aide : « J'ai un tic, c'est involontaire, ça n'a rien de contagieux ni de grave, ne t'inquiète pas ». Choisis une ou deux personnes de confiance pour commencer.",
    ),
    ex(
      's3-vocal-script',
      'Répéter ta phrase',
      '2 min',
      "Une phrase répétée devient facile à dire quand il le faut.",
      [
        "Écris ta phrase d'explication avec tes propres mots.",
        "Dis-la à voix haute trois fois, dans un ton calme.",
        "Imagine la dire à une personne de confiance.",
      ],
      90,
    ),
  ],
  bruxism: [
    lesson(
      's3-brux-night',
      'La nuit et le dentiste',
      '3 min',
      "On peut aussi serrer ou grincer des dents la nuit, sans le savoir : mâchoire fatiguée au réveil, maux de tête, dents sensibles. Seul un dentiste peut faire le point, vérifier l'usure des dents et proposer si besoin une gouttière sur mesure. Ne t'auto-diagnostique pas et consulte si la douleur est persistante.",
    ),
    ex(
      's3-brux-relax',
      'Détendre la mâchoire',
      '2 min',
      "Un petit soin à faire en fin de journée.",
      [
        "Pose une compresse tiède (pas brûlante) sur la joue pendant une minute.",
        "Masse doucement le muscle de la mâchoire, en petits cercles.",
        "Ouvre et ferme la bouche très lentement trois fois, sans forcer.",
      ],
      120,
    ),
  ],
}

function order(items) {
  return items.filter(Boolean)
}

export function buildSeasonTwoEpisodes(behaviorId) {
  const [a, b] = SPECIFIC_S2[behaviorId] ?? []
  return order([S2.triggers, a, S2.diary, S2.automatic, S2.awareness, b, S2.competing, S2.shame, S2.defusion, S2.sensory, S2.ifthen, S2.ifthenPlan, S2.bilan])
}

export function buildSeasonThreeEpisodes(behaviorId) {
  const [a, b] = SPECIFIC_S3[behaviorId] ?? []
  return order([S3.lapse, a, S3.review, S3.urgesReturn, b, S3.warning, S3.bodyScan, S3.lifestyle, S3.visualisation, S3.help, S3.letter, S3.maintain, S3.bilan])
}
