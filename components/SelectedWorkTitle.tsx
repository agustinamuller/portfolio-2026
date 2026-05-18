'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/data/translations'

/**
 * Título "Selected Work" / "Proyectos destacados" — client component
 * para que pueda usar el hook useLanguage. Se importa desde app/page.tsx
 * (que es server component) sin afectar el SSR del resto de la home.
 */
export function SelectedWorkTitle() {
  const { language } = useLanguage()
  return (
    <h2
      className="work-section-title"
      style={{
        fontFamily: '"Neue Montreal", var(--font-sans)',
        fontWeight: 500,
        fontSize: 56,
        lineHeight: '64px',
        letterSpacing: '-2px',
        color: 'var(--fg-1)',
        margin: 0,
        textAlign: 'center',
        padding: '0 24px',
      }}
    >
      {translations.work.sectionTitle[language]}
    </h2>
  )
}
