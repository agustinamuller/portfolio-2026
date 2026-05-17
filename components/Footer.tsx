'use client'

import { useState } from 'react'

const EMAIL = 'magustinamuller@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/magustinamuller/'

/**
 * Footer del Home — "Let's talk!" con email copy-to-clipboard
 * y badge de LinkedIn que lleva al perfil.
 */
export function Footer() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback para navegadores sin clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = EMAIL
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      } catch {
        /* noop */
      }
      document.body.removeChild(textarea)
    }
  }

  return (
    <footer
      id="contact"
      className="footer-section"
      style={{
        padding: '96px 16px 56px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        alignItems: 'center',
        background: 'var(--bg-1)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Título "Let's talk!" — HeadlineL/Medium (desktop), reduce a
          XL/Medium en mobile via CSS. */}
      <h2
        className="footer-title"
        style={{
          fontFamily: '"Neue Montreal", var(--font-sans)',
          fontWeight: 500,
          fontSize: 64,
          lineHeight: '72px',
          letterSpacing: '-2px',
          color: 'var(--fg-1)',
          margin: 0,
        }}
      >
        Let&rsquo;s talk!
      </h2>

      {/* Email + botón de copiar al clipboard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <button
          type="button"
          onClick={copyEmail}
          aria-label={copied ? 'Email copiado al portapapeles' : 'Copiar email al portapapeles'}
          className="footer-email-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--fg-1)',
            fontFamily: '"Neue Montreal", var(--font-sans)',
            fontWeight: 500,
            fontSize: 20,
            lineHeight: '32px',
            transition: 'opacity 200ms var(--ease)',
          }}
        >
          <span>{EMAIL}</span>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              color: copied ? 'var(--color-accent)' : 'var(--fg-3)',
              transition: 'color 200ms var(--ease)',
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </span>
        </button>

        {/* Feedback "Copied!" — slot reservado para no afectar layout */}
        <span
          aria-live="polite"
          style={{
            fontFamily: '"Neue Montreal", var(--font-sans)',
            fontSize: 13,
            color: 'var(--color-accent)',
            opacity: copied ? 1 : 0,
            transition: 'opacity 220ms var(--ease)',
            height: 16,
            lineHeight: '16px',
          }}
        >
          {copied ? 'Copied to clipboard' : ' '}
        </span>

        {/* Badge de LinkedIn — link al perfil */}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver perfil de LinkedIn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--color-accent)',
            color: '#fafafa',
            textDecoration: 'none',
            transition: 'transform 220ms var(--ease), box-shadow 220ms var(--ease)',
          }}
          className="footer-linkedin"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
          </svg>
        </a>
      </div>

      {/* Copyright */}
      <div
        className="footer-copyright"
        style={{
          marginTop: 24,
          fontFamily: '"Neue Montreal", var(--font-sans)',
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '20px',
          color: 'var(--fg-3)',
        }}
      >
        Agustina Müller © {new Date().getFullYear()}
      </div>

      {/* Responsive mobile — Figma 434:1476.
          - Padding: 64px arriba / 16px laterales / 48px abajo
          - Título "Let's talk!": 40/48 (vs 64/72 desktop)
          - Email button: 16/24
          - Gap reducido entre elementos */}
      <style>{`
        @media (max-width: 600px) {
          .footer-section {
            padding: 64px 16px 48px !important;
            gap: 24px !important;
          }
          .footer-title {
            font-size: 40px !important;
            line-height: 48px !important;
            letter-spacing: -1px !important;
          }
          .footer-email-btn {
            font-size: 16px !important;
            line-height: 24px !important;
          }
          .footer-copyright {
            margin-top: 16px !important;
          }
        }
      `}</style>
    </footer>
  )
}

/** Ícono "copiar" — dos cuadros superpuestos (estilo iOS / Tailwind). */
function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

/** Ícono "check" — confirmación visual de copiado. */
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
