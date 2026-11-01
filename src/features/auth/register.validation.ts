import type { FormikErrors } from 'formik'
import type { RegisterFormValues } from './auth.types'

export function validateRegister(
  values: RegisterFormValues,
): FormikErrors<RegisterFormValues> {
  const errors: FormikErrors<RegisterFormValues> = {}

  if (!values.name.trim()) {
    errors.name = 'Введи ім’я користувача'
  } else if (values.name.trim().length < 6) {
    errors.name = 'Ім’я користувача має містити щонайменше 6 символів'
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
  } else if (
    !/[a-z]/.test(values.password) ||
    !/[A-Z]/.test(values.password) ||
    !/[0-9]/.test(values.password) ||
    !/[^a-zA-Z0-9]/.test(values.password)
  ) {
    errors.password =
      'Додай велику й маленьку латинські літери, цифру та спеціальний символ'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Повтори пароль'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Паролі не збігаються'
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'Потрібно прийняти умови користування'
  }

  return errors
}