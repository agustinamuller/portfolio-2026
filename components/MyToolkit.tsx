'use client'

import { useEffect, useRef, useState } from 'react'
import { Reveal } from './Reveal'

interface ToolkitIcon {
  id: string
  name: string
  src: string
}

// Los SVG vienen desde Figma con su propio fondo redondeado completo:
// no necesitan background en el contenedor (eso causaba un "stroke" del
// color de fondo asomando alrededor cuando el border-radius no coincidía
// exactamente con el del SVG).
const ICONS: ToolkitIcon[] = [
  { id: 'claude', name: 'Claude', src: '/assets/toolkit/claude.svg' },
  { id: 'figma', name: 'Figma', src: '/assets/toolkit/figma.svg' },
  { id: 'antigravity', name: 'Antigravity', src: '/assets/toolkit/antigravity.svg' },
  { id: 'v0', name: 'v0', src: '/assets/toolkit/v0.svg' },
  { id: 'cursor', name: 'Cursor', src: '/assets/toolkit/cursor.svg' },
  { id: 'lovable', name: 'Lovable', src: '/assets/toolkit/lovable.svg' },
  { id: 'hotjar', name: 'Hotjar', src: '/assets/toolkit/hotjar.svg' },
  { id: 'analytics', name: 'Google Analytics', src: '/assets/toolkit/analytics.svg' },
]

// Parámetros del efecto dock magnification
const HOVER_RANGE = 140
const MAX_SCALE = 1.55
const MAX_LIFT = 14

/**
 * Sección "My toolkit" — dock de íconos con efecto magnification estilo
 * Dock de macOS. Al hacer hover, el ícono bajo el cursor se eleva y agranda,
 * y los adyacentes responden con escala decreciente según distancia.
 *
 * Cada ícono muestra un tooltip con el nombre de la app al estar hovereado
 * directamente (no se muestra para los íconos adyacentes que sólo escalan).
 */
export function MyToolkit() {
  const dockRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  // isMobile (≤600px) → tap-to-show tooltip (mobile only)
  const [isMobile, setIsMobile] = useState(false)
  // isTouchOrTablet (≤1024px) → controla cursor decorativo
  const [isTouchOrTablet, setIsTouchOrTablet] = useState(false)
  // hasHover (mouse real, no touch) → controla dock magnification
  // En tablet con mouse: true → magnification funciona
  // En tablet touch puro / mobile: false → sin magnification (evita bug
  // de hover sticky donde múltiples íconos quedan "seleccionados")
  const [hasHover, setHasHover] = useState(false)
  // ID del ícono "tappeado" en mobile — feedback visual + tooltip
  const [activeIconId, setActiveIconId] = useState<string | null>(null)

  // Detectar breakpoints + capabilities en paralelo
  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 600px)')
    const mqTablet = window.matchMedia('(max-width: 1024px)')
    const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsMobile(mqMobile.matches)
    setIsTouchOrTablet(mqTablet.matches)
    setHasHover(mqHover.matches)
    const onMobileChange = () => setIsMobile(mqMobile.matches)
    const onTabletChange = () => setIsTouchOrTablet(mqTablet.matches)
    const onHoverChange = () => setHasHover(mqHover.matches)
    mqMobile.addEventListener('change', onMobileChange)
    mqTablet.addEventListener('change', onTabletChange)
    mqHover.addEventListener('change', onHoverChange)
    return () => {
      mqMobile.removeEventListener('change', onMobileChange)
      mqTablet.removeEventListener('change', onTabletChange)
      mqHover.removeEventListener('change', onHoverChange)
    }
  }, [])

  // Cursor decorativo — DESKTOP ONLY (>1024px). No se monta en mobile
  // ni en tablet (touch devices o tablets con o sin mouse).
  useEffect(() => {
    if (isTouchOrTablet) return
    const section = sectionRef.current
    const cursor = cursorRef.current
    if (!section || !cursor) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let raf = 0
    let cx = 0
    let cy = 0
    let targetOpacity = 0

    const apply = () => {
      raf = 0
      cursor.style.transform = `translate(${cx}px, ${cy}px)`
      cursor.style.opacity = String(targetOpacity)
    }

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()

      cx = e.clientX
      cy = e.clientY

      // Binary inside/outside — cursor visible solo si el mouse está
      // dentro de la sección. La transition CSS 150ms suaviza el cambio.
      const isInside = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      )
      targetOpacity = isInside ? 1 : 0

      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [isTouchOrTablet])

  // Dock magnification effect — funciona SOLO si hay mouse real (hover).
  // En touch devices (mobile o tablet sin trackpad), el :hover CSS queda
  // sticky después de un tap, lo que causaba que varios íconos se vean
  // "seleccionados" a la vez. Con hasHover detectamos mouse real y evitamos
  // ese bug en touch.
  useEffect(() => {
    if (!hasHover) return
    const dock = dockRef.current
    if (!dock) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let raf = 0
    let currentMouseX: number | null = null

    const applyEffect = () => {
      raf = 0
      const dockRect = dock.getBoundingClientRect()

      iconRefs.current.forEach((el) => {
        if (!el) return

        if (currentMouseX === null) {
          el.style.transform = 'scale(1) translateY(0)'
          return
        }

        const iconRect = el.getBoundingClientRect()
        const iconCenterX = iconRect.left + iconRect.width / 2 - dockRect.left
        const distance = Math.abs(iconCenterX - currentMouseX)

        if (distance > HOVER_RANGE) {
          el.style.transform = 'scale(1) translateY(0)'
          return
        }

        const t = 1 - distance / HOVER_RANGE
        const eased = Math.sin((t * Math.PI) / 2)
        const scale = 1 + (MAX_SCALE - 1) * eased
        const lift = MAX_LIFT * eased

        el.style.transform = `scale(${scale}) translateY(${-lift}px)`
      })
    }

    const scheduleApply = () => {
      if (raf) return
      raf = requestAnimationFrame(applyEffect)
    }

    const onMove = (e: MouseEvent) => {
      const rect = dock.getBoundingClientRect()
      currentMouseX = e.clientX - rect.left
      scheduleApply()
    }

    const onLeave = () => {
      currentMouseX = null
      scheduleApply()
    }

    dock.addEventListener('mousemove', onMove)
    dock.addEventListener('mouseleave', onLeave)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      dock.removeEventListener('mousemove', onMove)
      dock.removeEventListener('mouseleave', onLeave)
    }
  }, [hasHover])

  return (
    <section
      ref={sectionRef}
      aria-label="My toolkit"
      className="toolkit-section"
      style={{
        padding: '96px 112px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Cursor decorativo — DESKTOP ONLY (>1024px).
          Render condicional: NO se monta en mobile ni tablet. */}
      {!isTouchOrTablet && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 130,
            height: 65,
            marginLeft: -11,
            marginTop: -10,
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 150ms ease',
            zIndex: 20,
            willChange: 'transform',
          }}
        >
          <img
            src="/assets/cursor-toolkit.svg"
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
          />
        </div>
      )}
      {/* Mismo patrón de Reveal que Selected Work / WhatIDo:
          duration 900, distance 40 → más visible y fluido. */}
      <Reveal duration={900} distance={40} rootMargin="0px 0px 10% 0px">
        <h2
          className="toolkit-title"
          style={{
            fontFamily: '"Neue Montreal", var(--font-sans)',
            fontWeight: 500,
            fontSize: 56,
            lineHeight: '64px',
            letterSpacing: '-2px',
            color: 'var(--fg-1)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          My toolkit
        </h2>
      </Reveal>

      {/* Reveal del dock — mismos params que el título + delay 150ms para
          stagger respecto del título. width:100% en el wrapper deja que
          el dock pueda expandirse en mobile (usa width:100% via media query). */}
      <Reveal
        duration={900}
        distance={40}
        delay={150}
        rootMargin="0px 0px 10% 0px"
        style={{ width: '100%' }}
      >
        <div className="toolkit-dock" ref={dockRef}>
          {ICONS.map((icon, i) => (
            <div
              key={icon.id}
              className={`toolkit-icon-wrapper${activeIconId === icon.id ? ' is-active' : ''}`}
              // Tap-to-show tooltip — se activa en cualquier device SIN
              // mouse real (mobile + tablet touch). En devices con hover,
              // el CSS :hover hace el trabajo y NO necesitamos tap.
              // Self-clear a los 1800ms.
              onTouchStart={() => {
                if (hasHover) return // hover funciona naturalmente con mouse
                setActiveIconId(icon.id)
                window.setTimeout(() => {
                  setActiveIconId((current) => (current === icon.id ? null : current))
                }, 1800)
              }}
            >
              {/* El ícono escala/se eleva por el dock effect (JS) */}
              <div
                ref={(el) => {
                  iconRefs.current[i] = el
                }}
                className="toolkit-icon"
                role="img"
                aria-label={icon.name}
              >
                {/* El SVG llena el contenedor completo. Los SVGs exportados
                    desde Figma ya traen su propio fondo redondeado y diseño,
                    así no genera un "doble contenedor" visible. El bg del
                    div sólo actúa como fallback si el SVG es transparente. */}
                <img
                  src={icon.src}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Tooltip — sólo se ve cuando el cursor está SOBRE este ícono
                  específicamente (no se ve para los íconos adyacentes que
                  sólo escalan por el dock magnetic). */}
              <span className="toolkit-tooltip">{icon.name}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
