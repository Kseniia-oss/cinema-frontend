import { Link } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import AuthField from '../components/AuthField'
import PasswordField from '../components/PasswordField'
import GoogleIcon from '../components/GoogleIcon'
import { useLoginForm } from '../features/auth/useLoginForm'

export default function LoginPage() {
  const {
    formik,
    showPassword,
    togglePasswordVisibility,
    handleGoogleLogin,
    notice,
  } = useLoginForm()

  const error = (name: 'userName' | 'email' | 'password') =>
    formik.touched[name] ? formik.errors[name] : undefined

  return (
    <AuthLayout
      compactFooter
      footer={
        <>
          <span>Немає акаунта?</span>
          <Link to="/register">Зареєструватися</Link>
        </>
      }
    >
      <h1 className="auth-title">Вхід</h1>

      <form
        className="auth-form"
        onSubmit={formik.handleSubmit}
        aria-busy={formik.isSubmitting}
        noValidate
      >
        {/* Бекенд для входу вимагає ще й ім’я користувача, тому поле залишаємо */}
        <AuthField
          name="userName"
          placeholder="Ім’я користувача"
          autoComplete="username"
          value={formik.values.userName}
          error={error('userName')}
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
          autoComplete="current-password"
          value={formik.values.password}
          visible={showPassword}
          error={error('password')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onToggle={togglePasswordVisibility}
        />

        <div className="auth-options">
          <label className="auth-check">
            <input
              name="rememberMe"
              type="checkbox"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
            />
            <span>Запам’ятати мене</span>
          </label>

          <Link to="/forgot-password" className="auth-link">
            Забули пароль?
          </Link>
        </div>

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Входимо…' : 'Увійти'}
        </button>
      </form>

      <div className="auth-divider">
        <span>Або</span>
      </div>

      <div className="auth-alternatives">
        <button
          type="button"
          className="auth-button auth-button--light"
          onClick={handleGoogleLogin}
          disabled={formik.isSubmitting}
        >
          <GoogleIcon />
          <span>Увійти через Google</span>
        </button>

        <Link to="/" className="auth-button auth-button--glass">
          Увійти як гість
        </Link>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true">
        {notice && <p className="auth-notice">{notice}</p>}
      </div>
    </AuthLayout>
  )
}