import { Link } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import AuthField from '../components/AuthField'
import { MailIcon } from '../components/Icons'
import { useForgotPasswordForm } from '../features/auth/useForgotPasswordForm'

export default function ForgotPasswordPage() {
  const { formik, notice, sent, secondsLeft, resending, resend } =
    useForgotPasswordForm()

  const emailError = formik.touched.email ? formik.errors.email : undefined
  const waiting = secondsLeft > 0

  const status = (
    <div role="status" aria-live="polite" aria-atomic="true">
      {notice && <p className="auth-notice">{notice}</p>}
    </div>
  )

  if (sent) {
    return (
      <AuthLayout>
        <div className="auth-status-icon">
          <MailIcon />
        </div>

        <h1 className="auth-title">Перевірте свою пошту</h1>

        <p className="auth-message">
          Якщо обліковий запис із цією електронною адресою існує, ми надіслали
          вам лист із посиланням для відновлення пароля.
        </p>

        <button
          type="button"
          className={
            waiting
              ? 'auth-button auth-button--primary auth-button--waiting'
              : 'auth-button auth-button--primary'
          }
          onClick={resend}
          disabled={waiting || resending}
        >
          {resending ? 'Надсилаємо…' : 'Надіслати повторно'}
        </button>

        {waiting && (
          <p className="auth-timer" aria-live="off">
            00:{String(secondsLeft).padStart(2, '0')}
          </p>
        )}

        {status}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      footer={
        <>
          <span>Маєте акаунт?</span>
          <Link to="/login">Увійти</Link>
        </>
      }
    >
      <h1 className="auth-title">Відновлення паролю</h1>

      <p className="auth-subtitle">
        Вкажіть email — ми надішлемо інструкцію для відновлення доступу.
      </p>

      <form
        className="auth-form"
        onSubmit={formik.handleSubmit}
        aria-busy={formik.isSubmitting}
        noValidate
      >
        <AuthField
          name="email"
          type="email"
          placeholder="Електронна пошта"
          autoComplete="email"
          value={formik.values.email}
          error={emailError}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Надсилаємо…' : 'Надіслати інструкцію'}
        </button>
      </form>

      <Link
        to="/reset-password"
        className="auth-link auth-notice"
      >
        У мене вже є код із листа
      </Link>

      {status}
    </AuthLayout>
  )
}