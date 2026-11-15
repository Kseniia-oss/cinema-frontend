import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { apiClient } from '../../api/apiClient'
import { apiError } from '../../api/apiError'

type Mode = 'create' | 'update'

type Preview =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'ready'; url: string }
  | { status: 'error'; message: string }

function PosterForm({ movieId }: { movieId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [preview, setPreview] = useState<Preview>({ status: 'loading' })

  const mode = selectedMode ?? (preview.status === 'ready' ? 'update' : 'create')
  const disabled = busy || preview.status === 'loading'

  useEffect(() => {
    const controller = new AbortController()
    let objectUrl: string | undefined

    async function loadPoster() {
      try {
        const response = await apiClient.get<Blob>('/api/Poster/Get', {
          params: { id: movieId, ...(revision > 0 ? { v: revision } : {}) },
          responseType: 'blob',
          headers: { Accept: 'image/*, application/octet-stream' },
          signal: controller.signal,
        })

        if (controller.signal.aborted) return

        if (response.status === 204) {
          setPreview({ status: 'empty' })
          return
        }

        const blob = response.data

        if (!(blob instanceof Blob) || blob.size === 0) {
          throw new Error('Сервер повернув порожню відповідь замість постера.')
        }

        if (
          blob.type &&
          !blob.type.startsWith('image/') &&
          !blob.type.startsWith('application/octet-stream')
        ) {
          throw new Error(`Сервер повернув ${blob.type} замість зображення.`)
        }

        objectUrl = URL.createObjectURL(blob)
        setPreview({ status: 'ready', url: objectUrl })
      } catch (cause: unknown) {
        if (controller.signal.aborted) return

        if (axios.isAxiosError(cause) && cause.response?.status === 404) {
          setPreview({ status: 'empty' })
          return
        }

        setPreview({
          status: 'error',
          message: axios.isAxiosError(cause)
            ? apiError(cause)
            : cause instanceof Error
              ? cause.message
              : 'Не вдалося отримати постер.',
        })
      }
    }

    void loadPoster()

    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [movieId, revision])

  function reloadPoster() {
    setPreview({ status: 'loading' })
    setRevision((value) => value + 1)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (disabled || !file) return

    const form = event.currentTarget
    const data = new FormData()
    data.append('poster', file)

    setBusy(true)
    setError('')
    setNotice('')

    try {
      const config = { params: { id: movieId }, timeout: 60000 }

      if (mode === 'update') {
        await apiClient.put('/api/Poster/Update', data, config)
      } else {
        await apiClient.post('/api/Poster/Create', data, config)
      }

      form.reset()
      setFile(null)
      setSelectedMode('update')
      setNotice('Постер збережено.')
      reloadPoster()
    } catch (cause: unknown) {
      setError(apiError(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="poster-heading">
      <h2 id="poster-heading">Постер фільму</h2>

      {preview.status === 'loading' && (
        <p role="status">Завантажуємо збережений постер…</p>
      )}

      {preview.status === 'empty' && <p>Збережений постер не знайдено.</p>}

      {preview.status === 'ready' && (
        <figure style={{ margin: '0 0 16px' }}>
          <img
            src={preview.url}
            alt="Збережений постер фільму"
            style={{
              display: 'block',
              width: '100%',
              maxWidth: 240,
              height: 'auto',
              borderRadius: 12,
            }}
            onError={() =>
              setPreview({
                status: 'error',
                message: 'Файл отримано, але браузер не зміг показати зображення.',
              })
            }
          />
        </figure>
      )}

      {preview.status === 'error' && (
        <div>
          <p role="alert">{preview.message}</p>
          <button type="button" onClick={reloadPoster} disabled={busy}>
            Повторити завантаження постера
          </button>
        </div>
      )}

      <form className="movie-form" onSubmit={handleSubmit}>
        <div className="movie-form-field">
          <label htmlFor="poster-mode">Що потрібно зробити?</label>
          <select
            id="poster-mode"
            value={mode}
            disabled={disabled}
            onChange={(event) => {
              setSelectedMode(event.target.value === 'update' ? 'update' : 'create')
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
            disabled={disabled}
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
          disabled={disabled || !file}
        >
          {busy ? 'Зберігаємо…' : 'Зберегти постер'}
        </button>

        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
      </form>
    </section>
  )
}

export default function MoviePosterUpload({ movieId }: { movieId: string }) {
  return <PosterForm key={movieId} movieId={movieId} />
}