'use client'

import { useEffect, useState } from 'react'
import { Reveal } from './Reveal'
import { useLanguage } from '@/contexts/LanguageContext'

/**
 * Sección "what i do" — bilingüe inglés con palabras clave destacadas.
 *
 * Desktop: arrow icon + 2 columnas con animación lateral (Reveal direction).
 * Mobile:  sin arrow, 2 párrafos stacked vertical, fade in al cargar la
 *          página (no por scroll), porque la sección ya es visible en el
 *          primer fold junto con el hero — no tiene sentido esperar scroll
 *          para que aparezca.
 */
export function WhatIDo() {
  // Detectar mobile breakpoint. En SSR arranca en false; al hidratarse
  // en cliente se actualiza al valor real. Para evitar flash, ambos
  // estados renderizan los mismos elementos — sólo cambia el wrapper.
  const [isMobile, setIsMobile] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    setIsMobile(mq.matches)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Renderiza los 2 párrafos según el idioma:
  // - EN mantiene las palabras clave destacadas en spans (UX/UI, Product
  //   Designer, mobile apps, etc.) por ser el copy "marketing" del Figma.
  // - ES usa texto plano sin destacados (el copy en español del doc
  //   no tiene énfasis tipográfico marcado en el Figma de Agustina).
  const paragraph1 =
    language === 'es' ? (
      <p style={paragraphStyle}>
        Soy Agustina, <span style={emphasisStyle}>UX/UI</span> &amp;{' '}
        <span style={emphasisStyle}>Product Designer</span> de Argentina, enfocada en crear productos digitales claros, funcionales y escalables. Diseño{' '}
        <span style={emphasisStyle}>aplicaciones mobile</span> y{' '}
        <span style={emphasisStyle}>plataformas web</span>, equilibrando{' '}
        <span style={emphasisStyle}>necesidades de usuario</span> y{' '}
        <span style={emphasisStyle}>objetivos de negocio</span> para crear experiencias intuitivas y consistentes.
      </p>
    ) : (
      <p style={paragraphStyle}>
        I&rsquo;m Agustina, a <span style={emphasisStyle}>UX/UI</span> &{' '}
        <span style={emphasisStyle}>Product Designer</span> from Argentina focused on creating clear, functional, and scalable digital products. I design{' '}
        <span style={emphasisStyle}>mobile apps</span> and{' '}
        <span style={emphasisStyle}>web platforms</span> by balancing{' '}
        <span style={emphasisStyle}>user needs</span> and{' '}
        <span style={emphasisStyle}>business goals</span> to create intuitive and consistent experiences.
      </p>
    )

  const paragraph2 =
    language === 'es' ? (
      <p style={paragraphStyle}>
        Me especializo en <span style={emphasisStyle}>Product Design</span> y{' '}
        <span style={emphasisStyle}>Design Systems</span>, colaborando con equipos de producto y desarrollo en proyectos B2B, B2C, SaaS, fintech y e-commerce, transformando flujos complejos en soluciones simples, escalables y centradas en el usuario.
      </p>
    ) : (
      <p style={paragraphStyle}>
        I specialize in <span style={emphasisStyle}>Product Design</span> and{' '}
        <span style={emphasisStyle}>Design Systems</span>, collaborating with product and development teams across B2B, B2C, SaaS, fintech, and e-commerce projects to turn complex workflows into simple, scalable, user-centered solutions.
      </p>
    )

  return (
    <section
      aria-label="What I do"
      className="whatido-section"
      style={{
        // padding-top reducido de 96 → 64 (sube levemente el bloque
        // hacia el hero, dándole más conexión visual). Bottom mantiene
        // 112 para separación con Selected Work.
        padding: '64px 112px 112px',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="whatido-inner"
        style={{
          display: 'flex',
          gap: 40,
          alignItems: 'flex-start',
          width: '100%',
          maxWidth: 1280,
        }}
      >
        {/* Arrow icon morado — DESKTOP ONLY. El Figma mobile no lo incluye,
            así que se oculta con la media query de abajo. */}
        {!isMobile && (
          <Reveal
            direction="right"
            distance={80}
            duration={900}
            rootMargin="0px 0px 10% 0px"
            waitForHero
            className="whatido-arrow"
            style={{ flexShrink: 0 }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 36,
                height: 140,
                color: 'var(--color-accent)',
              }}
            >
              <ArrowIcon />
            </div>
          </Reveal>
        )}

        {/* Dos párrafos — desktop: lado a lado con Reveal lateral; mobile:
            stacked vertical con fade in al cargar (sin scroll trigger). */}
        <div
          className="whatido-content"
          style={{
            display: 'flex',
            gap: 32,
            alignItems: 'flex-start',
            flex: '1 1 0',
            minWidth: 0,
          }}
        >
          {isMobile ? (
            <>
              {/* Mobile: fade in al cargar la página, sincronizado con
                  la entrada del hero. Sin slide ni scroll trigger. */}
              <div className="whatido-mobile-fade-in" style={{ flex: '1 1 0', minWidth: 0 }}>
                {paragraph1}
              </div>
              <div
                className="whatido-mobile-fade-in"
                // animationDelay override del CSS (1500ms base) +500ms de
                // stagger = 2000ms para que aparezca DESPUÉS del primero,
                // no antes (inline override la propiedad delay del shorthand).
                style={{ flex: '1 1 0', minWidth: 0, animationDelay: '2000ms' }}
              >
                {paragraph2}
              </div>
            </>
          ) : (
            <>
              {/* Desktop: párrafos entran desde lados opuestos al scrollear */}
              <Reveal
                direction="right"
                distance={80}
                duration={900}
                rootMargin="0px 0px 10% 0px"
                waitForHero
                style={{ flex: '1 1 0', minWidth: 0 }}
              >
                {paragraph1}
              </Reveal>
              <Reveal
                direction="left"
                distance={80}
                duration={900}
                rootMargin="0px 0px 10% 0px"
                waitForHero
                style={{ flex: '1 1 0', minWidth: 0 }}
              >
                {paragraph2}
              </Reveal>
            </>
          )}
        </div>
      </div>

      {/* Responsive mobile y tablet — Figma 553:1633 adaptado.
          - Mobile/Tablet: sin arrow, párrafos stacked verticales
          - Mobile: padding 80px arriba / 16px laterales / 56px abajo
          - Tablet: padding 96px arriba / 64px laterales / 112px abajo
            (consistente con el resto de secciones tablet) */}
      <style>{`
        @media (max-width: 1024px) {
          .whatido-arrow {
            display: none !important;
          }
          .whatido-content {
            flex-direction: column !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 600px) {
          .whatido-section {
            /* padding-top reducido 80 → 56 (consistente con desktop) */
            padding: 56px 16px 56px !important;
          }
        }
      `}</style>
    </section>
  )
}

const paragraphStyle: React.CSSProperties = {
  flex: '1 1 0',
  minWidth: 0,
  fontFamily: '"Neue Montreal", var(--font-sans)',
  fontWeight: 400, // Regular (token M/Regular)
  fontSize: 16, // M/Regular: 16px
  lineHeight: '28px', // M/Regular: 28px
  color: 'var(--fg-3)', // text-secondary (#b4b4bc)
  margin: 0,
}


const emphasisStyle: React.CSSProperties = {
  color: 'var(--fg-1)', // text-primary (#fafafa) — destaca palabras clave
  fontWeight: 400,
}

function ArrowIcon() {
  return (
    <svg
      width="36"
      height="140"
      viewBox="0 0 36 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        d="M23.0337 8C23.0513 8.00171 23.0963 8.28616 23.1343 8.63379C23.718 13.9734 26.8309 17.5427 31.603 18.3447L32.3306 18.4668L32.3315 21.04L31.5278 21.168C28.3724 21.6684 25.771 23.5965 24.3218 26.5088C23.8569 27.4432 23.4221 28.9372 23.2427 30.2168C23.1534 30.8542 23.0715 31.4036 23.061 31.4375C23.0501 31.4711 22.3948 31.3499 21.604 31.168C20.8128 30.9859 20.1472 30.8187 20.1255 30.7969C20.0441 30.7121 20.4946 28.7628 20.7935 27.9072C21.8428 24.9027 23.6252 22.664 25.8774 21.5234L26.7456 21.084L3.66943 21.0352L3.66846 18.4307L26.7554 18.3955L26.0679 18.0684C23.2003 16.7015 20.9893 13.4338 20.2163 9.41895C20.1465 9.05636 20.1193 8.72918 20.1558 8.69238C20.2076 8.64118 22.8728 7.99995 23.0337 8Z"
        fill="currentColor"
      />
    </svg>
  )
}
