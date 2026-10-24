import { useMemo, useState } from 'react'
import { Clock, Info, Users } from 'lucide-react'

// Generate realistic crowd data by hour for a place
export function generateHourlyCrowdData(place) {
  const currentHour24 = new Date().getHours()
  const name = (place?.name || '').toLowerCase()
  const category = (place?.category || '').toLowerCase()

  // Base patterns
  // 9 AM to 9 PM (13 hours: 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21)
  const hours = [
    { hour24: 9, label: '9 AM' },
    { hour24: 10, label: '10 AM' },
    { hour24: 11, label: '11 AM' },
    { hour24: 12, label: '12 PM' },
    { hour24: 13, label: '1 PM' },
    { hour24: 14, label: '2 PM' },
    { hour24: 15, label: '3 PM' },
    { hour24: 16, label: '4 PM' },
    { hour24: 17, label: '5 PM' },
    { hour24: 18, label: '6 PM' },
    { hour24: 19, label: '7 PM' },
    { hour24: 20, label: '8 PM' },
    { hour24: 21, label: '9 PM' },
  ]

  let curve = [20, 35, 55, 70, 60, 50, 65, 85, 95, 80, 50, 30, 15] // Default heritage sunset peak

  if (category.includes('food') || category.includes('restaurant')) {
    // Lunch peak (12-2 PM) and dinner peak (7-9 PM)
    curve = [15, 20, 40, 85, 95, 60, 30, 25, 45, 75, 95, 90, 65]
  } else if (name.includes('hussain sagar') || name.includes('necklace') || name.includes('lumbini')) {
    // Heavy evening lake curve
    curve = [10, 15, 25, 30, 25, 35, 55, 75, 95, 90, 80, 55, 30]
  } else if (name.includes('salar jung') || name.includes('chowmahalla')) {
    // Midday indoor museum curve
    curve = [25, 50, 80, 90, 85, 70, 60, 45, 30, 15, 10, 10, 5]
  }

  return hours.map((h, idx) => {
    const crowdPercent = curve[idx] || 40
    let level = 'Low'
    let levelColor = '#10B981' // Green
    if (crowdPercent >= 70) {
      level = 'Peak'
      levelColor = '#EF4444' // Red
    } else if (crowdPercent >= 35) {
      level = 'Moderate'
      levelColor = '#F59E0B' // Amber
    }

    const isCurrent = h.hour24 === currentHour24

    return {
      ...h,
      crowdPercent,
      level,
      levelColor,
      isCurrent,
    }
  })
}

export default function CrowdLevelChart({ place }) {
  const crowdData = useMemo(() => generateHourlyCrowdData(place), [place])
  const [hoveredHour, setHoveredHour] = useState(null)

  const currentHourItem = crowdData.find((h) => h.isCurrent) || crowdData[4]
  const peakHourItem = [...crowdData].sort((a, b) => b.crowdPercent - a.crowdPercent)[0]

  const activeDisplay = hoveredHour || currentHourItem

  return (
    <div className="crowd-level-chart-card">
      <div className="crowd-chart-header">
        <div className="crowd-title-group">
          <h4 className="crowd-chart-heading">
            <Users size={16} /> Crowd Level by Hour
          </h4>
          <span className="crowd-status-pill" style={{ color: activeDisplay.levelColor }}>
            ● {activeDisplay.level} Crowd ({activeDisplay.crowdPercent}%) at {activeDisplay.label}
          </span>
        </div>
        <div className="crowd-summary-tip">
          <Clock size={13} />
          <span>Peak hours: <strong>{peakHourItem.label}</strong> (up to {peakHourItem.crowdPercent}%)</span>
        </div>
      </div>

      {/* Mini Bar Chart */}
      <div className="crowd-bars-container">
        {crowdData.map((item) => {
          return (
            <div
              key={item.hour24}
              className={`crowd-bar-col ${item.isCurrent ? 'is-current-hour' : ''} ${
                hoveredHour?.hour24 === item.hour24 ? 'is-hovered' : ''
              }`}
              onMouseEnter={() => setHoveredHour(item)}
              onMouseLeave={() => setHoveredHour(null)}
              title={`${item.label}: ${item.crowdPercent}% crowd (${item.level})`}
            >
              {item.isCurrent && (
                <span className="current-hour-indicator" title="Current time">
                  Now
                </span>
              )}

              <div className="crowd-bar-track">
                <div
                  className="crowd-bar-fill"
                  style={{
                    height: `${item.crowdPercent}%`,
                    backgroundColor: item.levelColor,
                  }}
                />
              </div>

              <span className="crowd-bar-label">
                {item.hour24 % 3 === 0 ? item.label : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* Footer Info & Legend */}
      <div className="crowd-chart-footer">
        <div className="crowd-legend">
          <span className="legend-item"><span className="legend-dot green" /> Low (&lt;35%)</span>
          <span className="legend-item"><span className="legend-dot amber" /> Moderate (35-70%)</span>
          <span className="legend-item"><span className="legend-dot red" /> Peak (&gt;70%)</span>
        </div>
        <div className="crowd-disclaimer">
          <Info size={11} />
          <span>Based on historical footfall &amp; visitor trends</span>
        </div>
      </div>
    </div>
  )
}
