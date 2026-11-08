import type { ChangeEventHandler, FocusEventHandler, HTMLInputTypeAttribute } from 'react'

interface AuthFieldProps {
  name: string
  placeholder: string
  value: string
  type?: HTMLInputTypeAttribute
  autoComplete?: string
  error?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur: FocusEventHandler<HTMLInputElement>
}

export default function AuthField({
  name,
  placeholder,
  value,
  type = 'text',
  autoComplete,
  error,
  onChange,
  onBlur,
}: AuthFieldProps) {
  const errorId = `${name}-error`

  return (
    <div className="auth-field">
      <label className="auth-sr-only" htmlFor={name}>
        {placeholder}
      </label>

      <div className="auth-input">
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          autoCapitalize="none"
          spellCheck={false}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      {error && (
        <p id={errorId} className="auth-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}