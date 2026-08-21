import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // External projects live at their own domain, and placeholder tiles (the
  // NDA thesis) are non-clickable — neither has a /projects/<slug> page on
  // this site, so exclude them so crawlers don't index a 404.
  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((p) => p.type !== 'external' && p.type !== 'placeholder')
    .map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: p.type === 'case-study' ? 0.8 : 0.6,
    }))

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...projectEntries,
  ]
}
