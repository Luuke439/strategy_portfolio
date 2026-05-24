import type { MetadataRoute } from 'next'

// Production URL — override via NEXT_PUBLIC_SITE_URL in deployment env if
// the domain ever changes. Falling back to the canonical custom domain.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lukecaporelli.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
