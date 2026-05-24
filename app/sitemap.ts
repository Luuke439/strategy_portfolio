import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lukecaporelli.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // External projects (resaga, gravelwerk) live at their own domain and
  // have no /projects/<slug> page on this site — exclude them so crawlers
  // don't index a 404.
  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((p) => p.type !== 'external')
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
