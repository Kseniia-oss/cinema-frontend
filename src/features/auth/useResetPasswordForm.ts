import { useState } from 'react'
import { useFormik, type FormikErrors } from 'formik'
import { useSearchParams } from 'react-router'
import { apiError } from '../../api/apiError'
import { resetPassword, type ResetValues } from './passwordRecovery.api'

export function useResetPasswordForm() {
  const [params] = useSearchParams()
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')

  const formik = useFormik<ResetValues>({
    initialValues: {
      email: params.get('email') ?? '',
      token: params.get('token') ?? '',
      password: '',
      confirmPassword: '',
    },

    validate(values) {
      const errors: FormikErrors<ResetValues> = {}

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = 'Введи коректну адресу.'
      }

      if (!values.token.trim()) {
        errors.token = 'Встав код із листа для відновлення пароля.'
      }

      const password = values.password

      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
      ) {
        errors.password =
          'Мінімум 8 символів: велика й мала латинські літери, цифра та спецсимвол.'
      }

      if (!values.confirmPassword || password !== values.confirmPassword) {
        errors.confirmPassword = 'Паролі не збігаються.'
      }

      return errors
    },

    async onSubmit(values, helpers) {
      setError('')

      try {
        await resetPassword(values)
        helpers.resetForm({
          values: {
            email: '',
            token: '',
            password: '',
            confirmPassword: '',
          },
        })
        setComplete(true)
      } catch (cause: unknown) {
        setError(apiError(cause))
      }
    },
  })

  return { formik, error, complete }
}