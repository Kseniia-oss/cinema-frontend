import { useState } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import { useAppDispatch } from '../../app/hooks'
import type { LoginFormValues } from './auth.types'
import { validateLogin } from './auth.validation'
import { loginUser } from './auth.api'
import { getAuthErrorMessage } from './auth.errors'
import { saveSession } from './auth.session'
import { sessionStarted } from './authSlice'

export function useLoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
        const session = await loginUser({
          userName: values.userName.trim(),
          email: values.email.trim(),
          password: values.password,
        })

        saveSession(session)
        dispatch(sessionStarted(session))

        helpers.resetForm()
        navigate('/', { replace: true })
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