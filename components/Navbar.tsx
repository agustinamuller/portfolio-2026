'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'
import { Button } from './Button'

// Marker especial — al cerrar el menú, navegar al top en lugar de a una sección.
const NAV_INTENT_TOP = '__TOP__'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // Detectar si estamos en la home. Si no, los links work/about/contact
  // navegan a /#section en lugar de hacer smooth scroll (que solo funciona
  // si la sección existe en la página actual).
  const pathname = usePathname()
  const isHome = pathname === '/'
  /**
   * Si el cierre del menú es por navegación (tap en link), guardamos
   * el id objetivo aquí. El cleanup del body lock verifica este ref para
   * decidir si restaurar el scrollY anterior (cierre sin navegación) o
   * navegar a la sección target (tap en link).
   */
  const pendingNavIdRef = useRef<string | null>(null)

  // Detectar mobile breakpoint con JS (en lugar de sólo CSS media query).
  // Esto garantiza que la lógica de visibilidad/render sea robusta y no
  // dependa del cache de CSS del dev server.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    setIsMobile(mq.matches)
    const onChange = () => {
      setIsMobile(mq.matches)
      if (!mq.matches) setMenuOpen(false) // cerrar menu si pasamos a desktop
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Detecta qué sección del home es la "visible" actualmente y la marca
  // como activa en la navbar (work / about / contact).
  useEffect(() => {
    const ids = ['work', 'about', 'contact']
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Mobile: bloquear scroll del body cuando el menú está abierto.
  // Técnica position:fixed para no romper el position:sticky de la navbar.
  useEffect(() => {
    if (!menuOpen) return
    const scrollY = window.scrollY
    const body = document.body
    const prevPosition = body.style.position
    const prevTop = body.style.top
    const prevWidth = body.style.width
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    return () => {
      body.style.position = prevPosition
      body.style.top = prevTop
      body.style.width = prevWidth

      const html = document.documentElement
      const prevScrollBehavior = html.style.scrollBehavior

      // Al cerrar el menú, decidir qué scroll hacer según el motivo del cierre:
      const pendingId = pendingNavIdRef.current
      pendingNavIdRef.current = null

      if (pendingId === NAV_INTENT_TOP) {
        // Tap en el logo → ir al top con smooth
        window.scrollTo({ top: 0, behavior: 'smooth' })
        history.replaceState(null, '', '/')
      } else if (pendingId) {
        // Tap en un link → navegar a la sección con smooth
        requestAnimationFrame(() => {
          const el = document.getElementById(pendingId)
          if (!el) return
          const top = el.getBoundingClientRect().top - 80
          window.scrollTo({ top, behavior: 'smooth' })
          history.replaceState(null, '', `#${pendingId}`)
        })
      } else {
        // Cierre sin navegación (X, ESC) → restaurar la posición exacta
        // SIN animación. Desactivamos temporalmente el scroll-behavior:smooth
        // del CSS global (html tiene scroll-behavior:smooth, lo cual hace
        // que cualquier window.scrollTo sea animado por default).
        html.style.scrollBehavior = 'auto'
        window.scrollTo(0, scrollY)
        // Restaurar el scroll-behavior en el próximo frame
        requestAnimationFrame(() => {
          html.style.scrollBehavior = prevScrollBehavior
        })
      }
    }
  }, [menuOpen])

  // Mobile: ESC cierra el menú
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Smooth scroll a la sección + actualiza el hash sin scroll jump del browser.
  // - Si estamos en la home (isHome=true) y existe el elemento: smooth scroll
  // - Si NO estamos en la home: dejamos que el browser navegue normalmente
  //   al href "/#section" (no preventDefault, navega + aplica el hash)
  // - Si el menú mobile está abierto: usamos pendingNavIdRef para coordinar
  //   con el cleanup del body lock
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    if (!isHome) {
      // En otra página → dejar que el <Link href="/#id"> navegue al home
      // y el browser aplique el scroll al anchor automáticamente.
      setMenuOpen(false)
      return
    }
    e.preventDefault()
    if (menuOpen) {
      pendingNavIdRef.current = id
      setMenuOpen(false)
      return
    }
    // Menú no abierto + en home → scroll directo
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  // Click en el logo → scroll al top (home) o navegar a home (otra página).
  const scrollToTop = (e: React.MouseEvent) => {
    if (!isHome) {
      // En otra página → dejar que el <Link href="/"> navegue al home
      setMenuOpen(false)
      return
    }
    e.preventDefault()
    if (menuOpen) {
      pendingNavIdRef.current = NAV_INTENT_TOP
      setMenuOpen(false)
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    history.replaceState(null, '', '/')
  }

  return (
    <>
      <nav
        className={`anim-enter-navbar nav-shell ${scrolled ? 'is-scrolled' : ''}`}
        style={{
          width: '100%',
          height: 96,
          // Padding desktop por default. Mobile override via CSS media query
          // (regla en globals.css: .nav-shell { padding: 28px 16px } @ ≤ 600px).
          padding: '28px 112px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }} onClick={scrollToTop}>
          <Logo />
        </Link>

        {/* DESKTOP nav — siempre renderizado, oculto en mobile via CSS
            (className nav-desktop-items con media query).
            Override del tamaño/peso default del Button size="lg" (20/500):
            navbar más liviana con 18/400. No tocamos el Button base para
            no romper otros usos de size="lg" en la app. */}
        <div className="nav-desktop-items" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="/#work" onClick={scrollTo('work')} style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="lg"
              className={`nav-item ${activeSection === 'work' ? 'is-active' : ''}`}
              style={navItemStyle}
            >
              work
            </Button>
          </a>
          <a href="/#about" onClick={scrollTo('about')} style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="lg"
              className={`nav-item ${activeSection === 'about' ? 'is-active' : ''}`}
              style={navItemStyle}
            >
              about me
            </Button>
          </a>
          <a href="/#contact" onClick={scrollTo('contact')} style={{ textDecoration: 'none' }}>
            <Button
              variant="ghost"
              size="lg"
              className={`nav-item ${activeSection === 'contact' ? 'is-active' : ''}`}
              style={navItemStyle}
            >
              contact
            </Button>
          </a>
        </div>

        {/* MOBILE toggle — siempre renderizado, oculto en desktop via CSS. */}
        <button
          className="nav-mobile-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-overlay"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </nav>

      {/* MOBILE overlay — siempre renderizado, oculto en desktop via CSS. */}
      <div
        id="nav-mobile-overlay"
        className={`nav-mobile-overlay ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
        style={{
          paddingTop: 20,
          textAlign: 'center',
        }}
      >
          <a
            href="/#work"
            onClick={scrollTo('work')}
            className="nav-mobile-link"
            style={mobileLinkStyle}
            onTouchStart={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            onTouchEnd={(e) => (e.currentTarget.style.color = 'var(--fg-1)')}
            onTouchCancel={(e) => (e.currentTarget.style.color = 'var(--fg-1)')}
          >
            work
          </a>
          <a
            href="/#about"
            onClick={scrollTo('about')}
            className="nav-mobile-link"
            style={{ ...mobileLinkStyle, marginTop: 20 }}
            onTouchStart={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            onTouchEnd={(e) => (e.currentTarget.style.color = 'var(--fg-1)')}
            onTouchCancel={(e) => (e.currentTarget.style.color = 'var(--fg-1)')}
          >
            about me
          </a>
          <a
            href="/#contact"
            onClick={scrollTo('contact')}
            className="nav-mobile-link"
            style={{ ...mobileLinkStyle, marginTop: 20 }}
            onTouchStart={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            onTouchEnd={(e) => (e.currentTarget.style.color = 'var(--fg-1)')}
            onTouchCancel={(e) => (e.currentTarget.style.color = 'var(--fg-1)')}
          >
            contact
          </a>
      </div>
    </>
  )
}

/**
 * Override del Button size="lg" para los items de la navbar (work / about
 * me / contact). El size="lg" del Button base es 20/500; en la navbar lo
 * bajamos a 18/400 para que se sienta menos pesada. No tocamos el Button
 * base para no afectar otros usos de size="lg" en la app.
 */
const navItemStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 400,
}

/**
 * Estilo común para los links del menú mobile. Inline para garantizar que
 * apliquen siempre, sin depender del CSS global ni del cache del dev server.
 * 18/400 alineado con la navbar desktop.
 */
const mobileLinkStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: '"Neue Montreal", var(--font-sans)',
  fontWeight: 400,
  fontSize: 18,
  lineHeight: '28px',
  color: 'var(--fg-1)',
  textAlign: 'center',
  padding: '4px 12px',
  margin: 0,
  textDecoration: 'none',
  WebkitTapHighlightColor: 'transparent',
}

/**
 * Ícono hamburger del Figma — dos líneas horizontales paralelas (estilo "≡").
 */
function HamburgerIcon() {
  return (
    <svg
      width="21"
      height="8"
      viewBox="0 0 21 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="0" y1="1" x2="21" y2="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="7" x2="21" y2="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

/**
 * Ícono X (cerrar menú).
 */
function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
