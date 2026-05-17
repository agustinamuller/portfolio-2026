'use client'

import { useEffect, useState } from 'react'

/**
 * Floating button "scroll to top" — aparece en el bottom-right después de
 * que el usuario scrolleó ~80% del viewport hacia abajo. Smooth scroll al
 * top de la página. Mismo lenguaje visual que el back button (circle
 * outline 48×48) pero con una flecha hacia arriba propia (no es el back
 * rotado, eso confunde la semántica back vs scroll-to-top).
 *
 * Visibilidad: solo cuando hace falta — no aparece al inicio porque
 * sería redundante con el back button del header. La aparición tiene
 * fade + slide-up suave.
 *
 * Accesibilidad:
 * - aria-label descriptivo
 * - Hover/focus → color-accent
 * - `prefers-reduced-motion: reduce` → sin smooth scroll, sin slide-up
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Threshold: 80% del viewport. Pensado para que el botón aparezca
      // cuando el usuario ya está "metido" en el contenido, no apenas
      // hace un pequeño scroll.
      const threshold = window.innerHeight * 0.8
      setVisible(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      className="scroll-to-top-btn"
      data-visible={visible}
    >
      {/* Circle outline + ícono custom de scroll-to-up del asset original.
          Inlineamos el SVG (en lugar de usar <img src>) para que el fill
          herede currentColor y cambie al accent en hover, igual que el
          back button. El asset original tenía fill="#121212" hardcoded.
          El path está en coords 24×24 — lo centramos dentro del 48×48 con
          translate(12, 12). */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="currentColor" />
        <g transform="translate(12 12)">
          <path
            d="M1.60692 13.0758C1.58646 13.0554 1.43001 12.4312 1.25938 11.6889C1.08876 10.9464 0.975225 10.3309 1.00691 10.321C1.0387 10.3112 1.55401 10.2344 2.15212 10.1504C3.35318 9.98162 4.75552 9.57305 5.63255 9.13648C8.36586 7.77569 10.1757 5.33417 10.6461 2.37294L10.7659 1.61887L13.1809 1.61887L13.2955 2.30233C14.0468 6.78009 17.3948 9.69937 22.4052 10.2455C22.7324 10.2811 23 10.3237 23 10.3401C23 10.4912 22.3969 12.9935 22.3492 13.0408C22.3146 13.075 22.0079 13.0496 21.6677 12.9841C17.9004 12.26 14.8349 10.1868 13.5532 7.49627L13.2457 6.85089L13.2457 22.3811L10.7232 22.3811L10.7232 6.8606L10.3103 7.67538C9.23946 9.78912 7.13881 11.4626 4.3192 12.4481C3.51592 12.7289 1.68458 13.1527 1.60692 13.0758Z"
            fill="currentColor"
          />
        </g>
      </svg>

      <style>{`
        .scroll-to-top-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 48px;
          height: 48px;
          padding: 0;
          background: var(--bg-1);
          color: var(--fg-1);
          border: none;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 40;
          /* Estado inicial: invisible y desplazado un poco abajo. Aparece
             con un slide-up + fade cuando data-visible="true". */
          opacity: 0;
          pointer-events: none;
          transform: translateY(8px);
          transition:
            opacity 280ms var(--ease),
            transform 280ms var(--ease),
            color 200ms var(--ease);
          /* Soft shadow para que se separe del contenido detrás cuando
             pasa por encima de imágenes/videos. */
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .scroll-to-top-btn[data-visible="true"] {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .scroll-to-top-btn:hover,
        .scroll-to-top-btn:focus-visible {
          color: var(--color-accent);
        }

        .scroll-to-top-btn:focus-visible {
          outline: 2px solid var(--color-accent);
          outline-offset: 4px;
        }

        /* Mobile: margen más chico para no quedar tan al borde. */
        @media (max-width: 600px) {
          .scroll-to-top-btn {
            bottom: 24px;
            right: 24px;
          }
        }

        /* Reduced motion: animación mínima, sin slide. */
        @media (prefers-reduced-motion: reduce) {
          .scroll-to-top-btn {
            transition: opacity 120ms linear, color 120ms linear;
            transform: none;
          }
          .scroll-to-top-btn[data-visible="true"] {
            transform: none;
          }
        }
      `}</style>
    </button>
  )
}
