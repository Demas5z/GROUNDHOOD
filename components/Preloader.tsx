'use client'

import { useEffect, useRef, useState } from 'react'
import BrandLogo from './BrandLogo'

// Premium fashion e-commerce preloader (GOAT-inspired): a brief dark screen with the
// GROUNDHOOD logo fading in and a subtle loading bar, then a smooth fade-out.
//
// Mounted once in the root layout, so it shows only on the initial load / hard refresh —
// client-side navigations don't remount it. It hides as soon as the page finishes loading
// (min ~1s so it never flickers, hard-capped so it never overstays), keeping perf first.

export default function Preloader() {
  const [fadeOut, setFadeOut] = useState(false)
  const [removed, setRemoved] = useState(false)
  const startedHide = useRef(false)

  useEffect(() => {
    // Re-arm on (Strict Mode) remount after cleanup.
    startedHide.current = false

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const MIN_VISIBLE = reduce ? 200 : 1000 // never flash; let the fade-in read
    const MAX_VISIBLE = 2400 // hard cap — never block the experience
    const FADE_MS = reduce ? 100 : 600
    const start = performance.now()

    let fadeTimer: ReturnType<typeof setTimeout>
    let removeTimer: ReturnType<typeof setTimeout>

    const hide = () => {
      if (startedHide.current) return
      startedHide.current = true
      const wait = Math.max(0, MIN_VISIBLE - (performance.now() - start))
      fadeTimer = setTimeout(() => {
        setFadeOut(true)
        removeTimer = setTimeout(() => setRemoved(true), FADE_MS)
      }, wait)
    }

    if (document.readyState === 'complete') {
      hide()
    } else {
      window.addEventListener('load', hide, { once: true })
    }
    const cap = setTimeout(hide, MAX_VISIBLE)

    return () => {
      window.removeEventListener('load', hide)
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
      clearTimeout(cap)
    }
  }, [])

  // Lock scroll while the overlay is on screen.
  useEffect(() => {
    if (removed) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [removed])

  if (removed) return null

  return (
    <div aria-hidden="true" className={`preloader${fadeOut ? ' preloader--hide' : ''}`}>
      <div className="preloader__inner">
        <BrandLogo priority height="clamp(20px, 6vw, 30px)" className="preloader__logo" />
        <span className="preloader__bar" />
      </div>

      <style>{`
        .preloader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          opacity: 1;
          transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .preloader--hide {
          opacity: 0;
          pointer-events: none;
        }
        .preloader__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }
        .preloader__logo {
          animation: preloaderLogoIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .preloader__bar {
          position: relative;
          width: 120px;
          height: 1px;
          background: rgba(212, 210, 203, 0.15);
          overflow: hidden;
        }
        .preloader__bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #d4d2cb;
          transform: translateX(-100%);
          animation: preloaderBar 1.3s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        @keyframes preloaderLogoIn {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes preloaderBar {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .preloader { transition-duration: 100ms; }
          .preloader__logo { animation: none; }
          .preloader__bar::after { animation: none; transform: translateX(0); opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
