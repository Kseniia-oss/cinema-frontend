import { apiClient } from '../../api/apiClient'

export interface ResetValues {
  email: string
  token: string
  password: string
  confirmPassword: string
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post('/api/Auth/ForgotPassword', { email })
}

export async function resetPassword(values: ResetValues): Promise<void> {
  await apiClient.post('/api/Auth/ResetPassword', {
    email: values.email.trim(),
    token: values.token.trim(),
    password: values.password,
    confirmPassword: values.confirmPassword,
  })
}