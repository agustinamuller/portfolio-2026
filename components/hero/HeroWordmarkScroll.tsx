'use client'

import { CSSProperties, ReactNode, useEffect, useRef } from 'react'

interface Props {
  children: ReactNode
  /** Estilos del wrapper (marginTop, position, etc). */
  style?: CSSProperties
  className?: string
  /** Multiplicador del scale máximo. Default 0.4 → scale máx 1.4. */
  scaleAmount?: number
  /** Blur máximo en px. Default 12. */
  blurAmount?: number
}

/**
 * Wrapper que aplica una animación scroll-linked al wordmark del hero:
 * a medida que el elemento sube por el viewport, se agranda (scale),
 * se difumina (blur) y desaparece (opacity).
 *
 * Implementación con JS para garantizar compatibilidad cross-browser
 * (animation-timeline:view() aún no es universal). Listener pasivo
 * para no afectar el smooth-scroll del navegador.
 */
export function HeroWordmarkScroll({
  children,
  style,
  className,
  scaleAmount = 0.4,
  blurAmount = 12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respetar reduced-motion: si activo, no aplicar el efecto.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    let raf = 0

    const applyEffect = () => {
      // Basado en scrollY — la animación arranca inmediatamente con
      // cualquier scroll, sin esperar a que el wordmark salga del viewport.
      // completeAt = 320px → necesitas scrollear ~320px para que el
      // wordmark se haya evaporado completamente. Ritmo más relajado.
      const completeAt = 320
      const progress = Math.max(0, Math.min(1, window.scrollY / completeAt))

      // CRÍTICO: cuando progress=0 (al top de la página) usamos
      // transform/filter "none" en vez de scale(1)/blur(0). Cualquier
      // valor de transform distinto de none crea capa GPU permanente y
      // el texto se renderea con escala de grises (sin subpixel AA),
      // dejando letras "raras" en el wordmark. Mismo fix que Reveal.
      if (progress === 0) {
        el.style.transform = 'none'
        el.style.opacity = '1'
        el.style.filter = 'none'
        el.style.willChange = 'auto'
      } else {
        const scale = 1 + progress * scaleAmount
        const opacity = 1 - progress
        const blur = progress * blurAmount
        el.style.transform = `scale(${scale})`
        el.style.opacity = String(opacity)
        el.style.filter = `blur(${blur}px)`
        el.style.willChange = 'transform, opacity, filter'
      }
    }

    const onScroll = () => {
      // Throttle con rAF para no aplicar más de 60 veces/seg
      if (raf) return
      raf = requestAnimationFrame(() => {
        applyEffect()
        raf = 0
      })
    }

    applyEffect() // estado inicial
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [scaleAmount, blurAmount])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transformOrigin: 'center center',
        // willChange inicial 'auto' — el applyEffect lo activa cuando hay
        // scroll y lo desactiva cuando vuelve al top. Sin esto, el
        // wordmark vive permanentemente en capa GPU con rendering raro.
        willChange: 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
