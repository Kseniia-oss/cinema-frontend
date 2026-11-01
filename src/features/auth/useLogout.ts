import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logoutUser } from './auth.api'
import { clearSession } from './auth.session'
import { sessionEnded } from './authSlice'

export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const session = useAppSelector((state) => state.auth.session)

  const pending = useRef(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutNotice, setLogoutNotice] = useState('')

  async function handleLogout() {
    if (pending.current) return

    pending.current = true
    setIsLoggingOut(true)
    setLogoutNotice('')

    try {
      if (session) {
        await logoutUser(session)
      }
    } catch {
      setLogoutNotice(
        'Вихід виконано в цій вкладці. Сервер не підтвердив завершення сесії.',
      )
    } finally {
      clearSession()
      dispatch(sessionEnded())

      pending.current = false
      setIsLoggingOut(false)

      navigate('/', { replace: true })
    }
  }

  return {
    handleLogout,
    isLoggingOut,
    logoutNotice,
  }
}