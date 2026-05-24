'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { useHoverCapable } from '@/lib/useViewport'

// Easing: expo-out — fast initial response, controlled deceleration
// Feels precise and intentional (Apple product page register)
const easing = (t: number) => 1 - Math.pow(2, -8 * t)

interface Props {
  children: ReactNode
}

export default function LenisProvider({ children }: Props) {
  const hoverCapable = useHoverCapable()

  // On touch devices (phones, tablets), native momentum scroll feels better
  // than Lenis's wheel-smoothing — iOS rubber-band in particular fights
  // anything that intercepts the touch stream. We render Lenis only on
  // hover-capable devices.
  //
  // useLenis() consumers all handle the no-provider case (they fall back to
  // window.scrollTo), so this gate is safe without further changes.
  if (!hoverCapable) {
    return <>{children}</>
  }

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
