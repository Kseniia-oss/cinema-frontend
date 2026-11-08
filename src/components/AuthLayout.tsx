import type { ReactNode } from 'react'
import AsteraBackground from './AsteraBackground'
import logo from '../assets/astera-logo.svg'
import './AuthLayout.css'

interface AuthLayoutProps {
  children: ReactNode
  footer?: ReactNode
  // На сторінці входу рядок під кнопками стоїть ближче (15 px замість 30 px)
  compactFooter?: boolean
}

// Спільний каркас для входу, реєстрації та відновлення пароля:
// анімований фон, логотип ліворуч (на комп’ютері) і скляна картка праворуч.
export default function AuthLayout({
  children,
  footer,
  compactFooter = false,
}: AuthLayoutProps) {
  return (
    <div className="auth-screen">
      <AsteraBackground />

      <div className="auth-logo">
        <img src={logo} alt="Astera" width={344} height={150} />
      </div>

      <main className="auth-card">
        <div className="auth-content">{children}</div>

        {footer && (
          <div
            className={
              compactFooter ? 'auth-footer auth-footer--compact' : 'auth-footer'
            }
          >
            {footer}
          </div>
        )}
      </main>
    </div>
  )
}