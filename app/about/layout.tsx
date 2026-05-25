import type { Metadata } from 'next'

export const metadata: Metadata = {
  // The root layout's title template ('%s — Luke Caporelli') appends the
  // suffix, so we only set the segment-specific part here.
  title: 'About',
  description: 'Experience, education, collaborations, and contact for Luke Caporelli — Strategic Designer based in Germany.',
  alternates: { canonical: '/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
