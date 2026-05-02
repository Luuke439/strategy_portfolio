import { memo } from 'react'

interface ChallengeBlockProps {
  challenge: string
  strategy: string
  results: string
  accentColor: string
}

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

const rows = (challenge: string, strategy: string, results: string) => [
  { label: 'Challenge', text: challenge },
  { label: 'Strategy',  text: strategy  },
  { label: 'Results',   text: results   },
]

function ChallengeBlock({ challenge, strategy, results }: ChallengeBlockProps) {
  return (
    <div style={{ marginTop: '3rem', marginBottom: '3rem' }}>
      {rows(challenge, strategy, results).map((row, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '2rem',
            alignItems: 'start',
            padding: '1.5rem 0',
            borderTop: '1px solid #E5E5E5',
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#A0A0A0',
              paddingTop: '0.15rem',
              minWidth: '80px',
            }}
          >
            {row.label}
          </span>
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 300,
              fontSize: '0.95rem',
              color: '#0A0A0A',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {row.text}
          </p>
        </div>
      ))}
      <div style={{ borderTop: '1px solid #E5E5E5' }} />
    </div>
  )
}

export default memo(ChallengeBlock)
