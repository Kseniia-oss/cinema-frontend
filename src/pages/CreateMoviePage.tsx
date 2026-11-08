import { Link } from 'react-router'
import { useCreateMovieForm } from '../features/movies/useCreateMovieForm'
import './AdminPage.css'
import './MovieForm.css'

const fields = [
  { name: 'title', label: 'Назва фільму', type: 'text' },
  { name: 'year', label: 'Рік випуску', type: 'number' },
] as const

export default function CreateMoviePage() {
  const { formik, isEditing, detail, submitError } = useCreateMovieForm()

  if (detail.loading) {
    return <p role="status">Завантажуємо фільм…</p>
  }

  if (detail.error) {
    return (
      <section className="admin-page">
        <p role="alert">{detail.error}</p>
        <button type="button" onClick={detail.retry}>
          Спробувати ще раз
        </button>
        <Link to="/admin" className="admin-back">До адмінпанелі</Link>
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

        <Link to="/admin" className="admin-back">До адмінпанелі</Link>
      </header>

      {submitError && (
        <p className="admin-notice" role="alert">{submitError}</p>
      )}

      <form className="movie-form" onSubmit={formik.handleSubmit} noValidate>
        <div className="movie-form-grid">
          {fields.map((field) => {
            const id = `movie-${field.name}`
            const error = formik.touched[field.name]
              ? formik.errors[field.name]
              : undefined

            return (
              <div className="movie-form-field" key={field.name}>
                <label htmlFor={id}>{field.label}</label>
                <input
                  id={id}
                  type={field.type}
                  {...formik.getFieldProps(field.name)}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                />

                {error && (
                  <p id={`${id}-error`} className="movie-form-error" role="alert">
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
            rows={5}
            {...formik.getFieldProps('description')}
          />
        </div>

        <div className="movie-form-actions">
          <button
            type="submit"
            className="movie-form-submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? 'Зберігаємо…'
              : isEditing ? 'Зберегти зміни' : 'Додати фільм'}
          </button>

          <Link to="/admin" className="admin-back">Скасувати</Link>
        </div>
      </form>
    </div>
  )
}