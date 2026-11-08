import { useState } from 'react'
import { apiError } from '../../api/apiError'
import { deleteMovie, type ApiMovie } from './movies.api'
import { useHomeMovies } from './useHomeMovies'

export function useAdminMovies() {
  const catalog = useHomeMovies()
  const [deleting, setDeleting] = useState(false)
  const [notice, setNotice] = useState('')

  async function handleDeleteMovie(movie: ApiMovie) {
    if (deleting) return

    const confirmed = window.confirm(
      `Видалити фільм «${movie.title}» із каталогу?`,
    )

    if (!confirmed) return

    setDeleting(true)
    setNotice('')

    try {
      await deleteMovie(movie.id)
      setNotice(`Фільм «${movie.title}» видалено.`)
      catalog.retryLoading()
    } catch (cause: unknown) {
      setNotice(apiError(cause))
    } finally {
      setDeleting(false)
    }
  }

  return {
    ...catalog,
    deleting,
    notice,
    handleDeleteMovie,
  }
}