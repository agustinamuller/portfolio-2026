'use client'

import { useEffect, useRef } from 'react'

// Playground dimensions (SVG coordinate space).
// VH 280 — playground con buena presencia. El wordmark baja proporcionalmente
// porque ocupa más espacio antes, manteniendo las letras igual de pegadas
// al piso del playground (el margin-top negativo del wordmark es en vw).
const VW = 1280
const VH = 280

// Cada asset describe su archivo SVG, dimensiones intrínsecas,
// posición inicial dentro del viewBox y la forma del cuerpo físico.
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

const ASSETS: AssetSpec[] = [
  {
    id: 'pill-product',
    href: '/assets/hero/hero-pill-product.svg',
    w: 240, h: 120,
    initX: 300, initY: 80,
    shape: 'rect',
    restitution: 0.45, friction: 0.25, density: 0.002,
  },
  {
    id: 'pill-design-systems',
    href: '/assets/hero/hero-pill-design-systems.svg',
    w: 222, h: 115,
    initX: 980, initY: 90,
    shape: 'rect',
    restitution: 0.45, friction: 0.25, density: 0.002,
  },
  {
    id: 'pill-ux-ui',
    href: '/assets/hero/hero-pill-ux-ui.svg',
    w: 210, h: 66,
    initX: 640, initY: 60,
    shape: 'rect',
    restitution: 0.4, friction: 0.3, density: 0.002,
  },
  {
    id: 'asterisk',
    href: '/assets/hero/hero-asterisk.svg',
    w: 55, h: 56,
    initX: 470, initY: 110,
    shape: 'circle',
    radius: 28,
    restitution: 0.6, friction: 0.2, density: 0.001,
  },
  {
    id: 'circle-arrow',
    href: '/assets/hero/hero-circle-arrow.svg',
    w: 70, h: 70,
    initX: 820, initY: 50,
    shape: 'circle',
    radius: 35,
    restitution: 0.65, friction: 0.2, density: 0.001,
  },
]

export function HeroPhysicsOverlay() {
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

      // Gravedad natural — los assets caen suavemente y se asientan
      // sobre el piso del playground.
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

      // Static bounds — paredes GRUESAS (200px en lugar de 60) para prevenir
      // tunneling: cuando un asset choca con velocidad alta, puede atravesar
      // una pared delgada por un solo time-step de la simulación. Paredes
      // gruesas garantizan que el cuerpo NO pueda salirse del viewBox visible.
      const wallThickness = 200
      const floor = Bodies.rectangle(
        VW / 2,
        VH + wallThickness / 2,
        VW + 200,
        wallThickness,
        { isStatic: true }
      )
      const ceiling = Bodies.rectangle(
        VW / 2,
        -wallThickness / 2,
        VW + 200,
        wallThickness,
        { isStatic: true }
      )
      const wallL = Bodies.rectangle(
        -wallThickness / 2,
        VH / 2,
        wallThickness,
        VH * 3,
        { isStatic: true }
      )
      const wallR = Bodies.rectangle(
        VW + wallThickness / 2,
        VH / 2,
        wallThickness,
        VH * 3,
        { isStatic: true }
      )

      Composite.add(engine.world, [...bodies, floor, ceiling, wallL, wallR])

      // CRÍTICO — desbloquear scroll sobre el playground:
      // matter-js Mouse._init() registra internamente listeners de
      // 'mousewheel' y 'DOMMouseScroll' que llaman event.preventDefault(),
      // lo cual BLOQUEA el scroll de la página cuando el mouse está sobre
      // el playground (en Chrome, 'mousewheel' es legacy pero todavía se
      // dispara y su preventDefault sí cancela el scroll).
      //
      // Solución: registramos PRIMERO (antes de Mouse.create) listeners
      // en capture phase que llaman stopImmediatePropagation() — esto
      // termina el dispatch del evento ANTES de que matter-js lo reciba,
      // por lo que su preventDefault() nunca se ejecuta y el browser hace
      // su scroll default normal.
      const blockMatterWheel = (e: Event) => {
        e.stopImmediatePropagation()
      }
      container.addEventListener('mousewheel', blockMatterWheel, { capture: true })
      container.addEventListener('DOMMouseScroll', blockMatterWheel, { capture: true })
      container.addEventListener('wheel', blockMatterWheel, { capture: true })

      // Mouse interaction — escala las coordenadas del DOM a las del viewBox SVG
      const mouse = Mouse.create(container)

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
      // fade in del playground (animation delay 800ms en globals.css).
      // Las pills permanecen en sus posiciones iniciales hasta que arranca
      // el runner, así la animación de caída es visible al usuario.
      const runnerTimeout = window.setTimeout(() => {
        if (cancelled) return
        Runner.run(runner, engine)
      }, 800)

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
      className="hero-physics"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${VW} / ${VH}`,
        // Oculta el cursor del sistema dentro del playground — sólo se ve
        // el cursor decorativo SVG "drag me!".
        cursor: 'none',
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
            {/* Hit area transparente — coincide con el bbox del SVG */}
            <rect
              x={-a.w / 2}
              y={-a.h / 2}
              width={a.w}
              height={a.h}
              fill="transparent"
            />
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

      <style>{`
        /* touch-action: pan-y permite scroll vertical de la página
           incluso cuando el mouse/dedo está sobre el playground.
           pan-y = scroll vertical permitido, otros gestos bloqueados. */
        .hero-physics { touch-action: pan-y; user-select: none; }
        .hero-physics svg g[style*="grab"] { pointer-events: all; cursor: none; }
        @media (max-width: 600px) { .hero-physics { display: none; } }
      `}</style>
    </div>
  )
}
