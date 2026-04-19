import { memo } from 'react'

interface MetaRowProps {
  label: string
  value: string
  accentColor: string
}

const FONT = "'TWK Lausanne Pan', system-ui, sans-serif"

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.35rem' }}>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: '0.78rem',
          color: '#A0A0A0',
          minWidth: '64px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: '0.78rem',
          color: '#0A0A0A',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export default memo(MetaRow)
