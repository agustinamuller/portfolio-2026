'use client'

import { useState, ButtonHTMLAttributes } from 'react'
import { ArrowDiag } from './icons/ArrowDiag'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', style: propStyle, children, ...rest }: Props) {
  const [hovered, setHovered] = useState(false)

  const fs = size === 'lg' ? 20 : 16
  const lh = size === 'lg' ? '32px' : '28px'
  const pad = size === 'lg' ? '8px 16px' : '6px 14px'

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: pad,
    borderRadius: 100,
    fontFamily: '"Neue Montreal", var(--font-sans)',
    fontWeight: 500,
    fontSize: fs,
    lineHeight: lh,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 220ms cubic-bezier(0.2,0.8,0.2,1)',
    whiteSpace: 'nowrap',
  }

  let variantStyle: React.CSSProperties = {}
  let arrowColor = '#fafafa'

  if (variant === 'primary') {
    variantStyle = hovered
      ? { background: 'transparent', borderColor: 'var(--fg-1)', color: 'var(--fg-1)' }
      : { background: 'var(--color-accent)', color: '#fafafa', borderColor: 'var(--color-accent)' }
    arrowColor = hovered ? '#131316' : '#fafafa'
  } else if (variant === 'ghost') {
    // Ghost: sin background, color controlado por className/CSS externo
    // para soportar hover y active states declarativos.
    variantStyle = { background: 'transparent', padding: '4px 10px' }
  } else if (variant === 'outline') {
    variantStyle = { background: 'transparent', borderColor: 'var(--fg-1)', color: 'var(--fg-1)' }
    arrowColor = '#131316'
  }

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variantStyle, ...propStyle }}
      {...rest}
    >
      {children}
      {variant !== 'ghost' && <ArrowDiag size={size === 'lg' ? 20 : 16} color={arrowColor} />}
    </button>
  )
}
