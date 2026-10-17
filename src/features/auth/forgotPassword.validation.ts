import type { FormikErrors } from 'formik'
import type { ForgotPasswordFormValues } from './auth.types'

export function validateForgotPassword(
  values: ForgotPasswordFormValues,
): FormikErrors<ForgotPasswordFormValues> {
  const errors: FormikErrors<ForgotPasswordFormValues> = {}

  if (!values.email.trim()) {
    errors.email = 'Введіть електронну пошту'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Введіть коректну адресу електронної пошти'
  }

  return errors
}