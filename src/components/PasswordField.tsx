import type { ChangeEventHandler, FocusEventHandler } from 'react'

interface PasswordFieldProps {
  name: string
  placeholder: string
  value: string
  visible: boolean
  error?: string
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
  onChange,
  onBlur,
  onToggle,
}: PasswordFieldProps) {
  const errorId = `${name}-error`

  return (
    <div className="login-field">
      <label className="login-sr-only" htmlFor={name}>
        {placeholder}
      </label>

      <div className="login-password">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />

        <button
          type="button"
          className="login-eye"
          onClick={onToggle}
          aria-controls={name}
          aria-label={
            `${visible ? 'Приховати' : 'Показати'}: ${placeholder}`
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {!visible && <path d="m4 4 16 16" />}
          </svg>
        </button>
      </div>

      {error && (
        <p id={errorId} className="login-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}