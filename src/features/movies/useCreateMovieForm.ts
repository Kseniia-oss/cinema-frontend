import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { movieAdded, movieUpdated } from './moviesSlice'
import { validateMovieForm } from './movieForm.validation'
import type { MovieFormValues } from './movieForm.validation'

export function useCreateMovieForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const movies = useAppSelector((state) => state.movies.items)

  const isEditing = id !== undefined
  const movie = movies.find((item) => item.id === Number(id))
  const notFound = isEditing && !movie

  const formik = useFormik<MovieFormValues>({
    initialValues: {
      title: movie?.title ?? '',
      year: movie?.year ?? '',
      genre: movie?.genre ?? '',
      durationMinutes: movie?.durationMinutes ?? '',
      description: movie?.description ?? '',
    },

    enableReinitialize: true,
    validate: validateMovieForm,

    onSubmit: (values, helpers) => {
      if (notFound) {
        helpers.setSubmitting(false)
        return
      }

      const movieData = {
        title: values.title.trim(),
        year: Number(values.year),
        genre: values.genre.trim(),
        durationMinutes: Number(values.durationMinutes),
        description: values.description.trim(),
      }

      if (isEditing && movie) {
        dispatch(
          movieUpdated({
            ...movie,
            ...movieData,
          }),
        )
      } else {
        const nextId =
          movies.reduce(
            (maximum, item) => Math.max(maximum, item.id),
            0,
          ) + 1

        dispatch(
          movieAdded({
            ...movieData,
            id: nextId,
            rating: 0,
          }),
        )
      }

      helpers.setSubmitting(false)
      navigate('/admin')
    },
  })

  return {
    formik,
    isEditing,
    notFound,
  }
}