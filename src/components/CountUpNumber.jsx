import { useEffect, useRef, useState } from 'react'

export default function CountUpNumber({ target, suffix = '', duration = 1600 }) {
  const [displayValue, setDisplayValue] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return target
    }
    return 0
  })
  const elementRef = useRef(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // If user prefers reduced motion, initial state already set target
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true
            observer.unobserve(entry.target) // Trigger once and unobserve

            const startTime = performance.now()
            const animate = (currentTime) => {
              const elapsed = currentTime - startTime
              const progress = Math.min(elapsed / duration, 1)

              // easeOutExpo curve
              const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
              const currentVal = Math.round(easeProgress * target)

              setDisplayValue(currentVal)

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setDisplayValue(target)
              }
            }

            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [target, duration])

  return (
    <span ref={elementRef} className="stat-number">
      {displayValue}
      {suffix}
    </span>
  )
}
