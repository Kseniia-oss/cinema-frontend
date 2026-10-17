import { useState } from 'react'
import { useFormik } from 'formik'
import type { LoginFormValues } from './auth.types'
import { validateLogin } from './auth.validation'

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },

    validate: validateLogin,

    onSubmit: (_values, helpers) => {
      setNotice(
        'Сервер авторизації ще не підключений. Вхід не виконано.',
      )

      helpers.setSubmitting(false)
    },
  })

  function togglePasswordVisibility() {
    setShowPassword((previousValue) => !previousValue)
  }

  function handleGoogleLogin() {
    setNotice('Вхід через Google ще не підключений.')
  }

  return {
    formik,
    showPassword,
    togglePasswordVisibility,
    handleGoogleLogin,
    notice,
  }
}