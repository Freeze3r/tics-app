import { Navigate, Outlet } from 'react-router-dom'
import { loadProfile } from '../lib/profile.js'

// Les données (dont le plan issu du quiz) restent sur l'appareil : quelqu'un qui se
// connecte depuis un nouveau téléphone, ou qui a vidé son navigateur, n'a plus de plan
// et doit refaire le quiz plutôt que de tomber sur des écrans vides.
export default function RequireProfile() {
  if (!loadProfile()) return <Navigate to="/quiz" replace />
  return <Outlet />
}
