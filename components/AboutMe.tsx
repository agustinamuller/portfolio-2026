'use client'

// (sin useEffect/useRef/useState — el cursor decorativo se eliminó, ahora vive
// solo en el Hero)
import { Reveal } from './Reveal'
import BlurText from './BlurText'
import LogoLoop from './LogoLoop'
import { useLanguage, Language } from '@/contexts/LanguageContext'

const TITLE_TEXT = {
  en:
    "I've always been interested in understanding how people interact with technology. Today, I design digital experiences where product, systems, and human behavior connect in an intuitive, functional, and intentional way.",
  es:
    'Siempre me interesó entender cómo las personas interactúan con la tecnología. Hoy diseño experiencias digitales donde producto, sistemas y comportamiento humano se conectan de una forma intuitiva, funcional e intencional.',
}

// Testimonios — la quote se traduce, name y role quedan iguales (los roles
// son títulos profesionales que en LinkedIn están en inglés).
const TESTIMONIALS: Testimonial[] = [
  {
    quote: {
      en: 'Smart, proactive, and incredibly talented at creating intuitive UI/UX experiences.',
      es: 'Inteligente, proactiva e increíblemente talentosa para crear experiencias UI/UX intuitivas.',
    },
    name: 'Francisco Rosso',
    role: 'Senior iOS Engineer',
  },
  {
    quote: {
      en:
        'Agustina never makes a design decision without first understanding the user, and in UX, that makes all the difference.',
      es:
        'Agustina nunca toma una decisión de diseño sin antes entender al usuario, y en UX eso hace toda la diferencia.',
    },
    name: 'Martín Stefoni',
    role: 'Senior iOS Engineer',
  },
  {
    quote: {
      en:
        'Agustina transforms business needs into clear, functional, and beautifully crafted digital experiences.',
      es:
        'Agustina transforma necesidades de negocio en experiencias digitales claras, funcionales y visualmente muy bien resueltas.',
    },
    name: 'Johanna Herrera',
    role: 'Project Manager',
  },
  {
    quote: {
      en:
        'She combines strong UX thinking with exceptional communication, collaboration, problem solving skills.',
      es:
        'Combina una mirada sólida de UX con excelentes habilidades de comunicación, colaboración y resolución de problemas.',
    },
    name: 'Santiago Coronel',
    role: 'Senior Software Engineer',
  },
]

interface Testimonial {
  quote: { en: string; es: string }
  name: string
  role: string
}

const CARD_LEFT_BODY = {
  en:
    'Outside of design, a big part of my inspiration comes from music, art, traveling, and absorbing references from architecture, film, and design. I have a very strong connection and sensitivity to music, especially the sounds and aesthetics of the 80s. I’m deeply drawn to the atmospheres, visual identities, and cultural details that defined that era. I also have a pretty nerdy side: I love science fiction, fantasy, and fictional universes like Star Wars and Game of Thrones. I grew up playing The Sims, and that was probably where my obsession with creating things first began.',
  es:
    'Fuera del diseño, gran parte de mi inspiración viene de la música, el arte, los viajes y de absorber referencias de arquitectura, cine y diseño. Tengo una conexión y sensibilidad muy fuerte con la música, especialmente con los sonidos y la estética de los años 80. Me atraen mucho las atmósferas, identidades visuales y detalles culturales que definieron esa época. También tengo un lado bastante nerd: me encanta la ciencia ficción, la fantasía y universos ficticios como Star Wars y Game of Thrones. Crecí jugando Los Sims, y probablemente ahí empezó mi obsesión por crear cosas.',
}

const CARD_RIGHT_HEADING = {
  en: 'Graphic design was my passion… until I met UX',
  es: 'Graphic design was my passion… hasta que conocí UX',
}

const CARD_RIGHT_BODY = {
  en:
    'A big part of my childhood and teenage years was spent experimenting on my computer, browsing the internet, discovering things out of curiosity, and creating. I spent hours exploring creative tools, editing visuals, customizing interfaces, and learning things simply because I enjoyed it. Back then, design was something purely visual to me. Years later, I studied Graphic Design & Visual Communication, where I discovered web design and eventually UX/UI. By the time I graduated, I was already working as a UX Designer, realizing that design could also influence how people use, feel, and experience a digital product.',
  es:
    'Gran parte de mi infancia y adolescencia la pasé experimentando en la computadora, navegando por internet, descubriendo cosas por curiosidad y creando. Pasaba horas explorando herramientas creativas, editando visuales, personalizando interfaces y aprendiendo simplemente porque lo disfrutaba. En ese momento, el diseño era algo puramente visual para mí. Años después estudié Diseño Gráfico y Comunicación Visual, donde descubrí el diseño web y eventualmente UX/UI. Para cuando me gradué, ya estaba trabajando como UX Designer y entendiendo que el diseño también podía influir en cómo las personas usan, sienten y experimentan un producto digital.',
}

const TESTIMONIALS_TITLE = {
  en: 'Kind words from people I’ve worked with',
  es: 'Algunas palabras de personas con las que trabajé',
}

/**
 * Sección "About me" del Home — node Figma 562:2793.
 * - Título grande full-width con efecto DecryptedText al entrar al viewport.
 * - 2 cards lado a lado con fondo dark: imagen/story + story profesional.
 * - 3 cards de testimonios con fondo dark y avatar LinkedIn.
 * - Cursor decorativo que sigue al mouse, visible sólo dentro de la sección.
 */
export function AboutMe() {
  // Idioma actual del contexto — se usa para resolver el contenido bilingüe
  // de title, cards, testimonios y heading de testimonios.
  const { language } = useLanguage()

  return (
    <section
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
        // Cursor del sistema visible — el cursor decorativo se removió y
        // queda solo en el Hero.
      }}
    >
      {/* Cursor decorativo removido — quedó solo en el Hero. */}

      {/* 1) Título grande con efecto BlurText — cada palabra entra con
          fade + blur + slide vertical al entrar al viewport. */}
      <BlurText
        text={TITLE_TEXT[language]}
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
            <p style={cardBody}>{CARD_LEFT_BODY[language]}</p>
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
              {CARD_RIGHT_HEADING[language]}
            </h3>

            <p style={cardBody}>{CARD_RIGHT_BODY[language]}</p>
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
            {TESTIMONIALS_TITLE[language]}
          </h3>

          {/* Slider horizontal infinito con LogoLoop. renderItem custom
              para mostrar cada testimonio como card. Sin fadeOut. */}
          <LogoLoop
            logos={TESTIMONIALS.map((t) => ({
              node: <TestimonialCard testimonial={t} language={language} />,
            }))}
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

function TestimonialCard({
  testimonial,
  language,
}: {
  testimonial: Testimonial
  language: Language
}) {
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
        &ldquo;{testimonial.quote[language]}&rdquo;
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
  // Asset oficial del Figma. Le damos className específica para poder
  // override la regla global del LogoLoop (que aplica height:
  // logoHeight + width: auto a TODAS las <img> dentro del slider, y
  // estaba estirando este icono a 240px). Con !important ganamos
  // specificity en el .iunok-style override del slider.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/assets/linkedin-icon-testimonials.svg"
      alt=""
      aria-hidden="true"
      className="testimonial-linkedin-icon"
      width={20}
      height={20}
      draggable={false}
      style={{
        display: 'block',
        userSelect: 'none',
        width: 20,
        height: 20,
        flexShrink: 0,
      }}
    />
  )
}

const cardBody: React.CSSProperties = {
  fontFamily: '"Neue Montreal", var(--font-sans)',
  fontWeight: 400,
  fontSize: 16,
  lineHeight: '28px',
  color: 'var(--fg-3)',
  margin: 0,
}
