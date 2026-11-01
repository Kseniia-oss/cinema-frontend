import { useState } from 'react'
import { useFormik } from 'formik'
import type { RegisterFormValues } from './auth.types'
import { validateRegister } from './register.validation'
import { registerUser } from './auth.api'
import { getAuthErrorMessage } from './auth.errors'

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

    onSubmit: async (values, helpers) => {
      setNotice('')

      try {
        await registerUser({
          userName: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        })

        helpers.resetForm()

        setNotice(
          'Акаунт успішно створено на сервері. Можеш перейти на сторінку входу. Збереження сесії ще не підключене.',
        )
      } catch (error: unknown) {
        setNotice(getAuthErrorMessage(error))
      }
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