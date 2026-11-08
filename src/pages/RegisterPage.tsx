import { Link } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import AuthField from '../components/AuthField'
import PasswordField from '../components/PasswordField'
import GoogleIcon from '../components/GoogleIcon'
import { useRegisterForm } from '../features/auth/useRegisterForm'

type Field = 'name' | 'email' | 'password' | 'confirmPassword' | 'acceptTerms'

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

  const error = (name: Field) =>
    formik.touched[name] ? formik.errors[name] : undefined

  const termsError = error('acceptTerms')

  return (
    <AuthLayout
      footer={
        <>
          <span>Маєте акаунт?</span>
          <Link to="/login">Увійти</Link>
        </>
      }
    >
      <h1 className="auth-title">Створення акаунту</h1>

      <form
        className="auth-form"
        onSubmit={formik.handleSubmit}
        aria-busy={formik.isSubmitting}
        noValidate
      >
        <AuthField
          name="name"
          placeholder="Ім’я"
          autoComplete="username"
          value={formik.values.name}
          error={error('name')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <AuthField
          name="email"
          type="email"
          placeholder="Електронна пошта"
          autoComplete="email"
          value={formik.values.email}
          error={error('email')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <PasswordField
          name="password"
          placeholder="Пароль"
          value={formik.values.password}
          visible={showPassword}
          error={error('password')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onToggle={togglePasswordVisibility}
        />

        <PasswordField
          name="confirmPassword"
          placeholder="Повторіть пароль"
          value={formik.values.confirmPassword}
          visible={showConfirmPassword}
          error={error('confirmPassword')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onToggle={toggleConfirmPasswordVisibility}
        />

        <div>
          <label className="auth-options auth-check">
            <input
              name="acceptTerms"
              type="checkbox"
              required
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(termsError)}
              aria-describedby={termsError ? 'terms-error' : undefined}
            />
            <span>Приймаю умови користування</span>
          </label>

          {termsError && (
            <p id="terms-error" className="auth-error" role="alert">
              {termsError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Створюємо…' : 'Створити'}
        </button>
      </form>

      <div className="auth-divider">
        <span>Або</span>
      </div>

      <button
        type="button"
        className="auth-button auth-button--light"
        onClick={handleGoogleRegister}
        disabled={formik.isSubmitting}
      >
        <GoogleIcon />
        <span>Увійти через Google</span>
      </button>

      <div role="status" aria-live="polite" aria-atomic="true">
        {notice && <p className="auth-notice">{notice}</p>}
      </div>
    </AuthLayout>
  )
}