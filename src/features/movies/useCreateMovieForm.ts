import { useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router'
import { apiError } from '../../api/apiError'
import { createMovie, updateMovie } from './movies.api'
import {
  validateMovieForm,
  type MovieFormValues,
} from './movieForm.validation'
import { useMovie } from './useMovie'

export function useCreateMovieForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const detail = useMovie(id)
  const [submitError, setSubmitError] = useState('')

  const formik = useFormik<MovieFormValues>({
    initialValues: {
      title: detail.movie?.title ?? '',
      description: detail.movie?.description ?? '',
      year: detail.movie?.year || '',
    },

    enableReinitialize: true,
    validate: validateMovieForm,

    onSubmit: async (values) => {
      if (id && !detail.movie) return

      setSubmitError('')

      const input = {
        title: values.title.trim(),
        description: values.description.trim(),
        year: Number(values.year),
      }

      try {
        if (id) {
          await updateMovie(id, input)
        } else {
          await createMovie(input)
        }

        navigate('/admin', { replace: true })
      } catch (cause: unknown) {
        setSubmitError(apiError(cause))
      }
    },
  })

  return {
    formik,
    isEditing: id !== undefined,
    detail,
    submitError,
  }
}