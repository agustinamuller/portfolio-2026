import { CSSProperties } from 'react'

interface LetterDef {
  src: string
  /** Posición X dentro del viewBox del wordmark master (1232 unidades). */
  x: number
  /** Posición Y dentro del viewBox del wordmark master (169 unidades). */
  y: number
  /** Ancho del SVG individual (unidades del viewBox del wordmark). */
  w: number
  /** Alto del SVG individual (unidades del viewBox del wordmark). */
  h: number
}

/**
 * Cada letra del wordmark "agustina müller" con su posición y dimensiones
 * EXACTAS dentro del viewBox 1232×169 del Figma. Las X las extraje del
 * SVG completo (puntos M iniciales de cada subpath). Las Y se calculan
 * para alinear cada letra por su baseline (bottom del viewBox).
 *
 * Master viewBox: 1232 × 169 (ratio ~7.29:1)
 */
const MASTER_W = 1232
const MASTER_H = 169

// Posiciones Y calculadas a partir de las coordenadas exactas del SVG
// master (1232×169) vs los SVG individuales. Cada letra se coloca en
// la posición exacta donde la diseñó en el Figma.
//   y_top_en_master = primer_M_del_master - primer_M_del_svg_individual
const LETTERS: LetterDef[] = [
  { src: 'a-1.svg', x: 4.55, y: 37.47, w: 93.34, h: 101.17 },
  { src: 'g.svg', x: 96.07, y: 37.48, w: 92.2, h: 131.53 },
  { src: 'u.svg', x: 202.61, y: 40.10, w: 84.42, h: 98.36 },
  { src: 's.svg', x: 296.14, y: 37.47, w: 85.18, h: 101.17 },
  { src: 't.svg', x: 382.57, y: 9.93, w: 52.36, h: 127.22 },
  { src: 'i.svg', x: 445.61, y: 3.18, w: 22.57, h: 132.65 },
  { src: 'n.svg', x: 483.31, y: 37.47, w: 84.42, h: 98.36 },
  { src: 'a-2.svg', x: 576.65, y: 37.47, w: 93.34, h: 101.17 },
  { src: 'm.svg', x: 705.67, y: 17.33, w: 189.45, h: 121.7 },
  { src: 'u-2.svg', x: 907.96, y: 0, w: 84.42, h: 138.46 },
  { src: 'l-1.svg', x: 1007.94, y: 1.87, w: 20.1, h: 133.96 },
  { src: 'l-2.svg', x: 1042.49, y: 1.87, w: 20.11, h: 133.96 },
  { src: 'e.svg', x: 1073.03, y: 37.47, w: 94.29, h: 101.17 },
  { src: 'r.svg', x: 1177.18, y: 37.85, w: 54.82, h: 97.99 },
]

interface Props {
  className?: string
  style?: CSSProperties
}

/**
 * Wordmark "agustina müller" — cada letra renderizada como SVG
 * individual, posicionada absolutamente según las coordenadas del
 * SVG master (1232×169 del Figma). Las letras caen una por una
 * desde arriba con stagger, manteniendo la disposición tipográfica
 * exacta del Figma.
 */
export function HeroWordmarkLetters({ className, style }: Props) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${MASTER_W} / ${MASTER_H}`,
        ...style,
      }}
      aria-label="agustina müller"
    >
      {LETTERS.map((letter, i) => (
        <img
          key={`${letter.src}-${i}`}
          src={`/assets/hero-wordmark/${letter.src}`}
          alt=""
          draggable={false}
          className="hero-letter"
          style={{
            position: 'absolute',
            left: `${(letter.x / MASTER_W) * 100}%`,
            top: `${(letter.y / MASTER_H) * 100}%`,
            width: `${(letter.w / MASTER_W) * 100}%`,
            height: `${(letter.h / MASTER_H) * 100}%`,
            // Stagger: cada letra arranca 60ms después de la anterior.
            animationDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  )
}
