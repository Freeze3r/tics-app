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

// Classes d'un item de nav (styles définis dans index.css : .nav-item*).
export function navItemClass({ active, emphasis }) {
  const base = 'nav-item flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-xs font-semibold'
  if (emphasis) return `${base} nav-item-sos`
  return `${base} ${active ? 'nav-item-active' : ''}`
}
