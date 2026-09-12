import { useTravelMode } from '../context/useTravelMode'

const MODES = [
  { id: 'driving-car', label: 'Driving', icon: '🚗' },
  { id: 'foot-walking', label: 'Walking', icon: '🚶' },
  { id: 'cycling-regular', label: 'Cycling', icon: '🚴' },
]

export default function TravelModeSegmentedControl({ value, onChange }) {
  const { travelMode: contextMode, setTravelMode: setContextMode } = useTravelMode()

  // Support controlled mode or shared context mode
  const currentMode = value ?? contextMode
  const handleModeChange = onChange ?? setContextMode

  return (
    <div className="travel-mode-segmented-control" role="tablist" aria-label="Select Travel Mode">
      {MODES.map((mode) => {
        const isActive = currentMode === mode.id
        return (
          <button
            key={mode.id}
            role="tab"
            aria-selected={isActive}
            className={`mode-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => handleModeChange(mode.id)}
          >
            <span className="tab-icon">{mode.icon}</span>
            <span className="tab-label">{mode.label}</span>
          </button>
        )
      })}
    </div>
  )
}
