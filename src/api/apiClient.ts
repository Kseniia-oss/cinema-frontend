import axios from 'axios'
import { readSession } from '../features/auth/auth.session'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? ''

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  if (!apiBaseUrl) {
    throw new Error(
      'Адресу Backend API не налаштовано. Заповніть VITE_API_BASE_URL.',
    )
  }

  const target = new URL(
    apiClient.getUri(config),
    window.location.origin,
  )

  const apiOrigin = new URL(
    apiBaseUrl,
    window.location.origin,
  ).origin

  if (target.origin !== apiOrigin) {
    throw new Error('Адреса запиту не належить Backend API.')
  }

  const isPublicAuth =
    /^\/api\/Auth\/(?:login|register|confirmemail|forgotpassword|resetpassword|refresh)\/?$/i.test(
      target.pathname,
    )

  if (!isPublicAuth && !config.headers.has('Authorization')) {
    const session = readSession()

    if (session) {
      config.headers.set(
        'Authorization',
        `Bearer ${session.accessToken}`,
      )
    }
  }

  return config
})