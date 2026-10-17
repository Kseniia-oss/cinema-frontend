import type { FormikErrors } from 'formik'
import type { RegisterFormValues } from './auth.types'

export function validateRegister(
  values: RegisterFormValues,
): FormikErrors<RegisterFormValues> {
  const errors: FormikErrors<RegisterFormValues> = {}

  if (!values.name.trim()) {
    errors.name = 'Введіть ім’я'
  }

  if (!values.email.trim()) {
    errors.email = 'Введіть електронну пошту'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Введіть коректну адресу електронної пошти'
  }

  if (!values.password) {
    errors.password = 'Введіть пароль'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Повторіть пароль'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Паролі не збігаються'
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'Підтвердьте прийняття умов користування'
  }

  return errors
}