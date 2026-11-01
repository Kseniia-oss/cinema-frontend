import type { FormikErrors } from 'formik'
import type { LoginFormValues } from './auth.types'

export function validateLogin(
  values: LoginFormValues,
): FormikErrors<LoginFormValues> {
  const errors: FormikErrors<LoginFormValues> = {}

  if (!values.userName.trim()) {
    errors.userName = 'Введи ім’я користувача'
  } else if (values.userName.trim().length < 6) {
    errors.userName = 'Ім’я користувача має містити щонайменше 6 символів'
  }

  if (!values.email.trim()) {
    errors.email = 'Введи електронну пошту'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Введи коректну адресу електронної пошти'
  }

  if (!values.password) {
    errors.password = 'Введи пароль'
  } else if (values.password.length < 8) {
    errors.password = 'Пароль має містити щонайменше 8 символів'
  }

  return errors
}