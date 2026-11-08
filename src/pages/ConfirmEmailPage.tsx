import { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import axios from 'axios'
import { confirmEmail } from '../features/auth/auth.api'
import './LoginPage.css'

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
    <main className="login-screen">
      <div className="login-panel">
        <h1 className="login-title">Підтвердження пошти</h1>

        {email && token ? (
          <>
            <p>Натисни кнопку, щоб підтвердити адресу {email}.</p>

            <button
              type="button"
              className="login-button login-button-primary"
              onClick={handleConfirm}
              disabled={busy}
            >
              {busy ? 'Підтверджуємо…' : 'Підтвердити пошту'}
            </button>
          </>
        ) : (
          <p>
            У посиланні бракує даних. Відкрий посилання з листа
            для підтвердження пошти.
          </p>
        )}

        {error && (
          <p className="login-notice" role="alert">
            {error}
          </p>
        )}

        <Link to="/login">До входу</Link>
      </div>
    </main>
  )
}