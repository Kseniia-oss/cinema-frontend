import { useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import type { RegisterFormValues } from './auth.types'
import { validateRegister } from './register.validation'
import { registerUser } from './auth.api'
import { getAuthErrorMessage } from './auth.errors'
import { saveSession } from './auth.session'
import { sessionStarted } from './authSlice'

export function useRegisterForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
      let accountCreated = false

      try {
        const session = await registerUser({
          userName: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        })

        accountCreated = true

        saveSession(session)
        dispatch(sessionStarted(session))

        helpers.resetForm()
        navigate('/', { replace: true })
      } catch (error: unknown) {
        const message = getAuthErrorMessage(error)

        setNotice(
          accountCreated
            ? `Акаунт створено, але автоматичний вхід не завершено. ${message} Перейди на сторінку входу.`
            : message,
        )
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