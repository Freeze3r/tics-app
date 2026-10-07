// Habillage commun de la barre de navigation flottante : utilisé par la vraie nav
// (AppShell) et par sa maquette dans le tutoriel, pour qu'elles restent identiques.
export function NavFrame({ children }) {
  return (
    <nav className="nav-bar fixed inset-x-3 bottom-3 z-30 mx-auto max-w-md rounded-[28px]">
      <div className="flex items-center justify-around px-2 py-2">{children}</div>
    </nav>
  )
}
