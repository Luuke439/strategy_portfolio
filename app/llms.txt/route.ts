import { projects } from '@/data/projects'
import { SITE_URL, AUTHOR, DESCRIPTION } from '@/lib/site'

// llms.txt — site index for LLM crawlers (https://llmstxt.org). Mirrors
// the sitemap conceptually, but in a structured-Markdown format LLMs can
// ingest cheaply without crawling every page.

export const dynamic = 'force-static'
export const revalidate = 86400 // 24h

function render(): string {
  const caseStudies = projects.filter((p) => p.type === 'case-study')
  const labs = projects.filter((p) => p.type === 'lab')
  const externals = projects.filter((p) => p.type === 'external')

  const fmt = (p: (typeof projects)[number]) => {
    const url = p.type === 'external' && p.externalUrl ? p.externalUrl : `${SITE_URL}/projects/${p.slug}`
    const tail = p.problemStatement ? `: ${p.problemStatement}` : ''
    return `- [${p.name}](${url})${tail}`
  }

  return [
    `# ${AUTHOR.name}`,
    '',
    `> ${DESCRIPTION}`,
    '',
    `${AUTHOR.jobTitle} based in ${AUTHOR.location} (${AUTHOR.nationality}). Contact: ${AUTHOR.email}`,
    '',
    '## Site',
    '',
    `- [Home](${SITE_URL}): Project portfolio and 3D hero`,
    `- [About](${SITE_URL}/about): Experience, education, contact`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): Full URL index`,
    `- [Full content](${SITE_URL}/llms-full.txt): Long-form llms.txt with case-study bodies`,
    '',
    '## Case Studies',
    '',
    ...caseStudies.map(fmt),
    '',
    '## Lab Projects',
    '',
    ...labs.map(fmt),
    '',
    '## External Products',
    '',
    ...externals.map(fmt),
    '',
  ].join('\n')
}

export async function GET() {
  return new Response(render(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
