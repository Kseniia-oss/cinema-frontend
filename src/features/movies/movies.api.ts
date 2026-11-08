import { apiClient } from '../../api/apiClient'

export interface FilmInput {
  title: string
  description: string
  year: number
}

export interface ApiMovie extends FilmInput {
  id: string
  rating: number | null
}

function parseFilm(data: unknown): ApiMovie {
  if (!data || typeof data !== 'object') {
    throw new Error('Некоректна відповідь каталогу.')
  }

  const film = data as Record<string, unknown>

  const validId =
    (typeof film.id === 'string' && film.id.trim() !== '') ||
    (typeof film.id === 'number' && Number.isSafeInteger(film.id))

  if (
    !validId ||
    typeof film.year !== 'number' ||
    !Number.isInteger(film.year) ||
    !(typeof film.title === 'string' || film.title === null) ||
    !(typeof film.description === 'string' || film.description === null) ||
    !(
      film.rating == null ||
      (typeof film.rating === 'number' && Number.isFinite(film.rating))
    )
  ) {
    throw new Error('Сервер повернув невідомий формат фільму.')
  }

  return {
    id: String(film.id),
    title: film.title ?? '',
    description: film.description ?? '',
    year: film.year,
    rating: film.rating ?? null,
  }
}

export async function getMovies(): Promise<ApiMovie[]> {
  const { data } = await apiClient.get<unknown>('/api/Film/GetAll')

  if (!Array.isArray(data)) {
    throw new Error('Сервер повернув невідомий формат каталогу.')
  }

  return data.map(parseFilm)
}

export async function getMovie(id: string): Promise<ApiMovie> {
  const { data } = await apiClient.get<unknown>('/api/Film/Get', {
    params: { id },
  })

  const movie = parseFilm(data)

  if (movie.id !== id) {
    throw new Error('Сервер повернув інший фільм.')
  }

  return movie
}

export async function createMovie(input: FilmInput): Promise<void> {
  await apiClient.post('/api/Film/Create', input)
}

export async function updateMovie(
  id: string,
  input: FilmInput,
): Promise<void> {
  await apiClient.put('/api/Film/Update', input, {
    params: { id },
  })
}

export async function deleteMovie(id: string): Promise<void> {
  await apiClient.delete('/api/Film/Delete', {
    params: { id },
  })
}