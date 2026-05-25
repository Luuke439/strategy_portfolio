'use client'

// Route-segment error boundary. Catches errors thrown during render of any
// child route. Doesn't catch errors from event handlers (those need
// try/catch in the handler) or async server-side errors (those bubble to
// global-error.tsx). Errors here keep the layout (header, nav) intact.

import { useEffect } from 'react'

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface for Vercel log streams. Replace with Sentry/etc. if wired later.
    console.error('[route-error]', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ maxWidth: '44ch', textAlign: 'left' }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#A0A0A0',
            marginBottom: '1rem',
          }}
        >
          Something went sideways
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#0A0A0A',
            margin: '0 0 1rem',
          }}
        >
          This part of the site couldn&rsquo;t render.
        </h1>
        <p
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#6B6B6B',
            margin: '0 0 1.5rem',
          }}
        >
          Try again — most of the time a retry resolves it. If it keeps
          happening, the logs have the detail.
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
          Try again
        </button>
      </div>
    </div>
  )
}
