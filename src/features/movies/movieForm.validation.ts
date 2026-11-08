import type { FormikErrors } from 'formik'

export interface MovieFormValues {
  title: string
  year: number | string
  description: string
}

export function validateMovieForm(
  values: MovieFormValues,
): FormikErrors<MovieFormValues> {
  const errors: FormikErrors<MovieFormValues> = {}

  if (!values.title.trim()) {
    errors.title = 'Введи назву фільму.'
  }

  const year = Number(values.year)

  if (!Number.isInteger(year) || year < 1888 || year > 2100) {
    errors.year = 'Вкажи рік від 1888 до 2100.'
  }

  return errors
}