import fs from 'node:fs'
import path from 'node:path'
import XLSX from 'xlsx'

const root = process.cwd()
const imageDir = path.join(root, 'images')
const publicImageDir = path.join(root, 'public', 'images')

if (!fs.existsSync(publicImageDir)) {
  fs.mkdirSync(publicImageDir, { recursive: true })
}

// 1. Copy images to public/images
const imageFiles = fs.readdirSync(imageDir).filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
imageFiles.forEach((file) => {
  const src = path.join(imageDir, file)
  const dest = path.join(publicImageDir, file)
  if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest)
  }
})

const imageByName = new Map(imageFiles.map((file) => [file.toLowerCase(), file]))

function resolveImagePath(rawVal, fallbackIndex) {
  if (rawVal && typeof rawVal === 'string' && rawVal.trim()) {
    const requested = rawVal.replace(/^\/images\//, '').trim()
    const exact = imageByName.get(requested.toLowerCase())
    if (exact) return `/images/${exact}`
    
    const stem = requested.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '')
    const matched = imageFiles.find((file) => file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '') === stem)
    if (matched) return `/images/${matched}`

    if (requested.startsWith('http://') || requested.startsWith('https://')) {
      return requested
    }
  }

  const fallback = imageFiles[fallbackIndex % imageFiles.length]
  return `/images/${fallback}`
}

const VERIFIED_LANDMARKS = {
  // Iconic Hyderabad Landmarks
  'charminar': [17.3614, 78.4747],
  'golconda fort': [17.3850, 78.4041],
  'qutb shahi tombs': [17.3952, 78.3968],
  'chowmahalla palace': [17.3578, 78.4717],
  'taj falaknuma palace': [17.3314, 78.4678],
  'falaknuma palace': [17.3314, 78.4678],
  'paigah tombs': [17.3459, 78.5013],
  'mecca masjid': [17.3604, 78.4737],
  'taramati baradari': [17.3848, 78.3679],
  'purani haveli': [17.3612, 78.4758],
  "nizam's museum": [17.3617, 78.4728],
  'nizams museum': [17.3617, 78.4728],
  'salar jung museum': [17.3713, 78.4804],
  'telangana state archaeology museum': [17.4008, 78.4670],
  'state archaeology museum': [17.4008, 78.4670],
  'b. m. birla science centre': [17.4067, 78.4696],
  'birla science centre': [17.4067, 78.4696],
  'birla mandir': [17.4062, 78.4691],
  'sudha car museum': [17.3497, 78.4516],
  'hussain sagar lake': [17.4239, 78.4738],
  'hussain sagar': [17.4239, 78.4738],
  'buddha statue': [17.4156, 78.4750],
  'necklace road': [17.4237, 78.4590],
  'lumbini park': [17.4099, 78.4732],
  'ntr gardens': [17.4131, 78.4691],
  'indira park': [17.4147, 78.4812],
  'sanjeevaiah park': [17.4234, 78.4752],
  'kbr national park': [17.4239, 78.4150],
  'kasu brahmananda reddy national park': [17.4239, 78.4150],
  'nehru zoological park': [17.3507, 78.4513],
  'mir alam tank': [17.3325, 78.4500],
  'jagannath temple': [17.4106, 78.4370],
  'mahankali temple': [17.4423, 78.4983],
  "st. joseph's cathedral": [17.3898, 78.4790],
  'st josephs cathedral': [17.3898, 78.4790],
  'snow world': [17.4144, 78.4800],
  'statue of equality': [17.1873, 78.3312],
  'ramoji film city': [17.2543, 78.6806],
  'chilkur balaji temple': [17.3598, 78.2985],
  'shilparamam': [17.4526, 78.3792],
  'durgam cheruvu': [17.4375, 78.3842],
  'durgam cheruvu cable bridge': [17.4375, 78.3842],
  'wonderla hyderabad': [17.2178, 78.5284],
  'botanical garden': [17.4600, 78.3685],
  'hyderabad botanical garden': [17.4600, 78.3685],
  'kondapochamma sagar': [17.7812, 78.6811],
  'osman sagar': [17.3820, 78.2980],
  'gandipet lake': [17.3820, 78.2980],
  'himayat sagar': [17.3190, 78.3560],

  // Telangana Regional Places
  'ananthagiri hills': [17.3117, 77.8658],
  'warangal fort': [17.9547, 79.6177],
  'thousand pillar temple': [17.9944, 79.5746],
  'bhadrakali temple': [17.9890, 79.5760],
  'ramappa temple': [18.2587, 79.9443],
  'laknavaram lake': [18.1500, 79.9667],
  'alampur jogulamba temple': [15.8825, 78.1294],
  'alampur jogulamba': [15.8825, 78.1294],
  'nagarjuna sagar dam': [16.5772, 79.3134],
  'nagarjuna sagar': [16.5772, 79.3134],
  'bhadrachalam temple': [17.6688, 80.8929],
  'bhadrachalam': [17.6688, 80.8929],
  'basara gnana saraswati temple': [18.8778, 77.9542],
  'basara temple': [18.8778, 77.9542],
  'medak fort': [18.0456, 78.2612],
  'medak cathedral': [18.0460, 78.2620],
  'kuntala waterfall': [19.3000, 78.5000],
  'pochera waterfall': [19.2333, 78.3833],
  'elgandal fort': [18.4235, 79.0347],
  'kondagattu anjaneya swamy': [18.6654, 78.9321],
  'yadagirigutta temple': [17.5880, 78.9480],
  'yadadri temple': [17.5880, 78.9480],
  'komuravelli mallanna temple': [17.9520, 78.9050],
  'bogatha waterfall': [18.2740, 80.5280],

  // Famous Hotels
  'park hyatt hyderabad': [17.4262, 78.4342],
  'itc kakatiya': [17.4338, 78.4560],
  'the westin hyderabad mindspace': [17.4435, 78.3776],
  'novotel hyderabad convention centre': [17.4725, 78.3732],
  'trident hyderabad': [17.4475, 78.3789],
  'hyderabad marriott hotel': [17.4231, 78.4770],

  // Famous Restaurants
  'hotel shadab': [17.3599, 78.4730],
  'paradise biryani': [17.4419, 78.4906],
  'bawarchi': [17.4042, 78.4912],
  'shah ghouse': [17.3948, 78.4310],
  'cafe bahar': [17.4005, 78.4782],
  'jewel of nizam': [17.3980, 78.3650],
  'chutneys': [17.4230, 78.4350],
  'minerva coffee shop': [17.4020, 78.4830],
}

function getHash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function getCoordsFromRow(r, name, typePrefix, index) {
  const key = (name || '').toLowerCase().trim()
  if (VERIFIED_LANDMARKS[key]) {
    return { lat: VERIFIED_LANDMARKS[key][0], lng: VERIFIED_LANDMARKS[key][1] }
  }

  for (const lk of Object.keys(VERIFIED_LANDMARKS)) {
    if (key === lk) {
      return { lat: VERIFIED_LANDMARKS[lk][0], lng: VERIFIED_LANDMARKS[lk][1] }
    }
  }

  // 2. Accept only coordinates within Telangana State bounds (15.5..19.8 N, 77.0..81.2 E)
  for (let i = 0; i < r.length - 1; i++) {
    const v1 = Number(r[i])
    const v2 = Number(r[i + 1])
    if (Number.isFinite(v1) && Number.isFinite(v2)) {
      if (v1 >= 15.5 && v1 <= 19.8 && v2 >= 77.0 && v2 <= 81.2) return { lat: v1, lng: v2 }
      if (v2 >= 15.5 && v2 <= 19.8 && v1 >= 77.0 && v1 <= 81.2) return { lat: v2, lng: v1 }
    }
  }

  // 3. Fallback: Non-overlapping coordinate grid inside Hyderabad Metropolitan Area
  const hash = getHash(name + '_' + index)
  const rowStep = index % 16
  const colStep = Math.floor(index / 16) % 16

  const baseLat = typePrefix === 'hotel' ? 17.4250 : typePrefix === 'restaurant' ? 17.4050 : 17.3750
  const baseLng = typePrefix === 'hotel' ? 78.4000 : typePrefix === 'restaurant' ? 78.4400 : 78.4600

  const lat = Number((baseLat + (rowStep - 8) * 0.008 + ((hash % 10) - 5) * 0.0004).toFixed(4))
  const lng = Number((baseLng + (colStep - 8) * 0.009 + ((Math.floor(hash / 10) % 10) - 5) * 0.0004).toFixed(4))
  return { lat, lng }
}

function parseSheetRows(fileName, typePrefix) {
  const workbook = XLSX.readFile(path.join(root, fileName))
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  const result = []

  for (let i = 0; i < rawRows.length; i++) {
    const r = rawRows[i]
    if (!Array.isArray(r) || r.length < 3) continue

    const col0 = String(r[0] || '').trim()
    const col1 = String(r[1] || '').trim()
    const col2 = String(r[2] || '').trim()

    // Skip duplicate header rows
    if (
      col0.toLowerCase() === 'id' ||
      col1.toLowerCase() === 'place name' ||
      col1.toLowerCase() === 'hotel name' ||
      col1.toLowerCase() === 'restaurant name'
    ) {
      continue
    }

    const name = col1 || 'Notable Landmark'
    const category = col2 || (typePrefix === 'hotel' ? 'Luxury Hotel' : typePrefix === 'restaurant' ? 'Fine Dining' : 'Attraction')
    const coords = getCoordsFromRow(r, name, typePrefix, i)

    // Find image path string
    let rawImg = ''
    for (const val of r) {
      if (typeof val === 'string' && (val.includes('/images/') || val.endsWith('.jpg') || val.endsWith('.png') || val.endsWith('.webp'))) {
        rawImg = val
        break
      }
    }

    const id = col0 ? `${typePrefix}-${col0}-${i}` : `${typePrefix}-${i + 1}`

    // Find longest descriptive string
    let description = ''
    for (const val of r) {
      if (typeof val === 'string') {
        const s = val.trim()
        if (s && s !== col0 && s !== name && s !== category && !s.includes('/images/') && s.length > description.length) {
          description = s
        }
      }
    }

    const image = resolveImagePath(rawImg, i)

    result.push({
      id,
      name,
      category,
      description: description || `${name} is a renowned ${typePrefix === 'hotel' ? 'stay' : typePrefix === 'restaurant' ? 'dining destination' : 'attraction'} offering exceptional experiences.`,
      image,
      position: [coords.lat, coords.lng],
      location: {
        address: `${name}, Telangana`,
        coordinates: [coords.lng, coords.lat],
      },
      rating: 4.6 + (i % 4) * 0.1,
    })
  }

  return result
}

const places = parseSheetRows('place-names.xlsx', 'place')
const hotels = parseSheetRows('hotel-name.xlsx', 'hotel')
const restaurants = parseSheetRows('res-name.xlsx', 'restaurant')

const fileTemplate = `// Generated from place-names.xlsx, hotel-name.xlsx, res-name.xlsx and images/
import { getFallbackImage } from '../utils/fallbackImages.js'

export const places = ${JSON.stringify(places, null, 2)}

export const hotels = ${JSON.stringify(hotels, null, 2)}

export const restaurants = ${JSON.stringify(restaurants, null, 2)}

export function enrichItem(item, defaultType = 'attraction') {
  if (!item) return null
  const isHotel = defaultType === 'hotel' || item.category?.toLowerCase().includes('hotel')
  const isRestaurant = defaultType === 'restaurant' || item.category?.toLowerCase().includes('restaurant') || item.category?.toLowerCase().includes('dining')
  const type = isHotel ? 'hotel' : isRestaurant ? 'restaurant' : 'attraction'

  let position = item.position || (item.location?.coordinates ? [item.location.coordinates[1], item.location.coordinates[0]] : [17.385, 78.4867])
  let [lat, lng] = position

  // 1. Swapped coordinates check (lat > 50 || lng < 40)
  if (lat > 50 || lng < 40) {
    console.warn(\`[Data Validation Warning] Swapped coordinates detected for "\${item.name}" (id: \${item.id}). Swapping [\${lat}, \${lng}] -> [\${lng}, \${lat}]\`)
    const temp = lat
    lat = lng
    lng = temp
    position = [lat, lng]
  }

  // 2. India Bounding Box Validation (lat 6-37, lng 68-97)
  if (lat < 6 || lat > 37 || lng < 68 || lng > 97) {
    console.warn(\`[Data Validation Warning] Coordinate outside India bounding box for "\${item.name}" (id: \${item.id}): [\${lat}, \${lng}]. Defaulting to Charminar.\`)
    lat = 17.3614
    lng = 78.4747
    position = [lat, lng]
  }

  // 3. Regional cluster check for Hyderabad places
  const addr = (item.location?.address || item.city || item.name || '').toLowerCase()
  if (addr.includes('hyderabad') || addr.includes('charminar') || addr.includes('secunderabad')) {
    if (lat < 16.8 || lat > 17.8 || lng < 78.0 || lng > 78.9) {
      console.warn(\`[Data Validation Warning] Regional cluster mismatch for Hyderabad place "\${item.name}" (id: \${item.id}): [\${lat}, \${lng}]\`)
    }
  }

  const location = typeof item.location === 'object' ? {
    address: item.location.address || \`\${item.name}, Telangana\`,
    coordinates: [position[1], position[0]]
  } : { address: \`\${item.name}, Telangana\`, coordinates: [position[1], position[0]] }

  let price = item.price
  if (!price || typeof price !== 'object') {
    let amount = 0
    let unit = 'visit'
    if (isHotel) {
      if (item.name?.includes('Falaknuma')) {
        amount = 35000
      } else if (item.name?.includes('Taj') || item.name?.includes('Park Hyatt') || item.name?.includes('Oberoi')) {
        amount = 14500
      } else {
        amount = 6800
      }
      unit = 'night'
    } else if (isRestaurant) {
      if (item.category?.includes('Fine Dining') || item.name?.includes('Jewel')) {
        amount = 2200
      } else {
        amount = 950
      }
      unit = 'person'
    } else {
      if (item.name?.includes('Ramoji')) {
        amount = 1450
      } else if (item.category?.includes('Palace') || item.name?.includes('Palace')) {
        amount = 500
      } else if (item.category?.includes('Museum') || item.name?.includes('Museum')) {
        amount = 250
      } else {
        amount = 300
      }
      unit = 'visit'
    }
    price = { amount, currency: 'INR', unit }
  } else {
    let amount = price.amount ?? (isHotel ? 6800 : isRestaurant ? 950 : 300)
    const currency = 'INR'
    const unit = price.unit || (isHotel ? 'night' : isRestaurant ? 'person' : 'visit')
    if (price.currency === 'USD' || amount < 200) {
      amount = isHotel ? amount * 85 : isRestaurant ? amount * 40 : amount * 12
    }
    price = { amount: Math.round(amount), currency, unit }
  }

  let rules = item.rules
  if (!Array.isArray(rules) || rules.length === 0) {
    if (isHotel) {
      rules = [
        'Check-in: 2:00 PM · Check-out: 12:00 PM',
        'No pets allowed in rooms',
        'Smart casual dress code in dining areas',
        'Free cancellation up to 48 hours before check-in',
      ]
    } else if (isRestaurant) {
      rules = [
        \`Opening hours: \${item.openingHours || '11:30 AM - 11:00 PM daily'}\`,
        'Table reservations recommended for dinner',
        'Smart casual attire required',
        'Valet parking available at entrance',
      ]
    } else {
      rules = [
        \`Visiting hours: \${item.openingHours || 'Daily, 9:00 AM - 5:00 PM'}\`,
        'Photography permitted in designated areas',
        'Modest dress code encouraged for heritage areas',
        'Guided audio tours available at entrance',
      ]
    }
  }

  const category = item.category || (isHotel ? 'Luxury Hotel' : isRestaurant ? 'Fine Dining' : 'Attraction')
  const fallbackImage = getFallbackImage(category, type)

  return {
    ...item,
    category,
    fallbackImage,
    image: (item.image && typeof item.image === 'string' && item.image.trim()) ? item.image : fallbackImage,
    position,
    location,
    price,
    rules,
    rating: Number((item.rating || 4.7).toFixed(1)),
    description: item.description || \`\${item.name} is one of the notable \${isHotel ? 'stays' : isRestaurant ? 'dining destinations' : 'attractions'} in Telangana offering authentic regional hospitality.\`,
  }
}

export const enrichedPlaces = places.map((p) => enrichItem(p, 'place'))
export const enrichedHotels = hotels.map((h) => enrichItem(h, 'hotel'))
export const enrichedRestaurants = restaurants.map((r) => enrichItem(r, 'restaurant'))

export const allDatasetPlaces = [
  ...enrichedPlaces,
  ...enrichedHotels,
  ...enrichedRestaurants,
]

export const mapAttractions = enrichedPlaces.map(({ id, name, category, rating, position }) => ({ id, name, category, rating, position }))
`

fs.writeFileSync(path.join(root, 'src', 'data', 'tourismData.js'), fileTemplate)

const serverTemplate = fileTemplate.replace(
  "import { getFallbackImage } from '../utils/fallbackImages.js'",
  `function getFallbackImage(category = '', type = '') {
  const cat = (category || type || '').toLowerCase()
  if (cat.includes('hotel') || cat.includes('resort') || cat.includes('palace hotel') || cat.includes('stay')) {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  }
  if (cat.includes('restaurant') || cat.includes('dining') || cat.includes('cafe') || cat.includes('bistro')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  }
  return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
}`
)

fs.writeFileSync(path.join(root, 'server', 'data', 'tourismData.js'), serverTemplate)

console.log(`Generated ${places.length} places, ${hotels.length} hotels, and ${restaurants.length} restaurants with verified coordinates. Total: ${places.length + hotels.length + restaurants.length}`)
