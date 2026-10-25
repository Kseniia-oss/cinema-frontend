import { Link } from 'react-router'
import { useCreateMovieForm } from '../features/movies/useCreateMovieForm'
import type { MovieFormValues } from '../features/movies/movieForm.validation'
import './AdminPage.css'
import './MovieForm.css'

const fields = [
  { name: 'title', label: 'Назва фільму', type: 'text' },
  { name: 'year', label: 'Рік випуску', type: 'number' },
  { name: 'genre', label: 'Жанр', type: 'text' },
  {
    name: 'durationMinutes',
    label: 'Тривалість у хвилинах',
    type: 'number',
  },
] as const

export default function CreateMoviePage() {
  const { formik, isEditing, notFound } = useCreateMovieForm()

  function getError(name: keyof MovieFormValues) {
    return formik.touched[name] ? formik.errors[name] : undefined
  }

  const descriptionError = getError('description')

  if (notFound) {
    return (
      <section className="admin-page">
        <h1>Фільм не знайдено</h1>

        <p>
          Можливо, фільм було видалено або демонстраційні дані
          скинулися після перезавантаження сторінки.
        </p>

        <div>
          <Link to="/admin" className="admin-back">
            До адмінпанелі
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-heading">
        <div>
          <p className="admin-eyebrow">Керування контентом</p>
          <h1>{isEditing ? 'Редагувати фільм' : 'Додати фільм'}</h1>
        </div>

        <Link to="/admin" className="admin-back">
          До адмінпанелі
        </Link>
      </header>

      <p className="admin-notice">
        Демонстраційний режим. Зміни зберігаються лише в пам’яті
        застосунку. Після перезавантаження сторінки вони зникнуть.
      </p>

      <form
        className="movie-form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="movie-form-grid">
          {fields.map((field) => {
            const error = getError(field.name)
            const id = `movie-${field.name}`

            return (
              <div className="movie-form-field" key={field.name}>
                <label htmlFor={id}>{field.label}</label>

                <input
                  id={id}
                  name={field.name}
                  type={field.type}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                />

                {error && (
                  <p
                    id={`${id}-error`}
                    className="movie-form-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="movie-form-field">
          <label htmlFor="movie-description">Опис</label>

          <textarea
            id="movie-description"
            name="description"
            rows={5}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            aria-invalid={Boolean(descriptionError)}
            aria-describedby={
              descriptionError ? 'movie-description-error' : undefined
            }
          />

          {descriptionError && (
            <p
              id="movie-description-error"
              className="movie-form-error"
              role="alert"
            >
              {descriptionError}
            </p>
          )}
        </div>

        <div className="movie-form-actions">
          <button
            type="submit"
            className="movie-form-submit"
            disabled={formik.isSubmitting}
          >
            {isEditing ? 'Зберегти зміни' : 'Додати фільм'}
          </button>

          <Link to="/admin" className="admin-back">
            Скасувати
          </Link>
        </div>
      </form>
    </div>
  )
}