import { Link, Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ConfirmEmailPage from '../pages/ConfirmEmailPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import MovieDetailsPage from '../pages/MovieDetailsPage'
import AdminPage from '../pages/AdminPage'
import CreateMoviePage from '../pages/CreateMoviePage'
import RequireRole from '../features/auth/RequireRole'
import { ROLE_CONTENT_MANAGER } from '../features/auth/roles'
import { useSessionExpiry } from '../features/auth/useSessionExpiry'

export default function AppRouter() {
  useSessionExpiry()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="movies/:id" element={<MovieDetailsPage />} />

        <Route
          element={
            <RequireRole
              role={ROLE_CONTENT_MANAGER}
              message="Керувати фільмами може лише контент-менеджер."
            />
          }
        >
          <Route path="admin" element={<AdminPage />} />
          <Route path="admin/movies/new" element={<CreateMoviePage />} />
          <Route path="admin/movies/:id/edit" element={<CreateMoviePage />} />
        </Route>

        <Route
          path="*"
          element={
            <section className="page">
              <h1>404 — Сторінку не знайдено</h1>
              <Link to="/">Повернутися на головну</Link>
            </section>
          }
        />
      </Route>
    </Routes>
  )
}