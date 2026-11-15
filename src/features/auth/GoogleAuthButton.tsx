import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import { loginWithGoogle } from './auth.api'
import { getAuthErrorMessage } from './auth.errors'
import { saveSession } from './auth.session'
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
    let initialized = false
    let lastWidth = 0

    async function finishLogin(result: google.accounts.id.CredentialResponse) {
      if (!active || pending) return

      if (!result.credential) {
        setNotice('Google не повернув ID-токен. Спробуй ще раз.')
        return
      }

      pending = true
      setNotice('Входимо на сайт…')

      try {
        const session = await loginWithGoogle(result.credential)

        if (!active) return

        saveSession(session)
        dispatch(sessionStarted(session))
        navigate('/', { replace: true })
      } catch (error: unknown) {
        if (!active) return

        setNotice(
          axios.isAxiosError(error) && error.response?.status === 401
            ? 'Сервер не прийняв ID-токен Google. Спробуй увійти ще раз.'
            : getAuthErrorMessage(error),
        )
      } finally {
        pending = false
      }
    }

    function renderButton() {
      if (!active || !element) return
      if (typeof google === 'undefined' || !google.accounts?.id) return

      const width = Math.min(400, element.clientWidth)
      if (width <= 0 || width === lastWidth) return

      if (!initialized) {
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: finishLogin,
          ux_mode: 'popup',
          auto_select: false,
        })

        initialized = true
        setNotice('')
      }

      lastWidth = width
      element.replaceChildren()

      google.accounts.id.renderButton(element, {
        type: 'standard',
        theme: 'outline',
        size: 'medium',
        text: 'signin_with',
        shape: 'rectangular',
        locale: 'uk',
        width,
      })
    }

    function onLoadError() {
      if (active && !initialized) {
        setNotice('Не вдалося завантажити кнопку Google. Онови сторінку.')
      }
    }

    const script = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    )

    script?.addEventListener('load', renderButton)
    script?.addEventListener('error', onLoadError)

    const observer = new ResizeObserver(renderButton)
    observer.observe(element)
    renderButton()

    const timer = window.setTimeout(onLoadError, 15000)

    return () => {
      active = false
      window.clearTimeout(timer)
      observer.disconnect()
      script?.removeEventListener('load', renderButton)
      script?.removeEventListener('error', onLoadError)
      element.replaceChildren()
    }
  }, [dispatch, navigate])

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <div
        ref={container}
        style={{
          width: '100%',
          maxWidth: 400,
          minHeight: 44,
          marginInline: 'auto',
          display: 'grid',
          alignItems: 'center',
        }}
      />

      {notice && (
        <p className="auth-notice" role="status">
          {notice}
        </p>
      )}
    </div>
  )
}