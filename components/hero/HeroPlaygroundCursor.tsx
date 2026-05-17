'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Cursor decorativo "drag me!" para el playground del Hero.
 *
 * Se monta como componente HERMANO del playground (no hijo) — fuera del
 * HeroWordmarkScroll que tiene transform, así position:fixed funciona
 * correctamente sin caer en el bug de "contained fixed positioning".
 *
 * NO se renderiza en mobile (no hay mouse cursor en touch devices).
 */
export function HeroPlaygroundCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar mobile y tablet (≤1024px) — no montar el cursor en touch
  // devices. El cursor decorativo solo aplica en desktop (>1024px).
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    setIsMobile(mq.matches)
    const onChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const cursor = cursorRef.current
    if (!cursor) return

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
      const playground = document.querySelector('.hero-physics-wrap') as HTMLElement | null
      if (!playground) {
        targetOpacity = 0
        if (!raf) raf = requestAnimationFrame(apply)
        return
      }
      const rect = playground.getBoundingClientRect()

      cx = e.clientX
      cy = e.clientY

      // Binary inside/outside — el cursor solo se muestra cuando el mouse
      // está REALMENTE dentro de la sección. Sin fade gradual por distancia
      // (causaba que se vea fuera de la sección y se solape con otros
      // cursores en transiciones rápidas). La transition CSS 150ms suaviza
      // el cambio visual.
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
  }, [isMobile])

  // En mobile no renderizamos el div del cursor — no hay mouse en touch.
  if (isMobile) return null

  return (
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
        zIndex: 100,
        willChange: 'transform',
      }}
    >
      <img
        src="/assets/cursor-hero.svg"
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', display: 'block', userSelect: 'none' }}
      />
    </div>
  )
}
