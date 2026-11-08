import { useState } from 'react'
import { useFormik } from 'formik'
import { apiError } from '../../api/apiError'
import type { ForgotPasswordFormValues } from './auth.types'
import { validateForgotPassword } from './forgotPassword.validation'
import { requestPasswordReset } from './passwordRecovery.api'

export function useForgotPasswordForm() {
  const [notice, setNotice] = useState('')

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: '',
    },

    validate: validateForgotPassword,

    onSubmit: async (values) => {
      setNotice('')

      try {
        await requestPasswordReset(values.email.trim())
        setNotice(
          'Якщо акаунт із такою адресою існує, перевір пошту та папку «Спам».',
        )
      } catch (cause: unknown) {
        setNotice(apiError(cause))
      }
    },
  })

  return { formik, notice }
}