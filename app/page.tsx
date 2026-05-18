import { WorkCard } from '@/components/WorkCard'
import { SelectedWorkTitle } from '@/components/SelectedWorkTitle'
import { Footer } from '@/components/Footer'
import { HeroPhysicsOverlay } from '@/components/hero/HeroPhysicsOverlay'
import { HeroPlaygroundCursor } from '@/components/hero/HeroPlaygroundCursor'
import { HeroWordmarkScroll } from '@/components/hero/HeroWordmarkScroll'
import { HeroWordmarkLetters } from '@/components/hero/HeroWordmarkLetters'
import { HeroMobilePhysicsOverlay } from '@/components/hero/HeroMobilePhysicsOverlay'
import { HeroMobileWordmark } from '@/components/hero/HeroMobileWordmark'
import { WhatIDo } from '@/components/WhatIDo'
import { MyToolkit } from '@/components/MyToolkit'
import { AboutMe } from '@/components/AboutMe'
import { Reveal } from '@/components/Reveal'
import projects from '@/data/projects'

function Hero() {
  return (
    <section
      aria-label="agustina müller — product designer"
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--bg-1)',
        /* overflow: visible — para que el wordmark agrandado al scrollear
           no se recorte por arriba/abajo del section. El playground físico
           tiene su propio overflow:hidden en su wrapper interno. */
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Zona de física — playground contenido (max 1280px). overflow:hidden
          impide que los assets se desborden visualmente hacia el wordmark.
          Envuelto en HeroWordmarkScroll para que aplique la MISMA animación
          de salida (scale + blur + fade out) sincronizada con el wordmark. */}
      <HeroWordmarkScroll
        className="hero-physics-wrap"
        style={{
          width: '100%',
          // Sin max-width — rellena todo el ancho del section padre
          // (que tiene padding 24 lateral). El padding del hero es único:
          // siempre 24px respecto al viewport, sin max-content adicional.
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <HeroPhysicsOverlay />
      </HeroWordmarkScroll>

      {/* Wordmark "agustina müller" desktop — letras individuales que caen
          con stagger. HeroWordmarkScroll wrapper aplica zoom + blur + fade
          out al scrollear. */}
      <HeroWordmarkScroll
        className="hero-desktop-wrap"
        style={{
          width: '100%',
          // Sin max-width — rellena todo el ancho del section padre
          // (que tiene padding 24 lateral). El wordmark queda con solo
          // 24px de cada lado al viewport.
          position: 'relative',
          zIndex: 1,
        }}
      >
        <HeroWordmarkLetters className="hero-desktop" />
      </HeroWordmarkScroll>

      {/* ==================== MOBILE ==================== */}

      {/* Playground físico MOBILE — pills más chicas, viewBox 393×180.
          Wrapped en HeroWordmarkScroll para que tenga el mismo scroll-out
          animation (scale + blur + fade) que las pills desktop. */}
      <HeroWordmarkScroll
        className="hero-physics-mobile-wrap"
        style={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <HeroMobilePhysicsOverlay />
      </HeroWordmarkScroll>

      {/* Wordmark MOBILE — "agustina" arriba + "müller" abajo, letras
          individuales con stagger continuo. Mismo scroll-out animation. */}
      <HeroWordmarkScroll
        className="hero-wordmark-mobile-wrap"
        style={{
          width: '100%',
          position: 'relative',
          zIndex: 1,
          // Sin padding — el playground (más alto) ya da el aire vertical
          // necesario, así "agustina müller" queda pegado a las pills caídas
          // (no hay gap vacío entre el playground y el wordmark).
          paddingTop: 0,
        }}
      >
        <HeroMobileWordmark />
      </HeroWordmarkScroll>

      {/* Cursor del playground — montado FUERA del HeroWordmarkScroll
          (transform rompería el position:fixed del cursor). Solo desktop. */}
      <HeroPlaygroundCursor />

      <style>{`
        /* Por defecto (desktop > 1024px): mostrar componentes desktop */
        .hero-physics-mobile-wrap { display: none; }
        .hero-wordmark-mobile-wrap { display: none; }

        /* MOBILE Y TABLET (≤1024px): usar versión mobile completa
           (wordmark mobile dividido en 2 líneas + playground mobile). */
        @media (max-width: 1024px) {
          .hero-desktop-wrap { display: none !important; }
          .hero-physics-wrap { display: none !important; }
          .hero-physics-mobile-wrap { display: block !important; }
          .hero-wordmark-mobile-wrap { display: block !important; }
        }

        /* Padding del hero — único del hero, diferenciado del resto.
           Aplicado al SECTION (no a cada wrap individual). El padding
           del section afecta a todo el contenido interno (wordmark y
           playground), manteniendo el mismo padding lateral en ambos.
           Aplicar padding directo al .hero-physics-wrap (con overflow:hidden
           y matter-js dentro) causaba que las pills se vean cortadas. */
        section[aria-label="agustina müller — product designer"] {
          padding: 0 24px;
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          section[aria-label="agustina müller — product designer"] {
            padding: 0 16px;
          }
        }
      `}</style>
    </section>
  )
}

function ExploreSection() {
  return (
    <section
      id="work"
      className="work-section"
      style={{
        padding: '80px 0 112px',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* Título "Selected Work" — Reveal slide desde abajo.
          waitForHero: espera a que el hero termine antes de animar (en
          tablet la sección puede estar en viewport al cargar). */}
      <Reveal
        direction="up"
        distance={40}
        duration={900}
        rootMargin="0px 0px 10% 0px"
        waitForHero
      >
        {/* Título bilingüe — client component que lee el idioma del Context.
            Sus estilos están en SelectedWorkTitle.tsx (matchean al inline
            anterior). */}
        <SelectedWorkTitle />
      </Reveal>

      {/* Grid: 2 columnas desktop, 1 columna mobile. Cards entran con
          mismas direcciones en ambos breakpoints (right/left). */}
      <div
        className="work-grid-wrap"
        style={{
          width: '100%',
          padding: '0 112px',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="work-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 32,
            width: '100%',
          }}
        >
          {projects.map((p, i) => (
            <Reveal
              key={p.slug}
              // i=0 → card 1 entra desde la izquierda (direction="right")
              // i=1 → card 2 entra desde la derecha (direction="left")
              direction={i === 0 ? 'right' : 'left'}
              distance={80}
              duration={900}
              rootMargin="0px 0px 10% 0px"
              waitForHero
            >
              <WorkCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Responsive mobile — Figma 434:1449 */}
      <style>{`
        @media (max-width: 600px) {
          .work-section {
            padding: 56px 0 56px !important;
            gap: 24px !important;
          }
          .work-section-title {
            font-size: 32px !important;
            line-height: 40px !important;
            letter-spacing: -0.5px !important;
            padding: 0 16px !important;
          }
          .work-grid-wrap {
            padding: 0 16px !important;
          }
          .work-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      {/* Hero ya tiene su propia animación de entrada al cargar la página
          (anim-enter-navbar + anim-enter-wordmark) — no se envuelve con Reveal. */}
      <Hero />

      {/* Todas las secciones usan fade in armonioso (Reveal con mismos params). */}
      <WhatIDo />
      <ExploreSection />
      <MyToolkit />
      <AboutMe />

      <Reveal duration={800} distance={32} rootMargin="0px 0px 10% 0px">
        <Footer />
      </Reveal>
    </>
  )
}
