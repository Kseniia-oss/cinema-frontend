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
      const email = values.email.trim()

      try {
        await registerUser({
          userName: values.name.trim(),
          email,
          password: values.password,
        })

        helpers.resetForm()
        setShowPassword(false)
        setShowConfirmPassword(false)
        setNotice(
          `Акаунт створено. Перевір пошту ${email} і підтвердь адресу за посиланням із листа.`,
        )
      } catch (error: unknown) {
        setNotice(getAuthErrorMessage(error))
      }
    },
  })

  function togglePasswordVisibility() {
    setShowPassword((visible) => !visible)
  }

  function toggleConfirmPasswordVisibility() {
    setShowConfirmPassword((visible) => !visible)
  }

  return {
    formik,
    showPassword,
    showConfirmPassword,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    notice,
  }
}