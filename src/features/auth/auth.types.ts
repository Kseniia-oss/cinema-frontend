export interface LoginFormValues {
  userName: string
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface ForgotPasswordFormValues {
  email: string
}

export interface AuthRequest {
  userName: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userName: string
  email: string
  role: string
  expiration: string
}