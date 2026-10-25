import { Link } from 'react-router'
import MovieCard from '../components/MovieCard'
import { useHomeMovies } from '../features/movies/useHomeMovies'
import './HomePage.css'

export default function HomePage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    genres,
    filteredMovies,
    resetFilters,
  } = useHomeMovies()

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-content">
          <p className="home-eyebrow">Твій вечір починається тут</p>

          <h1 id="home-title">Історії, які захоплюють</h1>

          <p className="home-hero-description">
            Знаходь фільми для свого настрою та відкривай нові історії.
          </p>

          <div className="home-hero-actions">
            <a href="#home-movies" className="home-button home-button-dark">
              Обрати фільм
            </a>

            <Link
              to="/register"
              className="home-button home-button-light"
            >
              Створити акаунт
            </Link>
          </div>
        </div>

        <div className="home-hero-placeholder" aria-hidden="true">
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="m10 8 6 4-6 4V8Z" />
          </svg>
        </div>
      </section>

      <section
        id="home-movies"
        className="home-movies"
        aria-labelledby="movies-title"
      >
        <div className="home-section-heading">
          <div>
            <h2 id="movies-title">Обери, що подивитися</h2>
            <p>Демонстраційна добірка — вигадані фільми та рейтинги.</p>
          </div>
        </div>

        <div className="home-filters">
          <div className="home-filter-field">
            <label htmlFor="movie-search">Пошук за назвою</label>

            <input
              id="movie-search"
              type="search"
              placeholder="Введіть назву фільму"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="home-filter-field">
            <label htmlFor="movie-genre">Жанр</label>

            <select
              id="movie-genre"
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
            >
              <option value="">Усі жанри</option>

              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="home-button home-button-light"
            onClick={resetFilters}
          >
            Скинути
          </button>
        </div>

        <p className="home-results-count" role="status">
          Знайдено: {filteredMovies.length}
        </p>

        {filteredMovies.length > 0 ? (
          <div className="home-movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="home-empty">
            <h3>Нічого не знайдено</h3>
            <p>Спробуйте іншу назву або змініть жанр.</p>

            <button
              type="button"
              className="home-button home-button-dark"
              onClick={resetFilters}
            >
              Показати всі фільми
            </button>
          </div>
        )}
      </section>
    </div>
  )
}