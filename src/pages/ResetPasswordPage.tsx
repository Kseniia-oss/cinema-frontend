import { Link } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import AuthField from '../components/AuthField'
import PasswordField from '../components/PasswordField'
import { CheckIcon } from '../components/Icons'
import { useResetPasswordForm } from '../features/auth/useResetPasswordForm'

type Field = 'email' | 'token' | 'password' | 'confirmPassword'

export default function ResetPasswordPage() {
  const {
    formik,
    complete,
    error,
    needsCode,
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
  } = useResetPasswordForm()

  const fieldError = (name: Field) =>
    formik.touched[name] ? formik.errors[name] : undefined

  if (complete) {
    return (
      <AuthLayout>
        <div className="auth-status-icon auth-status-icon--success">
          <CheckIcon />
        </div>

        <h1 className="auth-title">Пароль змінено!</h1>

        <p className="auth-message">
          Ваш пароль успішно оновлено. Тепер ви можете увійти до свого акаунту
          з новим паролем.
        </p>

        <Link to="/login" className="auth-button auth-button--primary">
          Увійти
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      footer={
        needsCode ? (
          <Link to="/forgot-password">Отримати новий лист</Link>
        ) : undefined
      }
    >
      <h1 className="auth-title">Створіть новий пароль</h1>

      <p className="auth-subtitle">Придумайте новий пароль для свого акаунта</p>

      <form
        className="auth-form"
        onSubmit={formik.handleSubmit}
        aria-busy={formik.isSubmitting}
        noValidate
      >
        {needsCode && (
          <>
            <AuthField
              name="email"
              type="email"
              placeholder="Електронна пошта"
              autoComplete="email"
              value={formik.values.email}
              error={fieldError('email')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <AuthField
              name="token"
              placeholder="Код із листа"
              autoComplete="off"
              value={formik.values.token}
              error={fieldError('token')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </>
        )}

        <PasswordField
          name="password"
          placeholder="Введіть новий пароль"
          value={formik.values.password}
          visible={showPassword}
          hint="Мінімум 8 символів"
          error={fieldError('password')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onToggle={togglePassword}
        />

        <PasswordField
          name="confirmPassword"
          placeholder="Підтвердіть новий пароль"
          value={formik.values.confirmPassword}
          visible={showConfirm}
          error={fieldError('confirmPassword')}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onToggle={toggleConfirm}
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Зберігаємо…' : 'Зберегти'}
        </button>
      </form>
    </AuthLayout>
  )
}