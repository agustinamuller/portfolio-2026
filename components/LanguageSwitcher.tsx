'use client'

import { useLanguage, Language } from '@/contexts/LanguageContext'

/**
 * Toggle de idioma EN | ES — match del Figma node 749:2847.
 *
 * Layout: dos "buttons" horizontales (EN y ES) con un separador vertical
 * fino en el medio. El idioma activo va en weight medium + color primary;
 * el inactivo en weight regular + color tertiary.
 *
 * Animación: soft fade entre estados (color + font-weight no se animan
 * directo en CSS, pero los simulamos con transición de color suave).
 *
 * Usa `useLanguage()` para leer/escribir el idioma global. Persistencia
 * en localStorage + detección automática del browser ya están manejadas
 * en el LanguageContext.
 */
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="lang-switcher" role="group" aria-label="Language selector">
      <button
        type="button"
        className={`lang-switcher-btn ${language === 'en' ? 'is-active' : ''}`}
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="lang-switcher-divider" aria-hidden="true" />
      <button
        type="button"
        className={`lang-switcher-btn ${language === 'es' ? 'is-active' : ''}`}
        onClick={() => setLanguage('es')}
        aria-pressed={language === 'es'}
        aria-label="Cambiar a español"
      >
        ES
      </button>

      <style>{`
        .lang-switcher {
          display: inline-flex;
          align-items: center;
          gap: 0;
        }

        .lang-switcher-btn {
          /* Match Figma: button 40px alto, padding 12px, sin background. */
          height: 40px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;

          font-family: 'Neue Montreal', var(--font-sans);
          font-size: 14px;
          line-height: 20px;
          /* Inactivo por default: regular + color tertiary (fg-4 del DS = #82828c). */
          font-weight: 400;
          color: var(--fg-4);

          /* Animación suave entre estados — solo color, no font-weight
             (font-weight no se anima nativamente). */
          transition: color 220ms var(--ease);
        }

        .lang-switcher-btn.is-active {
          /* Activo: medium + color primary (fg-1 del DS = #fafafa). */
          font-weight: 500;
          color: var(--fg-1);
        }

        /* Hover SOLO en devices con mouse — patrón del DS para evitar sticky
           hover en touch. El inactivo se acerca al activo al hacer hover. */
        @media (hover: hover) and (pointer: fine) {
          .lang-switcher-btn:not(.is-active):hover {
            color: var(--fg-3);
          }
        }

        .lang-switcher-btn:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 4px;
          border-radius: 4px;
        }

        /* Separador vertical entre EN y ES — 20px de alto, 1px de ancho.
           Match Figma (la "line1" rotada 90°). */
        .lang-switcher-divider {
          display: inline-block;
          width: 1px;
          height: 20px;
          background: var(--border-1);
        }

        /* Respeta reduced-motion: sin transición de color. */
        @media (prefers-reduced-motion: reduce) {
          .lang-switcher-btn {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}
