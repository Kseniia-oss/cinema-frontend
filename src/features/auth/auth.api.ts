import { apiClient } from '../../api/apiClient'
import type { AuthRequest, AuthResponse } from './auth.types'
import { isAuthResponse } from './auth.session'

export async function registerUser(values: AuthRequest): Promise<void> {
  await apiClient.post('/api/Auth/register', values)
}

export async function loginUser(values: AuthRequest): Promise<AuthResponse> {
  const response = await apiClient.post<unknown>('/api/Auth/login', values)

  if (!isAuthResponse(response.data)) {
    throw new Error('Сервер повернув неочікуваний формат авторизації.')
  }

  return response.data
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

export async function confirmEmail(email: string, token: string): Promise<void> {
  await apiClient.post('/api/Auth/ConfirmEmail', null, {
    params: { email, token },
  })
}