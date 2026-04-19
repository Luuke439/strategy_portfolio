'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

// Easing: expo-out — fast initial response, controlled deceleration
// Feels precise and intentional (Apple product page register)
const easing = (t: number) => 1 - Math.pow(2, -8 * t)

interface Props {
  children: ReactNode
}

export default function LenisProvider({ children }: Props) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
