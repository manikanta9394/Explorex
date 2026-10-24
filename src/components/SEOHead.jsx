import { useEffect } from 'react'

export default function SEOHead({
  title = 'Explorex | Curated Travel & Cultural Guide for India',
  description = 'Discover 170+ verified heritage monuments, cultural stays, and authentic food across all 36 States and Union Territories of India with multimodal navigation.',
  image = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/800px-Charminar_Hyderabad_1.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
}) {
  useEffect(() => {
    // 1. Title
    const formattedTitle = title.includes('Explorex') ? title : `${title} | Explorex India`
    document.title = formattedTitle

    // Helper to update or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Standard description
    setMetaTag('name', 'description', description)

    // Open Graph
    setMetaTag('property', 'og:title', formattedTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:image', image)
    setMetaTag('property', 'og:url', url)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:site_name', 'Explorex')

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', formattedTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', image)
  }, [title, description, image, url])

  return null
}
