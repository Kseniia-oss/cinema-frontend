import { useEffect, useState } from 'react'
import axios from 'axios'
import { getMovies } from './movies.api'
import type { ApiMovie } from './movies.api'

function getCatalogError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    ) {
      return 'Сервер не відповів вчасно. Спробуй ще раз.'
    }

    if (!error.response) {
      return 'Не вдалося завантажити каталог. Перевір з’єднання та спробуй ще раз.'
    }

    return `Не вдалося завантажити каталог. Код відповіді: ${error.response.status}.`
  }

  return error instanceof Error
    ? error.message
    : 'Сталася помилка під час завантаження каталогу.'
}

export function useHomeMovies() {
  const [movies, setMovies] = useState<ApiMovie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    let active = true

    async function loadMovies() {
      try {
        const data = await getMovies()

        if (active) {
          setMovies(data)
          setError('')
        }
      } catch (requestError: unknown) {
        if (active) {
          setError(getCatalogError(requestError))
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadMovies()

    return () => {
      active = false
    }
  }, [requestNumber])

  const normalizedQuery = searchQuery
    .trim()
    .toLocaleLowerCase('uk-UA')

  const filteredMovies = movies.filter((movie) =>
    movie.title
      .toLocaleLowerCase('uk-UA')
      .includes(normalizedQuery),
  )

  function resetFilters() {
    setSearchQuery('')
  }

  function retryLoading() {
    setError('')
    setIsLoading(true)
    setRequestNumber((previous) => previous + 1)
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredMovies,
    totalMovies: movies.length,
    isLoading,
    error,
    resetFilters,
    retryLoading,
  }
}