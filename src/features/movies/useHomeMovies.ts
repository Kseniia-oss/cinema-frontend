import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'

export function useHomeMovies() {
  const movies = useAppSelector((state) => state.movies.items)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')

  const genres = Array.from(
    new Set(movies.map((movie) => movie.genre)),
  )

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('uk-UA')

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLocaleLowerCase('uk-UA')
      .includes(normalizedQuery)

    const matchesGenre =
      selectedGenre === '' || movie.genre === selectedGenre

    return matchesSearch && matchesGenre
  })

  function resetFilters() {
    setSearchQuery('')
    setSelectedGenre('')
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
    filteredMovies,
    resetFilters,
  }
}