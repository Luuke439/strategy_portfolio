import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// 1200×630 is the LinkedIn / Twitter / Slack / Facebook canonical size.
export const alt = 'Luke Caporelli — Strategic Design'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// next/og bundles Satori — pure JS, no headless browser required. We load
// TWK Lausanne Pan TTFs from /public/fonts so the typography matches the
// site exactly instead of falling back to a generic sans.
export default async function OpenGraphImage() {
  const fontDir = join(
    process.cwd(),
    'public/fonts/TWKLausannePan 2/Web',
  )
  const [bold, medium] = await Promise.all([
    readFile(join(fontDir, 'TWKLausannePan-700.ttf')),
    readFile(join(fontDir, 'TWKLausannePan-500.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          padding: '90px',
          fontFamily: 'Lausanne',
        }}
      >
        {/* ── Top row: chrome C mark + section label ───────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 64 64">
            <defs>
              <linearGradient
                id="chrome"
                x1="32"
                y1="6"
                x2="32"
                y2="58"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#f8f3ea" />
                <stop offset="0.35" stopColor="#c8c8c8" />
                <stop offset="0.55" stopColor="#7a7a7a" />
                <stop offset="0.85" stopColor="#c8c8c8" />
                <stop offset="1" stopColor="#f0d6b0" />
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill="#1a1a1a" />
            <path
              d="M 52 21 A 24 24 0 1 0 52 43"
              fill="none"
              stroke="url(#chrome)"
              strokeWidth="13"
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{
              fontFamily: 'Lausanne',
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#8a8a8a',
            }}
          >
            Strategic Design Portfolio
          </span>
        </div>

        {/* ── Main block: name + role ──────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Lausanne',
              fontWeight: 700,
              fontSize: 154,
              lineHeight: 0.95,
              letterSpacing: '-0.045em',
              backgroundImage:
                'linear-gradient(180deg, #f8f3ea 0%, #c8c8c8 35%, #7a7a7a 55%, #c8c8c8 85%, #f0d6b0 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Luke Caporelli
          </span>
          <span
            style={{
              fontFamily: 'Lausanne',
              fontWeight: 500,
              fontSize: 38,
              letterSpacing: '-0.01em',
              color: '#b8b8b8',
              marginTop: 28,
            }}
          >
            Product strategy · Interaction design · Systems thinking
          </span>
        </div>

        {/* ── Bottom row: program affiliation ──────────────────────── */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'Lausanne',
            fontWeight: 500,
            fontSize: 22,
            letterSpacing: '0.04em',
            color: '#6b6b6b',
          }}
        >
          M.A. Strategic Design · HfG Schwäbisch Gmünd
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Lausanne', data: bold, weight: 700, style: 'normal' },
        { name: 'Lausanne', data: medium, weight: 500, style: 'normal' },
      ],
    },
  )
}
