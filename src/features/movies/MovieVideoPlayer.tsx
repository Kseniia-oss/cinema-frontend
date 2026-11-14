import { useState } from 'react'
import { apiClient } from '../../api/apiClient'

export default function MovieVideoPlayer({ movieId }: { movieId: string }) {
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)

  const src = apiClient.getUri({
    url: '/api/Video/Get',
    params: { id: movieId },
  })

  return (
    <section aria-label="Перегляд фільму">
      <h2>Перегляд фільму</h2>

      {!started || failed ? (
        <>
          {failed && (
            <p role="alert">
              Не вдалося відкрити відео. Можливо, файл ще не додано
              або сервер обмежує доступ до перегляду.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setFailed(false)
              setStarted(true)
            }}
          >
            {failed ? 'Спробувати ще раз' : 'Відкрити плеєр'}
          </button>
        </>
      ) : (
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          style={{ width: '100%', maxWidth: 960, background: '#000' }}
          onError={() => setFailed(true)}
        />
      )}
    </section>
  )
}