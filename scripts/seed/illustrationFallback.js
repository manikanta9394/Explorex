import crypto from 'crypto'

/**
 * Generates an SVG vector illustration fallback tailored to the place's
 * name, city, state, category, and visual features.
 */
export function generateIllustrationFallback(place) {
  const { name, city, state, category, visual_features } = place
  const prompt = `minimal flat illustration of ${name}, ${city}, ${state}, ${visual_features || category}, no text, no people`

  // Palette selection based on category
  let bgGradient = ['#1A3427', '#2A4F3E']
  let accentColor = '#C9A227'
  let accentSecondary = '#E6C65C'
  let motifColor = 'rgba(255, 255, 255, 0.12)'

  const catLower = (category || '').toLowerCase()
  if (catLower.includes('spiritual') || catLower.includes('temple')) {
    bgGradient = ['#2D1810', '#4A2818']
    accentColor = '#F59E0B'
    accentSecondary = '#FDE68A'
    motifColor = 'rgba(245, 158, 11, 0.15)'
  } else if (catLower.includes('waterfall') || catLower.includes('nature') || catLower.includes('hill')) {
    bgGradient = ['#0F291E', '#164E37']
    accentColor = '#10B981'
    accentSecondary = '#6EE7B7'
    motifColor = 'rgba(16, 185, 129, 0.15)'
  } else if (catLower.includes('coastal') || catLower.includes('beach') || catLower.includes('lake') || catLower.includes('lagoon')) {
    bgGradient = ['#0C2B3E', '#154B6E']
    accentColor = '#38BDF8'
    accentSecondary = '#BAE6FD'
    motifColor = 'rgba(56, 189, 248, 0.15)'
  } else if (catLower.includes('wildlife') || catLower.includes('desert')) {
    bgGradient = ['#2E1E0F', '#4D3319']
    accentColor = '#F97316'
    accentSecondary = '#FED7AA'
    motifColor = 'rgba(249, 115, 22, 0.15)'
  }

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" data-place-id="${place.id}">
  <title>${name}, ${city}, ${state}</title>
  <desc id="explorex-prompt">${prompt}</desc>
  <defs>
    <linearGradient id="bgGrad_${place.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradient[0]}"/>
      <stop offset="100%" stop-color="${bgGradient[1]}"/>
    </linearGradient>
    <linearGradient id="goldGrad_${place.id}" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${accentSecondary}"/>
    </linearGradient>
    <radialGradient id="sunGlow_${place.id}" cx="50%" cy="35%" r="40%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${bgGradient[0]}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Sky & Atmosphere -->
  <rect width="1200" height="800" fill="url(#bgGrad_${place.id})"/>
  <circle cx="600" cy="320" r="280" fill="url(#sunGlow_${place.id})"/>

  <!-- Geometric Mountain / Architectural Backdrop Layers -->
  <path d="M0,800 L0,620 Q300,520 600,560 T1200,600 L1200,800 Z" fill="${motifColor}"/>
  <path d="M0,800 L0,680 Q400,600 800,640 T1200,660 L1200,800 Z" fill="rgba(0,0,0,0.2)"/>

  <!-- Stylized Landmark Silhouettes -->
  <g transform="translate(600, 520)" text-anchor="middle">
    <!-- Center Dome / Spire Motif -->
    <path d="M -90,0 Q -90,-160 0,-210 Q 90,-160 90,0 Z" fill="url(#goldGrad_${place.id})" opacity="0.9"/>
    <!-- Flanking Minarets / Pillars -->
    <rect x="-170" y="-180" width="16" height="180" rx="4" fill="url(#goldGrad_${place.id})" opacity="0.85"/>
    <circle cx="-162" cy="-190" r="14" fill="${accentSecondary}"/>
    <rect x="154" y="-180" width="16" height="180" rx="4" fill="url(#goldGrad_${place.id})" opacity="0.85"/>
    <circle cx="162" cy="-190" r="14" fill="${accentSecondary}"/>
    <!-- Arched Portal -->
    <path d="M -40,0 L -40,-90 Q 0,-130 40,-90 L 40,0 Z" fill="${bgGradient[0]}"/>
  </g>

  <!-- Ground Plane / Water Reflection -->
  <rect y="700" width="1200" height="100" fill="rgba(0,0,0,0.35)"/>
  <line x1="100" y1="720" x2="1100" y2="720" stroke="${accentColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="12,12"/>
  <line x1="250" y1="745" x2="950" y2="745" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="1.5" stroke-dasharray="24,18"/>

  <!-- Landmark Title Label Subtext in SVG -->
  <text x="600" y="755" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="600" fill="${accentSecondary}" opacity="0.4" text-anchor="middle" letter-spacing="2.5">${name.toUpperCase()} · ${city.toUpperCase()}</text>

  <!-- Badge Marker in bottom corner -->
  <rect x="30" y="738" width="160" height="34" rx="17" fill="rgba(0,0,0,0.6)" stroke="${accentColor}" stroke-width="1.2"/>
  <text x="110" y="760" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="700" fill="${accentSecondary}" text-anchor="middle" letter-spacing="1.2">ILLUSTRATION</text>
</svg>`

  const svgBase64 = Buffer.from(svgContent).toString('base64')
  const dataUrl = `data:image/svg+xml;base64,${svgBase64}`
  const sha256 = crypto.createHash('sha256').update(dataUrl).digest('hex')

  return {
    url: dataUrl,
    source: 'ai_generated',
    prompt,
    license: 'Custom Vector Illustration (Creative Commons CC0)',
    attribution: `Explorex AI Cultural Vector Illustration (${name})`,
    width: 1200,
    height: 800,
    sha256,
    is_primary: true,
    is_verified: true,
    is_illustration: true,
  }
}
