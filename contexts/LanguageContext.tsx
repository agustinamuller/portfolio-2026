'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

export type Language = 'en' | 'es'

interface LanguageContextValue {
  /** Idioma actual del sitio. */
  language: Language
  /**
   * Cambia el idioma actual. Persiste la elección del usuario en
   * localStorage para que respete la preferencia al volver al sitio.
   */
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'portfolio-language'

/**
 * Detecta el idioma inicial:
 *  1. Si el usuario eligió manualmente algún idioma → usar el guardado en
 *     localStorage (su preferencia explícita gana siempre).
 *  2. Si nunca eligió → detectar el idioma del navegador.
 *     - Si empieza con "es" → 'es'
 *     - Cualquier otro → 'en' (default, según definición de Agustina)
 *
 * Esto corre SOLO en el cliente (window guard). Server-side usa default 'en'.
 */
function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    // localStorage puede no estar disponible (Safari private, etc.)
  }
  const browser = window.navigator.language?.toLowerCase() ?? ''
  return browser.startsWith('es') ? 'es' : 'en'
}

/**
 * Provider del Context de idioma. Envuelve toda la app en `app/layout.tsx`.
 * Maneja:
 *  - state del idioma actual
 *  - detección automática del browser language al primer load
 *  - persistencia en localStorage cuando el usuario cambia con el switcher
 *  - sync inicial entre el SSR (siempre 'en') y el client (puede ser 'es')
 *    sin causar hydration mismatch — el cambio se aplica en un useEffect
 *    después del primer paint.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default 'en' para evitar hydration mismatch entre server y client.
  // En el primer effect, sincronizamos con el idioma real del browser.
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const initial = detectInitialLanguage()
    setLanguageState(initial)
    // También actualizamos el atributo lang del <html> para SEO/a11y.
    document.documentElement.lang = initial
  }, [])

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    document.documentElement.lang = next
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Si localStorage falla, el cambio aplica solo para esta sesión.
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook para acceder al idioma actual y cambiarlo desde cualquier componente.
 *
 * @example
 * const { language, setLanguage } = useLanguage()
 * setLanguage(language === 'en' ? 'es' : 'en')
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  }
  return ctx
}
