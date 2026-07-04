/* eslint-disable @next/next/no-img-element */
// Official GROUNDHOOD wordmark (public/PLAIN_LOGOS.png — 283×36, white on transparent).
// Single source of truth for the brand logo so size/quality stay consistent everywhere.

type BrandLogoProps = {
  /** Display height. A number is treated as px; a string (e.g. a clamp()) is used as-is for responsiveness. */
  height?: number | string
  /** Eager-load when the logo is above the fold (navbar, auth, preloader). */
  priority?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function BrandLogo({ height = 24, priority = false, className, style }: BrandLogoProps) {
  const h = typeof height === 'number' ? `${height}px` : height
  return (
    <img
      src="/PLAIN_LOGOS.png"
      alt="GROUNDHOOD"
      width={283}
      height={36}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      // Fixed height + width:auto preserves the intrinsic 283:36 ratio and avoids layout shift.
      style={{ height: h, width: 'auto', display: 'block', ...style }}
    />
  )
}
