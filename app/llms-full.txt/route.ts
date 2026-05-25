import { projects } from '@/data/projects'
import { SITE_URL, AUTHOR, DESCRIPTION } from '@/lib/site'

// llms-full.txt — long-form companion to /llms.txt. Includes every
// project's problem, role, team, tools, scope, challenge, strategy,
// results, key insight, and impact stats so an LLM can answer questions
// about the work without crawling individual pages.

export const dynamic = 'force-static'
export const revalidate = 86400

function block(label: string, value: string | undefined): string {
  if (!value) return ''
  return `**${label}:** ${value}\n\n`
}

function render(): string {
  const sections = projects.map((p) => {
    const url = p.type === 'external' && p.externalUrl ? p.externalUrl : `${SITE_URL}/projects/${p.slug}`
    const stats =
      p.impactStats.length === 0
        ? ''
        : `**Impact:**\n${p.impactStats
            .map((s) => `- ${s.number} ${s.label} — ${s.description}`)
            .join('\n')}\n\n`
    return [
      `## ${p.name} (${p.year})`,
      ``,
      `[${url}](${url})`,
      ``,
      block('Type', p.category),
      block('Tags', p.tags?.join(', ')),
      block('Problem', p.problemStatement),
      block('Role', p.role),
      block('Team', p.team),
      block('Tools', p.tools),
      block('Scope', p.scope),
      block('Challenge', p.challenge),
      block('Strategy', p.strategy),
      block('Results', p.results),
      block('Key Insight', p.keyInsight),
      block('Description', p.description),
      stats,
    ].join('')
  })

  return [
    `# ${AUTHOR.name} — Full Portfolio`,
    '',
    `> ${DESCRIPTION}`,
    '',
    `${AUTHOR.jobTitle} based in ${AUTHOR.location} (${AUTHOR.nationality}). Contact: ${AUTHOR.email}`,
    '',
    '---',
    '',
    ...sections,
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
