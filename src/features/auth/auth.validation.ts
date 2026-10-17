import type { FormikErrors } from 'formik'
import type { LoginFormValues } from './auth.types'

export function validateLogin(
  values: LoginFormValues,
): FormikErrors<LoginFormValues> {
  const errors: FormikErrors<LoginFormValues> = {}

  if (!values.email.trim()) {
    errors.email = 'Введи електронну пошту'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Введи коректну адресу електронної пошти'
  }

  if (!values.password) {
    errors.password = 'Введи пароль'
  }

  return errors
}