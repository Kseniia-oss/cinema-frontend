import type { Movie } from '../features/movies/movie.types'

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card-poster" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" />
        </svg>

        <span>Постер</span>
      </div>

      <div className="movie-card-content">
        <div className="movie-card-meta">
          <span>{movie.year}</span>
          <span aria-label={`Рейтинг ${movie.rating} із 10`}>
            ★ {movie.rating.toFixed(1)}
          </span>
        </div>

        <h3>{movie.title}</h3>

        <p className="movie-card-details">
          {movie.genre} · {movie.durationMinutes} хв
        </p>

        <p className="movie-card-description">
          {movie.description}
        </p>
      </div>
    </article>
  )
}