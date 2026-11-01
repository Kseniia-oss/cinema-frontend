import { apiClient } from '../../api/apiClient'

export interface ApiMovie {
  id: number
  title: string
  description: string
  year: number
  rating: number
}

function isApiMovie(value: unknown): value is ApiMovie {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  return (
    'id' in value &&
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    'title' in value &&
    typeof value.title === 'string' &&
    'description' in value &&
    typeof value.description === 'string' &&
    'year' in value &&
    typeof value.year === 'number' &&
    Number.isInteger(value.year) &&
    'rating' in value &&
    typeof value.rating === 'number' &&
    Number.isFinite(value.rating)
  )
}

export async function getMovies(): Promise<ApiMovie[]> {
  const response = await apiClient.get<unknown>('/api/Film/GetAll')

  if (
    !Array.isArray(response.data) ||
    !response.data.every(isApiMovie)
  ) {
    throw new Error('Сервер повернув неочікуваний формат каталогу.')
  }

  return response.data.map((movie) => ({
    id: movie.id,
    title: movie.title,
    description: movie.description,
    year: movie.year,
    rating: movie.rating,
  }))
}