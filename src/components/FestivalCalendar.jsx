import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import SafeImage from './SafeImage'

export const TELANGANA_FESTIVALS = [
  {
    id: 'bonalu',
    name: 'Bonalu Festival (బోనాలు)',
    period: 'July – August (Ashada Masam)',
    seasonTag: 'Monsoon Celebration',
    themeColor: '#D97706',
    icon: '🪔',
    tagline: 'Centuries-old royal thanksgiving to Mother Goddess Mahankali',
    description:
      'Bonalu is Telangana’s iconic heritage festival celebrated with grand pageantry. Women carry decorated brass pots ("Bonam") layered with cooked rice, jaggery, curd, and neem leaves atop their heads to honor Goddess Mahankali. The festival begins at Golconda Fort, moves to Ujjaini Mahankali in Secunderabad, and culminates in the historic Old City with vibrant Pothuraju dancers and the royal elephant procession.',
    highlights: [
      'Begins with Golconda Fort Sri Jagadamba Mahankali Bonalu atop the hill fort',
      'Energetic rhythmic Pothuraju dance with whips and turmeric body paint',
      'Lal Darwaza Mahankali Temple procession led by decorated temple elephant',
      'Rangam (annual oracle prophecy) predicting prosperity for Telangana',
    ],
    visitorTips:
      'Wear comfortable walking shoes. Sundays during Ashada Masam see grand processions. Photography of Pothuraju dancers is permitted with courtesy.',
    relatedPlaces: [
      {
        id: 'place-2-2',
        name: 'Golconda Fort (Sri Jagadamba Mahakali)',
        category: 'Historical Fort',
        image: '/images/golconda-fort.jpg',
        connection: 'Where the first Bonalu of the year is offered at the hill shrine',
      },
      {
        id: 'place-1-1',
        name: 'Charminar & Lal Darwaza',
        category: 'Heritage Landmark',
        image: '/images/charminar.jpg',
        connection: 'Heart of the final grand Old City Bonalu procession',
      },
    ],
  },
  {
    id: 'ramzan-nights',
    name: 'Ramzan Nights & Haleem Trail (రమజాన్ రాత్రులు)',
    period: 'March – April (Holy Month of Ramadan)',
    seasonTag: 'Midnight Food & Culture',
    themeColor: '#059669',
    icon: '🌙',
    tagline: 'A nocturnal paradise of glowing bazaars, fragrant attar, and royal Haleem',
    description:
      'During the holy month of Ramadan, Hyderabad transforms into an enchanting nocturnal wonderland. The Old City surrounding Charminar stays vibrant and illuminated until 4:00 AM. Thousands gather for midnight shopping along Laad Bazaar, while century-old restaurants simmer giant wood-fired cauldrons of Hyderabadi Haleem—a GI-tagged royal delicacy of slow-cooked meat, wheat, lentils, and rich spices.',
    highlights: [
      'Iconic Hyderabadi Dum Biryani and GI-tagged slow-cooked mutton Haleem',
      'Charminar pedestrian plaza illuminated with fairy lights all night',
      'Midnight bangle, pearl, and traditional attar shopping at Laad Bazaar',
      'Pre-dawn Sehri street food delicacies around Mecca Masjid and Nayab',
    ],
    visitorTips:
      'Best experienced between 10:00 PM and 2:30 AM. Park near Madina Building or Charminar bus station and explore the pedestrian zone on foot.',
    relatedPlaces: [
      {
        id: 'place-1-1',
        name: 'Charminar & Laad Bazaar Night Market',
        category: 'Night Market',
        image: '/images/charminar.jpg',
        connection: 'Epicenter of all-night bazaars and Eid shopping',
      },
      {
        id: 'restaurant-101',
        name: 'Hotel Shadab',
        category: 'Heritage Dining',
        image: '/images/charminar.jpg',
        connection: 'Legendary midnight Haleem, Nihari, and Nizami Biryani',
      },
    ],
  },
  {
    id: 'sankranti',
    name: 'Sankranti & International Kite Festival (సంక్రాంతి)',
    period: 'January 13 – 16 (Makara Sankranti)',
    seasonTag: 'Winter Harvest & Skies',
    themeColor: '#EA580C',
    icon: '🪁',
    tagline: 'Vibrant harvest skies, rooftop kite battles, and traditional sweets',
    description:
      'Sankranti marks the sun’s transition into Capricorn and is celebrated across Hyderabad with rooftop kite duels that fill the sky from dawn till dusk. The Telangana Tourism Department hosts the Telangana International Kite and Sweet Festival, welcoming master kite flyers from over 40 countries alongside traditional cultural dances and sweet feasts.',
    highlights: [
      'Telangana International Kite Festival with gigantic 3D artistic kites',
      'Traditional Haridasu folk singers in bright dhotis and copper vessels',
      'Muggulu (geometric colorful rangoli with flowers) across every threshold',
      'Festive sesame sweets: Ariselu, Sakinalu, Bobbatlu, and Til-Laddus',
    ],
    visitorTips:
      'Visit Parade Grounds in Secunderabad for the official Kite Festival and Shilparamam for authentic folk music and craft workshops.',
    relatedPlaces: [
      {
        id: 'place-9-9',
        name: 'Shilparamam Arts & Crafts Village',
        category: 'Cultural Village',
        image: '/images/charminar.jpg',
        connection: 'Hosts live rural folk dances, pottery, and Sankranti Sambaralu',
      },
      {
        id: 'place-4-4',
        name: 'Hussain Sagar Lake (Tank Bund)',
        category: 'Lake & Promenade',
        image: '/images/charminar.jpg',
        connection: 'Popular waterfront kite flying and evening winter breeze',
      },
    ],
  },
  {
    id: 'bathukamma',
    name: 'Bathukamma Floral Festival (బతుకమ్మ)',
    period: 'September – October (Navratri)',
    seasonTag: 'Autumn Flower Festival',
    themeColor: '#DB2777',
    icon: '🌸',
    tagline: 'Telangana’s unique feminine celebration of wildflowers and ecology',
    description:
      'Declared the State Festival of Telangana, Bathukamma represents the deep cultural reverence for nature and water bodies. Women create intricate, concentric tiered stacks ("Bathukamma") using vibrant seasonal wildflowers such as Gunugu, Tangedu, and Gummadi. Dressed in traditional silk Langa Vonis and Pattu Sarees, women dance in harmonious circles, singing timeless Telangana folk songs before peacefully immersing the flowers into lakes.',
    highlights: [
      'Magnificent floral sculptures celebrating native Deccan flora',
      'Harmonious clapping circle folk dances (Bathukamma Patalu)',
      'Grand evening immersion at Tank Bund and waterfront promenades',
      'Saddula Bathukamma (grand finale) with traditional five-flavor spiced rice',
    ],
    visitorTips:
      'The most spectacular gathering happens on Tank Bund along Hussain Sagar, where thousands of illuminated Bathukammas are gathered at dusk.',
    relatedPlaces: [
      {
        id: 'place-4-4',
        name: 'Hussain Sagar & Tank Bund',
        category: 'Lakeside Promenade',
        image: '/images/charminar.jpg',
        connection: 'Grand central stage for the finale Saddula Bathukamma immersion',
      },
      {
        id: 'place-7-7',
        name: 'Birla Mandir',
        category: 'Spiritual Heritage',
        image: '/images/charminar.jpg',
        connection: 'Offers panoramic night view of illuminated lake festivities',
      },
    ],
  },
  {
    id: 'numaish',
    name: 'Numaish - All India Industrial Exhibition (నుమాయిష్)',
    period: 'January 1 – February 15 (46 Days)',
    seasonTag: 'Historic 46-Day Fair',
    themeColor: '#7C3AED',
    icon: '🎡',
    tagline: 'Hyderabad’s premier century-old open-air fair running since 1938',
    description:
      'Started during the era of the 7th Nizam Mir Osman Ali Khan, Numaish is a cherished winter tradition attracting over 2.5 million visitors annually. Spread over 23 acres at Nampally, it houses more than 2,000 stalls featuring regional handicrafts from Kashmir to Kanyakumari, giant Ferris wheels, local dry fruit halwas, and open-air food courts.',
    highlights: [
      'Historic exhibition tradition running uninterrupted for over 85 years',
      'Giant amusement park with vintage Ferris wheels and thrill rides',
      'Authentic street delicacies: Mirchi Bajji, Lucknowi Chikan, and Dry Fruit Halwa',
      'Bargain shopping for handmade carpets, leather goods, and regional spices',
    ],
    visitorTips:
      'Gates open at 3:00 PM on weekdays and 1:00 PM on weekends. Take Hyderabad Metro directly to Gandhi Bhavan or Nampally Station to avoid road congestion.',
    relatedPlaces: [
      {
        id: 'place-1-1',
        name: 'Moazzam Jahi Market & Nampally',
        category: 'Historic Market',
        image: '/images/charminar.jpg',
        connection: 'Just 1 km from the Numaish grounds, famed for handmade ice cream',
      },
    ],
  },
]

export default function FestivalCalendar({ onNavigate, onSelectPlace }) {
  const [selectedFestival, setSelectedFestival] = useState(TELANGANA_FESTIVALS[0])
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredFestivals = TELANGANA_FESTIVALS.filter((f) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'monsoon' && f.id === 'bonalu') return true
    if (activeFilter === 'spring' && f.id === 'ramzan-nights') return true
    if (activeFilter === 'winter' && (f.id === 'sankranti' || f.id === 'numaish')) return true
    if (activeFilter === 'autumn' && f.id === 'bathukamma') return true
    return false
  })

  return (
    <div className="festival-calendar-shell">
      {/* Category Season Filter Tabs */}
      <div className="festival-filter-tabs">
        <button
          type="button"
          className={`fest-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Festivals ({TELANGANA_FESTIVALS.length})
        </button>
        <button
          type="button"
          className={`fest-tab-btn ${activeFilter === 'monsoon' ? 'active' : ''}`}
          onClick={() => setActiveFilter('monsoon')}
        >
          🌧️ Monsoon (Bonalu)
        </button>
        <button
          type="button"
          className={`fest-tab-btn ${activeFilter === 'spring' ? 'active' : ''}`}
          onClick={() => setActiveFilter('spring')}
        >
          🌙 Spring (Ramzan Nights)
        </button>
        <button
          type="button"
          className={`fest-tab-btn ${activeFilter === 'autumn' ? 'active' : ''}`}
          onClick={() => setActiveFilter('autumn')}
        >
          🌸 Autumn (Bathukamma)
        </button>
        <button
          type="button"
          className={`fest-tab-btn ${activeFilter === 'winter' ? 'active' : ''}`}
          onClick={() => setActiveFilter('winter')}
        >
          🪁 Winter (Sankranti &amp; Numaish)
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="festivals-display-grid">
        {/* Left: Cards List */}
        <div className="festivals-cards-col">
          {filteredFestivals.map((fest) => {
            const isSelected = selectedFestival.id === fest.id
            return (
              <div
                key={fest.id}
                className={`festival-summary-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setSelectedFestival(fest)}
              >
                <div className="fest-card-header">
                  <span className="fest-card-icon">{fest.icon}</span>
                  <div className="fest-card-title-group">
                    <h4>{fest.name}</h4>
                    <span className="fest-period-tag">{fest.period}</span>
                  </div>
                </div>
                <p className="fest-tagline">{fest.tagline}</p>
                <div className="fest-card-bottom">
                  <span className="fest-season-pill">{fest.seasonTag}</span>
                  <span className="fest-places-count">
                    {fest.relatedPlaces.length} Related Destination{fest.relatedPlaces.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: Selected Festival Deep Dive */}
        <div className="festival-deep-dive-card">
          <div className="deep-dive-banner" style={{ borderColor: selectedFestival.themeColor }}>
            <div className="deep-dive-title-row">
              <span className="deep-dive-icon">{selectedFestival.icon}</span>
              <div>
                <h3>{selectedFestival.name}</h3>
                <span className="deep-dive-period">{selectedFestival.period} · {selectedFestival.seasonTag}</span>
              </div>
            </div>
            <p className="deep-dive-tagline">“{selectedFestival.tagline}”</p>
          </div>

          <div className="deep-dive-content">
            <div className="deep-dive-section">
              <h5>📜 Cultural Heritage &amp; Traditions</h5>
              <p className="deep-dive-body">{selectedFestival.description}</p>
            </div>

            <div className="deep-dive-section">
              <h5>✨ Key Highlights &amp; Rituals</h5>
              <ul className="deep-dive-highlights">
                {selectedFestival.highlights.map((h, i) => (
                  <li key={i}>
                    <span className="hl-bullet">✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Places in Explorex */}
            <div className="deep-dive-section">
              <h5>📍 Related Landmark Destinations</h5>
              <div className="related-places-grid">
                {selectedFestival.relatedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="fest-place-mini-card"
                    onClick={() => {
                      onSelectPlace?.(place)
                      onNavigate?.(`explore/${place.id}`)
                    }}
                    title={`View ${place.name}`}
                  >
                    <div className="fest-place-thumb">
                      <SafeImage
                        src={place.image}
                        fallbackSrc="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80"
                        category={place.category}
                        alt={place.name}
                      />
                    </div>
                    <div className="fest-place-meta">
                      <h6>{place.name}</h6>
                      <span className="fest-place-conn">{place.connection}</span>
                      <button
                        type="button"
                        className="fest-view-place-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectPlace?.(place)
                          onNavigate?.(`explore/${place.id}`)
                        }}
                      >
                        <ExternalLink size={11} /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor Etiquette Tip */}
            <div className="deep-dive-tip-box">
              <span className="tip-box-icon">💡</span>
              <div>
                <strong>Visitor Guidance:</strong>
                <p>{selectedFestival.visitorTips}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
