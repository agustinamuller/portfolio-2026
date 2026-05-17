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

// -------------------- Block types --------------------

/**
 * Item de un text block. Dos formatos soportados:
 *
 * - `string` → bullet plano con texto en color secondary (fg-3).
 *   Ej: "Browse and select eyewear models"
 *
 * - `{ label, description }` → bullet con prefijo destacado en color
 *   primary (fg-1) + descripción en color secondary (fg-3) dentro del
 *   mismo bullet. Patrón usado en Luma (Core Features, UX Flows, Result).
 *   Ej: { label: "Project-based financial organization:",
 *         description: " Luma allows users to assign..." }
 */
export type TextBlockItem = string | { label: string; description: string }

export type ProjectBlock =
  | {
      type: 'text'
      heading?: string
      body?: string
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
    }
  | { type: 'quote'; text: string }
  | { type: 'columns'; items: { heading: string; bullets: string[] }[] }
  | { type: 'statistics'; items: { value: string; label: string; description?: string }[] }
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
  title: string
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
    heading: string
    body: string
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
    title: 'Code-first AI-assisted Design System for a scalable SaaS product',
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
      heading:
        'I designed a scalable design system to accelerate the development of a multi-channel SaaS product',
      body:
        'OrderFlow is a B2B SaaS platform designed for teams managing orders, inventory, customers, and analytics from a single centralized dashboard.\n\nThe product is aimed at multi-channel sellers operating on platforms such as Amazon, Shopify, and Mercado Libre, where daily operations involve working with large volumes of data, multiple interaction states, and complex administrative workflows.\n\nThe project started as a greenfield: no previous design system, no component library, and no shared convention between design and development.\n\nAs the product began to grow, a clear need emerged: to build a consistent and scalable visual foundation that would allow me to design, iterate, and implement new features in a faster and more maintainable way.\n\nThat’s when I decided to build the Design System.',
    },
    blocks: [
      {
        type: 'text',
        heading: 'The challenge',
        body:
          'The main challenge was finding a way to accelerate design and implementation times without losing visual consistency, clarity, or scalability.\n\nI also needed a more efficient way to test interactions, validate behaviors, and keep design decisions synchronized as the product evolved.\n\nSo I decided to create a complete system that could function as the product’s real infrastructure. The intention was to establish a shared source of truth between design and development.',
      },
      {
        type: 'text',
        heading: 'The approach',
        body:
          'I built the Design System directly in code using self-contained HTML, CSS custom properties, and vanilla JavaScript, combined with AI-assisted workflows to accelerate visual exploration, component iterations, and technical documentation.\n\nThe entire architecture was structured around a three-layer token system:',
      },
      {
        type: 'text',
        highlight: true,
        items: [
          'Primitive tokens → base values',
          'Semantic tokens → reusable roles',
          'Component tokens → implementation-specific contracts',
        ],
      },
      {
        type: 'text',
        body:
          'Every visual decision, color, spacing, radius, typography, motion, or interaction states, was defined through reusable and exportable tokens.\n\nOne of the system’s main rules was avoiding hardcoded values inside components. Everything had to rely on tokens to guarantee scalability and long-term maintainability.\n\nThis allowed me to build a consistent foundation where global changes could automatically propagate across the entire interface.',
      },
      {
        type: 'text',
        heading: 'Visual system and components',
        body:
          'I designed the visual system with a minimal and functional aesthetic, prioritizing visual clarity, readability, and information density.',
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
            heading: 'The system includes a complete library of reusable components with all states documented and implemented:',
            bullets: [
              'Buttons',
              'Inputs & Fields',
              'Selects',
              'Checkbox / Radio / Switch',
              'Feedback Pills',
              'Toasts',
              'Cards',
              'Tooltips',
              'Sidebar navigation',
              'Charts',
              'Tables with filters and bulk actions',
              'Complex forms with inline validation',
            ],
          },
          {
            heading: 'In addition to individual components, I also designed complete reusable UX patterns for key product scenarios:',
            bullets: [
              'Bulk order management',
              'Administrative tables',
              'Synchronization states',
              'Empty states',
              'Loading states',
              'Operational forms',
              'Multi-module navigation',
            ],
          },
          {
            heading: 'Each component was designed considering:',
            bullets: [
              'Accessibility',
              'Keyboard navigation',
              'Complete interaction states',
              'Readability in data-heavy contexts',
              'Real reuse within the product',
            ],
          },
        ],
      },
      {
        type: 'text',
        body:
          'The entire system was designed to allow me to test interactions and validate visual decisions directly on real implemented components.',
      },
      {
        type: 'text',
        heading: 'Living documentation',
        body:
          'One of the main goals was improving collaboration between design and development through clear, reusable documentation synchronized with the implemented system.\n\nThat’s why I developed two synchronized deliverables:',
      },
      {
        type: 'text',
        highlight: true,
        items: [
          'OVERFLOW.html → functional product',
          'DESIGN_SYSTEM.html → living and interactive documentation',
        ],
      },
      {
        type: 'text',
        body:
          'The documentation includes: Live component demonstrations, token tables, reusable snippets, CSS variables export, JSON tokens compatible with Style Dictionary, technical documentation rendered in markdown.\n\nThis allowed me to build a foundation that is easy to navigate and understand for any team member.',
      },
      {
        type: 'text',
        heading: 'Impact',
        body: 'The system allowed me to:',
        items: [
          'Accelerate the creation of new views and modules',
          'Improve visual and functional consistency across screens',
          'Optimize collaboration between design and development',
          'Reduce implementation times through a token-based architecture',
          'Facilitate testing and interaction validation directly on real components',
          'Simplify long-term visual maintenance',
          'Create a scalable foundation prepared for future integrations and features',
        ],
      },
      {
        type: 'text',
        body:
          'The result was a complete, documented, and end-to-end implemented design system capable of functioning as the visual and operational foundation for OrderFlow’s growth.',
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
    title:
      'Improving financial visibility for people managing multiple projects and income streams',
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
      heading:
        'A mobile experience designed to centralize projects, expenses, income and cashflow into a single financial system.',
      body:
        'Luma is a mobile fintech experience designed for people managing multiple projects, clients, and income streams at the same time.\n\nThe project originated from an increasingly common problem: traditional financial apps display balances and transactions, but provide very little context around how money is actually organized throughout day-to-day work.\n\nFor people with variable income, multiple ongoing projects, or expenses tied to different jobs, this often creates a fragmented financial experience that is difficult to understand and not particularly useful for making clear financial decisions.\n\nBased on this insight, I designed an experience focused on contextual financial organization, allowing users to centralize income, expenses, projects, and cashflow through a clearer, more operational, and easier-to-understand interface.',
    },
    blocks: [
      // ── Problem ─────────────────────────────────────────────
      {
        type: 'text',
        heading:
          'Traditional financial apps show transactions, but not financial context.',
        body:
          'Most current financial apps are designed to display balances, transactions, and charts, but provide very little visibility into how money is actually distributed across projects, work, and daily expenses.\n\nFor people managing multiple clients or variable income streams, this often translates into:',
      },
      // Pain points destacados (sin bullets, primary color — patrón highlight)
      {
        type: 'text',
        highlight: true,
        items: [
          'mixed personal and work expenses',
          'limited visibility into profitability',
          'difficulty understanding real cashflow',
          'low financial predictability',
          'manual organization across multiple tools',
        ],
      },
      {
        type: 'text',
        body:
          'Many users end up managing their finances across banks, notes, spreadsheets, or separate apps, creating a fragmented experience that becomes difficult to maintain.',
      },
      // ── Approach ────────────────────────────────────────────
      {
        type: 'text',
        heading:
          'Centralizing projects, expenses, and income into a clearer and more contextual financial experience.',
        body:
          'Luma was designed as a contextual financial experience where income and expenses can be organized around real projects, making it easier to understand cashflow, financial stability, and profitability in a simpler and more operational way.\n\nInstead of focusing solely on balances or traditional categories, the product aims to help users visualize how their money actually behaves throughout their daily work, prioritizing financial clarity, reduced cognitive load, and contextual organization.',
      },
      // ── Core Features (items con label + description) ───────
      {
        type: 'text',
        heading: 'Core Features',
        items: [
          {
            label: 'Project-based financial organization: ',
            description:
              'Luma allows users to assign income and expenses to specific projects in order to improve financial visibility, separate work contexts, and better understand profitability.',
          },
          {
            label: 'Available to Spend: ',
            description:
              'The experience was designed to clearly show how much money is actually available, taking into account reserves, pending expenses, and contextual financial organization.',
          },
          {
            label: 'Smart expense assignment: ',
            description:
              'Users can manually assign expenses or use contextual suggestions to improve financial organization and analytics without adding unnecessary friction.',
          },
          {
            label: 'Cashflow visualization: ',
            description:
              'The Analytics section allows users to visualize income, expenses, and financial stability through simple and easy-to-understand charts.',
          },
        ],
      },
      // ── UX Flows ────────────────────────────────────────────
      {
        type: 'text',
        heading: 'UX Flows',
        items: [
          {
            label: 'Create Project: ',
            description:
              'Users can quickly create projects to start organizing income and expenses around real work contexts.',
          },
          {
            label: 'Expense Assignment: ',
            description:
              'After making a purchase, users can assign transactions to specific projects to improve financial clarity and profitability.',
          },
          {
            label: 'States & Edge Cases: ',
            description:
              'The experience was designed considering unassigned expenses, negative cashflow, projects without income, transaction reassignment, empty states, and pending payments.',
          },
        ],
      },
      // ── Design System & UI Implementation ───────────────────
      {
        type: 'text',
        heading: 'Design System & UI Implementation',
        body:
          'I built both the design system and the functional interface directly in HTML and CSS using reusable components, semantic variables, and scalable patterns designed to reduce the gap between design and implementation.\n\nThis approach made it possible to transform visual decisions into an interactive and functional interface from the early stages of the project, enabling rapid testing, state validation, and exploration of real behaviors directly within the implemented product.\n\nMore than 80% of the interface was developed using reusable components and shared patterns, allowing faster iterations, improved visual consistency, and significantly reducing friction between design and development.',
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
        heading: 'Result',
        body:
          'Luma explored a new way of organizing financial information around real projects and workflows, transforming income, expenses, and cashflow into a more understandable, organized, and contextual experience.',
        items: [
          {
            label:
              'The code-first approach reduced more than 70% of the traditional time required to build a design system',
            description:
              ' from scratch, design, iterate, and implement new interfaces and components, eliminating a large portion of the traditional handoff between design and development.',
          },
          {
            label:
              'During initial product validations, the introduction of project-based financial organization improved financial categorization adoption by approximately 65% during testing flows',
            description:
              ', reducing friction when interpreting expenses and income distributed across multiple work contexts.',
          },
        ],
      },
      {
        type: 'text',
        body:
          'The result was a mobile fintech experience designed to help people with variable income better understand and organize their daily financial situation.',
      },
      // ── Media 2 — showcase final del producto ───────────────
      {
        type: 'media',
        mediaType: 'image',
        src: '/assets/work/luma/detail-project.png',
        alt:
          'Showcase final del producto Luma — pantallas mobile del experience completo',
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
    title: 'Increased conversion in a 3D facial scanning experience',
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
      heading:
        'I designed the experience of a B2C app focused on purchasing personalized eyewear through 3D facial scanning and prescription management.',
      body:
        'The product is part of a HealthTech ecosystem that connects users, optometrists, and manufacturing processes, enabling the production of eyewear tailored to each person’s facial anatomy.',
    },
    blocks: [
      {
        type: 'text',
        heading: 'The challenge',
        body: 'The app’s main flow allows users to:',
        items: [
          'Browse and select eyewear models',
          'Perform a 3D facial scan directly from their device',
          'Manage their prescription by uploading an existing prescription, taking a photo, or scheduling an appointment with a professional',
          'Preview the result through a Virtual Try-On experience',
          'Complete the purchase',
        ],
      },
      {
        type: 'text',
        body:
          'The challenge was to organize a complex process into a clear and understandable experience that guided users through each step without causing drop-offs.',
      },
      {
        type: 'text',
        heading: 'Problem',
        body: 'There was friction across several critical points in the flow:',
        items: [
          'The 3D scanning process generated uncertainty (accuracy, camera usage, data concerns)',
          'Prescription management interrupted the experience',
          'Many users did not have a prescription and did not know how to continue',
          'The overall process felt complex and unclear',
        ],
      },
      {
        type: 'text',
        body: 'This directly impacted conversion rates and the quality of manufacturing data.',
      },
      {
        type: 'text',
        heading: 'What I did',
        body: 'I focused on simplifying the flow and reducing friction at every stage.',
        items: [
          'Reorganized the experience into clear, progressive steps',
          'Designed a scanning onboarding flow that prepared users before entering the SDK',
          'Added real-time feedback to guide the scanning process',
          'Created a flexible prescription system (upload, photo, or appointment)',
          'Integrated optometrist scheduling directly into the flow',
          'Defined states, validations, and messaging to provide clarity throughout the experience',
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
        heading: 'Impact & Metrics',
        body:
          'The solution is already implemented and actively being used, positively impacting both the user experience and operational processes.',
        items: [
          'Created a smoother experience between the B2C app, optometrists, and internal operations',
          'Turned 3D facial scanning from a barrier into an understandable step within the journey',
          'Reduced purchase friction by offering clear prescription alternatives',
          'Integrated professional services without removing users from the flow',
        ],
      },
      {
        type: 'statistics',
        items: [
          {
            value: '+37%',
            label: 'purchase completion rate',
            description:
              'B2C Conversion Area. Prescription flexibility reduced abandonments and transformed the lack of a prescription into an opportunity.',
          },
          {
            value: '-22%',
            label: 'errors in biometric data',
            description:
              'Manufacturing Quality Area. Onboarding and real-time feedback increased scan reliability.',
          },
          {
            value: '+48%',
            label: 'usage of the appointment scheduling feature',
            description:
              'Service Adoption Area. Gamification and integrated scheduling reduced friction.',
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
      // Showcase final del producto (DESPUÉS de testimonials, según Figma)
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
