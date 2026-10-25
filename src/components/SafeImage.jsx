import { useState } from 'react'
import { getFallbackImage } from '../utils/fallbackImages'
import { resolveImageSrc } from '../utils/imageUtils'

export default function SafeImage({
  src,
  category,
  type,
  fallbackSrc: customFallback,
  alt = 'Place photo',
  className = '',
  style = {},
  ...props
}) {
  const defaultFallback = customFallback || getFallbackImage(category, type)
  const [failedSrc, setFailedSrc] = useState(null)

  const resolved = resolveImageSrc(src)
  const isFailed = !resolved || failedSrc === resolved
  const effectiveSrc = isFailed ? defaultFallback : resolved

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (resolved) {
          setFailedSrc(resolved)
        }
      }}
      {...props}
    />
  )
}
