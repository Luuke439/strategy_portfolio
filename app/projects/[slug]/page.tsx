import { notFound } from 'next/navigation'
import { getProjectBySlug, projects } from '@/data/projects'
import CaseStudyPage from '@/components/CaseStudyPage'
import LabPage from '@/components/LabPage'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
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

  if (project.type === 'case-study') {
    return <CaseStudyPage project={project} />
  }
  return <LabPage project={project} />
}
