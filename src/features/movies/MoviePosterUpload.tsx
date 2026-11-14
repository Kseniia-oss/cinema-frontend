import { useState } from 'react'
import type { FormEvent } from 'react'
import { apiClient } from '../../api/apiClient'
import { apiError } from '../../api/apiError'

export default function MoviePosterUpload({ movieId }: { movieId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !file) return

    const form = event.currentTarget
    const data = new FormData()
    data.append('poster', file)

    setBusy(true)
    setError('')
    setNotice('')

    try {
      const config = { params: { id: movieId }, timeout: 60000 }

      if (mode === 'create') {
        await apiClient.post('/api/Poster/Create', data, config)
      } else {
        await apiClient.put('/api/Poster/Update', data, config)
      }

      form.reset()
      setFile(null)
      setMode('update')
      setNotice('Постер збережено.')
    } catch (cause: unknown) {
      setError(apiError(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="poster-heading">
      <h2 id="poster-heading">Постер фільму</h2>

      <form className="movie-form" onSubmit={handleSubmit}>
        <div className="movie-form-field">
          <label htmlFor="poster-mode">Що потрібно зробити?</label>
          <select
            id="poster-mode"
            value={mode}
            disabled={busy}
            onChange={(event) => {
              setMode(event.target.value === 'update' ? 'update' : 'create')
              setNotice('')
              setError('')
            }}
          >
            <option value="create">Додати перший постер</option>
            <option value="update">Замінити наявний постер</option>
          </select>
        </div>

        <div className="movie-form-field">
          <label htmlFor="movie-poster">Файл зображення</label>
          <input
            id="movie-poster"
            type="file"
            accept="image/*"
            disabled={busy}
            required
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null)
              setNotice('')
              setError('')
            }}
          />
        </div>

        <button
          type="submit"
          className="movie-form-submit"
          disabled={busy || !file}
        >
          {busy ? 'Завантажуємо…' : 'Зберегти постер'}
        </button>

        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
      </form>
    </section>
  )
}