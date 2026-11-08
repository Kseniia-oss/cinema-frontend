import { useEffect, useState } from 'react'
import { apiError } from '../../api/apiError'
import { getMovies, type ApiMovie } from './movies.api'

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
      } catch (cause: unknown) {
        if (active) setError(apiError(cause))
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadMovies()

    return () => {
      active = false
    }
  }, [requestNumber])

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('uk-UA')

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLocaleLowerCase('uk-UA').includes(normalizedQuery),
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