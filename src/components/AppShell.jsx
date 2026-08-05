import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/home', label: 'Accueil', icon: '🏠' },
  { to: '/tracker', label: 'Tracker', icon: '📝' },
  { to: '/sos', label: 'SOS', icon: '🌿', emphasis: true },
  { to: '/coach', label: 'Coach', icon: '💬' },
  { to: '/profil', label: 'Profil', icon: '🙂' },
]

export default function AppShell() {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-teal-50 dark:bg-navy-900">
      <div className="flex-1 pb-20">
        <Outlet />
      </div>

      <nav className="fixed inset-x-0 bottom-0 border-t border-teal-200 bg-white/95 backdrop-blur dark:border-teal-700 dark:bg-navy-800/95">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-2xl px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  item.emphasis
                    ? 'bg-coral-500 text-white'
                    : isActive
                      ? 'text-coral-600 dark:text-coral-300'
                      : 'text-navy-800/50 dark:text-sand-100/50'
                }`
              }
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
