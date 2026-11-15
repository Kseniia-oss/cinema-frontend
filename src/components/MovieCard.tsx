import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router'
import { apiClient } from '../api/apiClient'
import type { ApiMovie } from '../features/movies/movies.api'

interface MovieCardProps {
  movie: ApiMovie
}

function MoviePoster({ movieId }: { movieId: string }) {
  const [src, setSrc] = useState('')
  const [message, setMessage] = useState('Завантажуємо постер…')

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl: string | undefined

    async function loadPoster() {
      try {
        const response = await apiClient.get<Blob>('/api/Poster/Get', {
          params: { id: movieId },
          responseType: 'blob',
          headers: { Accept: 'image/*, application/octet-stream' },
          signal: controller.signal,
        })

        if (controller.signal.aborted) return

        if (response.status === 204 || !response.data.size) {
          setMessage('Постера поки немає')
          return
        }

        objectUrl = URL.createObjectURL(response.data)
        setSrc(objectUrl)
      } catch (error: unknown) {
        if (controller.signal.aborted) return

        setMessage(
          axios.isAxiosError(error) && error.response?.status === 404
            ? 'Постера поки немає'
            : 'Не вдалося завантажити постер',
        )
      }
    }

    void loadPoster()

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [movieId])

  return (
    <div
      className="movie-card-poster"
      style={{ aspectRatio: '2 / 3', overflow: 'hidden' }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onError={() => {
            setSrc('')
            setMessage('Не вдалося показати зображення')
          }}
        />
      ) : (
        <span>{message}</span>
      )}
    </div>
  )
}

export default function MovieCard({ movie }: MovieCardProps) {
  const title = movie.title.trim() || 'Без назви'
  const rating = movie.rating?.toFixed(1)

  return (
    <article className="movie-card">
      <MoviePoster key={movie.id} movieId={String(movie.id)} />

      <div className="movie-card-content">
        <div className="movie-card-meta">
          <span>{movie.year > 0 ? movie.year : 'Рік не вказано'}</span>
          <span aria-label={`Рейтинг: ${rating ?? 'не вказано'}`}>
            ★ {rating ?? '—'}
          </span>
        </div>

        <h3>
          <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
            {title}
          </Link>
        </h3>

        <p className="movie-card-description">
          {movie.description.trim() || 'Опис поки відсутній.'}
        </p>
      </div>
    </article>
  )
}