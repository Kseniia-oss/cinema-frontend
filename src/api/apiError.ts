import axios from 'axios'

export function apiError(cause: unknown): string {
  if (!axios.isAxiosError(cause)) {
    return cause instanceof Error
      ? cause.message
      : 'Не вдалося виконати запит.'
  }

  if (!cause.response) {
    if (cause.code === 'ECONNABORTED' || cause.code === 'ETIMEDOUT') {
      return 'Сервер не відповів вчасно. Спробуй ще раз.'
    }

    return 'Немає відповіді сервера. Перевір з’єднання.'
  }

  const { status, data } = cause.response

  if (status === 401) {
    return 'Потрібно увійти в акаунт. Якщо ти вже входила, увійди знову.'
  }

  if (status === 403) {
    return 'Недостатньо прав для цієї дії.'
  }

  if (status >= 500) {
    return `Помилка сервера (${status}). Спробуй пізніше.`
  }

  const message =
    typeof data === 'string'
      ? data
      : Object.values(data?.errors ?? {})
          .flat()
          .filter((value) => typeof value === 'string')
          .join(' ') ||
        data?.message ||
        data?.title

  if (
    typeof message === 'string' &&
    message.trim() &&
    !message.trim().startsWith('<')
  ) {
    return `${message.trim().slice(0, 400)} (${status})`
  }

  return status === 404
    ? 'Запис не знайдено (404).'
    : `Запит відхилено (${status}).`
}