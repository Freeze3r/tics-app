import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { resolveAuthScope } from '../lib/authScope.js'

export default function RequireAuth() {
  const [status, setStatus] = useState('checking') // checking | authed | anon

  useEffect(() => {
    let active = true
    // resolveAuthScope() doit être attendu ici avant que les écrans enfants
    // (Home, Profil, etc.) ne lisent leurs données locales scopées par compte.
    resolveAuthScope().then((user) => {
      if (!active) return
      setStatus(user ? 'authed' : 'anon')
    })
    return () => {
      active = false
    }
  }, [])

  if (status === 'checking') return null
  if (status === 'anon') return <Navigate to={supabase ? '/auth' : '/'} replace />
  return <Outlet />
}
