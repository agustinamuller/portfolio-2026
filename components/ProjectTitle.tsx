'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { tLocalized, LocalizedString } from '@/data/translations'

/**
 * H1 del case study — client component que resuelve el title bilingüe.
 * Se monta dentro del ProjectHeader del detail page (server component).
 *
 * El title puede ser string plano (inglés siempre) o `{ en, es }`
 * (bilingüe). El componente usa `tLocalized` que maneja ambos casos.
 */
export function ProjectTitle({ title }: { title: LocalizedString }) {
  const { language } = useLanguage()
  return (
    <h1
      style={{
        fontFamily: '"Neue Montreal", var(--font-sans)',
        fontWeight: 500,
        fontSize: 40,
        lineHeight: '48px',
        letterSpacing: '-1px',
        color: 'var(--fg-1)',
        margin: 0,
        flex: '1 1 0',
        minWidth: 0,
      }}
    >
      {tLocalized(title, language)}
    </h1>
  )
}
