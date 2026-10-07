// Squelettes de documents légaux — brouillons génériques, PAS relus par un
// professionnel du droit. Les passages marqués [À COMPLÉTER] nécessitent des
// informations que seul l'éditeur de l'app peut fournir (statut juridique,
// SIRET, adresse, etc.). À faire valider par un juriste avant publication
// réelle, en particulier pour les CGV (service payant) vu le sujet sensible
// (santé/bien-être) de l'app.

export const LEGAL_DOCS = {
  'mentions-legales': {
    title: 'Mentions légales',
    sections: [
      {
        heading: 'Éditeur',
        body: `[À COMPLÉTER — nom ou raison sociale, statut (auto-entrepreneur, société...), numéro SIRET, adresse postale, email de contact]`,
      },
      {
        heading: 'Directeur de la publication',
        body: `[À COMPLÉTER]`,
      },
      {
        heading: 'Hébergement',
        body: `Application hébergée par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.\nBase de données et authentification hébergées par Supabase Inc.`,
      },
      {
        heading: 'Contact',
        body: `Pour toute question relative à ces mentions légales : [À COMPLÉTER — email de contact]`,
      },
    ],
  },
  cgu: {
    title: "Conditions générales d'utilisation",
    sections: [
      {
        heading: 'Objet',
        body: `Sooth est une application d'accompagnement pour les comportements répétitifs centrés sur le corps (BFRB : rongement d'ongles, grattage de peau, tics, etc.). Elle propose un suivi personnalisé, des exercices, un coach conversationnel et du contenu éducatif.`,
      },
      {
        heading: "Ce que Sooth n'est pas",
        body: `Sooth est un outil de complément et d'auto-accompagnement. Ce n'est ni un dispositif médical, ni un substitut à un diagnostic, un traitement ou un suivi par un professionnel de santé (médecin, psychologue, psychiatre). En cas de détresse sévère ou de risque pour ta sécurité, contacte un professionnel ou une ligne d'écoute (3114 en France, gratuit et disponible 24/7).`,
      },
      {
        heading: 'Compte utilisateur',
        body: `L'accès à l'app nécessite la création d'un compte (email + mot de passe). Tu es responsable de la confidentialité de tes identifiants. Un compte est strictement personnel.`,
      },
      {
        heading: 'Coach conversationnel (IA)',
        body: `Le coach intégré s'appuie sur un modèle de langage tiers. Ses réponses sont générées automatiquement, peuvent contenir des erreurs, et ne constituent jamais un avis médical ou professionnel.`,
      },
      {
        heading: 'Communauté',
        body: `Les publications dans l'espace communautaire doivent rester respectueuses et bienveillantes. Tout contenu haineux, harcelant ou dangereux peut être supprimé et donner lieu à une suspension de compte.`,
      },
      {
        heading: 'Propriété intellectuelle',
        body: `L'ensemble des contenus de l'app (textes, exercices, design, marque) est protégé et ne peut être reproduit sans autorisation.`,
      },
      {
        heading: 'Résiliation',
        body: `Tu peux supprimer ton compte à tout moment depuis Profil > Réglages avancés. La suppression est définitive et efface l'ensemble de tes données.`,
      },
      {
        heading: 'Droit applicable',
        body: `[À COMPLÉTER — droit applicable et juridiction compétente]`,
      },
    ],
  },
  cgv: {
    title: 'Conditions générales de vente',
    sections: [
      {
        heading: 'Statut',
        body: `L'offre Premium n'est pas encore disponible : Sooth est entièrement gratuit pour le moment. Ces conditions entreront en vigueur uniquement à l'ouverture de l'offre payante, avec information préalable des utilisateurs.`,
      },
      {
        heading: 'Objet',
        body: `Les présentes CGV encadrent la souscription à l'offre payante "Premium" de Sooth, régie par ailleurs par les Conditions générales d'utilisation.`,
      },
      {
        heading: 'Prix et offres',
        body: `Les prix affichés dans l'app (mensuel et annuel) sont indiqués toutes taxes comprises. Ils sont susceptibles d'évoluer ; tout changement de prix n'affecte pas un abonnement déjà souscrit avant l'entrée en vigueur du nouveau tarif.`,
      },
      {
        heading: 'Paiement',
        body: `Le paiement est traité par un prestataire tiers sécurisé (Stripe). Sooth ne stocke jamais tes coordonnées bancaires.`,
      },
      {
        heading: 'Durée et reconduction',
        body: `L'abonnement est reconduit automatiquement à chaque échéance (mensuelle ou annuelle) sauf résiliation avant la date de renouvellement.`,
      },
      {
        heading: 'Droit de rétractation',
        body: `Conformément à la réglementation, tu disposes d'un délai de rétractation de 14 jours à compter de la souscription, sauf si tu as expressément demandé et accepté un accès immédiat au contenu numérique payant, auquel cas ce droit peut être perdu dès le début de l'exécution. [À FAIRE VALIDER PAR UN JURISTE — clause sensible pour un contenu numérique]`,
      },
      {
        heading: 'Résiliation',
        body: `Résiliable à tout moment depuis Profil > Premium. La résiliation prend effet à la fin de la période déjà payée — pas de remboursement au prorata.`,
      },
      {
        heading: 'Facturation',
        body: `Une facture/reçu est émise automatiquement par notre prestataire de paiement à chaque transaction.`,
      },
      {
        heading: 'Réclamation',
        body: `[À COMPLÉTER — email ou procédure de réclamation]`,
      },
    ],
  },
  confidentialite: {
    title: 'Politique de confidentialité',
    sections: [
      {
        heading: 'Responsable du traitement',
        body: `[À COMPLÉTER]`,
      },
      {
        heading: 'Données collectées',
        body: `Sur nos serveurs : uniquement ton email et ton mot de passe (chiffré), pour te permettre de te connecter.\nSur ton appareil uniquement : réponses au quiz, plan, comportements suivis, historique de pratique, journal, moments difficiles, historique de conversation avec le coach, préférences de profil (prénom, âge, genre — optionnels). Ces données de santé et de bien-être ne sont jamais envoyées à nos serveurs.`,
      },
      {
        heading: 'Finalités',
        body: `Ces données servent uniquement à faire fonctionner et personnaliser l'app (générer ton plan, suivre ta progression, faire fonctionner le coach). Elles ne sont jamais vendues ni utilisées à des fins publicitaires.`,
      },
      {
        heading: 'Sous-traitants',
        body: `Supabase (authentification et stockage de l'email), Vercel (hébergement de l'application), Groq (traitement des messages que tu écris au coach : ils sont transmis pour générer une réponse, sans finalité publicitaire, et ne sont pas conservés par Sooth sur nos serveurs). Évite d'y écrire des informations qui permettent de t'identifier.`,
      },
      {
        heading: 'Conséquence du stockage sur ton appareil',
        body: `Comme tes données de santé restent sur ton appareil, elles ne sont pas récupérables si tu perds ton téléphone, vides les données du navigateur ou changes d'appareil. En contrepartie, personne d'autre que toi n'y a accès.`,
      },
      {
        heading: 'Durée de conservation',
        body: `Ton email est conservé tant que ton compte est actif. Les données stockées sur ton appareil sont effacées en vidant les données du navigateur ou en supprimant ton compte. Tu peux tout supprimer à tout moment depuis Profil > Réglages avancés > Supprimer mon compte.`,
      },
      {
        heading: 'Tes droits',
        body: `Droit d'accès, de rectification et d'effacement de tes données. L'effacement est disponible directement dans l'app. Pour toute autre demande : [À COMPLÉTER — email de contact].`,
      },
      {
        heading: 'Cookies et traceurs',
        body: `L'app utilise uniquement du stockage technique local (localStorage) nécessaire à son fonctionnement (préférences, session). Aucun cookie publicitaire ou traceur tiers n'est utilisé à ce jour.`,
      },
    ],
  },
}
