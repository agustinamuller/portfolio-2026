/**
 * Diccionario de traducciones para la UI del portfolio.
 *
 * Cada key es un identificador semántico (no el texto en sí). Cada value
 * tiene la versión `en` y `es`. Los componentes acceden a estos textos via
 * el hook `useTranslation()` que lee el idioma actual del LanguageContext.
 *
 * Si necesitás agregar un texto nuevo, agregalo acá primero y después
 * usá `t.<key>` en el componente.
 *
 * Algunos textos NO se traducen y por eso no están acá:
 *  - "agustina müller" (marca personal)
 *  - Pills del Hero: "UX/UI", "PRODUCT", "DESIGN SYSTEMS"
 *  - Tags de las cards (Fintech, Mobile App, etc.)
 *  - Nombres de herramientas en Toolkit (Figma, Cursor, Claude, etc.)
 *  - Reviews de iunok (testimonios reales en español original)
 *  - Roles e industrias de los proyectos (valores en inglés siempre)
 */

import { Language } from '@/contexts/LanguageContext'

export const translations = {
  // ────────────────────────────────────────────────────────────
  // Navbar
  // ────────────────────────────────────────────────────────────
  nav: {
    work: { en: 'work', es: 'proyectos' },
    aboutMe: { en: 'about me', es: 'sobre mí' },
    contact: { en: 'contact', es: 'contacto' },
  },

  // ────────────────────────────────────────────────────────────
  // What I Do — sección descriptiva debajo del hero
  // ────────────────────────────────────────────────────────────
  whatIDo: {
    heading: { en: 'What I do', es: 'Lo que hago' },
    body: {
      en:
        "I'm Agustina, a UX/UI & Product Designer from Argentina focused on building clear, functional, and scalable digital products. I design mobile apps and web platforms, balancing user needs and business goals to create intuitive and consistent experiences. I specialize in Product Design and Design Systems, working with product and engineering teams across B2B, B2C, SaaS, fintech, and e-commerce projects, transforming complex flows into simple, scalable, and user-centered solutions.",
      es:
        'Soy Agustina, UX/UI & Product Designer de Argentina, enfocada en crear productos digitales claros, funcionales y escalables. Diseño aplicaciones mobile y plataformas web, equilibrando necesidades de usuario y objetivos de negocio para crear experiencias intuitivas y consistentes. Me especializo en Product Design y Design Systems, colaborando con equipos de producto y desarrollo en proyectos B2B, B2C, SaaS, fintech y e-commerce, transformando flujos complejos en soluciones simples, escalables y centradas en el usuario.',
    },
  },

  // ────────────────────────────────────────────────────────────
  // Selected Work — sección de cards de proyectos
  // ────────────────────────────────────────────────────────────
  work: {
    sectionTitle: { en: 'Selected work', es: 'Proyectos destacados' },
    viewProject: { en: 'view project', es: 'ver proyecto' },
  },

  // ────────────────────────────────────────────────────────────
  // Project detail page — labels del sidebar + botones
  // ────────────────────────────────────────────────────────────
  project: {
    myRole: { en: 'MY ROLE', es: 'MI ROL' },
    industry: { en: 'INDUSTRY', es: 'INDUSTRIA' },
    backToWork: { en: 'Back to work', es: 'Volver a proyectos' },
    scrollToTop: { en: 'Scroll to top', es: 'Volver arriba' },
  },

  // ────────────────────────────────────────────────────────────
  // About Me — sección con texto largo + cards
  // ────────────────────────────────────────────────────────────
  aboutMe: {
    title: {
      en:
        "I've always been interested in understanding how people interact with technology. Today, I design digital experiences where product, systems, and human behavior connect in an intuitive, functional, and intentional way.",
      es:
        'Siempre me interesó entender cómo las personas interactúan con la tecnología. Hoy diseño experiencias digitales donde producto, sistemas y comportamiento humano se conectan de una forma intuitiva, funcional e intencional.',
    },
    card1: {
      en:
        'Outside design, much of my inspiration comes from music, art, travel, and absorbing references from architecture, cinema, and design.\n\nI have a strong connection and sensitivity to music, especially the sounds and aesthetics of the 80s. I’m drawn to the atmospheres, visual identities, and cultural details that defined that era.\n\nI also have a pretty nerdy side: I love sci-fi, fantasy, and fictional universes like Star Wars and Game of Thrones. I grew up playing The Sims, and that’s probably where my obsession with creating things started.\n\nI spent much of my childhood and teenage years experimenting on the computer, browsing the internet, discovering things out of curiosity, and creating. I spent hours exploring creative tools, editing visuals, customizing interfaces, and learning simply because I enjoyed it.',
      es:
        'Fuera del diseño, gran parte de mi inspiración viene de la música, el arte, los viajes y de absorber referencias de arquitectura, cine y diseño.\n\nTengo una conexión y sensibilidad muy fuerte con la música, especialmente con los sonidos y la estética de los años 80. Me atraen mucho las atmósferas, identidades visuales y detalles culturales que definieron esa época.\n\nTambién tengo un lado bastante nerd: me encanta la ciencia ficción, la fantasía y universos ficticios como Star Wars y Game of Thrones. Crecí jugando Los Sims, y probablemente ahí empezó mi obsesión por crear cosas.\n\nGran parte de mi infancia y adolescencia la pasé experimentando en la computadora, navegando por internet, descubriendo cosas por curiosidad y creando. Pasaba horas explorando herramientas creativas, editando visuales, personalizando interfaces y aprendiendo simplemente porque lo disfrutaba.',
    },
    card2: {
      en:
        'Graphic design was my passion… until I met UX.\n\nBack then, design was something purely visual to me. Years later I studied Graphic Design and Visual Communication, where I discovered web design and eventually UX/UI. By the time I graduated, I was already working as a UX Designer and starting to understand that design could also shape how people use, feel, and experience a digital product.',
      es:
        'Graphic design was my passion… hasta que conocí UX.\n\nEn ese momento, el diseño era algo puramente visual para mí. Años después estudié Diseño Gráfico y Comunicación Visual, donde descubrí el diseño web y eventualmente UX/UI. Para cuando me gradué, ya estaba trabajando como UX Designer y entendiendo que el diseño también podía influir en cómo las personas usan, sienten y experimentan un producto digital.',
    },
    testimonialsTitle: {
      en: 'Kind words from people I’ve worked with',
      es: 'Algunas palabras de personas con las que trabajé',
    },
    testimonials: {
      martin: {
        en:
          '"Agustina never makes a design decision without first understanding the user, and in UX that makes all the difference."',
        es:
          '"Agustina nunca toma una decisión de diseño sin antes entender al usuario, y en UX eso hace toda la diferencia."',
      },
      johanna: {
        en:
          '"Agustina turns business needs into clear, functional, and visually well-resolved digital experiences."',
        es:
          '"Agustina transforma necesidades de negocio en experiencias digitales claras, funcionales y visualmente muy bien resueltas."',
      },
      santiago: {
        en:
          '"She combines a solid UX perspective with excellent communication, collaboration, and problem-solving skills."',
        es:
          '"Combina una mirada sólida de UX con excelentes habilidades de comunicación, colaboración y resolución de problemas."',
      },
      francisco: {
        en:
          '"Smart, proactive, and incredibly talented at creating intuitive UI/UX experiences."',
        es:
          '"Inteligente, proactiva e increíblemente talentosa para crear experiencias UI/UX intuitivas."',
      },
    },
  },

  // ────────────────────────────────────────────────────────────
  // Toolkit — sección dock con herramientas
  // ────────────────────────────────────────────────────────────
  toolkit: {
    title: { en: 'Toolkit', es: 'Toolkit' },
  },

  // ────────────────────────────────────────────────────────────
  // Footer — Let's talk section
  // ────────────────────────────────────────────────────────────
  footer: {
    letsTalk: { en: "Let's talk!", es: '¡Hablemos!' },
    copyEmail: { en: 'copy email', es: 'copiar email' },
    copied: { en: 'Copied to clipboard', es: '¡Copiado!' },
  },
} as const

/**
 * Helper para resolver una key de traducción a su string según el idioma.
 *
 * @example
 * const text = t({ en: 'Hello', es: 'Hola' }, 'es') // → 'Hola'
 */
export function t(value: { en: string; es: string }, language: Language): string {
  return value[language]
}

/**
 * Helper para resolver un LocalizedString (string plano o objeto {en, es}).
 * Útil para los textos de proyectos donde algunos quedan en inglés siempre
 * (ej. tags, role values) y otros se traducen.
 *
 * @example
 * tLocalized('Mobile App', 'es')                       // → 'Mobile App'
 * tLocalized({ en: 'work', es: 'trabajo' }, 'es')      // → 'trabajo'
 */
export type LocalizedString = string | { en: string; es: string }

export function tLocalized(value: LocalizedString, language: Language): string {
  if (typeof value === 'string') return value
  return value[language]
}
