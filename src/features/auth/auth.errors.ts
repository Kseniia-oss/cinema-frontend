import axios from 'axios'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function getAuthErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<unknown>(error)) {
    return error instanceof Error
      ? error.message
      : 'Сталася помилка. Спробуй ще раз.'
  }

  if (
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT'
  ) {
    return 'Сервер не відповів вчасно. Спробуй ще раз.'
  }

  if (!error.response) {
    return 'Не вдалося отримати відповідь сервера. Перевір з’єднання. Також причиною можуть бути налаштування CORS.'
  }

  const { status, data } = error.response

  if (status >= 500) {
    return 'Помилка на сервері. Спробуй пізніше.'
  }

  if (status === 401) {
    return 'Не вдалося увійти. Перевір ім’я користувача, пошту та пароль.'
  }

  if (status === 403) {
    return 'Сервер відмовив у доступі.'
  }

  if (status === 429) {
    return 'Забагато запитів. Зачекай і спробуй пізніше.'
  }

  if (typeof data === 'string' && data.trim()) {
    // Не показуємо користувачу HTML сторінки помилки.
    if (!data.trim().startsWith('<')) {
      return data
    }
  }

  if (isRecord(data)) {
    if (isRecord(data.errors)) {
      const messages = Object.values(data.errors).flatMap((value) => {
        if (typeof value === 'string') return [value]

        if (Array.isArray(value)) {
          return value.filter(
            (item): item is string => typeof item === 'string',
          )
        }

        return []
      })

      if (messages.length > 0) {
        return messages.join(' ')
      }
    }

    if (typeof data.message === 'string') {
      return data.message
    }

    if (typeof data.title === 'string') {
      return data.title
    }
  }

  return `Не вдалося виконати запит. Код помилки: ${status}.`
}