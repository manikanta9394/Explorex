import { Sparkles } from 'lucide-react'

const MARQUEE_PLACES = [
  { name: 'Charminar', year: '1591 CE', cat: 'Monument', icon: '🏛️' },
  { name: 'Golconda Fort', year: 'Acoustic Marvel', cat: 'Citadel', icon: '👑' },
  { name: 'Chowmahalla Palace', year: 'Asaf Jahi Seat', cat: 'Palace', icon: '🏰' },
  { name: 'Salar Jung Museum', year: 'Global Art', cat: 'Museum', icon: '💎' },
  { name: 'Birla Mandir', year: 'White Marble', cat: 'Temple', icon: '🛕' },
  { name: 'Paradise Biryani', year: 'Since 1953', cat: 'Royal Cuisine', icon: '🍛' },
  { name: 'Hussain Sagar Lake', year: 'Monolith Buddha', cat: 'Lake', icon: '🌊' },
  { name: 'Paigah Tombs', year: 'Stucco Craft', cat: 'Heritage', icon: '🕊️' },
  { name: 'Ramappa Temple', year: 'UNESCO Site', cat: 'Kakatiya', icon: '🌺' },
  { name: 'Thousand Pillar Temple', year: 'Warangal', cat: 'Architecture', icon: '🏛️' },
  { name: 'Nimrah Cafe', year: 'Irani Chai', cat: 'Old City Classic', icon: '☕' },
  { name: 'Falaknuma Palace', year: 'Mirror in Sky', cat: 'Royal Hotel', icon: '👑' },
  { name: 'Hotel Shadab', year: 'Mutton Biryani', cat: 'Dining', icon: '🍲' },
  { name: 'Qutb Shahi Tombs', year: 'Ibrahim Bagh', cat: 'Heritage Park', icon: '🕌' },
  { name: 'Bawarchi Biryani', year: 'RTC Cross Roads', cat: 'Iconic Food', icon: '🥘' },
  { name: 'Ananthagiri Hills', year: 'Vikarabad', cat: 'Nature Retreat', icon: '🌲' },
]

export default function PlaceMarquee() {
  return (
    <aside className="place-marquee-section" aria-label="Telangana Highlights Marquee">
      <div className="marquee-eyebrow-container">
        <span className="marquee-eyebrow">
          <Sparkles size={13} />
          <span>Explore 400+ Telangana Landmarks</span>
        </span>
      </div>

      <div className="marquee-outer-wrapper">
        <div className="marquee-fade-left" aria-hidden="true" />
        <div className="marquee-fade-right" aria-hidden="true" />

        <div className="marquee-content-loop">
          {/* Track 1 */}
          <div className="marquee-track">
            {MARQUEE_PLACES.map((place, idx) => (
              <div key={`track1-${idx}`} className="marquee-chip">
                <span className="marquee-chip-icon">{place.icon}</span>
                <span className="marquee-chip-name">{place.name}</span>
                <span className="marquee-chip-dot">·</span>
                <span className="marquee-chip-meta">{place.year}</span>
                <span className="marquee-chip-badge">{place.cat}</span>
              </div>
            ))}
          </div>

          {/* Track 2 (Duplicate for infinite seamless loop) */}
          <div className="marquee-track" aria-hidden="true">
            {MARQUEE_PLACES.map((place, idx) => (
              <div key={`track2-${idx}`} className="marquee-chip">
                <span className="marquee-chip-icon">{place.icon}</span>
                <span className="marquee-chip-name">{place.name}</span>
                <span className="marquee-chip-dot">·</span>
                <span className="marquee-chip-meta">{place.year}</span>
                <span className="marquee-chip-badge">{place.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
