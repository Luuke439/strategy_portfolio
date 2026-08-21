import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, projects } from '@/data/projects'
import CaseStudyPage from '@/components/CaseStudyPage'
import LabPage from '@/components/LabPage'
import { SITE_URL, AUTHOR } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // External projects link straight to their own URL from the home grid, and
  // placeholder tiles (e.g. an NDA thesis) are intentionally non-clickable —
  // neither gets a hosted page. Skipping them here means those routes 404
  // instead of rendering a half-populated shell.
  return projects
    .filter((p) => p.type !== 'external' && p.type !== 'placeholder')
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  const url = `${SITE_URL}/projects/${slug}`
  const title = `${project.name} · ${project.category}`
  const description = project.problemStatement || `${project.name}: ${project.category} by ${AUTHOR.name}.`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      siteName: 'Luke Caporelli',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  // Defensive: external + placeholder projects should never reach this route
  // since they're excluded from generateStaticParams. But during dev/runtime
  // someone could still type the URL — 404 instead of rendering an empty page.
  if (project.type === 'external' || project.type === 'placeholder') notFound()

  const url = `${SITE_URL}/projects/${slug}`

  // CreativeWork + BreadcrumbList — gives search engines and LLMs a clean
  // semantic graph of this page (what it is, who made it, where it sits).
  const creativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: project.name,
    headline: project.headline || project.problemStatement,
    description: project.problemStatement,
    url,
    inLanguage: 'en',
    dateCreated: project.year,
    keywords: project.tags?.join(', '),
    creator: { '@id': `${SITE_URL}/#person` },
    author: { '@id': `${SITE_URL}/#person` },
    about: project.category,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: project.name, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {project.type === 'case-study' ? (
        <CaseStudyPage project={project} />
      ) : (
        <LabPage project={project} />
      )}
    </>
  )
}
