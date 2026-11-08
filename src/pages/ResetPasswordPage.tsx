import { Link } from 'react-router'
import { useResetPasswordForm } from '../features/auth/useResetPasswordForm'
import './LoginPage.css'

const fields = [
  {
    name: 'email',
    label: 'Електронна пошта',
    type: 'email',
    auto: 'email',
  },
  {
    name: 'token',
    label: 'Код із листа',
    type: 'password',
    auto: 'off',
  },
  {
    name: 'password',
    label: 'Новий пароль',
    type: 'password',
    auto: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: 'Повторіть новий пароль',
    type: 'password',
    auto: 'new-password',
  },
] as const

export default function ResetPasswordPage() {
  const { formik, complete, error } = useResetPasswordForm()

  return (
    <main className="login-screen">
      <div className="login-panel">
        <h1 className="login-title">Новий пароль</h1>

        {complete ? (
          <p role="status">
            Пароль змінено. Тепер можна увійти з новим паролем.
          </p>
        ) : (
          <form
            className="login-form"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            {fields.map((field) => {
              const message = formik.touched[field.name]
                ? formik.errors[field.name]
                : undefined

              return (
                <div className="login-field" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>

                  <input
                    id={field.name}
                    type={field.type}
                    autoComplete={field.auto}
                    required
                    {...formik.getFieldProps(field.name)}
                    aria-invalid={Boolean(message)}
                    aria-describedby={
                      message ? `${field.name}-error` : undefined
                    }
                  />

                  {message && (
                    <p
                      id={`${field.name}-error`}
                      className="login-error"
                      role="alert"
                    >
                      {message}
                    </p>
                  )}
                </div>
              )
            })}

            {error && <p className="login-error" role="alert">{error}</p>}

            <button
              type="submit"
              className="login-button login-button-primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Зберігаємо…' : 'Зберегти пароль'}
            </button>

            <Link to="/forgot-password">Отримати новий лист</Link>
          </form>
        )}

        <Link to="/login">До входу</Link>
      </div>
    </main>
  )
}