'use client'

// Last-resort boundary. Fires when even the RootLayout fails to render —
// so we ship our own <html> + <body>. Keeps the visual register coherent
// with not-found.tsx and error.tsx but doesn't rely on layout.tsx loading.

import { useEffect } from 'react'

const FONT = 'system-ui, sans-serif'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#FAFAFA',
          color: '#0A0A0A',
          fontFamily: FONT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '44ch' }}>
          <p
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#A0A0A0',
              margin: '0 0 1rem',
            }}
          >
            Something broke before the page could load
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              lineHeight: 1.1,
              margin: '0 0 1rem',
              fontWeight: 500,
            }}
          >
            We&rsquo;ll be back in a second.
          </h1>
          <p style={{ color: '#6B6B6B', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            Refresh the page or come back in a minute.
          </p>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: '0.95rem',
              color: '#FAFAFA',
              backgroundColor: '#0A0A0A',
              border: 'none',
              padding: '0.75rem 1.25rem',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  )
}
