import { Link } from 'react-router'
import { useLoginForm } from '../features/auth/useLoginForm'
import './LoginPage.css'

export default function LoginPage() {
  const {
    formik,
    showPassword,
    togglePasswordVisibility,
    handleGoogleLogin,
    notice,
  } = useLoginForm()

  const emailError = formik.touched.email
    ? formik.errors.email
    : undefined

  const passwordError = formik.touched.password
    ? formik.errors.password
    : undefined

  return (
    <main className="login-screen">
      <div className="login-panel">
        <h1 className="login-title">Вхід</h1>

        <form
          className="login-form"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="login-field">
            <label className="login-sr-only" htmlFor="email">
              Електронна пошта
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Електронна пошта"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'email-error' : undefined}
            />

            {emailError && (
              <p id="email-error" className="login-error" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <div className="login-field">
            <label className="login-sr-only" htmlFor="password">
              Пароль
            </label>

            <div className="login-password">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Пароль"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={
                  passwordError ? 'password-error' : undefined
                }
              />

              <button
                type="button"
                className="login-eye"
                onClick={togglePasswordVisibility}
                aria-controls="password"
                aria-label={
                  showPassword ? 'Приховати пароль' : 'Показати пароль'
                }
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {!showPassword && <path d="m4 4 16 16" />}
                </svg>
              </button>
            </div>

            {passwordError && (
              <p id="password-error" className="login-error" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          <div className="login-options">
            <label className="login-remember">
              <input
                name="rememberMe"
                type="checkbox"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />

              <span>Запам’ятати мене</span>
            </label>

            <Link to="/forgot-password" className="login-forgot">
              Забули пароль?
            </Link>
          </div>

          <button
            type="submit"
            className="login-button login-button-primary"
            disabled={formik.isSubmitting}
          >
            Увійти
          </button>
        </form>

        <div className="login-divider">
          <span>Або</span>
        </div>

        <div className="login-alternatives">
          <button
            type="button"
            className="login-button login-button-secondary"
            onClick={handleGoogleLogin}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.89-1.74 2.98-4.3 2.98-7.36Z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.12H3.05v2.59A10 10 0 0 0 12 22Z"
              />
              <path
                fill="#FBBC05"
                d="M6.39 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.34-2.59Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.34 2.59C7.18 7.72 9.39 5.96 12 5.96Z"
              />
            </svg>

            <span>Увійти через Google</span>
          </button>

          <Link
            to="/"
            className="login-button login-button-secondary login-guest"
          >
            Увійти як гість
          </Link>
        </div>

        {notice && (
          <p className="login-notice" role="status">
            {notice}
          </p>
        )}

        <p className="login-register">
          Немає акаунта?{' '}
          <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </main>
  )
}