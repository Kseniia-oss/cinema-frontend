import type { FormikErrors } from 'formik'

export interface MovieFormValues {
  title: string
  year: string | number
  genre: string
  durationMinutes: string | number
  description: string
}

export function validateMovieForm(
  values: MovieFormValues,
): FormikErrors<MovieFormValues> {
  const errors: FormikErrors<MovieFormValues> = {}

  if (!values.title.trim()) {
    errors.title = 'Введіть назву фільму.'
  }

  const yearText = String(values.year).trim()
  const year = Number(yearText)

  if (!yearText) {
    errors.year = 'Введіть рік випуску.'
  } else if (!Number.isInteger(year) || year < 1888 || year > 2100) {
    errors.year = 'Введіть цілий рік від 1888 до 2100.'
  }

  if (!values.genre.trim()) {
    errors.genre = 'Введіть жанр.'
  }

  const durationText = String(values.durationMinutes).trim()
  const duration = Number(durationText)

  if (!durationText) {
    errors.durationMinutes = 'Введіть тривалість.'
  } else if (!Number.isInteger(duration) || duration <= 0) {
    errors.durationMinutes =
      'Введіть цілу кількість хвилин, більшу за 0.'
  }

  if (!values.description.trim()) {
    errors.description = 'Додайте опис фільму.'
  }

  return errors
}