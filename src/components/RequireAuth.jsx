import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase, getCurrentUser } from '../lib/supabase.js'

export default function RequireAuth() {
  const [status, setStatus] = useState('checking') // checking | authed | anon

  useEffect(() => {
    let active = true
    getCurrentUser().then((user) => {
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
