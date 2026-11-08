import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { apiError } from '../../api/apiError'
import type { ForgotPasswordFormValues } from './auth.types'
import { validateForgotPassword } from './forgotPassword.validation'
import { requestPasswordReset } from './passwordRecovery.api'

const RESEND_DELAY = 30

export function useForgotPasswordForm() {
  const [notice, setNotice] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [resending, setResending] = useState(false)

  // Зворотний відлік до можливості надіслати лист повторно
  useEffect(() => {
    if (secondsLeft <= 0) return

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: '',
    },

    validate: validateForgotPassword,

    onSubmit: async (values) => {
      setNotice('')
      const email = values.email.trim()

      try {
        await requestPasswordReset(email)
        setSentTo(email)
        setSecondsLeft(RESEND_DELAY)
      } catch (cause: unknown) {
        setNotice(apiError(cause))
      }
    },
  })

  async function resend() {
    if (!sentTo || secondsLeft > 0 || resending) return

    setResending(true)
    setNotice('')

    try {
      await requestPasswordReset(sentTo)
      setSecondsLeft(RESEND_DELAY)
      setNotice('Лист надіслано ще раз.')
    } catch (cause: unknown) {
      setNotice(apiError(cause))
    } finally {
      setResending(false)
    }
  }

  return {
    formik,
    notice,
    sent: Boolean(sentTo),
    secondsLeft,
    resending,
    resend,
  }
}