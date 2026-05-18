'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/data/translations'

interface Props {
  /** Valor del rol — queda en inglés siempre (decisión del DS). */
  role: string
  /** Valor de la industry — queda en inglés siempre (decisión del DS). */
  industry: string
}

/**
 * Sidebar del header del case study — labels "MY ROLE" / "INDUSTRY"
 * traducidos al idioma actual. Los VALORES (role + industry) quedan en
 * inglés siempre (decisión del DS — son títulos profesionales tipo
 * LinkedIn).
 *
 * Client component porque usa useLanguage. Se monta dentro del
 * `<ProjectHeader>` del detail page que es server component.
 */
export function ProjectHeaderSide({ role, industry }: Props) {
  const { language } = useLanguage()
  const t = translations.project
  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        flexShrink: 0,
        width: 200,
      }}
      className="project-header-side"
    >
      <SideInfo label={t.myRole[language]} value={role} />
      <SideInfo label={t.industry[language]} value={industry} />
    </aside>
  )
}

function SideInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: '"Neue Montreal", var(--font-sans)',
          fontWeight: 500,
          fontSize: 16,
          lineHeight: '28px',
          color: 'var(--color-accent)',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"Neue Montreal", var(--font-sans)',
          fontWeight: 500,
          fontSize: 14,
          lineHeight: '20px',
          color: 'var(--fg-3)',
        }}
      >
        {value}
      </div>
    </div>
  )
}
