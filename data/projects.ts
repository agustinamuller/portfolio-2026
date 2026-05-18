/**
 * Schema de datos de proyectos. Cada proyecto tiene metadata (slug, year,
 * tags, title) + un array de blocks que representa el contenido del case
 * study en orden. La página de detalle (/work/[slug]) itera los blocks
 * y renderiza cada uno según su tipo.
 *
 * Tipos de block soportados:
 * - `text`: heading + body + items (bullets opcionales)
 * - `media`: video o imagen con alt text
 * - `quote`: texto destacado en grande
 * - `columns`: 3 columnas de bullets (system includes / etc.)
 * - `statistics`: 3 columnas con números grandes (+37%, -22%, etc.)
 * - `testimonials`: cards de reviews con avatar, nombre, texto
 */

import type { LocalizedString } from '@/data/translations'

// -------------------- Block types --------------------

/**
 * Item de un text block. Tres formatos soportados:
 *
 * - `string` → bullet plano legacy sólo-inglés.
 *   Ej: "Browse and select eyewear models"
 *
 * - `{ en, es }` → bullet plano bilingüe.
 *   Ej: { en: 'Buttons', es: 'Botones' }
 *
 * - `{ label, description }` → bullet con prefijo destacado en color
 *   primary (fg-1) + descripción en color secondary (fg-3) dentro del
 *   mismo bullet. Patrón usado en Luma. Ambos campos aceptan
 *   LocalizedString (string legacy o { en, es }).
 */
export type TextBlockItem =
  | string
  | { en: string; es: string }
  | { label: LocalizedString; description: LocalizedString }

export type ProjectBlock =
  | {
      type: 'text'
      heading?: LocalizedString
      body?: LocalizedString
      items?: TextBlockItem[]
      /**
       * Si true, items se renderizan SIN bullets y en color primary (fg-1)
       * — pensado para textos destacados como "Primitive tokens → base values"
       * o "OVERFLOW.html → functional product". Si false (default), items
       * son bullets normales en color secondary.
       *
       * Nota: `highlight` ignora el formato `{label, description}` — usa
       * solo el string. Si necesitás items mixtos label+description con
       * énfasis visual, usá items normales (con bullets).
       */
      highlight?: boolean
    }
  | {
      type: 'media'
      src: string
      mediaType: 'video' | 'image'
      alt?: string
      /**
       * Escala opcional aplicada al video/imagen (via CSS transform scale).
       * Útil cuando el asset exportado tiene padding interno y no llena
       * el contenedor completamente con object-fit: cover. Default: 1
       * (sin escala). Ej: 1.05 = +5% zoom, recorta el borde sobrante.
       */
      scale?: number
      /**
       * Si true, el contenedor NO aplica background var(--bg-2). Útil para
       * SVG/PNG con fondo transparente que tienen que mostrarse directo
       * sobre el background de la página (ej. flowcharts, ilustraciones).
       * Default: false (mantiene el fallback gris oscuro).
       */
      transparent?: boolean
      /**
       * CSS `object-position` aplicado al asset interno. Útil cuando con
       * `object-fit: cover` el sujeto del asset queda mal centrado (ej.
       * un mockup mobile que queda pegado al borde inferior).
       * Valores típicos: 'center top', 'center 20%', '50% 30%'.
       * Default: 'center center'.
       */
      objectPosition?: string
      /**
       * Aspect-ratio del contenedor del media. Default: '16 / 9'.
       * Útil cuando el asset original tiene proporciones distintas (ej.
       * '4 / 3' para mockups cuadrados) — evita que `object-fit: cover`
       * estire o recorte el contenido. Aceptar cualquier valor CSS válido
       * para `aspect-ratio` (ej. '16 / 9', '4 / 3', '3 / 2', '1 / 1').
       */
      aspectRatio?: string
    }
  | { type: 'quote'; text: LocalizedString }
  | {
      type: 'columns'
      items: { heading: LocalizedString; bullets: LocalizedString[] }[]
    }
  | {
      type: 'statistics'
      // `value` queda en string crudo (números/símbolos como "+37%" o "–22%")
      // — no se traduce. `label` y `description` sí son bilingües.
      items: { value: string; label: LocalizedString; description?: LocalizedString }[]
    }
  | { type: 'testimonials'; items: ProjectTestimonial[] }

export interface ProjectTestimonial {
  name: string
  meta: string
  ago?: string
  text: string[]
  likes?: number
  /**
   * Cantidad de estrellas (1–5) del rating de la review. Si se omite,
   * se renderizan 5 por default (asumimos review positiva).
   */
  rating?: number
  /**
   * Path al avatar de la review. Si no se define, se renderiza un círculo
   * con la inicial del nombre como fallback.
   */
  avatar?: string
}

// -------------------- Project type --------------------

export interface Project {
  slug: string
  year: string
  tags: string[]
  /**
   * Título del proyecto. Puede ser string plano (inglés solamente) o un
   * objeto `{ en, es }` para versión bilingüe. Se usa en la card del home
   * y como h1 del detail page.
   */
  title: LocalizedString
  /** Media del hero del DETALLE (usado en /work/[slug]). */
  media?: { type: 'video' | 'image'; src: string; alt?: string }
  /**
   * Media específico para la CARD del home — versión más liviana/optimizada
   * para la grid de Selected Work. Si no se define, usa `media` como fallback.
   */
  homeMedia?: { type: 'video' | 'image'; src: string }
  /** Rol (ej. "Product Designer | Design Systems"). Se muestra en el header del detalle. */
  role: string
  /** Industria (ej. "E-Commerce | SaaS"). Se muestra en el header del detalle. */
  industry: string
  /** Intro del case study: título grande + body (después del media principal). */
  intro?: {
    heading: LocalizedString
    body: LocalizedString
  }
  /** Secuencia de bloques del case study, en orden de renderizado. */
  blocks?: ProjectBlock[]
  /** Si el proyecto requiere contraseña para acceder al detalle. */
  protected: boolean
}

// -------------------- Projects data --------------------

const projects: Project[] = [
  // ============================================================
  // ORDERFLOW — Design System SaaS
  // ============================================================
  {
    slug: 'orderflow',
    year: '2026',
    tags: ['Design Systems', 'Product Design', 'SaaS', 'E-Commerce'],
    title: {
      en: 'Code-first AI-assisted Design System for a scalable SaaS product',
      es: 'Design System code-first asistido por IA para escalar un producto SaaS',
    },
    role: 'Product Design | Design Systems',
    industry: 'E-commerce | SaaS',
    media: {
      type: 'video',
      src: '/assets/work/orderflow/hero.mp4',
      alt: 'Preview del dashboard de OrderFlow mostrando órdenes, inventario y analytics integrados',
    },
    homeMedia: { type: 'image', src: '/assets/work/orderflow/orderflow-home.png' },
    protected: false,
    intro: {
      heading: {
        en: 'I designed a scalable design system to accelerate the development of a multi-channel SaaS product',
        es: 'Diseñé un sistema de diseño escalable para acelerar el desarrollo de un producto SaaS multi-canal.',
      },
      body: {
        en: 'OrderFlow is a B2B SaaS platform designed for teams managing orders, inventory, customers, and analytics from a single centralized dashboard.\n\nThe product is aimed at multi-channel sellers operating on platforms such as Amazon, Shopify, and Mercado Libre, where daily operations involve working with large volumes of data, multiple interaction states, and complex administrative workflows.\n\nThe project started as a greenfield: no previous design system, no component library, and no shared convention between design and development.\n\nAs the product began to grow, a clear need emerged: to build a consistent and scalable visual foundation that would allow me to design, iterate, and implement new features in a faster and more maintainable way.\n\nThat’s when I decided to build the Design System.',
        es: 'OrderFlow es una plataforma B2B SaaS diseñada para equipos que gestionan pedidos, inventario, clientes y analítica desde un único dashboard centralizado.\n\nEl producto está orientado a vendedores multi-canal que operan en plataformas como Amazon, Shopify y Mercado Libre, donde la operación diaria implica trabajar con grandes volúmenes de datos, múltiples estados de interacción y flujos administrativos complejos.\n\nEl proyecto nació como un greenfield: sin sistema de diseño previo, sin librería de componentes y sin una convención compartida entre diseño y desarrollo.\n\nA medida que el producto empezó a crecer, apareció una necesidad clara: construir una base visual consistente y escalable que me permitiera diseñar, iterar e implementar nuevas funcionalidades de forma más rápida y mantenible.\n\nAhí fue donde decidí construir el Design System.',
      },
    },
    blocks: [
      {
        type: 'text',
        heading: { en: 'The challenge', es: 'El desafío' },
        body: {
          en: 'The main challenge was finding a way to accelerate design and implementation times without losing visual consistency, clarity, or scalability.\n\nI also needed a more efficient way to test interactions, validate behaviors, and keep design decisions synchronized as the product evolved.\n\nSo I decided to create a complete system that could function as the product’s real infrastructure. The intention was to establish a shared source of truth between design and development.',
          es: 'El principal desafío era encontrar una forma de acelerar tiempos de diseño e implementación sin perder consistencia visual, claridad ni escalabilidad.\n\nTambién necesitaba una forma más eficiente de probar interacciones, validar comportamientos y mantener sincronizadas las decisiones de diseño a medida que el producto evolucionaba.\n\nEntonces decidí crear un sistema completo que funcionara como infraestructura real del producto. La intención era establecer una fuente de verdad compartida entre diseño y desarrollo.',
        },
      },
      {
        type: 'text',
        heading: { en: 'The approach', es: 'El enfoque' },
        body: {
          en: 'I built the Design System directly in code using self-contained HTML, CSS custom properties, and vanilla JavaScript, combined with AI-assisted workflows to accelerate visual exploration, component iterations, and technical documentation.\n\nThe entire architecture was structured around a three-layer token system:',
          es: 'Construí el Design System directamente en código utilizando HTML self-contained, CSS custom properties y JavaScript vanilla, acompañado por workflows asistidos por IA para acelerar exploración visual, iteraciones de componentes y documentación técnica.\n\nToda la arquitectura fue estructurada sobre un sistema de tokens en tres capas:',
        },
      },
      {
        type: 'text',
        highlight: true,
        items: [
          { en: 'Primitive tokens → base values', es: 'Tokens primitivos → valores base' },
          { en: 'Semantic tokens → reusable roles', es: 'Tokens semánticos → roles reutilizables' },
          { en: 'Component tokens → implementation-specific contracts', es: 'Tokens de componente → contratos específicos de implementación' },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'Every visual decision, color, spacing, radius, typography, motion, or interaction states, was defined through reusable and exportable tokens.\n\nOne of the system’s main rules was avoiding hardcoded values inside components. Everything had to rely on tokens to guarantee scalability and long-term maintainability.\n\nThis allowed me to build a consistent foundation where global changes could automatically propagate across the entire interface.',
          es: 'Cada decisión visual — color, spacing, radius, tipografía, motion o estados de interacción — fue definida mediante tokens reutilizables y exportables.\n\nUna de las reglas principales del sistema fue evitar valores hardcodeados dentro de componentes. Todo debía depender de tokens para garantizar escalabilidad y mantenimiento a largo plazo.\n\nEsto me permitió construir una base consistente donde cambios globales podían propagarse automáticamente a través de toda la interfaz.',
        },
      },
      {
        type: 'text',
        heading: { en: 'Visual system and components', es: 'Sistema visual y componentes' },
        body: {
          en: 'I designed the visual system with a minimal and functional aesthetic, prioritizing visual clarity, readability, and information density.',
          es: 'Diseñé el sistema visual con una estética minimalista y funcional, priorizando claridad visual, legibilidad y densidad de información.',
        },
      },
      {
        type: 'media',
        mediaType: 'video',
        src: '/assets/work/orderflow/design-system.mp4',
        alt: 'Vista del Design System de OrderFlow con tokens y componentes',
      },
      {
        type: 'columns',
        items: [
          {
            heading: {
              en: 'The system includes a complete library of reusable components with all states documented and implemented:',
              es: 'El sistema incluye una biblioteca completa de componentes reutilizables con todos sus estados documentados e implementados:',
            },
            bullets: [
              { en: 'Buttons', es: 'Buttons' },
              { en: 'Inputs & Fields', es: 'Inputs & Fields' },
              { en: 'Selects', es: 'Selects' },
              { en: 'Checkbox / Radio / Switch', es: 'Checkbox / Radio / Switch' },
              { en: 'Feedback Pills', es: 'Feedback Pills' },
              { en: 'Toasts', es: 'Toasts' },
              { en: 'Cards', es: 'Cards' },
              { en: 'Tooltips', es: 'Tooltips' },
              { en: 'Sidebar navigation', es: 'Sidebar navigation' },
              { en: 'Charts', es: 'Charts' },
              { en: 'Tables with filters and bulk actions', es: 'Tables con filtros y bulk actions' },
              { en: 'Complex forms with inline validation', es: 'Formularios complejos con validación inline' },
            ],
          },
          {
            heading: {
              en: 'In addition to individual components, I also designed complete reusable UX patterns for key product scenarios:',
              es: 'Además de los componentes individuales, también diseñé patrones completos de UX reutilizables para escenarios clave del producto:',
            },
            bullets: [
              { en: 'Bulk order management', es: 'Gestión masiva de órdenes' },
              { en: 'Administrative tables', es: 'Tablas administrativas' },
              { en: 'Synchronization states', es: 'Estados de sincronización' },
              { en: 'Empty states', es: 'Empty states' },
              { en: 'Loading states', es: 'Loading states' },
              { en: 'Operational forms', es: 'Formularios operativos' },
              { en: 'Multi-module navigation', es: 'Navegación multi-módulo' },
            ],
          },
          {
            heading: {
              en: 'Each component was designed considering:',
              es: 'Cada componente fue diseñado considerando:',
            },
            bullets: [
              { en: 'Accessibility', es: 'Accesibilidad' },
              { en: 'Keyboard navigation', es: 'Navegación por teclado' },
              { en: 'Complete interaction states', es: 'Estados completos de interacción' },
              { en: 'Readability in data-heavy contexts', es: 'Legibilidad en contextos data-heavy' },
              { en: 'Real reuse within the product', es: 'Reutilización real dentro del producto' },
            ],
          },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'The entire system was designed to allow me to test interactions and validate visual decisions directly on real implemented components.',
          es: 'Todo el sistema fue diseñado para permitirme probar interacciones y validar decisiones visuales directamente sobre componentes reales implementados.',
        },
      },
      {
        type: 'text',
        heading: { en: 'Living documentation', es: 'Living documentation' },
        body: {
          en: 'One of the main goals was improving collaboration between design and development through clear, reusable documentation synchronized with the implemented system.\n\nThat’s why I developed two synchronized deliverables:',
          es: 'Uno de los principales objetivos fue mejorar la colaboración entre diseño y desarrollo mediante documentación clara, reutilizable y sincronizada con el sistema implementado.\n\nPor eso desarrollé dos entregables sincronizados:',
        },
      },
      {
        type: 'text',
        highlight: true,
        items: [
          { en: 'OVERFLOW.html → functional product', es: 'OVERFLOW.html → producto funcional' },
          { en: 'DESIGN_SYSTEM.html → living and interactive documentation', es: 'DESIGN_SYSTEM.html → documentación viva e interactiva' },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'The documentation includes: Live component demonstrations, token tables, reusable snippets, CSS variables export, JSON tokens compatible with Style Dictionary, technical documentation rendered in markdown.\n\nThis allowed me to build a foundation that is easy to navigate and understand for any team member.',
          es: 'La documentación incluye: demostración live de componentes, token tables, snippets reutilizables, exportación de CSS variables, tokens JSON compatibles con Style Dictionary, documentación técnica renderizada en markdown.\n\nEsto hizo que pueda construir una base fácilmente navegable y entendible para cualquier integrante del equipo.',
        },
      },
      {
        type: 'text',
        heading: { en: 'Impact', es: 'Impacto' },
        body: {
          en: 'The system allowed me to:',
          es: 'El sistema me permitió:',
        },
        items: [
          { en: 'Accelerate the creation of new views and modules', es: 'Acelerar la creación de nuevas vistas y módulos' },
          { en: 'Improve visual and functional consistency across screens', es: 'Mejorar la consistencia visual y funcional entre pantallas' },
          { en: 'Optimize collaboration between design and development', es: 'Optimizar la colaboración entre diseño y desarrollo' },
          { en: 'Reduce implementation times through a token-based architecture', es: 'Reducir tiempos de implementación gracias a una arquitectura basada en tokens' },
          { en: 'Facilitate testing and interaction validation directly on real components', es: 'Facilitar testing y validación de interacciones directamente sobre componentes reales' },
          { en: 'Simplify long-term visual maintenance', es: 'Simplificar mantenimiento visual a largo plazo' },
          { en: 'Create a scalable foundation prepared for future integrations and features', es: 'Crear una base escalable preparada para futuras integraciones y funcionalidades' },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'The result was a complete, documented, and end-to-end implemented design system capable of functioning as the visual and operational foundation for OrderFlow’s growth.',
          es: 'El resultado fue un sistema de diseño completo, documentado e implementado end-to-end, capaz de funcionar como base visual y operativa para el crecimiento de OrderFlow.',
        },
      },
      {
        type: 'media',
        mediaType: 'video',
        src: '/assets/work/orderflow/inventory.mp4',
        alt: 'Vista del Inventory Dashboard de OrderFlow',
        // El video tiene padding interno (la app inventory no ocupa todo
        // el frame del export). Agrandamos 8% para que el contenido visible
        // llene el contenedor de borde a borde.
        scale: 1.08,
      },
    ],
  },

  // ============================================================
  // LUMA — App mobile fintech para gestión contextual de finanzas
  // ============================================================
  {
    slug: 'luma',
    year: '2025',
    tags: ['Fintech', 'Product Design', 'Mobile App', 'Design System'],
    title: {
      en:
        'Improving financial visibility for people managing multiple projects and income streams',
      es:
        'Mejorando la visibilidad financiera para personas que gestionan múltiples proyectos y fuentes de ingreso',
    },
    role: 'Product Designer | Design Systems',
    industry: 'Fintech',
    media: {
      type: 'video',
      src: '/assets/work/luma/luma-detail-hero.mp4',
      alt:
        'Preview de Luma — la app mobile fintech para gestionar proyectos, ingresos y cashflow contextual',
    },
    homeMedia: {
      type: 'image',
      src: '/assets/work/luma/portada-card-home.png',
    },
    protected: false,
    intro: {
      heading: {
        en: 'A mobile experience designed to centralize projects, expenses, income and cashflow into a single financial system.',
        es: 'Una experiencia mobile diseñada para centralizar proyectos, gastos, ingresos y cashflow en un único sistema financiero.',
      },
      body: {
        en: 'Luma is a mobile fintech experience designed for people managing multiple projects, clients, and income streams at the same time.\n\nThe project originated from an increasingly common problem: traditional financial apps display balances and transactions, but provide very little context around how money is actually organized throughout day-to-day work.\n\nFor people with variable income, multiple ongoing projects, or expenses tied to different jobs, this often creates a fragmented financial experience that is difficult to understand and not particularly useful for making clear financial decisions.\n\nBased on this insight, I designed an experience focused on contextual financial organization, allowing users to centralize income, expenses, projects, and cashflow through a clearer, more operational, and easier-to-understand interface.',
        es: 'Luma es una experiencia fintech mobile diseñada para personas que gestionan múltiples proyectos, clientes e ingresos al mismo tiempo.\n\nEl proyecto nació a partir de un problema cada vez más común: las apps financieras tradicionales muestran balances y movimientos, pero ofrecen muy poco contexto sobre cómo se organiza realmente el dinero dentro del trabajo diario.\n\nPara personas con ingresos variables, proyectos simultáneos o gastos asociados a distintos trabajos, esto suele generar una experiencia financiera fragmentada, difícil de entender y poco útil para tomar decisiones con claridad.\n\nA partir de este insight, diseñé una experiencia enfocada en organización financiera contextual, permitiendo centralizar ingresos, gastos, proyectos y cashflow desde una interfaz más clara, operativa y fácil de entender.',
      },
    },
    blocks: [
      // ── Problem ─────────────────────────────────────────────
      {
        type: 'text',
        heading: {
          en: 'Traditional financial apps show transactions, but not financial context.',
          es: 'Las apps financieras tradicionales muestran movimientos, pero no contexto financiero.',
        },
        body: {
          en: 'Most current financial apps are designed to display balances, transactions, and charts, but provide very little visibility into how money is actually distributed across projects, work, and daily expenses.\n\nFor people managing multiple clients or variable income streams, this often translates into:',
          es: 'La mayoría de las apps financieras actuales están diseñadas para mostrar balances, transacciones y gráficos, pero ofrecen muy poca visibilidad sobre cómo se distribuye realmente el dinero entre proyectos, trabajos y gastos diarios.\n\nPara personas que gestionan múltiples clientes o ingresos variables, esto suele traducirse en:',
        },
      },
      // Pain points destacados (sin bullets, primary color — patrón highlight)
      {
        type: 'text',
        highlight: true,
        items: [
          { en: 'mixed personal and work expenses', es: 'gastos personales y laborales mezclados' },
          { en: 'limited visibility into profitability', es: 'poca claridad sobre rentabilidad' },
          { en: 'difficulty understanding real cashflow', es: 'dificultad para entender cashflow real' },
          { en: 'low financial predictability', es: 'baja previsibilidad financiera' },
          { en: 'manual organization across multiple tools', es: 'organización manual entre distintas herramientas' },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'Many users end up managing their finances across banks, notes, spreadsheets, or separate apps, creating a fragmented experience that becomes difficult to maintain.',
          es: 'Muchos usuarios terminan administrando su dinero entre bancos, notas, spreadsheets o aplicaciones separadas, generando una experiencia financiera fragmentada y difícil de mantener.',
        },
      },
      // ── Approach ────────────────────────────────────────────
      {
        type: 'text',
        heading: {
          en: 'Centralizing projects, expenses, and income into a clearer and more contextual financial experience.',
          es: 'Centralizando proyectos, gastos e ingresos en una experiencia financiera más clara y contextual.',
        },
        body: {
          en: 'Luma was designed as a contextual financial experience where income and expenses can be organized around real projects, making it easier to understand cashflow, financial stability, and profitability in a simpler and more operational way.\n\nInstead of focusing solely on balances or traditional categories, the product aims to help users visualize how their money actually behaves throughout their daily work, prioritizing financial clarity, reduced cognitive load, and contextual organization.',
          es: 'Luma fue diseñada como una experiencia financiera contextual donde ingresos y gastos pueden organizarse alrededor de proyectos reales, permitiendo entender cashflow, estabilidad financiera y rentabilidad de manera más simple y operativa.\n\nEn lugar de enfocarse únicamente en balances o categorías tradicionales, el producto busca ayudar a los usuarios a visualizar cómo se comporta realmente su dinero dentro de su trabajo diario, priorizando claridad financiera, reducción de carga cognitiva y organización contextual.',
        },
      },
      // ── Core Features (items con label + description) ───────
      {
        type: 'text',
        heading: { en: 'Core Features', es: 'Features principales' },
        items: [
          {
            label: { en: 'Project-based financial organization: ', es: 'Organización financiera por proyectos: ' },
            description: {
              en: 'Luma allows users to assign income and expenses to specific projects in order to improve financial visibility, separate work contexts, and better understand profitability.',
              es: 'Luma permite asignar ingresos y gastos a proyectos específicos para mejorar visibilidad financiera, separar contexto laboral y entender rentabilidad de manera más clara.',
            },
          },
          {
            label: { en: 'Available to Spend: ', es: 'Available to Spend: ' },
            description: {
              en: 'The experience was designed to clearly show how much money is actually available, taking into account reserves, pending expenses, and contextual financial organization.',
              es: 'La experiencia fue diseñada para mostrar cuánto dinero está realmente disponible, considerando reservas, gastos pendientes y organización financiera contextual.',
            },
          },
          {
            label: { en: 'Smart expense assignment: ', es: 'Asignación inteligente de gastos: ' },
            description: {
              en: 'Users can manually assign expenses or use contextual suggestions to improve financial organization and analytics without adding unnecessary friction.',
              es: 'Los usuarios pueden asignar gastos manualmente o utilizar sugerencias contextuales para mejorar organización financiera y analytics sin generar fricción innecesaria.',
            },
          },
          {
            label: { en: 'Cashflow visualization: ', es: 'Visualización de cashflow: ' },
            description: {
              en: 'The Analytics section allows users to visualize income, expenses, and financial stability through simple and easy-to-understand charts.',
              es: 'La sección Analytics permite visualizar ingresos, gastos y estabilidad financiera mediante gráficos simples y fáciles de interpretar.',
            },
          },
        ],
      },
      // ── UX Flows ────────────────────────────────────────────
      {
        type: 'text',
        heading: { en: 'UX Flows', es: 'UX Flows' },
        items: [
          {
            label: { en: 'Create Project: ', es: 'Crear proyecto: ' },
            description: {
              en: 'Users can quickly create projects to start organizing income and expenses around real work contexts.',
              es: 'Los usuarios pueden crear proyectos rápidamente para comenzar a organizar ingresos y gastos alrededor de contextos reales de trabajo.',
            },
          },
          {
            label: { en: 'Expense Assignment: ', es: 'Asignación de gasto: ' },
            description: {
              en: 'After making a purchase, users can assign transactions to specific projects to improve financial clarity and profitability.',
              es: 'Después de realizar una compra, los usuarios pueden asignar transacciones a proyectos específicos para mejorar claridad financiera y profitability.',
            },
          },
          {
            label: { en: 'States & Edge Cases: ', es: 'Estados y edge cases: ' },
            description: {
              en: 'The experience was designed considering unassigned expenses, negative cashflow, projects without income, transaction reassignment, empty states, and pending payments.',
              es: 'La experiencia fue diseñada contemplando gastos sin asignar, cashflow negativo, proyectos sin ingresos, reasignación de transacciones, estados vacíos y pagos pendientes.',
            },
          },
        ],
      },
      // ── Design System & UI Implementation ───────────────────
      {
        type: 'text',
        heading: { en: 'Design System & UI Implementation', es: 'Design System & UI Implementation' },
        body: {
          en: 'I built both the design system and the functional interface directly in HTML and CSS using reusable components, semantic variables, and scalable patterns designed to reduce the gap between design and implementation.\n\nThis approach made it possible to transform visual decisions into an interactive and functional interface from the early stages of the project, enabling rapid testing, state validation, and exploration of real behaviors directly within the implemented product.\n\nMore than 80% of the interface was developed using reusable components and shared patterns, allowing faster iterations, improved visual consistency, and significantly reducing friction between design and development.',
          es: 'Construí tanto el sistema de diseño como la interfaz funcional directamente en HTML y CSS mediante componentes reutilizables, variables semánticas y patrones escalables diseñados para reducir la distancia entre diseño e implementación.\n\nEste enfoque permitió transformar las decisiones visuales en una interfaz interactiva y funcional desde etapas tempranas del proyecto, facilitando testing rápido, validación de estados y exploración de comportamientos reales directamente sobre el producto implementado.\n\nMás del 80% de la interfaz fue desarrollada utilizando componentes reutilizables y patrones compartidos, permitiendo acelerar iteraciones, mantener consistencia visual y reducir significativamente la fricción entre diseño y desarrollo.',
        },
      },
      // ── Media 1 — showcase del design system implementado ──
      {
        type: 'media',
        mediaType: 'image',
        src: '/assets/work/luma/detail-project (2).png',
        alt:
          'Vista del design system y UI implementada de Luma sobre dispositivo mobile',
      },
      // ── Result + métricas (items con label + description) ───
      {
        type: 'text',
        heading: { en: 'Result', es: 'Resultado' },
        body: {
          en: 'Luma explored a new way of organizing financial information around real projects and workflows, transforming income, expenses, and cashflow into a more understandable, organized, and contextual experience.',
          es: 'Luma exploró una nueva forma de organizar información financiera alrededor de proyectos y flujos de trabajo reales, permitiendo transformar ingresos, gastos y cashflow en una experiencia más comprensible, organizada y contextual.',
        },
        items: [
          {
            label: {
              en: 'The code-first approach reduced more than 70% of the traditional time required to build a design system',
              es: 'El enfoque code-first redujo más del 70% del tiempo tradicional necesario para construir un sistema de diseño desde cero',
            },
            description: {
              en: ' from scratch, design, iterate, and implement new interfaces and components, eliminating a large portion of the traditional handoff between design and development.',
              es: ', diseñar, iterar e implementar nuevas interfaces y componentes, eliminando gran parte del handoff tradicional entre diseño y desarrollo.',
            },
          },
          {
            label: {
              en: 'During initial product validations, the introduction of project-based financial organization improved financial categorization adoption by approximately 65% during testing flows',
              es: 'Durante las validaciones iniciales del producto, la introducción de organización financiera por proyectos mejoró aproximadamente un 65% la adopción de categorización financiera durante los flujos de testing',
            },
            description: {
              en: ', reducing friction when interpreting expenses and income distributed across multiple work contexts.',
              es: ', reduciendo fricción al momento de interpretar gastos e ingresos distribuidos entre múltiples contextos de trabajo.',
            },
          },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'The result was a mobile fintech experience designed to help people with variable income better understand and organize their daily financial situation.',
          es: 'El resultado fue una experiencia fintech mobile diseñada para ayudar a personas con ingresos variables a entender y organizar mejor su situación financiera diaria.',
        },
      },
      // ── Media 2 — showcase final del producto ───────────────
      {
        type: 'media',
        mediaType: 'image',
        src: '/assets/work/luma/detail-project.png',
        alt:
          'Showcase final del producto Luma — pantallas mobile del experience completo',
        // El asset original tiene proporciones ~4:3 (dispositivo diagonal
        // sobre fondo gris con padding). Forzar 16:9 con object-fit cover
        // hacía zoom-in y pegaba los bordes del iPhone al recuadro. Con
        // aspect-ratio 4:3 el contenedor matchea la imagen y el dispositivo
        // queda centrado con el aire original, igual que en el Figma.
        aspectRatio: '4 / 3',
      },
    ],
  },

  // ============================================================
  // IUNOK — B2C App de eyewear con 3D facial scanning
  // ============================================================
  {
    slug: 'iunok',
    year: '2024',
    tags: ['UX Design', 'UI Design', 'iOS App', 'B2C Healthtech'],
    title: {
      en: 'Increased conversion in a 3D facial scanning experience',
      es: 'Aumenté la conversión en una experiencia de escaneo facial 3D',
    },
    role: 'UX/UI Designer',
    industry: 'Healthtech',
    media: {
      type: 'video',
      src: '/assets/work/iunok/hero.mp4',
      alt:
        'Preview de la app iUnok mostrando el flujo de escaneo facial 3D para selección de lentes',
    },
    homeMedia: { type: 'video', src: '/assets/work/iunok/iunok-home.mp4' },
    protected: false,
    intro: {
      heading: {
        en: 'I designed the experience of a B2C app focused on purchasing personalized eyewear through 3D facial scanning and prescription management.',
        es: 'Diseñé la experiencia de una app B2C enfocada en la compra de lentes personalizados mediante escaneo facial 3D y gestión de prescripciones médicas.',
      },
      body: {
        en: 'The product is part of a HealthTech ecosystem that connects users, optometrists, and manufacturing processes, enabling the production of eyewear tailored to each person’s facial anatomy.',
        es: 'El producto forma parte de un ecosistema HealthTech que conecta usuarios, optometristas y procesos de manufactura, permitiendo producir lentes adaptados a la anatomía de cada persona.',
      },
    },
    blocks: [
      {
        type: 'text',
        heading: { en: 'The challenge', es: 'El desafío' },
        body: {
          en: 'The app’s main flow allows users to:',
          es: 'El flujo principal de la app permite:',
        },
        items: [
          { en: 'Browse and select eyewear models', es: 'Explorar y seleccionar modelos de lentes' },
          { en: 'Perform a 3D facial scan directly from their device', es: 'Realizar un escaneo facial 3D desde el dispositivo' },
          { en: 'Manage their prescription by uploading an existing prescription, taking a photo, or scheduling an appointment with a professional', es: 'Gestionar la prescripción médica: cargar una receta existente, subir una foto, o agendar una cita con un profesional' },
          { en: 'Preview the result through a Virtual Try-On experience', es: 'Visualizar el resultado mediante Virtual Try-On' },
          { en: 'Complete the purchase', es: 'Finalizar la compra' },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'The challenge was to organize a complex process into a clear and understandable experience that guided users through each step without causing drop-offs.',
          es: 'El desafío no era sumar funcionalidades, sino ordenar un proceso técnico y médico para que el usuario entendiera qué hacer en cada paso sin abandonar la experiencia.',
        },
      },
      {
        type: 'text',
        heading: { en: 'Problem', es: 'Problema' },
        body: {
          en: 'There was friction across several critical points in the flow:',
          es: 'Existía fricción en varios puntos críticos del flujo:',
        },
        items: [
          { en: 'The 3D scanning process generated uncertainty (accuracy, camera usage, data concerns)', es: 'El escaneo 3D generaba dudas sobre precisión, uso de cámara y datos biométricos' },
          { en: 'Prescription management interrupted the experience', es: 'La gestión de recetas interrumpía la experiencia de compra' },
          { en: 'Many users did not have a prescription and did not know how to continue', es: 'Muchos usuarios no tenían una prescripción y no sabían cómo continuar' },
          { en: 'The overall process felt complex and unclear', es: 'El proceso completo se percibía complejo y poco claro' },
        ],
      },
      {
        type: 'text',
        body: {
          en: 'This directly impacted conversion rates and the quality of manufacturing data.',
          es: 'Esto impactaba directamente en la conversión y en la calidad de los datos necesarios para manufactura.',
        },
      },
      {
        type: 'text',
        heading: { en: 'What I did', es: 'Qué hice' },
        body: {
          en: 'I focused on simplifying the flow and reducing friction at every stage.',
          es: 'Trabajé en simplificar el flujo y reducir fricción en cada etapa:',
        },
        items: [
          { en: 'Reorganized the experience into clear, progressive steps', es: 'Reorganicé la experiencia en pasos claros y progresivos' },
          { en: 'Designed a scanning onboarding flow that prepared users before entering the SDK', es: 'Diseñé un onboarding que prepara al usuario antes del escaneo' },
          { en: 'Added real-time feedback to guide the scanning process', es: 'Incorporé feedback en tiempo real para guiar la captura facial' },
          { en: 'Created a flexible prescription system (upload, photo, or appointment)', es: 'Diseñé un sistema flexible para gestionar prescripciones' },
          { en: 'Integrated optometrist scheduling directly into the flow', es: 'Integré la agenda de optometristas dentro del flujo' },
          { en: 'Defined states, validations, and messaging to provide clarity throughout the experience', es: 'Definí estados, validaciones y mensajes para dar claridad durante toda la experiencia' },
        ],
      },
      // Flowchart del proceso (después de "What I did")
      {
        type: 'media',
        mediaType: 'image',
        src: '/assets/work/iunok/flowchart.svg',
        alt: 'Diagrama de flujo del proceso de compra',
        // El SVG tiene fondo transparente — sin contenedor gris oscuro
        // para que se integre directo con el background de la página.
        transparent: true,
      },
      {
        type: 'text',
        heading: { en: 'Impact & Metrics', es: 'Impacto y métricas' },
        body: {
          en: 'The solution is already implemented and actively being used, positively impacting both the user experience and operational processes.',
          es: 'La solución ya se encuentra implementada y en funcionamiento, mejorando tanto la experiencia del usuario como la operación del producto.',
        },
        items: [
          { en: 'Created a smoother experience between the B2C app, optometrists, and internal operations', es: 'Se logró una experiencia más fluida entre la app B2C, optometristas y operación interna' },
          { en: 'Turned 3D facial scanning from a barrier into an understandable step within the journey', es: 'El escaneo facial 3D dejó de ser una barrera dentro del flujo' },
          { en: 'Reduced purchase friction by offering clear prescription alternatives', es: 'La gestión de prescripciones dejó de interrumpir la compra' },
          { en: 'Integrated professional services without removing users from the flow', es: 'Los servicios profesionales se integraron sin sacar al usuario de la experiencia' },
        ],
      },
      {
        type: 'statistics',
        items: [
          {
            value: '+37%',
            label: { en: 'purchase completion rate', es: 'finalización de compra' },
            description: {
              en: 'B2C Conversion Area. Prescription flexibility reduced abandonments and transformed the lack of a prescription into an opportunity.',
              es: 'Área de conversión B2C. La flexibilidad en prescripciones redujo abandonos y transformó la falta de receta en una oportunidad.',
            },
          },
          {
            value: '-22%',
            label: { en: 'errors in biometric data', es: 'errores en datos biométricos' },
            description: {
              en: 'Manufacturing Quality Area. Onboarding and real-time feedback increased scan reliability.',
              es: 'Área de calidad de manufactura. El onboarding y el feedback en tiempo real aumentaron la confiabilidad del escaneo.',
            },
          },
          {
            value: '+48%',
            label: { en: 'usage of the appointment scheduling feature', es: 'uso de la función de citas' },
            description: {
              en: 'Service Adoption Area. Gamification and integrated scheduling reduced friction.',
              es: 'Área de adopción de servicios. La gamificación y la agenda integrada redujeron la fricción.',
            },
          },
        ],
      },
      // Screens del producto al final, después de testimonials (orden Figma)
      {
        type: 'testimonials',
        items: [
          {
            name: 'Alfonso Ponce',
            meta: 'Local Guide · 27 opiniones · 8 fotos',
            ago: 'Hace 5 meses',
            avatar: '/assets/work/iunok/reviews/avatar-review-1.png',
            rating: 5,
            text: [
              'Vivo en León, Guanajuato y todo el proceso lo hice de forma remota a través de la app, súper fácil y rápido.',
              'Los lentes quedaron perfectos en medida y estilo, se nota la calidad y el cuidado en los detalles.',
              'Además, la comunicación una vez hecha la compra fue constante y el servicio al cliente impecable. Totalmente recomendable si buscas personalización, comodidad y un servicio confiable a distancia. 🙌',
            ],
            likes: 2,
          },
          {
            name: 'Luis Andrés Alvarez Aranda',
            meta: '16 opiniones · 2 fotos',
            ago: 'Hace 7 meses',
            avatar: '/assets/work/iunok/reviews/avatar-review-2.png',
            rating: 5,
            text: ['Excelente experiencia de compra. Los lentes llegaron a tiempo y son una maravilla.'],
            likes: 4,
          },
          {
            name: 'Andrea González',
            meta: '32 opiniones · 5 fotos',
            ago: 'Hace 2 meses',
            avatar: '/assets/work/iunok/reviews/avatar-review-3.png',
            rating: 5,
            text: [
              'Compré mis lentes a través de la app y me encantó lo simple y rápido que fue todo. Los lentes me quedaron increíbles y son súper cómodos.',
            ],
            likes: 4,
          },
        ],
      },
      {
        type: 'media',
        mediaType: 'video',
        src: '/assets/work/iunok/screens.mp4',
        alt: 'Pantallas del onboarding y flujo de escaneo',
      },
    ],
  },
]

export default projects

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
