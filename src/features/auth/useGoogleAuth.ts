import { useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { apiClient } from '../../api/apiClient'
import { useAppDispatch } from '../../app/hooks'
import { getAuthErrorMessage } from './auth.errors'
import { isAuthResponse, saveSession } from './auth.session'
import { sessionStarted } from './authSlice'

const GOOGLE_CLIENT_ID =
  '174450574248-q5fs4f3ulvcqrr3bupn9tb9hd545mmd2.apps.googleusercontent.com'

export function useGoogleAuth(setNotice: (message: string) => void) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const pending = useRef(false)

  function startGoogleAuth() {
    if (pending.current) return

    if (typeof google === 'undefined' || !google.accounts?.oauth2) {
      setNotice('Не вдалося завантажити Google. Онови сторінку й спробуй ще раз.')
      return
    }

    pending.current = true
    setNotice('Обери Google-акаунт у вікні, що відкрилося.')

    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        include_granted_scopes: false,

        callback: async (result) => {
          try {
            if (result.error || !result.access_token) {
              setNotice('Google-вхід не завершено. Спробуй ще раз.')
              return
            }

            setNotice('Входимо на сайт…')

            const { data } = await apiClient.post<unknown>(
              '/api/Auth/ProviderAuth',
              {
                providerType: 0,
                providerToken: result.access_token,
              },
            )

            if (!isAuthResponse(data)) {
              setNotice(
                'Сервер відповів, але формат сесії відрізняється від звичайного входу.',
              )
              return
            }

            saveSession(data)
            dispatch(sessionStarted(data))
            navigate('/', { replace: true })
          } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              setNotice('Сервер не прийняв токен Google. Спробуй увійти ще раз.')
            } else {
              setNotice(getAuthErrorMessage(error))
            }
          } finally {
            pending.current = false
          }
        },

        error_callback: (error) => {
          pending.current = false
          setNotice(
            error.type === 'popup_closed'
              ? 'Вікно Google закрито. За бажанням спробуй ще раз.'
              : 'Не вдалося відкрити вікно Google. Дозволь спливні вікна для сайту.',
          )
        },
      })

      client.requestAccessToken({ prompt: 'select_account' })
    } catch {
      pending.current = false
      setNotice('Не вдалося розпочати вхід через Google. Спробуй ще раз.')
    }
  }

  return startGoogleAuth
}