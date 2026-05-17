'use client'

import { useEffect, useRef } from 'react'

/**
 * Playground físico mobile — versión adaptada del HeroPhysicsOverlay desktop.
 *
 * Diferencias clave con desktop:
 * - viewBox 393×180 (vs 1280×280) → más compacto, proporción mobile
 * - Pills más chicas (matchean Figma mobile)
 * - Mismo comportamiento físico: caída, drag, paredes, scroll-friendly
 */

const VW = 393
// VH = alto del viewBox del playground. Más alto = las pills caen más lejos
// (más recorrido visual) y el "piso" queda más cerca de "agustina müller".
const VH = 260

type AssetSpec = {
  id: string
  href: string
  w: number
  h: number
  initX: number
  initY: number
} & (
  | { shape: 'rect'; restitution?: number; friction?: number; density?: number }
  | { shape: 'circle'; radius: number; restitution?: number; friction?: number; density?: number }
)

// Tamaños matchean el Figma mobile (aproximadamente la mitad del desktop).
// Posiciones iniciales TODAS centradas en el medio del playground (x ≈ 196.5,
// el centro del viewBox 393). Al arrancar la simulación, la gravedad las
// tira hacia abajo y los rebotes las distribuyen naturalmente.
const ASSETS: AssetSpec[] = [
  {
    id: 'pill-product',
    href: '/assets/hero/hero-pill-product.svg',
    w: 148, h: 74,
    initX: 160, initY: 30,   // centro-izquierda, arriba
    shape: 'rect',
    restitution: 0.45, friction: 0.25, density: 0.002,
  },
  {
    id: 'pill-design-systems',
    href: '/assets/hero/hero-pill-design-systems.svg',
    w: 137, h: 71,
    initX: 235, initY: 50,   // centro-derecha, un poco más abajo
    shape: 'rect',
    restitution: 0.45, friction: 0.25, density: 0.002,
  },
  {
    id: 'pill-ux-ui',
    href: '/assets/hero/hero-pill-ux-ui.svg',
    w: 130, h: 41,
    initX: 196, initY: 90,   // centro exacto, más abajo
    shape: 'rect',
    restitution: 0.4, friction: 0.3, density: 0.002,
  },
  {
    id: 'asterisk',
    href: '/assets/hero/hero-asterisk.svg',
    w: 36, h: 36,
    initX: 180, initY: 70,   // centro-izq, medio
    shape: 'circle',
    radius: 18,
    restitution: 0.6, friction: 0.2, density: 0.001,
  },
  {
    id: 'circle-arrow',
    href: '/assets/hero/hero-circle-arrow.svg',
    w: 46, h: 46,
    initX: 215, initY: 20,   // centro-der, arriba
    shape: 'circle',
    radius: 23,
    restitution: 0.65, friction: 0.2, density: 0.001,
  },
]

export function HeroMobilePhysicsOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const groupRefs = useRef<(SVGGElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    import('matter-js').then((Matter) => {
      if (cancelled) return
      const { Engine, Runner, Bodies, Events, Mouse, MouseConstraint, Composite } = Matter

      const engine = Engine.create({ gravity: { y: 0.6 } })
      const runner = Runner.create()

      const bodies = ASSETS.map((a) => {
        const common = {
          restitution: a.restitution ?? 0.5,
          friction: a.friction ?? 0.2,
          frictionAir: 0.012,
          density: a.density ?? 0.001,
        }
        if (a.shape === 'circle') {
          return Bodies.circle(a.initX, a.initY, a.radius, common)
        }
        return Bodies.rectangle(a.initX, a.initY, a.w, a.h, common)
      })

      // Paredes gruesas para evitar tunneling (igual que desktop)
      const wallThickness = 200
      const floor = Bodies.rectangle(VW / 2, VH + wallThickness / 2, VW + 200, wallThickness, { isStatic: true })
      const ceiling = Bodies.rectangle(VW / 2, -wallThickness / 2, VW + 200, wallThickness, { isStatic: true })
      const wallL = Bodies.rectangle(-wallThickness / 2, VH / 2, wallThickness, VH * 3, { isStatic: true })
      const wallR = Bodies.rectangle(VW + wallThickness / 2, VH / 2, wallThickness, VH * 3, { isStatic: true })

      Composite.add(engine.world, [...bodies, floor, ceiling, wallL, wallR])

      // Bloquear matter-js de preventDefault en wheel events (afecta scroll
      // desktop). Mismo fix que el desktop.
      const blockMatterWheel = (e: Event) => e.stopImmediatePropagation()
      container.addEventListener('mousewheel', blockMatterWheel, { capture: true })
      container.addEventListener('DOMMouseScroll', blockMatterWheel, { capture: true })
      container.addEventListener('wheel', blockMatterWheel, { capture: true })

      const mouse = Mouse.create(container)

      // CRÍTICO para mobile: matter-js attachea touchstart/touchmove con
      // preventDefault, lo cual bloquea el scroll de la página cuando el
      // dedo está sobre el playground.
      // Solución: re-attach los mismos listeners de matter-js pero con
      // { passive: true }. Matter-js sigue funcionando (drag de pills,
      // tracking, etc.), pero el browser IGNORA su preventDefault porque
      // el listener es passive. Resultado: scroll funciona Y las pills
      // siguen siendo draggables con touch.
      // mouse.mousedown maneja touchstart, mouse.mousemove maneja touchmove,
      // mouse.mouseup maneja touchend.
      const mAny = mouse as unknown as {
        mousedown: EventListener
        mousemove: EventListener
        mouseup: EventListener
      }
      if (mAny.mousedown && mAny.mousemove && mAny.mouseup) {
        container.removeEventListener('touchstart', mAny.mousedown)
        container.removeEventListener('touchmove', mAny.mousemove)
        container.removeEventListener('touchend', mAny.mouseup)
        container.addEventListener('touchstart', mAny.mousedown, { passive: true })
        container.addEventListener('touchmove', mAny.mousemove, { passive: true })
        container.addEventListener('touchend', mAny.mouseup, { passive: true })
      }
      const updateScale = () => {
        const w = container.offsetWidth || VW
        const h = container.offsetHeight || (w * VH / VW)
        Mouse.setScale(mouse, { x: VW / w, y: VH / h })
      }
      updateScale()

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      })
      Composite.add(engine.world, mc)

      const ro = new ResizeObserver(updateScale)
      ro.observe(container)

      Events.on(mc, 'startdrag', () => { container.style.cursor = 'grabbing' })
      Events.on(mc, 'enddrag', () => { container.style.cursor = '' })

      // Demoramos el inicio de la simulación física para que las pills NO
      // empiecen a caer invisibles antes de aparecer. Sincroniza con el
      // fade in del playground (animation delay 1200ms en globals.css —
      // mobile da más tiempo al wordmark dividido en 2 líneas).
      const runnerTimeout = window.setTimeout(() => {
        if (cancelled) return
        Runner.run(runner, engine)
      }, 1200)

      let raf: number
      function loop() {
        bodies.forEach((body, i) => {
          const ref = groupRefs.current[i]
          if (!ref) return
          const { x, y } = body.position
          const a = (body.angle * 180) / Math.PI
          ref.setAttribute('transform', `translate(${x} ${y}) rotate(${a})`)
        })
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)

      cleanup = () => {
        clearTimeout(runnerTimeout)
        cancelAnimationFrame(raf)
        ro.disconnect()
        container.removeEventListener('mousewheel', blockMatterWheel, { capture: true })
        container.removeEventListener('DOMMouseScroll', blockMatterWheel, { capture: true })
        container.removeEventListener('wheel', blockMatterWheel, { capture: true })
        if (mAny.mousedown && mAny.mousemove && mAny.mouseup) {
          container.removeEventListener('touchstart', mAny.mousedown)
          container.removeEventListener('touchmove', mAny.mousemove)
          container.removeEventListener('touchend', mAny.mouseup)
        }
        Runner.stop(runner)
        Composite.clear(engine.world, false)
        Engine.clear(engine)
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="hero-physics-mobile"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${VW} / ${VH}`,
        touchAction: 'pan-y',
        userSelect: 'none',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        height="100%"
        fill="none"
        style={{ display: 'block', overflow: 'hidden' }}
      >
        {ASSETS.map((a, i) => (
          <g
            key={a.id}
            ref={(el) => { groupRefs.current[i] = el }}
            transform={`translate(${a.initX} ${a.initY})`}
            style={{ cursor: 'grab' }}
          >
            <rect x={-a.w / 2} y={-a.h / 2} width={a.w} height={a.h} fill="transparent" />
            <image
              href={a.href}
              x={-a.w / 2}
              y={-a.h / 2}
              width={a.w}
              height={a.h}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
