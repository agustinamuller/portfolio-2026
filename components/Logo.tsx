interface Props {
  size?: number
}

export function Logo({ size = 18 }: Props) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        // Regular (antes 500/medium) — navbar más liviana, menos densa.
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.2,
        color: 'var(--fg-1)',
        letterSpacing: '-0.01em',
      }}
    >
      agustina müller
    </span>
  )
}
