export function resolveImageSrc(src) {
  if (!src || typeof src !== 'string' || !src.trim()) return ''
  const trimmed = src.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed
  }
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '')
  if (trimmed.startsWith('/')) {
    if (base && trimmed.startsWith(base + '/')) {
      return trimmed
    }
    return `${base}${trimmed}`
  }
  return trimmed
}
