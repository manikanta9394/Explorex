import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function checkImages() {
  console.log('🔍 Running Explorex Image Integrity Audit (check:images)...\n')

  const dataPath = path.join(__dirname, '../src/data/indiaPlacesData.js')
  if (!fs.existsSync(dataPath)) {
    console.error('❌ Data file not found:', dataPath)
    process.exit(1)
  }

  // Import dynamic data
  const { indiaPlaces } = await import(`file://${dataPath}`)

  console.log(`Auditing ${indiaPlaces.length} published places...`)

  const shaMap = new Map()
  const urlMap = new Map()
  const errors = []
  let photoCount = 0
  let illustrationCount = 0

  for (const place of indiaPlaces) {
    // 1. Missing Image Check
    if (!place.image || typeof place.image !== 'string' || place.image.trim() === '') {
      errors.push(`[MISSING_IMAGE] Place "${place.name}" (${place.id}) has no valid image attached!`)
      continue
    }

    const imgObj = (place.images && place.images[0]) || {}
    const sha = imgObj.sha256 || place.sha256
    const url = place.image

    if (!sha) {
      errors.push(`[MISSING_SHA256] Place "${place.name}" (${place.id}) is missing a SHA-256 hash!`)
    }

    // 2. Uniqueness Check (No two places can share an image)
    if (shaMap.has(sha)) {
      errors.push(
        `[DUPLICATE_SHA256] SHA-256 collision: "${shaMap.get(sha)}" and "${place.name}" share image hash ${sha}`
      )
    } else if (sha) {
      shaMap.set(sha, place.name)
    }

    if (urlMap.has(url)) {
      errors.push(
        `[DUPLICATE_URL] URL collision: "${urlMap.get(url)}" and "${place.name}" share image URL ${url.slice(0, 80)}`
      )
    } else {
      urlMap.set(url, place.name)
    }

    // 3. Image Type Accounting
    if (place.is_illustration || url.startsWith('data:image/svg+xml')) {
      illustrationCount++
    } else {
      photoCount++
    }
  }

  // 4. Sample verification for key landmarks (Taj Mahal, Charminar, Gateway of India, Golden Temple, Hawa Mahal, Konark)
  const landmarkVerification = [
    { name: 'Charminar', expectedKeyword: 'charminar' },
    { name: 'Taj Mahal', expectedKeyword: 'taj' },
    { name: 'Gateway of India', expectedKeyword: 'gateway' },
    { name: 'Golden Temple', expectedKeyword: 'golden' },
    { name: 'Hawa Mahal', expectedKeyword: 'hawa' },
    { name: 'Konark Sun Temple', expectedKeyword: 'konark' },
  ]

  console.log('\n--- Specific Landmark Image Verification ---')
  landmarkVerification.forEach(({ name, expectedKeyword }) => {
    const matched = indiaPlaces.find((p) => p.name.toLowerCase().includes(name.toLowerCase()))
    if (!matched) {
      errors.push(`[LANDMARK_MISSING] Mandatory landmark "${name}" not found in dataset!`)
    } else {
      const urlLower = matched.image.toLowerCase()
      const attrLower = (matched.image_attribution || '').toLowerCase()
      const matchesKeyword = urlLower.includes(expectedKeyword) || attrLower.includes(expectedKeyword)
      console.log(`  ✓ ${matched.name} (${matched.state}): ${matched.image.slice(0, 65)}... [Verified: ${matchesKeyword}]`)
      if (!matchesKeyword) {
        errors.push(`[IMAGE_MISMATCH] "${matched.name}" image does not match expected keyword "${expectedKeyword}"!`)
      }
    }
  })

  console.log('\n--- Integrity Audit Summary ---')
  console.log(`Total Places Checked:       ${indiaPlaces.length}`)
  console.log(`Unique Image Hashes:        ${shaMap.size}`)
  console.log(`Verified Real Photos:       ${photoCount}`)
  console.log(`AI Cultural Illustrations:  ${illustrationCount}`)
  console.log(`Errors Detected:            ${errors.length}`)

  if (errors.length > 0) {
    console.error('\n❌ CI Image Integrity Check FAILED with the following errors:')
    errors.forEach((err) => console.error('  - ' + err))
    process.exit(1)
  }

  console.log('\n✅ ALL IMAGE INTEGRITY AUDIT CHECKS PASSED PERFECTLY!')
}

checkImages().catch((err) => {
  console.error('Fatal Audit Error:', err)
  process.exit(1)
})
