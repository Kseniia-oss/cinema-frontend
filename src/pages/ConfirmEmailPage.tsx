import { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import axios from 'axios'
import AuthLayout from '../components/AuthLayout'
import { MailIcon } from '../components/Icons'
import { confirmEmail } from '../features/auth/auth.api'

// Окремого макета для цієї сторінки немає, тому вона зібрана
// з тих самих елементів, що й «Перевірте свою пошту».
export default function ConfirmEmailPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)

  const email = params.get('email')?.trim()
  const token = params.get('token')

  async function handleConfirm() {
    if (!email || !token || pending.current) return

    pending.current = true
    setBusy(true)
    setError('')

    try {
      await confirmEmail(email, token)
      navigate('/', { replace: true })
    } catch (cause) {
      const status = axios.isAxiosError(cause)
        ? cause.response?.status
        : undefined

      setError(
        status === 400 || status === 404 || status === 410
          ? 'Посилання недійсне або вже використане. Перевір останній лист.'
          : 'Не вдалося підтвердити пошту. Спробуй ще раз пізніше.',
      )
    } finally {
      pending.current = false
      setBusy(false)
    }
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
      <div className="auth-status-icon">
        <MailIcon />
      </div>

      <h1 className="auth-title">Підтвердження пошти</h1>

      {email && token ? (
        <>
          <p className="auth-message">
            Натисніть кнопку, щоб підтвердити адресу {email}.
          </p>

          <button
            type="button"
            className="auth-button auth-button--primary"
            onClick={handleConfirm}
            disabled={busy}
          >
            {busy ? 'Підтверджуємо…' : 'Підтвердити пошту'}
          </button>
        </>
      ) : (
        <p className="auth-message">
          У посиланні бракує даних. Відкрийте посилання з листа для
          підтвердження пошти.
        </p>
      )}

      {error && (
        <p className="auth-notice" role="alert">
          {error}
        </p>
      )}
    </AuthLayout>
  )
}