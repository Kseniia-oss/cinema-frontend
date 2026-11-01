import { apiClient } from '../../api/apiClient'
import type { AuthRequest, AuthResponse } from './auth.types'

export async function registerUser(
  values: AuthRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/api/Auth/register',
    values,
  )

  return response.data
}

export async function loginUser(
  values: AuthRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    '/api/Auth/login',
    values,
  )

  return response.data
}