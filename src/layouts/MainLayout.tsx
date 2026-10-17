import { NavLink, Outlet } from 'react-router'

export default function MainLayout() {
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

            <NavLink to="/login">
              Вхід
            </NavLink>

            <NavLink to="/register">
              Реєстрація
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container main-content">
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