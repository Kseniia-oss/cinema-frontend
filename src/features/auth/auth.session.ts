import type { AuthResponse } from './auth.types'

const SESSION_KEY = 'cinema.auth.session'

export function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== 'object' || value === null) return false

  const data = value as Record<string, unknown>

  return (
    typeof data.accessToken === 'string' &&
    data.accessToken.length > 0 &&
    typeof data.refreshToken === 'string' &&
    data.refreshToken.length > 0 &&
    typeof data.userName === 'string' &&
    typeof data.email === 'string' &&
    typeof data.role === 'string' &&
    typeof data.expiration === 'string' &&
    Number.isFinite(Date.parse(data.expiration))
  )
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Сховище може бути недоступним через налаштування браузера.
  }
}

export function readSession(): AuthResponse | null {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY)

    if (!saved) return null

    const session: unknown = JSON.parse(saved)

    if (
      !isAuthResponse(session) ||
      Date.parse(session.expiration) <= Date.now()
    ) {
      clearSession()
      return null
    }

    return session
  } catch {
    clearSession()
    return null
  }
}

export function saveSession(session: AuthResponse): void {
  if (
    !isAuthResponse(session) ||
    Date.parse(session.expiration) <= Date.now()
  ) {
    throw new Error('Сервер повернув некоректну або прострочену сесію.')
  }

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    throw new Error(
      'Не вдалося зберегти сесію. Перевір налаштування сховища браузера.',
    )
  }
}