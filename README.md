# Sooth (nom provisoire) — v1

App de gestion des BFRB (onychophagie, dermatillomanie, trichotillomanie, tics...) : accueil rassurant, quiz de diagnostic, plan personnalisé, dashboard, tracker d'épisodes, bouton SOS, coach, journal, bibliothèque éducative, communauté, badges, thème clair/sombre. PWA React + Supabase, déployable gratuitement.

Presque tous les modules du brief sont couverts en MVP. Restent en dehors du scope actuel : vraie IA générative pour le coach (nécessite une clé API payante), suivi photo, communauté multi-utilisateurs réelle, vrai paiement (le paywall est un mock visuel — aucune transaction n'est traitée).

## Stack

- [Vite](https://vite.dev) + React 19
- [Tailwind CSS v4](https://tailwindcss.com) (palette custom + dark mode par classe dans `src/index.css`)
- [React Router v7](https://reactrouter.com)
- [Supabase](https://supabase.com) (auth anonyme + stockage du quiz, des épisodes et du journal)

## Démarrer en local

```bash
npm install
npm run dev
```

L'app tourne sans Supabase configuré : tout reste disponible localement (localStorage), juste non synchronisé entre appareils.

## Configurer Supabase (gratuit)

1. Crée un compte sur [supabase.com](https://supabase.com) et un nouveau projet (plan gratuit).
2. Dans **Authentication > Providers > Anonymous Sign-Ins**, active l'option (elle est désactivée par défaut).
3. Dans **SQL Editor**, colle et exécute le contenu de [`supabase/schema.sql`](supabase/schema.sql) — ça crée les tables `quiz_responses`, `episodes` et `journal_entries` avec la sécurité au niveau ligne (chaque utilisateur anonyme ne voit que ses propres données).
4. Dans **Project Settings > API**, récupère `Project URL` et la clé `anon public`.
5. Copie `.env.example` vers `.env` et remplis les deux valeurs :

```bash
cp .env.example .env
```

6. Relance `npm run dev`.

## Déployer gratuitement sur Vercel

1. Pousse ce dépôt sur GitHub.
2. Sur [vercel.com](https://vercel.com), "Add New Project" → importe le repo GitHub (compte gratuit suffit).
3. Vercel détecte Vite automatiquement (build `npm run build`, output `dist`).
4. Dans les **Environment Variables** du projet Vercel, ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (les mêmes valeurs que ton `.env` local).
5. Déploie — l'URL fournie par Vercel est utilisable directement sur mobile ("Ajouter à l'écran d'accueil" pour un usage PWA-like).

Alternative équivalente : [Netlify](https://netlify.com), même principe (build command `npm run build`, publish directory `dist`).

## Parcours utilisateur

```
/          Accueil rassurant
/quiz      Quiz de diagnostic (7 questions)
/plan      Plan personnalisé généré + CTA "Continuer vers l'app"
             ↓ (sauvegarde le profil en local + Supabase)
/home      Dashboard : pratique de la semaine, exercice du jour, pensée du jour, insight tracker
/tracker   Log rapide d'épisode (contexte, émotion, durée) + historique + fréquence par déclencheur
/sos       Exercice de réponse concurrente en 1 tap, timer 90s, puis auto-compassion
/coach     Chat scripté bienveillant (mots-clés), suggère le SOS si besoin
/journal   Entrée d'humeur quotidienne guidée + historique
/library   Fiches par comportement (mécanisme, barrières physiques), HRT/CBIT, FAQ pro
/community Petites victoires par catégorie (démo locale, pas de vrai backend multi-utilisateurs)
/profil    Plan actif, badges, sélecteur de thème, reset des données, lien premium
/premium   Mock d'offre d'abonnement (aucun vrai paiement)
```

`/home`, `/tracker`, `/sos`, `/coach`, `/journal`, `/library`, `/community` et `/profil` partagent une navigation basse persistante (`AppShell`) et redirigent vers `/` si aucun profil n'existe encore (le quiz n'a pas été fait).

## Structure

```
src/
  screens/       Welcome, Quiz, Plan, Home, Tracker, Sos, Coach, Journal, Library, Community, Profile, Premium
  components/    Button, Chip, ProgressDots, AppShell (nav basse)
  data/          behaviors.js (exercices, fiches, barrières par comportement), quizQuestions.js,
                 episodeOptions.js, communityPosts.js (seed), dailyThoughts.js
  lib/           planGenerator.js, profile.js (profil + stats de pratique en local),
                 episodes.js, journal.js, community.js, checklist.js, badges.js,
                 coachResponses.js, theme.js (clair/sombre/système), supabase.js
supabase/
  schema.sql     Schéma à exécuter dans le SQL Editor Supabase (quiz_responses, episodes, journal_entries)
```

## Prochaines étapes suggérées

- Vraie IA générative pour le coach (nécessite une clé API et un budget — hors scope gratuit actuel)
- Suivi photo privé et chiffré (opt-in)
- Vraie communauté multi-utilisateurs avec modération
- Auth réelle (email/magic link) pour retrouver son profil sur un autre appareil
- Notifications contextuelles basées sur les horaires à risque identifiés dans le tracker
- Vrai paiement (Stripe ou RevenueCat pour du mobile natif) derrière l'écran Premium
