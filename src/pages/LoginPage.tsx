import { Link } from 'react-router'
import GoogleIcon from '../components/GoogleIcon'
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

  const userNameError = formik.touched.userName
    ? formik.errors.userName
    : undefined

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
          aria-busy={formik.isSubmitting}
          noValidate
        >
          <div className="login-field">
            <label className="login-sr-only" htmlFor="userName">
              Ім’я користувача
            </label>

            <input
              id="userName"
              name="userName"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Ім’я користувача"
              required
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(userNameError)}
              aria-describedby={
                userNameError ? 'username-error' : undefined
              }
            />

            {userNameError && (
              <p
                id="username-error"
                className="login-error"
                role="alert"
              >
                {userNameError}
              </p>
            )}
          </div>

          <div className="login-field">
            <label className="login-sr-only" htmlFor="email">
              Електронна пошта
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
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
                disabled
              />

              <span>Запам’ятати мене (незабаром)</span>
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
            {formik.isSubmitting ? 'Входимо…' : 'Увійти'}
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
            disabled={formik.isSubmitting}
          >
            <GoogleIcon />
            <span>Увійти через Google</span>
          </button>

          <Link
            to="/"
            className="login-button login-button-secondary login-guest"
          >
            Увійти як гість
          </Link>
        </div>

        <div role="status" aria-live="polite" aria-atomic="true">
          {notice && <p className="login-notice">{notice}</p>}
        </div>

        <p className="login-register">
          Немає акаунта?{' '}
          <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </main>
  )
}