import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not found',
  // Cheap way to keep robots out of soft-404 mirrors.
  robots: { index: false, follow: false },
}

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

export default function NotFound() {
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
      <div style={{ maxWidth: '40ch', textAlign: 'left' }}>
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
          404 — Not found
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#0A0A0A',
            margin: '0 0 1.25rem',
          }}
        >
          This page doesn&rsquo;t exist.
        </h1>
        <p
          style={{
            fontFamily: FONT,
            fontWeight: 300,
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#6B6B6B',
            margin: '0 0 2rem',
          }}
        >
          It may have moved, or never been here. Head back to the work.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: '0.95rem',
            color: '#0A0A0A',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          Back to portfolio →
        </Link>
      </div>
    </div>
  )
}
