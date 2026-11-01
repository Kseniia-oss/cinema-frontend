import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearSession } from './auth.session'
import { sessionEnded } from './authSlice'

export function useSessionExpiry() {
  const dispatch = useAppDispatch()
  const expiration = useAppSelector(
    (state) => state.auth.session?.expiration,
  )

  useEffect(() => {
    if (!expiration) return

    const expiresAt = Date.parse(expiration)
    let timer: ReturnType<typeof setTimeout> | undefined

    function checkExpiration() {
      if (timer) clearTimeout(timer)

      const remaining = expiresAt - Date.now()

      if (!Number.isFinite(remaining) || remaining <= 0) {
        clearSession()
        dispatch(sessionEnded())
        return
      }

      timer = setTimeout(
        checkExpiration,
        Math.min(remaining, 2_147_483_647),
      )
    }

    checkExpiration()

    window.addEventListener('focus', checkExpiration)
    document.addEventListener('visibilitychange', checkExpiration)

    return () => {
      if (timer) clearTimeout(timer)

      window.removeEventListener('focus', checkExpiration)
      document.removeEventListener('visibilitychange', checkExpiration)
    }
  }, [dispatch, expiration])
}