import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { apiClient } from '../../api/apiClient'
import { useAppDispatch } from '../../app/hooks'
import { getAuthErrorMessage } from './auth.errors'
import { isAuthResponse, saveSession } from './auth.session'
import { sessionStarted } from './authSlice'

const CLIENT_ID =
  '174450574248-q5fs4f3ulvcqrr3bupn9tb9hd545mmd2.apps.googleusercontent.com'

export default function GoogleAuthButton() {
  const container = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const element = container.current
    if (!element) return

    let active = true
    let pending = false
    let rendered = false

    async function finishLogin(result: google.accounts.id.CredentialResponse) {
      if (!active || pending) return

      if (!result.credential) {
        setNotice('Google не повернув ID-токен. Спробуй ще раз.')
        return
      }

      pending = true
      setNotice('Входимо на сайт…')

      try {
        const { data } = await apiClient.post<unknown>(
          '/api/Auth/ProviderAuth',
          {
            providerType: 0,
            providerToken: result.credential,
          },
        )

        if (!active) return

        if (!isAuthResponse(data)) {
          setNotice('Сервер відповів, але сайт не розпізнав формат сесії.')
          return
        }

        saveSession(data)
        dispatch(sessionStarted(data))
        navigate('/', { replace: true })
      } catch (error: unknown) {
        if (!active) return

        setNotice(
          axios.isAxiosError(error) && error.response?.status === 401
            ? 'Сервер не прийняв ID-токен Google.'
            : getAuthErrorMessage(error),
        )
      } finally {
        pending = false
      }
    }

    function renderButton() {
      if (!active || rendered || !element) return
      if (typeof google === 'undefined' || !google.accounts?.id) return

      rendered = true
      google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: finishLogin,
        ux_mode: 'popup',
        auto_select: false,
      })

      google.accounts.id.renderButton(element, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
      })
    }

    // Скрипт у index.html завантажується асинхронно.
    const script = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    )
    function onLoadError() {
      if (active) setNotice('Не вдалося завантажити Google. Онови сторінку.')
    }

    script?.addEventListener('load', renderButton)
    script?.addEventListener('error', onLoadError)
    renderButton()

    const timeout = window.setTimeout(() => {
      if (!rendered) onLoadError()
    }, 15000)

    return () => {
      active = false
      window.clearTimeout(timeout)
      script?.removeEventListener('load', renderButton)
      script?.removeEventListener('error', onLoadError)
      element.replaceChildren()
    }
  }, [dispatch, navigate])

  return (
    <div>
      <div ref={container} />
      {notice && <p className="auth-notice" role="status">{notice}</p>}
    </div>
  )
}