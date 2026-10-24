import PageHeaderBand from '../components/PageHeaderBand'
import FestivalCalendar from '../components/FestivalCalendar'
import { Calendar } from 'lucide-react'

export default function FestivalCalendarPage({ onNavigate, onSelectPlace }) {
  return (
    <div className="festival-calendar-page-shell">
      <PageHeaderBand
        eyebrow="Living Culture & Traditions"
        title="Telangana Festival Calendar"
        subtitle="Explore Hyderabad’s iconic celebrations—from Bonalu at Golconda Fort to midnight Ramzan Haleem trails, Sankranti kite festivals, and Bathukamma floral traditions."
        badge={
          <span className="header-stat-badge">
            <Calendar size={13} /> 5 Iconic Telangana Celebrations
          </span>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Festivals' },
        ]}
      />

      <div className="festival-page-container">
        <FestivalCalendar onNavigate={onNavigate} onSelectPlace={onSelectPlace} />
      </div>
    </div>
  )
}
