// Source unique pour la barre de navigation — réutilisée par AppShell (la vraie
// nav) et Tutorial (la maquette de nav pendant la visite guidée), pour qu'elles
// ne puissent jamais diverger en icônes/ordre/libellés.
export const NAV_ITEMS = [
  { to: '/home', label: 'Accueil', icon: '🏠' },
  { to: '/tracker', label: 'Tracker', icon: '📝' },
  { to: '/sos', label: 'SOS', icon: '🌿', emphasis: true },
  { to: '/coach', label: 'Coach', icon: '💬' },
  { to: '/profil', label: 'Profil', icon: '🙂' },
]
