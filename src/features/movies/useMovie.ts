import { useEffect, useState } from 'react'
import { apiError } from '../../api/apiError'
import { getMovie, type ApiMovie } from './movies.api'

interface MovieResult {
  id: string
  attempt: number
  movie?: ApiMovie
  error?: string
}

export function useMovie(id?: string) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<MovieResult>()

  useEffect(() => {
    if (!id) return

    let active = true

    getMovie(id)
      .then((movie) => {
        if (active) setResult({ id, attempt, movie })
      })
      .catch((cause: unknown) => {
        if (active) setResult({ id, attempt, error: apiError(cause) })
      })

    return () => {
      active = false
    }
  }, [id, attempt])

  const current =
    result?.id === id && result?.attempt === attempt
      ? result
      : undefined

  return {
    loading: Boolean(id && !current),
    movie: current?.movie,
    error: current?.error,
    retry: () => setAttempt((value) => value + 1),
  }
}