import { Link, useParams } from 'react-router'
import { useMovie } from '../features/movies/useMovie'
import './HomePage.css'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const { movie, loading, error, retry } = useMovie(id)

  return (
    <section className="home-page">
      <Link to="/#home-movies">До каталогу</Link>

      {loading && <p role="status">Завантажуємо фільм…</p>}

      {error && (
        <div className="home-empty">
          <p role="alert">{error}</p>
          <button type="button" onClick={retry}>
            Спробувати ще раз
          </button>
        </div>
      )}

      {movie && (
        <article className="home-hero-content">
          <p className="home-eyebrow">Про фільм</p>
          <h1>{movie.title || 'Без назви'}</h1>
          <p>
            {movie.year || 'Рік не вказано'}
            {' · '}
            Рейтинг: {movie.rating?.toFixed(1) ?? '—'}
          </p>
          <p className="home-hero-description">
            {movie.description || 'Опис поки відсутній.'}
          </p>
        </article>
      )}
    </section>
  )
}