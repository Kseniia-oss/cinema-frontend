import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { apiClient } from '../../api/apiClient'
import { apiError } from '../../api/apiError'

type Trailer = {
  id: string
  title: string
}

type Props = {
  movieId: string
  editable?: boolean
}

function readTrailers(data: unknown): Trailer[] {
  if (!Array.isArray(data)) {
    throw new Error('Сервер повернув неочікуваний формат списку трейлерів.')
  }

  return data.map((item: unknown) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error('Не вдалося прочитати запис трейлера.')
    }

    const row = item as Record<string, unknown>
    const id = row.id ?? row.trailerId

    if (typeof id !== 'string' || !id.trim()) {
      throw new Error('У списку трейлерів не знайдено ID запису.')
    }

    return {
      id,
      title:
        typeof row.title === 'string' && row.title.trim()
          ? row.title.trim()
          : 'Трейлер без назви',
    }
  })
}

function TrailerItem({
  trailer,
  editable,
}: {
  trailer: Trailer
  editable: boolean
}) {
  const [file, setFile] = useState<File | null>(null)
  const [replace, setReplace] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const objectUrl = useRef('')
  const request = useRef<AbortController | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      request.current?.abort()
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current)
    }
  }, [])

  function clearVideo() {
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current)
      objectUrl.current = ''
    }
    setVideoUrl('')
  }

  async function playTrailer() {
    if (busy) return

    const controller = new AbortController()
    request.current = controller
    setBusy(true)
    setError('')
    setNotice('Завантажуємо трейлер…')

    try {
      const { data } = await apiClient.get<Blob>('/api/Trailer/GetFile', {
        params: { trailerId: trailer.id },
        responseType: 'blob',
        headers: { Accept: 'video/*, application/octet-stream' },
        signal: controller.signal,
        timeout: 120000,
      })

      if (controller.signal.aborted) return

      if (
        !(data instanceof Blob) ||
        !data.size ||
        (data.type &&
          !data.type.startsWith('video/') &&
          !data.type.startsWith('application/octet-stream'))
      ) {
        throw new Error('Сервер не повернув відеофайл трейлера.')
      }

      clearVideo()
      const url = URL.createObjectURL(data)
      objectUrl.current = url
      setVideoUrl(url)
      setNotice('')
    } catch (cause: unknown) {
      if (controller.signal.aborted) return
      setNotice('')
      setError(apiError(cause))
    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editable || !file || busy) return

    const controller = new AbortController()
    request.current = controller
    const body = new FormData()
    body.append('trailer', file)

    setBusy(true)
    setNotice('')
    setError('')

    try {
      const config = {
        params: { trailerId: trailer.id },
        timeout: 120000,
        signal: controller.signal,
      }

      if (replace) {
        await apiClient.put('/api/Trailer/UpdateFile', body, config)
      } else {
        await apiClient.post('/api/Trailer/CreateFile', body, config)
      }

      if (controller.signal.aborted) return

      clearVideo()
      setFile(null)
      if (fileInput.current) fileInput.current.value = ''
      setReplace(true)
      setNotice('Файл збережено. Натисни «Відкрити трейлер», щоб перевірити.')
    } catch (cause: unknown) {
      if (!controller.signal.aborted) setError(apiError(cause))
    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  return (
    <article>
      <h3>{trailer.title}</h3>

      {editable && (
        <form className="movie-form" onSubmit={uploadFile}>
          <label className="movie-form-field">
            Дія з файлом
            <select
              value={replace ? 'update' : 'create'}
              disabled={busy}
              onChange={(event) => setReplace(event.target.value === 'update')}
            >
              <option value="create">Додати перший файл</option>
              <option value="update">Замінити наявний файл</option>
            </select>
          </label>

          <label className="movie-form-field">
            Відеофайл трейлера
            <input
              ref={fileInput}
              type="file"
              accept="video/*"
              disabled={busy}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          <button
            className="movie-form-submit"
            type="submit"
            disabled={busy || !file}
          >
            Зберегти файл
          </button>
        </form>
      )}

      {videoUrl ? (
        <video
          controls
          playsInline
          src={videoUrl}
          aria-label={trailer.title}
          style={{ display: 'block', width: '100%', maxWidth: 720 }}
          onError={() => setError('Браузер не зміг відтворити цей відеофайл.')}
        />
      ) : (
        <button type="button" onClick={playTrailer} disabled={busy}>
          Відкрити трейлер
        </button>
      )}

      {notice && <p role="status">{notice}</p>}
      {error && <p role="alert">{error}</p>}
    </article>
  )
}

function TrailerSection({ movieId, editable = false }: Props) {
  const [trailers, setTrailers] = useState<Trailer[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [revision, setRevision] = useState(0)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadList() {
      try {
        const { data } = await apiClient.get<unknown>(
          '/api/Trailer/GetAllTrailersData',
          { params: { filmId: movieId }, signal: controller.signal },
        )

        if (controller.signal.aborted) return
        setTrailers(readTrailers(data))
        setListError('')
      } catch (cause: unknown) {
        if (!controller.signal.aborted) setListError(apiError(cause))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadList()
    return () => controller.abort()
  }, [movieId, revision])

  function reloadList() {
    setLoading(true)
    setListError('')
    setRevision((value) => value + 1)
  }

  async function createTrailer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editable || saving || !title.trim() || !date) return

    setSaving(true)
    setCreateError('')
    setNotice('')

    try {
      await apiClient.post('/api/Trailer/Create', {
        filmId: movieId,
        title: title.trim(),
        date,
      })

      setTitle('')
      setDate('')
      setNotice('Запис створено. Прикріпи відеофайл біля назви трейлера нижче.')
      reloadList()
    } catch (cause: unknown) {
      setCreateError(apiError(cause))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-label="Трейлери фільму">
      <h2>Трейлери фільму</h2>

      {editable && (
        <form className="movie-form" onSubmit={createTrailer}>
          <label className="movie-form-field">
            Назва трейлера
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Наприклад: Офіційний трейлер"
              disabled={saving}
              required
            />
          </label>

          <label className="movie-form-field">
            Дата трейлера
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={saving}
              required
            />
          </label>

          <button
            type="submit"
            className="movie-form-submit"
            disabled={saving || !title.trim() || !date}
          >
            {saving ? 'Створюємо…' : 'Створити трейлер'}
          </button>
        </form>
      )}

      {notice && <p role="status">{notice}</p>}
      {createError && <p role="alert">{createError}</p>}

      {loading && <p role="status">Завантажуємо список трейлерів…</p>}

      {listError && (
        <div>
          <p role="alert">{listError}</p>
          <button type="button" onClick={reloadList}>
            Оновити список
          </button>
        </div>
      )}

      {!loading && !listError && trailers.length === 0 && (
        <p>До цього фільму ще не додали трейлерів.</p>
      )}

      {trailers.map((trailer) => (
        <TrailerItem key={trailer.id} trailer={trailer} editable={editable} />
      ))}
    </section>
  )
}

export default function MovieTrailers(props: Props) {
  return <TrailerSection key={props.movieId} {...props} />
}