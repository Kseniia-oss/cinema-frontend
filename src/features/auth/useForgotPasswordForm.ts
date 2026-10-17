import { useState } from 'react'
import { useFormik } from 'formik'
import type { ForgotPasswordFormValues } from './auth.types'
import { validateForgotPassword } from './forgotPassword.validation'

export function useForgotPasswordForm() {
  const [notice, setNotice] = useState('')

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: '',
    },

    validate: validateForgotPassword,

    onSubmit: (_values, helpers) => {
      setNotice(
        'Сервер відновлення пароля ще не підключений. Лист не надіслано.',
      )

      helpers.setSubmitting(false)
    },
  })

  return {
    formik,
    notice,
  }
}