import { useEffect } from 'react'

export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    // If user prefers reduced motion, reveal everything immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const allElements = document.querySelectorAll(
        '.reveal-fade-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom, .scroll-reveal'
      )
      allElements.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target) // Played once per element, no loops!
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    const targets = document.querySelectorAll(
      '.reveal-fade-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom, .scroll-reveal'
    )
    targets.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useScrollReveal
