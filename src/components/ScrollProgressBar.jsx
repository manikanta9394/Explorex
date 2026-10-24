import { useEffect, useRef } from 'react'

export default function ScrollProgressBar() {
  const barRef = useRef(null)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (barRef.current) {
            const scrollY = window.scrollY || window.pageYOffset
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollY / docHeight) * 100)) : 0
            barRef.current.style.width = `${progress}%`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div ref={barRef} className="scroll-progress-fill" />
    </div>
  )
}
