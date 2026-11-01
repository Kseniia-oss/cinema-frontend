import { useState } from 'react'
import { useFormik } from 'formik'
import type { LoginFormValues } from './auth.types'
import { validateLogin } from './auth.validation'
import { loginUser } from './auth.api'
import { getAuthErrorMessage } from './auth.errors'

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      rememberMe: false,
    },

    validate: validateLogin,

    onSubmit: async (values, helpers) => {
      setNotice('')

      try {
        const user = await loginUser({
          userName: values.userName.trim(),
          email: values.email.trim(),
          password: values.password,
        })

        helpers.resetForm()

        setNotice(
          `Сервер підтвердив вхід користувача ${user.userName}. Збереження сесії ще не підключене.`,
        )
      } catch (error: unknown) {
        setNotice(getAuthErrorMessage(error))
      }
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