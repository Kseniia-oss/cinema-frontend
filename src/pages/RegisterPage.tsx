import { Link } from 'react-router'
import GoogleIcon from '../components/GoogleIcon'
import PasswordField from '../components/PasswordField'
import { useRegisterForm } from '../features/auth/useRegisterForm'
import './LoginPage.css'
import './RegisterPage.css'

export default function RegisterPage() {
  const {
    formik,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleGoogleRegister,
    notice,
  } = useRegisterForm()

  const nameError = formik.touched.name
    ? formik.errors.name
    : undefined

  const emailError = formik.touched.email
    ? formik.errors.email
    : undefined

  const passwordError = formik.touched.password
    ? formik.errors.password
    : undefined

  const confirmPasswordError = formik.touched.confirmPassword
    ? formik.errors.confirmPassword
    : undefined

  const termsError = formik.touched.acceptTerms
    ? formik.errors.acceptTerms
    : undefined

  return (
    <main className="login-screen">
      <div className="login-panel">
        <div className="register-heading">
          <Link
            to="/login"
            className="register-back"
            aria-label="Повернутися до входу"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m14 6-6 6 6 6" />
            </svg>
          </Link>

          <h1 className="login-title">Створення акаунту</h1>
        </div>

        <form
          className="login-form"
          onSubmit={formik.handleSubmit}
          aria-busy={formik.isSubmitting}
          noValidate
        >
          <div className="login-field">
            <label className="login-sr-only" htmlFor="name">
              Ім’я користувача
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Ім’я користувача"
              required
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'name-error' : undefined}
            />

            {nameError && (
              <p id="name-error" className="login-error" role="alert">
                {nameError}
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

          <PasswordField
            name="password"
            placeholder="Пароль"
            value={formik.values.password}
            visible={showPassword}
            error={passwordError}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onToggle={togglePasswordVisibility}
          />

          <PasswordField
            name="confirmPassword"
            placeholder="Повторіть пароль"
            value={formik.values.confirmPassword}
            visible={showConfirmPassword}
            error={confirmPasswordError}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            onToggle={toggleConfirmPasswordVisibility}
          />

          <div className="register-terms">
            <label className="login-remember">
              <input
                name="acceptTerms"
                type="checkbox"
                required
                checked={formik.values.acceptTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(termsError)}
                aria-describedby={
                  termsError ? 'terms-error' : undefined
                }
              />

              <span>Приймаю умови користування</span>
            </label>

            {termsError && (
              <p id="terms-error" className="login-error" role="alert">
                {termsError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="login-button login-button-primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Створюємо…' : 'Створити'}
          </button>
        </form>

        <div className="login-divider">
          <span>Або</span>
        </div>

        <button
          type="button"
          className="login-button login-button-secondary"
          onClick={handleGoogleRegister}
          disabled={formik.isSubmitting}
        >
          <GoogleIcon />
          <span>Створити через Google</span>
        </button>

        <div role="status" aria-live="polite" aria-atomic="true">
          {notice && <p className="login-notice">{notice}</p>}
        </div>
      </div>
    </main>
  )
}