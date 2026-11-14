import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { apiClient } from '../../api/apiClient'

interface Props {
  movieId: string
}

export default function MovieVideoUpload({ movieId }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!file || busy) return

    const form = event.currentTarget
    const data = new FormData()
    data.append('video', file)

    setBusy(true)
    setMessage('')
    setError('')

    try {
      await apiClient.post('/api/Video/Create', data, {
        params: { id: movieId },
        timeout: 0,
      })

      form.reset()
      setFile(null)
      setMessage('Відео завантажено. Відкрий сторінку фільму для перегляду.')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const body = err.response?.data
        const detail =
          typeof body === 'string' && !body.trimStart().startsWith('<')
            ? body.trim()
            : typeof body?.title === 'string' ? body.title : ''

        setError(
          status
            ? `Не вдалося завантажити відео (${status}). ${detail}`.trim()
            : 'Не отримано відповіді сервера під час завантаження.',
        )
      } else {
        setError(err instanceof Error ? err.message : 'Помилка завантаження.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="movie-form" onSubmit={handleUpload}>
      <h2>Відео фільму</h2>

      <div className="movie-form-field">
        <label htmlFor="movie-video">Вибери відеофайл</label>
        <input
          id="movie-video"
          type="file"
          accept="video/*"
          disabled={busy}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null)
            setMessage('')
            setError('')
          }}
        />
      </div>

      <button
        type="submit"
        className="movie-form-submit"
        disabled={!file || busy}
      >
        {busy ? 'Завантажуємо…' : 'Завантажити відео'}
      </button>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </form>
  )
}