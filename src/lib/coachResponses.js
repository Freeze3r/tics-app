// Coach scripté par mots-clés (MVP local, gratuit). Pas de vraie IA générative :
// brancher une API (Claude, etc.) nécessiterait une clé et un budget hors scope actuel.
const RULES = [
  {
    keywords: ['honte', 'honteux', 'nul', 'faible', 'échoué', 'echec'],
    reply:
      "Ce que tu ressens n'est pas de la faiblesse — c'est un comportement automatique, pas un choix. La honte est justement ce qui entretient le cycle. Sois aussi doux·ce avec toi-même que tu le serais avec un ami dans la même situation.",
  },
  {
    keywords: ['envie', 'craquer', 'veux le faire', 'j’ai envie', 'jai envie', 'pas capable de resister'],
    reply:
      "Cette envie est inconfortable, mais elle dure en moyenne 90 secondes si tu ne la nourris pas. Tu veux lancer l'exercice SOS maintenant ?",
    suggestSos: true,
  },
  {
    keywords: ['stress', 'stressé', 'stressée', 'anxieux', 'anxieuse', 'angoisse'],
    reply:
      "Le stress est le déclencheur numéro un de ces comportements — c'est normal que ça arrive dans ces moments-là. Une respiration 4-7-8 peut aider à faire redescendre la tension avant qu'elle ne se traduise en geste.",
  },
  {
    keywords: ['ennui', 'ennuie', 'ennuyé', 'rien à faire'],
    reply:
      'L’ennui pousse souvent les mains à chercher une occupation. Essaie de les occuper activement — pâte à modeler, tricot, fidget — avant que le geste automatique ne prenne le relais.',
  },
  {
    keywords: ['triste', 'déprim', 'deprim', 'mal', 'seul'],
    reply:
      "Merci de me le dire. Si cette tristesse dure ou s'intensifie, ça vaut le coup d'en parler à un proche ou un professionnel — l'app est là pour t'accompagner, pas pour remplacer ce soutien.",
  },
  {
    keywords: ['dormir', 'nuit', 'soir', 'coucher', 'lit'],
    reply:
      'Le soir, en veille passive (télé, lecture, avant de dormir), c’est un moment à risque classique. Une routine de 10 minutes avec les mains occupées et une lumière tamisée peut vraiment aider.',
  },
  {
    keywords: ['merci', 'ça va mieux', 'ca va mieux', 'mieux'],
    reply: 'Content·e que ça aide. Tu peux revenir ici à chaque fois que tu en as besoin.',
  },
  {
    keywords: ['salut', 'bonjour', 'coucou', 'hey', 'yo'],
    reply: "Salut ! Content·e de te voir. Qu'est-ce qui t'amène aujourd'hui ?",
  },
  {
    keywords: ['fatigue', 'fatigué', 'fatiguée', 'épuisé', 'epuise', 'crevé'],
    reply:
      "La fatigue baisse la garde face à ces comportements — c'est physiologique, pas un manque de discipline. Si tu peux, une pause de quelques minutes maintenant vaut mieux qu'insister.",
  },
  {
    keywords: ['travail', 'boulot', 'école', 'ecole', 'cours', 'examen'],
    reply:
      "Les contextes de concentration ou de pression (travail, cours) sont des déclencheurs très fréquents. Avoir un objet à manipuler discrètement sous la table peut aider sans que ça se voie.",
  },
  {
    keywords: ['famille', 'parents', 'amis', 'ami', 'copain', 'copine', 'partenaire'],
    reply:
      "En parler à quelqu'un de confiance peut vraiment alléger les choses — pas besoin de tout expliquer d'un coup, juste ce que tu es prêt·e à partager.",
  },
  {
    keywords: ['ongle', 'ongles', 'main', 'mains'],
    reply:
      "Pour les mains, une bague ou un objet à tourner entre les doigts peut occuper le geste sans y penser activement. Tu veux qu'on regarde les exercices dédiés dans la bibliothèque ?",
  },
  {
    keywords: ['cheveux', 'sourcils', 'cils'],
    reply:
      "Distinguer un geste automatique (en arrière-plan, devant un écran) d'un geste plus ciblé (devant un miroir) aide à choisir la bonne stratégie. La bibliothèque détaille les deux.",
  },
  {
    keywords: ['peau', 'bouton', 'grattage', 'gratter'],
    reply:
      "L'éclairage et les miroirs grossissants amplifient souvent l'envie de gratter. Un ajustement simple de l'environnement peut faire une vraie différence.",
  },
]

const DEFAULT_REPLIES = [
  "Je suis là. Tu peux me dire ce que tu ressens là, maintenant, sans filtre.",
  "D'accord, merci de partager ça. Qu'est-ce qui se passe juste avant, en général — un moment de la journée, une émotion précise ?",
  "Ça arrive, et ce n'est pas grave. Qu'est-ce qui t'aiderait le plus là tout de suite : un exercice rapide, ou juste en parler ?",
]

export function getCoachReply(message) {
  const normalized = message.toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((k) => normalized.includes(k))) {
      return { text: rule.reply, suggestSos: Boolean(rule.suggestSos) }
    }
  }
  const idx = Math.floor(Math.random() * DEFAULT_REPLIES.length)
  return { text: DEFAULT_REPLIES[idx], suggestSos: false }
}
