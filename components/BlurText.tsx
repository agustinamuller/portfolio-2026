'use client'

import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'

interface AnimationStep {
  filter?: string
  opacity?: number
  y?: number
}

interface BlurTextProps {
  text?: string
  delay?: number
  className?: string
  style?: CSSProperties
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: AnimationStep
  animationTo?: AnimationStep[]
  easing?: (t: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

const buildKeyframes = (from: AnimationStep, steps: AnimationStep[]) => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ])
  const keyframes: Record<string, (string | number | undefined)[]> = {}
  keys.forEach((k) => {
    keyframes[k] = [
      from[k as keyof AnimationStep],
      ...steps.map((s) => s[k as keyof AnimationStep]),
    ]
  })
  return keyframes
}

/**
 * BlurText — cada palabra/letra entra con un fade + blur + slide vertical
 * conforme la sección entra al viewport. Animación de un solo disparo.
 *
 * Componente externo (React Bits) adaptado a TypeScript.
 */
export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  style,
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const [inView, setInView] = useState(false)
  // settled = la animación terminó y el texto está en estado estable
  // (mostrado u oculto). Sirve para liberar la capa GPU (willChange auto)
  // y devolver el subpixel antialiasing del sistema. Mismo patrón del fix
  // de Reveal — sin esto las letras se rendean en escala de grises con
  // bordes raros en Chrome.
  const [settled, setSettled] = useState(true)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Bidireccional: se anima al entrar Y se revierte al salir del viewport
    // (no unobserve después del primer hit).
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: -50 }
        : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  )

  const defaultTo = useMemo(
    () => [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? 5 : -5 },
      { filter: 'blur(0px)', opacity: 1, y: 0 },
    ],
    [direction]
  )

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo
  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  )

  // Cuando inView cambia, arranca animación → settled=false. Programamos
  // un timeout para volver a settled=true cuando termina el último span
  // (totalDuration + delay del último elemento + buffer).
  useEffect(() => {
    setSettled(false)
    const lastDelayMs = (elements.length - 1) * delay
    const totalMs = totalDuration * 1000 + lastDelayMs + 100 /* buffer */
    const t = window.setTimeout(() => setSettled(true), totalMs)
    return () => clearTimeout(t)
  }, [inView, elements.length, delay, totalDuration])

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', margin: 0, ...style }}
    >
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spanTransition: any = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        }
        return (
          <motion.span
            key={index}
            // Cast a any: motion espera TargetAndTransition (con index signature
            // para `--${string}` CSS custom props) y nuestro AnimationStep no
            // los declara. Funcionalmente correcto, sólo restricción de tipos.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initial={fromSnapshot as any}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            animate={(inView ? animateKeyframes : fromSnapshot) as any}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            style={{
              display: 'inline-block',
              // willChange SOLO mientras anima. Cuando settled=true, vuelve
              // a 'auto' para que el browser devuelva el subpixel
              // antialiasing del sistema (sino las letras quedan en capa
              // GPU permanente con rendering raro).
              willChange: settled ? 'auto' : 'transform, filter, opacity',
            }}
          >
            {segment === ' ' ? ' ' : segment}
            {animateBy === 'words' && index < elements.length - 1 && ' '}
          </motion.span>
        )
      })}
    </p>
  )
}

