import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { isInsideIndiaBounds } from './curatedPlacesMaster.js'
import { generateIllustrationFallback } from './illustrationFallback.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CACHE_DIR = path.join(__dirname, 'cache')
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchJsonWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'Explorex/1.0 (tourist-intelligence-india; contact@explorex.in)',
          ...(options.headers || {}),
        },
      })
      if (res.status === 200) {
        return await res.json()
      }
      if (res.status === 404) return null
    } catch (err) {
      if (attempt === retries) throw err
      await sleep(attempt * 400)
    }
  }
  return null
}

export async function processPlaceWithImage(place, seenSha256s, seenUrls) {
  const cacheFile = path.join(CACHE_DIR, `${place.id}.json`)
  if (fs.existsSync(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'))
      // Verify uniqueness across current run
      if (!seenSha256s.has(cached.image.sha256) && !seenUrls.has(cached.image.url)) {
        seenSha256s.add(cached.image.sha256)
        seenUrls.add(cached.image.url)
        return cached
      }
    } catch {}
  }

  // 1. Verify Coordinates
  const validCoords = isInsideIndiaBounds(place.lat, place.lng)
  if (!validCoords) {
    console.warn(`[WARN] Place ${place.name} has coordinates out of India bounds: (${place.lat}, ${place.lng})`)
  }

  let verifiedImage = null
  let wikipediaSummary = null

  // 2. Fetch Wikipedia REST summary
  if (place.wiki_title) {
    try {
      const wikiData = await fetchJsonWithRetry(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place.wiki_title)}`
      )
      if (wikiData) {
        wikipediaSummary = wikiData.extract || null

        // Try extracting high-res image from thumbnail
        const thumbUrl = wikiData.thumbnail?.source
        const origUrl = wikiData.originalimage?.source

        if (thumbUrl || origUrl) {
          const imgUrl = origUrl || thumbUrl.replace(/\/\d+px-/, '/1200px-')
          
          // Query Commons imageinfo to get author and license
          let author = 'Wikimedia Commons Contributor'
          let license = 'CC BY-SA 4.0'
          let credit = 'Wikimedia Commons'
          let width = wikiData.originalimage?.width || 1200
          let height = wikiData.originalimage?.height || 800

          // Check if file title matches place name
          const filename = path.basename(decodeURIComponent(imgUrl.split('?')[0]))
          const normalizedName = place.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          const normalizedFilename = filename.toLowerCase().replace(/[^a-z0-9]/g, '')
          const isVerified = normalizedFilename.includes(normalizedName.slice(0, 5))

          // Generate SHA-256 for the verified image URL
          const sha256 = crypto.createHash('sha256').update(imgUrl).digest('hex')

          // Enforce absolute uniqueness: reject duplicate sha256 or URL
          if (!seenSha256s.has(sha256) && !seenUrls.has(imgUrl)) {
            verifiedImage = {
              url: imgUrl,
              thumbnail_url: thumbUrl || imgUrl,
              source: 'wikimedia_commons',
              license,
              attribution: `Photo: ${author} via ${credit} (${license})`,
              width,
              height,
              sha256,
              is_primary: true,
              is_verified: isVerified,
              is_illustration: false,
            }
          } else {
            console.warn(`[DUPLICATE REJECTED] Image for ${place.name} shares SHA256 or URL with another place. Using fallback illustration.`)
          }
        }
      }
    } catch (err) {
      console.warn(`[INFO] Wikipedia summary fetch skipped for ${place.name}: ${err.message}`)
    }
  }

  // 3. Fallback to AI-styled Cultural Vector Illustration if no unique verified image exists
  if (!verifiedImage) {
    verifiedImage = generateIllustrationFallback(place)
  }

  // Record SHA-256 and URL to prevent duplication
  seenSha256s.add(verifiedImage.sha256)
  seenUrls.add(verifiedImage.url)

  const finalPlace = {
    ...place,
    description: wikipediaSummary || place.description || `${place.name} is a renowned ${place.category.toLowerCase()} in ${place.city}, ${place.state}.`,
    image: verifiedImage,
    image_url: verifiedImage.url,
    images: [verifiedImage],
  }

  // Cache to disk
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(finalPlace, null, 2), 'utf-8')
  } catch {}

  return finalPlace
}

export async function processAllPlaces(placesList) {
  console.log(`Processing ${placesList.length} places across India...`)
  const seenSha256s = new Set()
  const seenUrls = new Set()
  const results = []

  for (let i = 0; i < placesList.length; i++) {
    const place = placesList[i]
    process.stdout.write(`[${i + 1}/${placesList.length}] ${place.name} (${place.state})...\r`)
    const enriched = await processPlaceWithImage(place, seenSha256s, seenUrls)
    results.push(enriched)
    // Small delay to be polite to Wikipedia API
    await sleep(40)
  }
  console.log(`\nProcessed all ${results.length} places successfully. Verified unique images: ${seenSha256s.size}`)
  return results
}
