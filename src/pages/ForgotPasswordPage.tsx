import { Link } from 'react-router'
import { useForgotPasswordForm } from '../features/auth/useForgotPasswordForm'
import './LoginPage.css'
import './RegisterPage.css'
import './ForgotPasswordPage.css'

export default function ForgotPasswordPage() {
  const { formik, notice } = useForgotPasswordForm()

  const emailError = formik.touched.email
    ? formik.errors.email
    : undefined

  return (
    <main className="login-screen">
      <div className="login-panel">
        <div className="register-heading forgot-heading">
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

          <h1 className="login-title">Відновлення пароля</h1>
        </div>

        <p className="forgot-description">
          Вкажіть email — ми надішлемо інструкцію для відновлення доступу.
        </p>

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

          <button
            type="submit"
            className="login-button login-button-primary"
            disabled={formik.isSubmitting}
          >
            Надіслати інструкцію
          </button>
        </form>

        {notice && (
          <p className="login-notice" role="status">
            {notice}
          </p>
        )}
      </div>
    </main>
  )
}