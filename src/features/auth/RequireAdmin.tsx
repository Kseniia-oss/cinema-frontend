import { Link, Navigate, Outlet } from 'react-router'
import { useAppSelector } from '../../app/hooks'

const ADMIN_ROLE = 'Admin'

export default function RequireAdmin() {
  const session = useAppSelector((state) => state.auth.session)

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (session.role !== ADMIN_ROLE) {
    return (
      <section className="page">
        <h1>403 — Недостатньо прав</h1>
        <p>Ця сторінка доступна лише адміністратору.</p>
        <Link to="/">Повернутися на головну</Link>
      </section>
    )
  }

  return <Outlet />
}