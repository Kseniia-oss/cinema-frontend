import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { movieDeleted } from './moviesSlice'
import type { Movie } from './movie.types'

export function useAdminMovies() {
  const dispatch = useAppDispatch()
  const movies = useAppSelector((state) => state.movies.items)

  const [searchQuery, setSearchQuery] = useState('')
  const [notice, setNotice] = useState('')

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('uk-UA')

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLocaleLowerCase('uk-UA').includes(normalizedQuery),
  )

  const totalMovies = movies.length
  const totalGenres = new Set(
    movies.map((movie) => movie.genre),
  ).size

  function handleDeleteMovie(movie: Movie) {
    const confirmed = window.confirm(
      `Видалити фільм «${movie.title}» з демонстраційного каталогу?`,
    )

    if (!confirmed) {
      return
    }

    dispatch(movieDeleted(movie.id))
    setNotice(`Фільм «${movie.title}» видалено з демонстраційного каталогу.`)
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredMovies,
    totalMovies,
    totalGenres,
    handleDeleteMovie,
    notice,
  }
}