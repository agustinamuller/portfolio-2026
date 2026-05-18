import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import projects, { getProject } from '@/data/projects'
import CaseStudyDetail from '@/components/CaseStudyDetail'

/**
 * Server component mínimo: resuelve el slug, valida que el proyecto exista,
 * genera la metadata SEO, y pasa el proyecto al client component
 * `CaseStudyDetail` que renderiza todo el contenido.
 *
 * El contenido visual vive en `components/CaseStudyDetail.tsx` (client)
 * para reaccionar al switcher de idioma. Acá solo queda lo que Next.js
 * necesita en el servidor: las rutas para build, la metadata, y el
 * fetch del proyecto.
 */

// Pre-renderizar todas las rutas en build (mejor SEO)
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const project = getProject(slug)
  if (!project) return { title: 'Proyecto no encontrado' }
  // Para el <title> del browser y meta description usamos la versión EN
  // por default (es el idioma indexado por Google). El switcher cambia
  // los textos visibles en el cliente, pero la metadata del HTML server
  // queda fija al primer render. Es un trade-off aceptable.
  const titleEn = typeof project.title === 'string' ? project.title : project.title.en
  // intro.body puede ser string legacy o { en, es }. Para la meta description
  // (que es server-side y queda fija) usamos la versión EN.
  const introBody = project.intro?.body
  const introBodyEn = typeof introBody === 'string' ? introBody : introBody?.en
  return {
    title: titleEn,
    description: introBodyEn?.split('\n')[0] ?? titleEn,
  }
}

export default async function WorkDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const project = getProject(slug)
  if (!project) notFound()

  return <CaseStudyDetail project={project} />
}
