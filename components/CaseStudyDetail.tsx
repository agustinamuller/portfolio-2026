'use client'

/**
 * CaseStudyDetail — client component que renderiza todo el contenido de
 * un case study (/work/[slug]). Antes vivía dentro del page.tsx como
 * server component, pero al moverlo a client podemos reaccionar al
 * switcher de idioma (LanguageContext) y traducir intros, blocks e items
 * en tiempo real sin recargar la página.
 *
 * El page.tsx queda mínimo: solo generateStaticParams + generateMetadata
 * + el default export que resuelve el proyecto y pasa todo acá.
 */

import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Reveal } from '@/components/Reveal'
import LogoLoop from '@/components/LogoLoop'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
import type { Project, ProjectBlock, ProjectTestimonial, TextBlockItem } from '@/data/projects'
import { ProjectHeaderSide } from '@/components/ProjectHeaderSide'
import { ProjectTitle } from '@/components/ProjectTitle'
import { tLocalized, type LocalizedString } from '@/data/translations'
import { useLanguage } from '@/contexts/LanguageContext'

// ============================================================
// Resolución bilingüe — convierte LocalizedString → string según idioma
// ============================================================

/**
 * Resuelve cada LocalizedString del proyecto al string del idioma actual.
 * Centralizado acá para no tener que tocar los tipos internos de cada
 * sub-componente (ProjectIntro, ProjectTextBlock, etc. siguen recibiendo
 * strings planos). Una sola lectura de `useLanguage()` arriba.
 *
 * `title`, `role`, `industry` no se tocan acá — los componentes que los
 * usan (ProjectTitle, ProjectHeaderSide) ya leen el switcher por su cuenta.
 *
 * El item con shape `{ en, es }` plano (bullet bilingüe sin label) se
 * normaliza al string elegido. El shape `{ label, description }` se mantiene
 * y se resuelven sus dos campos individualmente.
 */
type ResolvedTextItem = string | { label: string; description: string }
type ResolvedBlock =
  | { type: 'text'; heading?: string; body?: string; items?: ResolvedTextItem[]; highlight?: boolean }
  | { type: 'media'; src: string; mediaType: 'video' | 'image'; alt?: string; scale?: number; transparent?: boolean; objectPosition?: string; aspectRatio?: string }
  | { type: 'quote'; text: string }
  | { type: 'columns'; items: { heading: string; bullets: string[] }[] }
  | { type: 'statistics'; items: { value: string; label: string; description?: string }[] }
  | { type: 'testimonials'; items: ProjectTestimonial[] }

function resolveItem(item: TextBlockItem, lang: 'en' | 'es'): ResolvedTextItem {
  if (typeof item === 'string') return item
  if ('label' in item) {
    return { label: tLocalized(item.label, lang), description: tLocalized(item.description, lang) }
  }
  // shape { en, es }
  return lang === 'es' ? item.es : item.en
}

function resolveBlock(block: ProjectBlock, lang: 'en' | 'es'): ResolvedBlock {
  switch (block.type) {
    case 'text':
      return {
        type: 'text',
        heading: block.heading ? tLocalized(block.heading, lang) : undefined,
        body: block.body ? tLocalized(block.body, lang) : undefined,
        items: block.items?.map((it) => resolveItem(it, lang)),
        highlight: block.highlight,
      }
    case 'media':
      return block
    case 'quote':
      return { type: 'quote', text: tLocalized(block.text, lang) }
    case 'columns':
      return {
        type: 'columns',
        items: block.items.map((col) => ({
          heading: tLocalized(col.heading, lang),
          bullets: col.bullets.map((b) => tLocalized(b, lang)),
        })),
      }
    case 'statistics':
      return {
        type: 'statistics',
        items: block.items.map((s) => ({
          value: s.value,
          label: tLocalized(s.label, lang),
          description: s.description ? tLocalized(s.description, lang) : undefined,
        })),
      }
    case 'testimonials':
      return block
  }
}

function resolveIntro(
  intro: { heading: LocalizedString; body: LocalizedString } | undefined,
  lang: 'en' | 'es',
): { heading: string; body: string } | undefined {
  if (!intro) return undefined
  return { heading: tLocalized(intro.heading, lang), body: tLocalized(intro.body, lang) }
}

// ============================================================
// Componente principal — recibe el proyecto ya resuelto desde page.tsx
// ============================================================

export default function CaseStudyDetail({ project }: { project: Project }) {
  const { language } = useLanguage()
  // Resolvemos LocalizedString → string una sola vez según el idioma actual.
  // Los sub-componentes internos siguen recibiendo strings planos como antes.
  const intro = resolveIntro(project.intro, language)
  const blocks = project.blocks?.map((b) => resolveBlock(b, language))

  return (
    <>
      {/* Navbar viene del app/layout.tsx (no se renderiza acá para evitar duplicación) */}
      <main className="project-detail">
        <article className="project-detail-container">
          <BackButton />

          <ProjectHeader project={project} />

          {project.media && (
            <ProjectMedia
              media={project.media}
              alt={project.media.alt}
              eager
            />
          )}

          {intro && <ProjectIntro intro={intro} />}

          {blocks?.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </article>
      </main>
      <Footer />

      {/* Floating scroll-to-top — aparece después de ~80% del viewport
          scrolleado. Pensado para case studies largos donde el back
          button del header queda fuera de pantalla y volver scrolleando
          es fricción. No reemplaza al back (que sigue arriba), es un
          atajo adicional. */}
      <ScrollToTopButton />

      {/* Estilos del detail page — inline para auto-contención.
          Sigue el design system del home: max-width 832 del contenido,
          padding responsive, dark mode. */}
      <style>{`
        .project-detail {
          width: 100%;
          padding: 56px 112px 96px;
          box-sizing: border-box;
        }
        .project-detail-container {
          max-width: 832px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* Body text de todos los bloques del case study.
           - Desktop / Tablet: L/Regular del Figma → 20px / 36px line
           - Mobile (≤600): M/Regular del Figma → 16px / 28px line
           Aplica a body, items con highlight, e items bulleted (consistencia
           total entre los tres tipos de texto descriptivo). Color va inline
           porque varía por instancia (primary / secondary). */
        .project-body-text {
          font-family: 'Neue Montreal', var(--font-sans);
          font-weight: 400;
          font-size: 20px;
          line-height: 36px;
        }

        @media (max-width: 1024px) {
          .project-detail {
            padding: 40px 64px 80px;
          }
          .project-detail-container { gap: 40px; }
        }
        @media (max-width: 600px) {
          .project-detail {
            padding: 24px 16px 56px;
          }
          .project-detail-container { gap: 32px; }
          /* Body baja a 16/28 (M/Regular) — alineado con el resto del sitio
             en mobile (ej. What I do usa el mismo size). 20/36 quedaba muy
             grande en pantallas chicas. */
          .project-body-text {
            font-size: 16px;
            line-height: 28px;
          }
        }
      `}</style>
    </>
  )
}

// ============================================================
// Back button
// ============================================================

function BackButton() {
  return (
    <Link
      href="/#work"
      aria-label="Volver al home"
      className="project-back-btn"
    >
      {/* SVG inline con `currentColor` — el stroke del círculo y el fill
          de la flecha usan el color del componente padre. Eso permite
          cambiar a color-accent en hover via CSS. Asset original del DS,
          conservando el diseño exacto del Figma. */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="currentColor" />
        <path
          d="M25.0755 34.3939C25.0552 34.4144 24.431 34.5708 23.6886 34.7415C22.9461 34.9121 22.3306 35.0256 22.3207 34.9939C22.3109 34.9622 22.2341 34.4468 22.1501 33.8487C21.9814 32.6477 21.5728 31.2453 21.1362 30.3683C19.7754 27.635 17.3339 25.8252 14.3727 25.3548L13.6186 25.235V22.82L14.3021 22.7053C18.7798 21.9541 21.6991 18.606 22.2452 13.5956C22.2809 13.2685 22.3235 13.0009 22.3399 13.0009C22.4909 13.0009 24.9932 13.6039 25.0406 13.6517C25.0748 13.6862 25.0493 13.9929 24.9839 14.3332C24.2598 18.1004 22.1865 21.1659 19.496 22.4477L18.8506 22.7552H34.3809V25.2777H18.8604L19.6751 25.6905C21.7889 26.7614 23.4624 28.862 24.4479 31.6817C24.7287 32.4849 25.1524 34.3163 25.0755 34.3939Z"
          fill="currentColor"
        />
      </svg>

      <style>{`
        .project-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          text-decoration: none;
          color: var(--fg-1);
          transition: color 200ms var(--ease);
          flex-shrink: 0;
        }
        .project-back-btn:hover,
        .project-back-btn:focus-visible {
          color: var(--color-accent);
        }
      `}</style>
    </Link>
  )
}

// ============================================================
// Header — title + role/industry side info
// ============================================================

function ProjectHeader({ project }: { project: Project }) {
  return (
    <Reveal direction="up" distance={24} duration={1000} once>
      <header className="project-header">
        {/* H1 bilingüe — client component que resuelve LocalizedString. */}
        <ProjectTitle title={project.title} />
        {/* Sidebar bilingüe — labels MY ROLE / INDUSTRY se traducen según
            el idioma actual; los valores quedan en inglés siempre. */}
        <ProjectHeaderSide role={project.role} industry={project.industry} />

        <style>{`
          .project-header {
            display: flex;
            gap: 32px;
            align-items: flex-start;
            width: 100%;
          }
          @media (max-width: 600px) {
            .project-header {
              flex-direction: column;
              gap: 24px;
            }
            .project-header h1 {
              font-size: 28px !important;
              line-height: 36px !important;
            }
            .project-header-side {
              width: 100% !important;
            }
          }
        `}</style>
      </header>
    </Reveal>
  )
}


// ============================================================
// Block renderer — switch sobre el tipo de block
// ============================================================

function BlockRenderer({ block }: { block: ResolvedBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <ProjectTextBlock
          heading={block.heading}
          body={block.body}
          items={block.items}
          highlight={block.highlight}
        />
      )
    case 'media':
      return (
        <ProjectMedia
          media={{ type: block.mediaType, src: block.src }}
          alt={block.alt}
          scale={block.scale}
          transparent={block.transparent}
          objectPosition={block.objectPosition}
          aspectRatio={block.aspectRatio}
        />
      )
    case 'quote':
      return <ProjectQuoteBlock text={block.text} />
    case 'columns':
      return <ProjectColumnsBlock items={block.items} />
    case 'statistics':
      return <ProjectStatisticsBlock items={block.items} />
    case 'testimonials':
      return <ProjectTestimonialsBlock items={block.items} />
    default:
      return null
  }
}

// ============================================================
// Media block — image / video con styling
// ============================================================

function ProjectMedia({
  media,
  alt,
  scale,
  transparent,
  eager = false,
  objectPosition,
  aspectRatio,
}: {
  media: { type: 'video' | 'image'; src: string }
  alt?: string
  /**
   * Escala opcional aplicada al asset interno. Útil cuando el video/imagen
   * tiene padding interno y no llena el contenedor con object-fit: cover.
   * El `overflow: hidden` del contenedor recorta lo sobrante.
   */
  scale?: number
  /**
   * Si true, el contenedor no aplica el background gris oscuro var(--bg-2).
   * Para SVG/PNG transparentes que tienen que mostrarse directo sobre el
   * background de la página (ej. flowcharts, ilustraciones).
   */
  transparent?: boolean
  /**
   * Si true, el asset carga eager (no lazy). Reservar para el hero del
   * detail page que está above-the-fold y es el LCP. Default false →
   * lazy loading para imágenes + preload metadata para videos.
   */
  eager?: boolean
  /**
   * CSS object-position aplicado al asset. Default 'center center'.
   * Útil para imágenes con sujeto descentrado en el canvas.
   */
  objectPosition?: string
  /**
   * Aspect-ratio del contenedor del media. Default: '16 / 9'.
   * Útil cuando el asset original tiene proporciones distintas — evita que
   * `object-fit: cover` estire/recorte el contenido. Acepta cualquier valor
   * válido de CSS `aspect-ratio` (ej. '4 / 3', '3 / 2', '1 / 1').
   */
  aspectRatio?: string
}) {
  // Para SVG transparentes, object-fit: contain muestra el asset completo
  // sin recortarlo (centrado en el container). Para el resto, cover llena
  // el container — el comportamiento por default que ya teníamos.
  const objectFit = transparent ? 'contain' : 'cover'

  // Hover-to-zoom: aplica a media de bloques internos (videos E imágenes,
  // pero NO al hero ni a SVG transparentes como el flowchart). En desktop
  // con mouse, el asset escala +22% en hover → permite ver el contenido
  // (dashboards, UIs, mockups mobile) más de cerca sin abrir una vista
  // extra. En tablet/mobile el efecto está desactivado vía media query.
  const isZoomable = !eager && !transparent

  const mediaStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition: objectPosition ?? 'center center',
    display: 'block',
    transform: scale && scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: 'center center',
  }

  // Concatenar las clases que necesite el contenedor (varias features
  // pueden activarse a la vez: expanded para transparent, zoomable para
  // hover-to-zoom). filter(Boolean).join(' ') deja un string limpio sin
  // espacios sobrantes ni "undefined".
  const wrapperClassName =
    [
      transparent && 'project-media-expanded',
      isZoomable && 'project-media-zoomable',
    ]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <Reveal direction="up" distance={24} duration={1000}>
      <div
        className={wrapperClassName}
        style={{
          // Cuando es transparente, el ancho lo controla la clase CSS
          // (rompe el max-width 832 del contenedor padre para que las
          // ilustraciones respiren). Si no, usa 100% del parent.
          width: transparent ? undefined : '100%',
          // Aspect-ratio configurable por bloque. Default 16:9 — la mayoría
          // de los assets están exportados en este ratio. Casos puntuales
          // pueden override (ej. mockups 4:3 que con 16:9 + cover quedan
          // recortados/estirados).
          aspectRatio: aspectRatio ?? '16 / 9',
          // Sin border-radius en assets transparentes (no hay contenedor
          // visible que necesite curva). Mantenemos 12px para los que sí
          // tienen background.
          borderRadius: transparent ? 0 : 12,
          overflow: 'hidden',
          background: transparent ? 'transparent' : 'var(--bg-2)',
          position: 'relative',
        }}
      >
        {media.type === 'video' ? (
          <video
            src={media.src}
            autoPlay
            loop
            muted
            playsInline
            preload={eager ? 'auto' : 'metadata'}
            style={mediaStyle}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.src}
            alt={alt ?? ''}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            style={mediaStyle}
          />
        )}

        <style>{`
          /* Assets transparentes (ej. flowcharts, ilustraciones) rompen el
             max-width 832 del contenedor de texto para mostrar más detalle.
             El centrado se hace con margin-left: 50% + translateX(-50%) — eso
             permite que el elemento se posicione respecto al CENTRO del parent
             aunque sea más ancho que el parent. */
          .project-media-expanded {
            width: min(calc(100vw - 224px), 1024px);
            margin-left: 50%;
            transform: translateX(-50%);
          }
          /* Tablet: padding lateral de la página baja a 64px → ancho usable
             viewport - 128. El cap de 1024 sigue aplicando. */
          @media (max-width: 1024px) {
            .project-media-expanded {
              width: min(calc(100vw - 128px), 1024px);
            }
          }
          /* Mobile: no break-out — el parent ya ocupa todo el ancho
             disponible (padding 16px). Vuelve a 100% normal. */
          @media (max-width: 600px) {
            .project-media-expanded {
              width: 100%;
              margin-left: 0;
              transform: none;
            }
          }

          /* ============================================================
             Hover-to-zoom — adaptado del patrón cult-ui (hover-video-player).
             Aplica SOLO a videos de bloques internos (no al hero, no a
             ilustraciones transparentes). El video sigue con autoplay; el
             hover sólo cambia el tamaño visual con un scale para que el
             usuario pueda inspeccionar el contenido más de cerca.

             - transform-origin: center → el zoom se centra en el video,
               no se desplaza hacia los costados.
             - z-index al hover → el video escalado pasa por encima de
               cualquier contenido adyacente (evita parecer "tapado").
             - box-shadow al hover → soft drop shadow para separar
               visualmente el video del fondo cuando está escalado.
             - easing cubic-bezier(0.32, 0.72, 0, 1) → el mismo del
               cult-ui demo, da una sensación natural y editorial.
             ============================================================ */
          .project-media-zoomable {
            position: relative;
            z-index: 1;
            transform-origin: center;
            transition:
              transform 500ms cubic-bezier(0.32, 0.72, 0, 1),
              box-shadow 500ms cubic-bezier(0.32, 0.72, 0, 1);
          }
          /* Hover SOLO en devices con mouse real. En tablet táctil y en
             mobile el efecto no aparece — quedan al tamaño normal. */
          @media (hover: hover) and (pointer: fine) {
            .project-media-zoomable:hover {
              /* scale 1.22 → el video pasa de 832px (ancho del body) a
                 ~1015px visualmente, justo por encima del contenedor
                 de texto. Suficiente para inspeccionar dashboards/UIs
                 sin perder contexto visual del case study. */
              transform: scale(1.22);
              z-index: 10;
              box-shadow: 0 32px 72px rgba(0, 0, 0, 0.5);
            }
          }
          /* Respetar reduced-motion: sin escala, sin transición. */
          @media (prefers-reduced-motion: reduce) {
            .project-media-zoomable {
              transition: none;
            }
            .project-media-zoomable:hover {
              transform: none;
            }
          }
        `}</style>
      </div>
    </Reveal>
  )
}

// ============================================================
// Intro — heading + body grande (después del media principal)
// ============================================================

function ProjectIntro({ intro }: { intro: { heading: string; body: string } }) {
  return (
    <Reveal direction="up" distance={24} duration={1000}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2
          style={{
            fontFamily: '"Neue Montreal", var(--font-sans)',
            fontWeight: 500,
            fontSize: 32,
            lineHeight: '40px',
            letterSpacing: '-0.64px',
            color: 'var(--fg-1)',
            margin: 0,
          }}
          className="project-intro-heading"
        >
          {intro.heading}
        </h2>
        <ProjectBody body={intro.body} color="var(--fg-3)" />
        <style>{`
          @media (max-width: 600px) {
            .project-intro-heading {
              font-size: 24px !important;
              line-height: 32px !important;
            }
          }
        `}</style>
      </div>
    </Reveal>
  )
}

// ============================================================
// Body helper — convierte \n\n en párrafos separados
// ============================================================

/**
 * Body helper — convierte \n\n en párrafos separados.
 * `color` permite override. Default = fg-3 (secondary) porque la regla
 * del DS es: el body/description siempre va en secondary.
 * Tamaño L/Regular del Figma: 20/36 weight 400.
 */
function ProjectBody({ body, color = 'var(--fg-3)' }: { body: string; color?: string }) {
  return (
    <>
      {body.split('\n\n').map((para, i) => (
        <p
          key={i}
          className="project-body-text"
          style={{
            color,
            margin: 0,
          }}
        >
          {para.split('\n').map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </>
  )
}

// ============================================================
// Text block — heading + body + items (bullets opcionales)
// ============================================================

function ProjectTextBlock({
  heading,
  body,
  items,
  highlight = false,
}: {
  heading?: string
  body?: string
  items?: ResolvedTextItem[]
  highlight?: boolean
}) {
  return (
    <Reveal direction="up" distance={24} duration={1000}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {heading && (
          <h3
            className="project-section-heading"
            style={{
              fontFamily: '"Neue Montreal", var(--font-sans)',
              fontWeight: 500,
              fontSize: 32,
              lineHeight: '40px',
              letterSpacing: '-0.64px',
              color: 'var(--fg-1)',
              margin: 0,
            }}
          >
            {heading}
          </h3>
        )}
        {body && <ProjectBody body={body} />}
        {items && items.length > 0 && (
          highlight ? (
            // Items destacados — texto primary sin bullets (ej. tokens del DS,
            // overflow.html / DESIGN_SYSTEM.html). Si el item es objeto
            // {label, description} (formato Luma), usamos solo el label como
            // texto destacado (la description se descarta en este modo).
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {items.map((item, i) => (
                <p
                  key={i}
                  className="project-body-text"
                  style={{
                    color: 'var(--fg-1)',
                    margin: 0,
                  }}
                >
                  {typeof item === 'string' ? item : item.label}
                </p>
              ))}
            </div>
          ) : (
            // Bullets normales — color secondary con disco. Si el item es
            // objeto {label, description}, el label va en primary y la
            // description en secondary, todo dentro del mismo <li> (patrón
            // del Figma de Luma: "Project-based financial organization: ...").
            <ul
              style={{
                margin: 0,
                paddingLeft: 30,
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {items.map((item, i) => (
                <li
                  key={i}
                  className="project-body-text"
                  style={{
                    // Color base del item — la description usa este color
                    // (secondary). Si el item es objeto, el label override
                    // con primary via <span> inline abajo.
                    color: 'var(--fg-3)',
                  }}
                >
                  {typeof item === 'string' ? (
                    item
                  ) : (
                    <>
                      <span style={{ color: 'var(--fg-1)' }}>{item.label}</span>
                      {item.description}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
        <style>{`
          @media (max-width: 600px) {
            .project-section-heading {
              font-size: 24px !important;
              line-height: 32px !important;
            }
          }
        `}</style>
      </div>
    </Reveal>
  )
}

// ============================================================
// Quote block — texto destacado en grande
// ============================================================

function ProjectQuoteBlock({ text }: { text: string }) {
  return (
    <Reveal direction="up" distance={24} duration={1000}>
      <blockquote
        style={{
          fontFamily: '"Neue Montreal", var(--font-sans)',
          fontWeight: 500,
          fontSize: 24,
          lineHeight: '32px',
          letterSpacing: '-0.25px',
          color: 'var(--fg-1)',
          margin: 0,
          padding: '24px 0',
          borderTop: '1px solid var(--border-2)',
          borderBottom: '1px solid var(--border-2)',
        }}
      >
        {text}
      </blockquote>
    </Reveal>
  )
}

// ============================================================
// Columns block — 3 columnas de bullets
// ============================================================

function ProjectColumnsBlock({ items }: { items: { heading: string; bullets: string[] }[] }) {
  return (
    <Reveal direction="up" distance={24} duration={1000}>
      <div className="project-columns">
        {items.map((col, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4
              style={{
                fontFamily: '"Neue Montreal", var(--font-sans)',
                // Regla del DS: si el texto estaba en medium, baja a regular.
                fontWeight: 400,
                fontSize: 16,
                lineHeight: '28px',
                color: 'var(--fg-1)',
                margin: 0,
              }}
            >
              {col.heading}
            </h4>
            <ul
              style={{
                margin: 0,
                paddingLeft: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {col.bullets.map((bullet, j) => (
                <li
                  key={j}
                  style={{
                    fontFamily: '"Neue Montreal", var(--font-sans)',
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: '28px',
                    // Regla del DS: el body/description siempre en secondary.
                    color: 'var(--fg-3)',
                  }}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <style>{`
          .project-columns {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }
          /* Breakpoint del DS (≤1024 = tablet+mobile). Antes era 768,
             que no estaba alineado con el resto del detail page y
             colapsaba a 1 columna mientras la página seguía en layout
             tablet. */
          @media (max-width: 1024px) {
            .project-columns {
              grid-template-columns: 1fr;
              gap: 24px;
            }
          }
        `}</style>
      </div>
    </Reveal>
  )
}

// ============================================================
// Statistics block — 3 columnas con números grandes
// ============================================================

function ProjectStatisticsBlock({
  items,
}: {
  items: { value: string; label: string; description?: string }[]
}) {
  return (
    <Reveal direction="up" distance={24} duration={1000}>
      <div className="project-statistics">
        {items.map((stat, i) => (
          <div
            key={i}
            className="project-stat-item"
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <div
              style={{
                fontFamily: '"Neue Montreal", var(--font-sans)',
                fontWeight: 500,
                fontSize: 48,
                lineHeight: '56px',
                letterSpacing: '-1px',
                color: 'var(--fg-1)',
              }}
              className="project-stat-value"
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: '"Neue Montreal", var(--font-sans)',
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: 'var(--fg-1)',
              }}
            >
              {stat.label}
            </div>
            {stat.description && (
              <div
                style={{
                  fontFamily: '"Neue Montreal", var(--font-sans)',
                  fontWeight: 400,
                  fontSize: 13,
                  lineHeight: '20px',
                  color: 'var(--fg-3)',
                  marginTop: 8,
                }}
              >
                {stat.description}
              </div>
            )}
          </div>
        ))}
        <style>{`
          .project-statistics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
          }
          /* Padding interno horizontal específico del bloque statistics
             (Figma node 638:4910) — diferencia el bloque del resto del
             case study, da más respiración entre value/label/description
             y los bordes de su columna. */
          .project-stat-item {
            padding: 0 48px;
          }
          /* Breakpoint del DS (≤1024). Antes era 768 → desalineado con el
             resto del detail page. */
          @media (max-width: 1024px) {
            .project-statistics {
              grid-template-columns: 1fr;
              gap: 32px;
            }
            /* Mantenemos 48px de padding lateral interno en tablet/mobile
               para que el contenido (value + label + description) no se
               estire de borde a borde del contenedor — Agustina lo pidió
               explícitamente para mejor legibilidad en breakpoints chicos. */
            .project-stat-item {
              padding: 0 48px;
            }
            .project-stat-value {
              font-size: 40px !important;
              line-height: 48px !important;
            }
          }
        `}</style>
      </div>
    </Reveal>
  )
}

// ============================================================
// Testimonials block — cards con avatares y reviews
// ============================================================

function ProjectTestimonialsBlock({ items }: { items: ProjectTestimonial[] }) {
  return (
    <Reveal direction="up" distance={24} duration={1000}>
      <div className="iunok-reviews-expanded">
        {/* Slider horizontal infinito con fade en los bordes — mismo patrón
            que el slider de testimonials del home (LogoLoop), pero con
            fadeOut para que las cards se difuminen suavemente en los
            extremos en lugar de cortarse. hoverSpeed=0 pausa el slider
            cuando el cursor está encima para que el usuario pueda leer. */}
        <LogoLoop
          logos={items.map((t, i) => ({ node: <TestimonialCard testimonial={t} key={i} /> }))}
          speed={30}
          direction="left"
          gap={32}
          logoHeight={0}
          hoverSpeed={0}
          fadeOut
          fadeOutColor="var(--bg-1)"
          ariaLabel="Reviews"
          className="iunok-reviews-loop"
        />

        <style>{`
          /* Desktop (>1024px): el slider respeta el ancho del contenedor
             de texto del case study (832 max-width). Los cards se
             difuminan en los bordes de esa misma zona — alineados con
             el resto del contenido. */
          .iunok-reviews-expanded {
            width: 100%;
            /* overflow:hidden acá Y en el .logoloop child — doble defensa
               contra el track del LogoLoop (width:max-content) que se
               renderiza más ancho que su contenedor. */
            overflow: hidden;
          }

          /* Clipping físico del slider. */
          .iunok-reviews-loop {
            overflow: hidden;
          }

          /* Fade en los bordes del slider en desktop. !important para
             ganar specificity sobre la regla base del LogoLoop. */
          .iunok-reviews-loop.logoloop--fade::before,
          .iunok-reviews-loop.logoloop--fade::after {
            width: clamp(80px, 14%, 160px) !important;
          }

          /* Tablet + mobile (≤1024px): el slider se extiende full-bleed
             hasta los bordes del viewport y se quita el fade — los cards
             se cortan limpio al pasar el borde. En estos breakpoints el
             contenedor de texto es muy angosto, el fade no aporta y los
             cards se ven cortados muy temprano. */
          @media (max-width: 1024px) {
            .iunok-reviews-expanded {
              width: 100vw;
              margin-left: 50%;
              transform: translateX(-50%);
            }
            .iunok-reviews-loop.logoloop--fade::before,
            .iunok-reviews-loop.logoloop--fade::after {
              display: none !important;
            }
          }

          /* Cards top-aligned dentro del slider para que las de altura
             distinta no se estiren raro (Alfonso es bastante más alto que
             Luis y Andrea). Cada card tiene width fijo. */
          .iunok-reviews-loop .logoloop__list {
            align-items: flex-start !important;
          }
          .iunok-reviews-loop .review-card {
            width: 400px;
            box-sizing: border-box;
          }

          /* LogoLoop tiene una regla global ".logoloop__item img" que
             aplica height:var(--logoloop-logoHeight) + width:auto a TODAS
             las images dentro del item. Como pasé logoHeight=0, todas
             las imágenes (avatar, stars, action icons) se renderizan con
             altura 0. Reseteamos eso acá y dejamos que cada clase defina
             su propio sizing con !important para ganar specificity. */
          .iunok-reviews-loop .logoloop__item img {
            width: auto;
            height: auto;
          }
          .iunok-reviews-loop .review-avatar {
            width: 32px !important;
            height: 32px !important;
          }
          .iunok-reviews-loop .review-action-icon {
            width: 18px !important;
            height: 18px !important;
          }
          /* Stars son inline SVG (no <img>) → no las afecta la regla
             ".logoloop__item img" del LogoLoop, no necesitan override. */

          /* ============================================================
             Estilos de la review card (extraídos de TestimonialCard para
             evitar duplicación). Sin background, sin border — Google
             reviews style.
             ============================================================ */
          .review-card {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .review-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }
          .review-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
            background: var(--bg-2);
          }
          .review-avatar-fallback {
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--color-accent);
            color: #fafafa;
            font-family: 'Neue Montreal', var(--font-sans);
            font-weight: 500;
            font-size: 14px;
          }
          .review-author {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
            flex: 1;
          }
          .review-name {
            font-family: 'Neue Montreal', var(--font-sans);
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            color: var(--fg-1);
          }
          .review-meta {
            font-family: 'Neue Montreal', var(--font-sans);
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: var(--fg-3);
          }
          .review-more {
            flex-shrink: 0;
            background: none;
            border: none;
            color: var(--fg-3);
            padding: 4px;
            cursor: default;
            line-height: 0;
          }
          .review-rating {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .review-stars {
            display: inline-flex;
            gap: 2px;
          }
          .review-ago {
            font-family: 'Neue Montreal', var(--font-sans);
            font-weight: 400;
            font-size: 12px;
            line-height: 16px;
            color: var(--fg-3);
          }
          .review-text {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .review-text p {
            font-family: 'Neue Montreal', var(--font-sans);
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            color: var(--fg-2);
            margin: 0;
          }
          .review-actions {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 4px;
          }
          .review-action-icon {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }
          .review-likes {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-family: 'Neue Montreal', var(--font-sans);
            font-weight: 400;
            font-size: 13px;
            line-height: 18px;
            color: var(--fg-2);
          }
        `}</style>
      </div>
    </Reveal>
  )
}

/**
 * Card de review estilo Google Maps reviews — sin background, sin border.
 * Layout: header (avatar + nombre/meta + menú) → rating → texto → acciones.
 * Match del Figma node 638:4951. Los estilos viven en el `<style>` global
 * de `ProjectTestimonialsBlock` (extraídos para evitar duplicación cuando
 * el slider replica las cards).
 */
function TestimonialCard({ testimonial }: { testimonial: ProjectTestimonial }) {
  const rating = testimonial.rating ?? 5

  return (
    <article className="review-card">
      {/* Header: avatar + nombre/meta + menú ⋮ */}
      <header className="review-header">
        {testimonial.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.avatar}
            alt=""
            className="review-avatar"
            aria-hidden="true"
          />
        ) : (
          // Fallback: círculo accent con inicial
          <div className="review-avatar review-avatar-fallback" aria-hidden="true">
            {testimonial.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="review-author">
          <div className="review-name">{testimonial.name}</div>
          <div className="review-meta">{testimonial.meta}</div>
        </div>
        <span className="review-more" aria-hidden="true">
          <MoreVerticalIcon />
        </span>
      </header>

      {/* Rating: 5 estrellas (N llenas + 5-N vacías) + "Hace X meses".
          Antes solo se rendeaban N estrellas amarillas → leía como
          "N de N" en vez de "N de 5". Ahora siempre se ven las 5
          posiciones, mostrando claramente el rating relativo. */}
      <div className="review-rating">
        <div className="review-stars" aria-label={`${rating} de 5 estrellas`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < rating} />
          ))}
        </div>
        {testimonial.ago && <span className="review-ago">{testimonial.ago}</span>}
      </div>

      {/* Texto: párrafos separados */}
      <div className="review-text">
        {testimonial.text.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Acciones: like (heart outline) + corazón rojo con count + share */}
      <div className="review-actions">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/work/iunok/reviews/like-button.svg"
          alt=""
          className="review-action-icon"
          aria-hidden="true"
        />
        {typeof testimonial.likes === 'number' && testimonial.likes > 0 && (
          <span className="review-likes">
            {/* Corazón rojo inline (el asset like-icon.svg que estaba en la
                carpeta era un cuadrado gris placeholder, no un corazón). */}
            <RedHeartIcon />
            {testimonial.likes}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/work/iunok/reviews/share-button.svg"
          alt=""
          className="review-action-icon"
          aria-hidden="true"
        />
      </div>
    </article>
  )
}

/**
 * Estrella del rating de Google reviews.
 * - `filled=true` → versión sólida con el amarillo de Google Maps (#FABB05),
 *   mismo path que el asset star-icon.svg que la diseñadora ya validó.
 * - `filled=false` → versión "outline": gris suave para representar las
 *   estrellas no obtenidas, manteniendo siempre 5 posiciones visibles.
 */
function StarIcon({ filled }: { filled: boolean }) {
  const color = filled ? '#FABB05' : '#3C3C46'
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5.9 0.5L2.5 11L11.3 4.6H0.5L9.3 11L5.9 0.5Z"
        fill={color}
        stroke={color}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Ícono de menú vertical (3 puntos) — el que aparece arriba a la derecha
 * de cada review en Google Maps. Decorativo, no interactivo.
 */
function MoreVerticalIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="3" r="1.25" fill="currentColor" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="8" cy="13" r="1.25" fill="currentColor" />
    </svg>
  )
}

/**
 * Corazón rojo filled — usado al lado del count de likes en cada review.
 * Inline en lugar de SVG asset porque `like-icon.svg` que estaba en la
 * carpeta de assets era un cuadrado gris placeholder, no el corazón rojo
 * del Figma.
 */
function RedHeartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#EA4335"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}
