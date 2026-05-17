'use client'

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: ReactNode
  /** Distancia (px) del desplazamiento inicial. Default 24. */
  distance?: number
  /** Dirección del desplazamiento. Default 'up' (slide hacia arriba). */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Duración del fade+slide (ms). Default 700. */
  duration?: number
  /** Delay antes de animar (ms). Default 0. */
  delay?: number
  /** Fracción de la sección que debe estar visible para disparar. Default 0.1. */
  threshold?: number
  /** Si false (default), se anima cada vez que entra y sale del viewport.
   *  Si true, se anima sólo la primera vez. */
  once?: boolean
  /**
   * Margen que ajusta el bounding box del viewport para el observer.
   * Default: `'0px 0px 10% 0px'` → EXTIENDE el viewport 10% hacia abajo,
   * disparando la animación ANTES de que el elemento entre al viewport real.
   * Esto evita que se vean "espacios en blanco" mientras los elementos
   * esperan animarse al scrollear.
   */
  rootMargin?: string
  /**
   * Si true, demora el montaje del IntersectionObserver hasta que el hero
   * termine de animar (~1.5s). Útil para secciones que están justo después
   * del hero y que en tablet/desktop podrían entrar al viewport al cargar
   * la página, animándose al mismo tiempo que el hero (queda mal).
   * Default: false.
   */
  waitForHero?: boolean
  className?: string
  style?: CSSProperties
}

const HERO_ANIMATION_MS = 1500

/**
 * Wrapper que aplica fade in + slide cuando el elemento entra al viewport.
 *
 * Patrón: IntersectionObserver + CSS transition. Sin dependencias externas.
 * Respeta `prefers-reduced-motion: reduce` — desactiva la animación y deja
 * el contenido visible desde el inicio para usuarios con sensibilidad al
 * movimiento.
 *
 * @example
 * <Reveal direction="up" delay={100}>
 *   <h2>Mi sección</h2>
 * </Reveal>
 */
export function Reveal({
  children,
  distance = 24,
  direction = 'up',
  duration = 1400,
  delay = 0,
  threshold = 0.1,
  once = false,
  rootMargin = '0px 0px 10% 0px',
  waitForHero = false,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detectar preferencia de "reducir movimiento" del sistema operativo
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Observer del scroll. Si waitForHero=true, el montaje se demora 1.5s
  // para que las secciones cercanas al hero (visibles en tablet/desktop
  // al cargar) no animen al mismo tiempo que el hero. Se montan DESPUÉS
  // de que el hero terminó de animar.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let obs: IntersectionObserver | null = null
    const mountObserver = () => {
      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) obs?.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        },
        { threshold, rootMargin }
      )
      obs.observe(el)
    }
    let mountTimeout: number | undefined
    if (waitForHero) {
      mountTimeout = window.setTimeout(mountObserver, HERO_ANIMATION_MS)
    } else {
      mountObserver()
    }
    return () => {
      if (mountTimeout) clearTimeout(mountTimeout)
      obs?.disconnect()
    }
  }, [once, threshold, rootMargin, waitForHero])

  // Calcular el desplazamiento inicial según dirección
  const dx =
    direction === 'left' ? distance : direction === 'right' ? -distance : 0
  const dy =
    direction === 'up' ? distance : direction === 'down' ? -distance : 0

  // Si el usuario prefiere movimiento reducido, mostrar directo sin animación
  const shouldAnimate = !reducedMotion

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: !shouldAnimate || visible ? 1 : 0,
        // CRÍTICO: cuando el elemento está visible (animación terminada),
        // usamos `transform: none` en vez de `translate(0, 0)`. Cualquier
        // valor de transform distinto de 'none' (incluso translate(0,0))
        // mantiene al elemento en una capa GPU separada. En esa capa el
        // texto se renderiza con anti-aliasing en escala de grises (por
        // `-webkit-font-smoothing: antialiased`) en vez del subpixel
        // antialiasing del sistema → letras "cortadas", finas o raras.
        // Con `transform: none` el elemento vuelve al render normal en CPU.
        transform:
          !shouldAnimate || visible
            ? 'none'
            : `translate(${dx}px, ${dy}px)`,
        transition: shouldAnimate
          ? `opacity ${duration}ms var(--ease) ${delay}ms, transform ${duration}ms var(--ease) ${delay}ms`
          : 'none',
        // will-change SOLO mientras está animando (oculto, esperando entrar).
        // Una vez visible, vuelve a 'auto' para que el browser rasterize el
        // texto en CPU con anti-aliasing normal (sino el texto queda con
        // rendering raro/cortado por permanecer en capa GPU).
        willChange: shouldAnimate && !visible ? 'opacity, transform' : 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
