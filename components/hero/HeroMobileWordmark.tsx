import { CSSProperties } from 'react'

/**
 * Wordmark "agustina müller" para mobile — versión en 2 líneas.
 *
 * Layout:
 *   ┌─────────────────────┐
 *   │   a g u s t i n a   │  ← line 1 (full width del viewport)
 *   │      m ü l l e r    │  ← line 2 (centrada, más chica)
 *   └─────────────────────┘
 *
 * Reutiliza los SVGs individuales del wordmark desktop. Cada letra se
 * posiciona absolutamente dentro de su palabra, con las coordenadas
 * relativas (recalculadas desde el master 1232×169 → palabra por palabra).
 *
 * Animaciones:
 * - Cada letra cae individualmente con stagger (clase .hero-letter)
 * - El stagger es continuo: agustina 0-7, müller 8-13 (560ms total)
 * - Wrap exterior puede recibir scroll-out animation (HeroWordmarkScroll)
 */

const MASTER_H = 169

interface LetterDef {
  src: string
  x: number
  y: number
  w: number
  h: number
}

/** Letras de "agustina" — x relativas al inicio de la palabra (max x ≈ 665). */
const LETTERS_AGUSTINA: LetterDef[] = [
  { src: 'a-1.svg', x: 0,      y: 37.47, w: 93.34, h: 101.17 },
  { src: 'g.svg',   x: 91.52,  y: 37.48, w: 92.20, h: 131.53 },
  { src: 'u.svg',   x: 198.06, y: 40.10, w: 84.42, h: 98.36 },
  { src: 's.svg',   x: 291.59, y: 37.47, w: 85.18, h: 101.17 },
  { src: 't.svg',   x: 378.02, y: 9.93,  w: 52.36, h: 127.22 },
  { src: 'i.svg',   x: 441.06, y: 3.18,  w: 22.57, h: 132.65 },
  { src: 'n.svg',   x: 478.76, y: 37.47, w: 84.42, h: 98.36 },
  { src: 'a-2.svg', x: 572.10, y: 37.47, w: 93.34, h: 101.17 },
]
const WIDTH_AGUSTINA = 665.44

/** Letras de "müller" — x relativas al inicio de la palabra (max x ≈ 526). */
const LETTERS_MULLER: LetterDef[] = [
  { src: 'm.svg',   x: 0,      y: 17.33, w: 189.45, h: 121.70 },
  { src: 'u-2.svg', x: 202.29, y: 0,     w: 84.42,  h: 138.46 },
  { src: 'l-1.svg', x: 302.27, y: 1.87,  w: 20.10,  h: 133.96 },
  { src: 'l-2.svg', x: 336.82, y: 1.87,  w: 20.11,  h: 133.96 },
  { src: 'e.svg',   x: 367.36, y: 37.47, w: 94.29,  h: 101.17 },
  { src: 'r.svg',   x: 471.51, y: 37.85, w: 54.82,  h: 97.99 },
]
const WIDTH_MULLER = 526.33

interface Props {
  className?: string
  style?: CSSProperties
}

/**
 * Componente helper — una palabra con sus letras posicionadas absolutamente.
 */
function WordmarkWord({
  letters,
  masterWidth,
  staggerOffset = 0,
  style,
}: {
  letters: LetterDef[]
  masterWidth: number
  staggerOffset?: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: `${masterWidth} / ${MASTER_H}`,
        ...style,
      }}
    >
      {letters.map((letter, i) => (
        <img
          key={`${letter.src}-${i}`}
          src={`/assets/hero-wordmark/${letter.src}`}
          alt=""
          draggable={false}
          className="hero-letter"
          style={{
            position: 'absolute',
            left: `${(letter.x / masterWidth) * 100}%`,
            top: `${(letter.y / MASTER_H) * 100}%`,
            width: `${(letter.w / masterWidth) * 100}%`,
            height: `${(letter.h / MASTER_H) * 100}%`,
            // Stagger continuo a través de las 2 palabras
            animationDelay: `${(i + staggerOffset) * 60}ms`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Wordmark mobile completo — 2 palabras stack verticales.
 *
 * Los anchos relativos garantizan que ambas palabras tengan la MISMA
 * altura visual (los caracteres se ven del mismo tamaño):
 *   - "agustina" → width 100% del contenedor
 *   - "müller"   → width 79.1% (= 526.33/665.44 → mismo factor de escala)
 */
export function HeroMobileWordmark({ className, style }: Props) {
  return (
    <div
      className={className}
      aria-label="agustina müller"
      style={{
        width: '100%',
        // Sin padding interno — el padding lateral viene del wrapper
        // `.hero-wordmark-mobile-wrap` en page.tsx (responsive: 16 mobile,
        // 24 tablet/desktop). Evita doble padding.
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        // pointerEvents: none → los <img> grandes del wordmark NO capturan
        // los touch gestures del browser. Sin esto, mobile no podía
        // scrollear cuando el dedo estaba sobre las letras (los browsers
        // tratan a los <img> como elementos arrastrables por default).
        pointerEvents: 'none',
        ...style,
      }}
    >
      {/* "agustina" — ocupa todo el ancho disponible */}
      <WordmarkWord
        letters={LETTERS_AGUSTINA}
        masterWidth={WIDTH_AGUSTINA}
        staggerOffset={0}
        style={{ width: '100%' }}
      />

      {/* "müller" — centrada, ancho proporcional para mantener mismo tamaño
          de letra. 79.1% = 526.33 / 665.44. */}
      <WordmarkWord
        letters={LETTERS_MULLER}
        masterWidth={WIDTH_MULLER}
        staggerOffset={LETTERS_AGUSTINA.length}
        style={{ width: `${(WIDTH_MULLER / WIDTH_AGUSTINA) * 100}%` }}
      />
    </div>
  )
}
