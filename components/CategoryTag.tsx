import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** 'year' = gris medio (text-secondary). 'category' = morado accent. */
  variant?: 'category' | 'year'
}

/**
 * Tag de categoría para las cards de proyectos.
 * - Desktop / Tablet: 14px / 20px line (S/Medium del Figma)
 * - Mobile (≤600px): 12px / 16px line (XS/Medium del Figma)
 *
 * El font-size + line-height van por CSS class (.category-tag) para poder
 * cambiarlos con media query. El color va inline porque depende de la
 * variant (year/category) que es por instancia.
 */
export function CategoryTag({ children, variant = 'category' }: Props) {
  return (
    <span
      className="category-tag"
      style={{
        color: variant === 'year' ? 'var(--fg-3)' : 'var(--color-accent)',
      }}
    >
      {children}
    </span>
  )
}
