import axios from 'axios'

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

  return config
})