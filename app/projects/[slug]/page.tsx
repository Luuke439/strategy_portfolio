import { notFound } from 'next/navigation'
import { getProjectBySlug, projects } from '@/data/projects'
import CaseStudyPage from '@/components/CaseStudyPage'
import LabPage from '@/components/LabPage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // External projects link straight to their own URL from the home grid — we
  // don't host a project page for them. Skipping them here means the route
  // 404s instead of rendering a half-populated LabPage shell.
  return projects
    .filter((p) => p.type !== 'external')
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.name} — Luke Caporelli`,
    description: project.problemStatement,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  // Defensive: an external project should never reach this route since it
  // isn't in generateStaticParams. But during dev/runtime someone could still
  // type the URL — 404 instead of rendering an empty page.
  if (project.type === 'external') notFound()

  if (project.type === 'case-study') {
    return <CaseStudyPage project={project} />
  }
  return <LabPage project={project} />
}
