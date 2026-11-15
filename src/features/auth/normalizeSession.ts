import { isAuthResponse } from './auth.session'
import type { AuthResponse } from './auth.types'

export function normalizeSession(data: unknown): AuthResponse {
  // Попередній формат API: role — рядок.
  if (isAuthResponse(data)) {
    return data
  }

  // Поточний формат API: roles — масив рядків.
  if (typeof data === 'object' && data !== null && 'roles' in data) {
    const roles = data.roles

    if (
      Array.isArray(roles) &&
      roles.every((role: unknown) => typeof role === 'string')
    ) {
      const session = {
        ...data,
        role: roles.join(','),
      }

      if (isAuthResponse(session)) {
        return session
      }
    }
  }

  throw new Error('Сервер повернув неочікуваний формат сесії.')
}