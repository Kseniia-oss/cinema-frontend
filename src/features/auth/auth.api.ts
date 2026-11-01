import { apiClient } from '../../api/apiClient'
import type { AuthRequest, AuthResponse } from './auth.types'
import { isAuthResponse } from './auth.session'

function parseAuthResponse(data: unknown): AuthResponse {
  if (!isAuthResponse(data)) {
    throw new Error('Сервер повернув неочікуваний формат авторизації.')
  }

  return data
}

export async function registerUser(
  values: AuthRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<unknown>(
    '/api/Auth/register',
    values,
  )

  return parseAuthResponse(response.data)
}

export async function loginUser(
  values: AuthRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<unknown>(
    '/api/Auth/login',
    values,
  )

  return parseAuthResponse(response.data)
}

export async function logoutUser(
  session: AuthResponse,
): Promise<void> {
  await apiClient.post(
    '/api/Auth/logout',
    {
      refreshToken: session.refreshToken,
    },
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    },
  )
}