import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SITE_HOST } from '@/lib/site'

// 1200×630 — canonical share size (LinkedIn / Twitter / Slack / Facebook).
export const alt = 'Luke Caporelli — Strategic Design'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Each project's slug + display label + accent color drawn from data/projects.ts.
// Listed here (rather than imported) so the OG renderer doesn't pull the full
// projects array — Satori only needs the labels and the accent dots.
const PROJECT_CHIPS = [
  { name: 'odo',          accent: '#088559' },
  { name: 're:markt',     accent: '#5a8a8d' },
  { name: 'maya',         accent: '#EB684E' },
  { name: 'gravelwerk',   accent: '#B45309' },
  { name: 'resaga',       accent: '#8B7355' },
  { name: 'expressive msg.', accent: '#6c5a8a' },
  { name: 'blend it!',    accent: '#8a5a82' },
  { name: 'Spotify Dashboard', accent: '#2B6CB0' },
] as const

export default async function OpenGraphImage() {
  const fontDir = join(process.cwd(), 'public/fonts/TWKLausannePan 2/Web')
  const [bold, medium, regular] = await Promise.all([
    readFile(join(fontDir, 'TWKLausannePan-700.ttf')),
    readFile(join(fontDir, 'TWKLausannePan-500.ttf')),
    readFile(join(fontDir, 'TWKLausannePan-400.ttf')),
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
          background: '#FAFAFA',
          padding: '64px 76px',
          fontFamily: 'Lausanne',
        }}
      >
        {/* ── Top row: chrome C-mark + eyebrow ───────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="44" height="44" viewBox="0 0 64 64">
              <defs>
                <linearGradient
                  id="chrome-mark"
                  x1="32"
                  y1="6"
                  x2="32"
                  y2="58"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#7a7a7a" />
                  <stop offset="0.35" stopColor="#2a2a2a" />
                  <stop offset="0.55" stopColor="#6c6c6c" />
                  <stop offset="0.85" stopColor="#1a1a1a" />
                  <stop offset="1" stopColor="#4a4a4a" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="14" fill="#0A0A0A" />
              <path
                d="M 52 21 A 24 24 0 1 0 52 43"
                fill="none"
                stroke="url(#chrome-mark)"
                strokeWidth="13"
                strokeLinecap="round"
              />
            </svg>
            <span
              style={{
                fontFamily: 'Lausanne',
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#0A0A0A',
              }}
            >
              Luke Caporelli · Strategic Design
            </span>
          </div>

          <span
            style={{
              fontFamily: 'Lausanne',
              fontWeight: 400,
              fontSize: 18,
              letterSpacing: '0.04em',
              color: '#8a8a8a',
            }}
          >
            {SITE_HOST}
          </span>
        </div>

        {/* ── Hero block: discipline triad, stacked ────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {['Product strategy', 'Interaction design', 'Systems thinking'].map((d) => (
            <span
              key={d}
              style={{
                fontFamily: 'Lausanne',
                fontWeight: 700,
                fontSize: 92,
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
                color: '#0A0A0A',
              }}
            >
              {d}
            </span>
          ))}
        </div>

        {/* ── Bottom: project chip row + school affiliation ───────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            {PROJECT_CHIPS.map((p) => (
              <div
                key={p.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 14px 7px 12px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(10,10,10,0.08)',
                  borderRadius: 999,
                  fontFamily: 'Lausanne',
                  fontWeight: 400,
                  fontSize: 18,
                  letterSpacing: '-0.005em',
                  color: '#0A0A0A',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: p.accent,
                  }}
                />
                {p.name}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'Lausanne',
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: '0.02em',
                color: '#6b6b6b',
              }}
            >
              M.A. Strategic Design · HfG Schwäbisch Gmünd
            </span>
            <span
              style={{
                fontFamily: 'Lausanne',
                fontWeight: 500,
                fontSize: 20,
                letterSpacing: '0.04em',
                color: '#8a8a8a',
              }}
            >
              2026
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Lausanne', data: bold, weight: 700, style: 'normal' },
        { name: 'Lausanne', data: medium, weight: 500, style: 'normal' },
        { name: 'Lausanne', data: regular, weight: 400, style: 'normal' },
      ],
    },
  )
}
