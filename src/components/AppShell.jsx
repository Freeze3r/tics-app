import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { getUserSettings } from '../lib/userSettings.js'
import { checkAndFireReminders } from '../lib/notifications.js'
import { NAV_ITEMS, navItemClass } from '../data/navItems.js'
import { NavFrame } from './NavBar.jsx'

export default function AppShell() {
  useEffect(() => {
    // Vérifie les rappels toutes les minutes tant que l'app est ouverte quelque
    // part (onglet actif ou en arrière-plan) — pas de vraie notification push
    // serveur pour l'instant, voir lib/notifications.js.
    const check = () => checkAndFireReminders(getUserSettings())
    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-svh flex-1 flex-col">
      <div className="flex-1 pb-28">
        <Outlet />
      </div>

      <NavFrame>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => navItemClass({ active: isActive, emphasis: item.emphasis })}
          >
            <span className="text-lg" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </NavFrame>
    </div>
  )
}
