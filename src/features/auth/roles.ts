import type { AuthResponse } from './auth.types'

export const ROLE_ADMIN = 'Admin'
export const ROLE_CONTENT_MANAGER = 'ContentManager'

const ROLE_CLAIMS = [
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  'role',
  'roles',
]

function readTokenRoles(accessToken: string): string[] {
  try {
    const part = accessToken.split('.')[1]

    if (!part) return []

    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes))

    if (!payload || typeof payload !== 'object') return []

    const claims = payload as Record<string, unknown>

    return ROLE_CLAIMS.flatMap((name) => {
      const value = claims[name]

      if (typeof value === 'string') return [value]

      if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string')
      }

      return []
    })
  } catch {
    return []
  }
}

// Ролі потрібні лише для того, щоб показати чи сховати сторінки.
// Справжню перевірку прав робить сервер.
export function getRoles(session: AuthResponse | null): string[] {
  if (!session) return []

  const fromResponse = session.role.split(',')
  const fromToken = readTokenRoles(session.accessToken)

  return [...new Set([...fromResponse, ...fromToken].map((r) => r.trim()))]
    .filter(Boolean)
}

export function hasRole(
  session: AuthResponse | null,
  role: string,
): boolean {
  return getRoles(session).includes(role)
}