import { useState } from 'react'
import { getFallbackImage } from '../utils/fallbackImages'

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
  const [hasError, setHasError] = useState(false)

  const effectiveSrc = hasError || !src || typeof src !== 'string' || !src.trim() ? defaultFallback : src

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => setHasError(true)}
      {...props}
    />
  )
}
