import type { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react'
import { EyeIcon, EyeSlashIcon } from './Icons'

interface PasswordFieldProps {
  name: string
  placeholder: string
  value: string
  visible: boolean
  error?: string
  hint?: ReactNode
  autoComplete?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
  onToggle: () => void
}

export default function PasswordField({
  name,
  placeholder,
  value,
  visible,
  error,
  hint,
  autoComplete = 'new-password',
  onChange,
  onBlur,
  onToggle,
}: PasswordFieldProps) {
  const errorId = `${name}-error`
  const hintId = `${name}-hint`
  const describedBy = [hint ? hintId : '', error ? errorId : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="auth-field">
      <label className="auth-sr-only" htmlFor={name}>
        {placeholder}
      </label>

      <div className="auth-input">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
        />

        <button
          type="button"
          className="auth-eye"
          onClick={onToggle}
          aria-controls={name}
          aria-label={`${visible ? 'Приховати' : 'Показати'}: ${placeholder}`}
        >
          {visible ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>

      {hint && (
        <p id={hintId} className="auth-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="auth-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}