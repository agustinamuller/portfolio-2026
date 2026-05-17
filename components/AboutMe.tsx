'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'
import BlurText from './BlurText'
import LogoLoop from './LogoLoop'

const TITLE_TEXT =
  "I've always been interested in understanding how people interact with technology. Today, I design digital experiences where product, systems, and human behavior connect in an intuitive, functional, and intentional way."

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Smart, proactive, and incredibly talented at creating intuitive UI/UX experiences.',
    name: 'Francisco Rosso',
    role: 'Senior iOS Engineer',
  },
  {
    quote: 'Agustina never makes a design decision without first understanding the user, and in UX, that makes all the difference.',
    name: 'Martín Stefoni',
    role: 'Senior iOS Engineer',
  },
  {
    quote: 'Agustina transforms business needs into clear, functional, and beautifully crafted digital experiences.',
    name: 'Johanna Herrera',
    role: 'Project Manager',
  },
  {
    quote: 'She combines strong UX thinking with exceptional communication, collaboration, problem solving skills.',
    name: 'Santiago Coronel',
    role: 'Senior Software Engineer',
  },
]

interface Testimonial {
  quote: string
  name: string
  role: string
}

/**
 * Sección "About me" del Home — node Figma 562:2793.
 * - Título grande full-width con efecto DecryptedText al entrar al viewport.
 * - 2 cards lado a lado con fondo dark: imagen/story + story profesional.
 * - 3 cards de testimonios con fondo dark y avatar LinkedIn.
 * - Cursor decorativo que sigue al mouse, visible sólo dentro de la sección.
 */
export function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar mobile y tablet (≤1024px) para no montar el cursor decorativo.
  // Solo se monta en desktop (>1024px).
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    setIsMobile(mq.matches)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Cursor decorativo con fade gradual — DESKTOP ONLY.
  // No se monta en mobile (no hay mouse cursor en touch).
  useEffect(() => {
    if (isMobile) return
    const section = sectionRef.current
    const cursor = cursorRef.current
    if (!section || !cursor) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let raf = 0
    let cx = 0
    let cy = 0
    let targetOpacity = 0

    const apply = () => {
      raf = 0
      cursor.style.transform = `translate(${cx}px, ${cy}px)`
      cursor.style.opacity = String(targetOpacity)
    }

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()

      cx = e.clientX
      cy = e.clientY

      // Binary inside/outside — cursor visible solo si el mouse está
      // dentro de la sección. La transition CSS 150ms suaviza el cambio.
      const isInside = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      )
      targetOpacity = isInside ? 1 : 0

      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About me"
      className="about-me"
      style={{
        padding: '96px 112px 112px',
        display: 'flex',
        flexDirection: 'column',
        gap: 56,
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        // Oculta el cursor del sistema cuando el mouse está sobre la sección
        // — sólo se ve el cursor decorativo SVG.
        cursor: 'none',
      }}
    >
      {/* Cursor decorativo — DESKTOP ONLY. No se renderiza en mobile. */}
      {!isMobile && (
      <div
        ref={cursorRef}
        className="about-cursor"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 130,
          height: 65,
          marginLeft: -11,
          marginTop: -10,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 150ms ease',
          zIndex: 5,
          willChange: 'transform',
        }}
      >
        <img
          src="/assets/cursor-about-me.svg"
          alt=""
          draggable={false}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
      )}

      {/* 1) Título grande con efecto BlurText — cada palabra entra con
          fade + blur + slide vertical al entrar al viewport. */}
      <BlurText
        text={TITLE_TEXT}
        animateBy="words"
        direction="top"
        delay={28}
        stepDuration={0.2}
        threshold={0.15}
        className="about-title-blur"
        style={{
          fontFamily: '"Neue Montreal", var(--font-sans)',
          fontWeight: 500,
          fontSize: 56,
          lineHeight: '64px',
          letterSpacing: '-2px',
          color: 'var(--fg-1)',
          width: '100%',
        }}
      />

      {/* 2) Dos cards: lado a lado en desktop, stacked en mobile */}
      <Reveal duration={900} distance={40} rootMargin="0px 0px 10% 0px" style={{ width: '100%' }}>
        <div
          className="about-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            width: '100%',
            alignItems: 'start',
          }}
        >
          {/* Card izquierda: imagen + story personal */}
          <article className="about-card">
            <img
              src="/assets/about-me.svg"
              alt="Agustina"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 8,
              }}
            />
            <p style={cardBody}>
              Outside of design, a big part of my inspiration comes from music, art, traveling, and absorbing references from architecture, film, and design. I have a very strong connection and sensitivity to music, especially the sounds and aesthetics of the 80s. I&rsquo;m deeply drawn to the atmospheres, visual identities, and cultural details that defined that era. I also have a pretty nerdy side: I love science fiction, fantasy, and fictional universes like Star Wars and Game of Thrones. I grew up playing The Sims, and that was probably where my obsession with creating things first began.
            </p>
          </article>

          {/* Card derecha: story profesional */}
          <article className="about-card">
            <h3
              style={{
                fontFamily: '"Neue Montreal", var(--font-sans)',
                fontWeight: 500,
                fontSize: 32,
                lineHeight: '40px',
                letterSpacing: '-0.5px',
                color: 'var(--fg-1)',
                margin: 0,
              }}
            >
              Graphic design was my passion… until I met UX
            </h3>

            <p style={cardBody}>
              A big part of my childhood and teenage years was spent experimenting on my computer, browsing the internet, discovering things out of curiosity, and creating. I spent hours exploring creative tools, editing visuals, customizing interfaces, and learning things simply because I enjoyed it. Back then, design was something purely visual to me. Years later, I studied Graphic Design &amp; Visual Communication, where I discovered web design and eventually UX/UI. By the time I graduated, I was already working as a UX Designer, realizing that design could also influence how people use, feel, and experience a digital product.
            </p>
          </article>
        </div>
      </Reveal>

      {/* 3) Testimonios — título + slider horizontal */}
      <Reveal duration={900} distance={40} rootMargin="0px 0px 10% 0px" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            width: '100%',
            marginTop: 24,
          }}
        >
          {/* Título — Neue Montreal Medium. En mobile reduce a 32/40lh. */}
          <h3
            className="about-testimonials-title"
            style={{
              fontFamily: '"Neue Montreal", var(--font-sans)',
              fontWeight: 500,
              fontSize: 56,
              lineHeight: '64px',
              letterSpacing: '-2px',
              color: 'var(--fg-1)',
              margin: 0,
            }}
          >
            Kind words from people I&rsquo;ve worked with
          </h3>

          {/* Slider horizontal infinito con LogoLoop. renderItem custom
              para mostrar cada testimonio como card. Sin fadeOut. */}
          <LogoLoop
            logos={TESTIMONIALS.map((t) => ({ node: <TestimonialCard testimonial={t} /> }))}
            speed={40}
            direction="left"
            gap={24}
            logoHeight={240}
            hoverSpeed={0}
            ariaLabel="Testimonials"
            className="testimonials-loop"
          />
        </div>
      </Reveal>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="about-testimonial-card">
      <p
        style={{
          fontFamily: '"Neue Montreal", var(--font-sans)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 18,
          lineHeight: '28px',
          color: 'var(--fg-1)',
          margin: 0,
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <LinkedInBadge />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: '"Neue Montreal", var(--font-sans)',
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '28px',
              color: 'var(--color-accent)',
            }}
          >
            {testimonial.name}
          </span>
          <span
            style={{
              fontFamily: '"Neue Montreal", var(--font-sans)',
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '16px',
              color: 'var(--fg-3)',
            }}
          >
            {testimonial.role}
          </span>
        </div>
      </div>
    </article>
  )
}

function LinkedInBadge() {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'var(--color-accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#fafafa" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    </div>
  )
}

const cardBody: React.CSSProperties = {
  fontFamily: '"Neue Montreal", var(--font-sans)',
  fontWeight: 400,
  fontSize: 16,
  lineHeight: '28px',
  color: 'var(--fg-2)',
  margin: 0,
}
