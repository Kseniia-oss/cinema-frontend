import { apiClient } from '../../api/apiClient'
import type { AuthRequest, AuthResponse } from './auth.types'
import { normalizeSession } from './normalizeSession'

export async function registerUser(values: AuthRequest): Promise<void> {
  // Після реєстрації сервер повертає текст «Check your email».
  await apiClient.post('/api/Auth/register', values)
}

export async function loginUser(
  values: AuthRequest,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<unknown>('/api/Auth/login', values)

  return normalizeSession(data)
}

export async function loginWithGoogle(
  idToken: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<unknown>('/api/Auth/ProviderAuth', {
    providerType: 0,
    providerToken: idToken,
  })

  return normalizeSession(data)
}

export async function logoutUser(session: AuthResponse): Promise<void> {
  await apiClient.post(
    '/api/Auth/logout',
    { refreshToken: session.refreshToken },
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  )
}

export async function confirmEmail(
  email: string,
  token: string,
): Promise<void> {
  await apiClient.post('/api/Auth/ConfirmEmail', null, {
    params: { email, token },
  })
}