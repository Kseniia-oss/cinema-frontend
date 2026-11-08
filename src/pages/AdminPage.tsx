import { Link } from 'react-router'
import { useAdminMovies } from '../features/movies/useAdminMovies'
import './AdminPage.css'

export default function AdminPage() {
  const {
    searchQuery,
    setSearchQuery,
    filteredMovies,
    totalMovies,
    isLoading,
    error,
    retryLoading,
    deleting,
    handleDeleteMovie,
    notice,
  } = useAdminMovies()

  return (
    <div className="admin-page">
      <header className="admin-heading">
        <div>
          <p className="admin-eyebrow">Керування контентом</p>
          <h1>Адмінпанель</h1>
        </div>

        <Link to="/" className="admin-back">На головну</Link>
      </header>

      <div>
        <Link to="/admin/movies/new" className="admin-back">
          Додати фільм
        </Link>
      </div>

      <div role="status" aria-live="polite">
        {notice && <p className="admin-notice">{notice}</p>}
      </div>

      <section className="admin-catalog" aria-labelledby="admin-catalog-title">
        <div className="admin-catalog-heading">
          <h2 id="admin-catalog-title">Каталог фільмів</h2>

          <div className="admin-search">
            <label htmlFor="admin-search">Пошук за назвою</label>
            <input
              id="admin-search"
              type="search"
              placeholder="Введіть назву фільму"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <p role="status">Завантажуємо каталог…</p>
        ) : error ? (
          <div className="admin-empty">
            <p role="alert">{error}</p>
            <button type="button" onClick={retryLoading}>
              Спробувати ще раз
            </button>
          </div>
        ) : (
          <>
            <p className="admin-results" role="status">
              Знайдено: {filteredMovies.length}
            </p>

            {filteredMovies.length > 0 ? (
              <ul className="admin-movie-list">
                {filteredMovies.map((movie) => (
                  <li key={movie.id} className="admin-movie">
                    <div className="admin-movie-heading">
                      <h3>{movie.title || 'Без назви'}</h3>
                      <span className="admin-movie-id">ID: {movie.id}</span>
                    </div>

                    <dl className="admin-movie-details">
                      <div>
                        <dt>Рік</dt>
                        <dd>{movie.year || '—'}</dd>
                      </div>
                      <div>
                        <dt>Рейтинг</dt>
                        <dd>{movie.rating?.toFixed(1) ?? '—'}</dd>
                      </div>
                    </dl>

                    <div className="admin-movie-actions">
                      <Link
                        to={`/admin/movies/${encodeURIComponent(movie.id)}/edit`}
                        className="admin-back"
                        aria-label={`Редагувати фільм «${movie.title}»`}
                      >
                        Редагувати
                      </Link>

                      <button
                        type="button"
                        className="admin-delete"
                        disabled={deleting}
                        onClick={() => handleDeleteMovie(movie)}
                        aria-label={`Видалити фільм «${movie.title}»`}
                      >
                        Видалити
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : totalMovies === 0 ? (
              <div className="admin-empty">
                <h3>Каталог поки порожній</h3>
                <p>Натисни «Додати фільм», щоб створити перший запис.</p>
              </div>
            ) : (
              <div className="admin-empty">
                <h3>Фільмів не знайдено</h3>
                <p>Спробуй іншу назву або очисть пошук.</p>
                <button type="button" onClick={() => setSearchQuery('')}>
                  Очистити пошук
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}