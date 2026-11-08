import { Link, Navigate, Outlet } from 'react-router'
import { useAppSelector } from '../../app/hooks'
import { hasRole } from './roles'

interface RequireRoleProps {
  role: string
  message: string
}

export default function RequireRole({ role, message }: RequireRoleProps) {
  const session = useAppSelector((state) => state.auth.session)

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (!hasRole(session, role)) {
    return (
      <section className="page">
        <h1>403 — Недостатньо прав</h1>
        <p>{message}</p>
        <Link to="/">Повернутися на головну</Link>
      </section>
    )
  }

  return <Outlet />
}