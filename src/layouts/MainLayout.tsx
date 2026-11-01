import { NavLink, Outlet } from 'react-router'
import { useAppSelector } from '../app/hooks'
import { useLogout } from '../features/auth/useLogout'
import './MainLayout.css'

export default function MainLayout() {
  const session = useAppSelector((state) => state.auth.session)

  const {
    handleLogout,
    isLoggingOut,
    logoutNotice,
  } = useLogout()

  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="container header-content">
          <NavLink to="/" className="logo">
            Cinema
          </NavLink>

          <nav className="navigation" aria-label="Основна навігація">
            <NavLink to="/" end>
              Головна
            </NavLink>

            {session ? (
              <>
                <span className="navigation-user">
                  {session.userName}
                </span>

                <button
                  type="button"
                  className="navigation-logout"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? 'Виходимо…' : 'Вийти'}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  Вхід
                </NavLink>

                <NavLink to="/register">
                  Реєстрація
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container main-content">
        <div role="status" aria-live="polite">
          {logoutNotice && (
            <p className="session-notice">
              {logoutNotice}
            </p>
          )}
        </div>

        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          Cinema — дипломний проєкт
        </div>
      </footer>
    </div>
  )
}