import { useState } from 'react'
import { useFormik } from 'formik'
import type { RegisterFormValues } from './auth.types'
import { validateRegister } from './register.validation'

export function useRegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notice, setNotice] = useState('')

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },

    validate: validateRegister,

    onSubmit: (_values, helpers) => {
      setNotice(
        'Сервер реєстрації ще не підключений. Акаунт не створено.',
      )

      helpers.setSubmitting(false)
    },
  })

  function togglePasswordVisibility() {
    setShowPassword((previousValue) => !previousValue)
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((previousValue) => !previousValue)
  }

  function handleGoogleRegister() {
    setNotice('Створення акаунта через Google ще не підключене.')
  }

  return {
    formik,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleGoogleRegister,
    notice,
  }
}