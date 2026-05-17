'use client'

import Link from 'next/link'
import { Project } from '@/data/projects'
import { CategoryTag } from './CategoryTag'
import { ArrowDiag } from './icons/ArrowDiag'

interface Props {
  project: Project
}

/**
 * Card de proyecto destacado en la sección "Selected Work" del home.
 *
 * Estructura:
 *  <article position:relative>
 *    ├─ work-card-media  (scale + overflow hidden)
 *    ├─ work-card-overlay (HERMANO del media, sobre él, visible en hover)
 *    └─ tags + título
 */
export function WorkCard({ project }: Props) {
  const { slug, year, tags, title, media, homeMedia } = project
  // Para la card del home preferimos `homeMedia` (asset liviano/optimizado
  // para la grid de Selected Work). Si no existe, caemos al `media` del hero
  // del detalle.
  const cardMedia = homeMedia ?? media

  return (
    <Link href={`/work/${slug}`} className="work-card-link">
      <article
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative', // anclaje para el overlay
        }}
      >
        {/* Media — único bloque con escala en hover y overflow hidden */}
        <div className="work-card-media">
          {cardMedia?.type === 'video' ? (
            // preload="metadata" → solo headers/duración inicial. Con autoPlay
            // el browser cargará más en cuanto el video esté en viewport, pero
            // esto evita bajar todo el byte-stream al cargar la home (sobre
            // todo en mobile/conexiones lentas).
            <video
              src={cardMedia.src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : cardMedia?.type === 'image' ? (
            // loading="lazy" en todas las cards. La primera (above-the-fold)
            // carga rápido igual porque es la primera petición; el lazy solo
            // evita bajar las cards de abajo del fold.
            <img
              src={cardMedia.src}
              alt={title}
              loading="lazy"
              decoding="async"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            // Fallback cuando un Project no define ni media ni homeMedia
            // — mostramos un placeholder con la inicial del título sobre
            // el bg-2 del contenedor. Evita una card visualmente vacía.
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Neue Montreal", var(--font-sans)',
                fontWeight: 500,
                fontSize: 96,
                lineHeight: 1,
                color: 'var(--fg-4)',
                letterSpacing: '-0.04em',
                userSelect: 'none',
              }}
            >
              {title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Overlay del botón — HERMANO del media, queda en su propia capa
            por encima del scale y overflow del media. Visible sólo en hover. */}
        <div className="work-card-overlay" aria-hidden="true">
          <span className="work-card-overlay-btn">
            view project
            <ArrowDiag size={14} color="#ffffff" />
          </span>
        </div>

        {/* Content: tags + título + botón mobile */}
        <div
          style={{
            paddingTop: 12,
            paddingBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16, // Figma mobile: gap 16 entre el bloque de título y el botón
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {year && <CategoryTag variant="year">{year}</CategoryTag>}
              {tags.map((t) => (
                <CategoryTag key={t}>{t}</CategoryTag>
              ))}
            </div>

            <h3
              style={{
                fontFamily: '"Neue Montreal", var(--font-sans)',
                fontWeight: 500,
                fontSize: 20,
                lineHeight: '32px',
                color: 'var(--fg-1)',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>

          {/* Botón "view project" — VISIBLE SOLO EN MOBILE. En desktop el
              CTA aparece como overlay sobre el media al hacer hover. En
              mobile no hay hover, así que mostramos el botón siempre. */}
          <span
            className="work-card-mobile-btn"
            aria-hidden="true"
          >
            view project
            <ArrowDiag size={14} color="#ffffff" />
          </span>
        </div>
      </article>
    </Link>
  )
}
