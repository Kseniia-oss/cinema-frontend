import { Link, Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import AdminPage from '../pages/AdminPage'
import CreateMoviePage from '../pages/CreateMoviePage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="admin" element={<AdminPage />} />

        <Route
          path="admin/movies/new"
          element={<CreateMoviePage />}
        />

        <Route
          path="admin/movies/:id/edit"
          element={<CreateMoviePage />}
        />

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