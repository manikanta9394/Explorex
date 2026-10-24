import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Compass,
  Copy,
  MapPin,
  Phone,
  PhoneCall,
  ShieldAlert,
  X,
} from 'lucide-react'
import { useUserLocation } from '../context/useUserLocation'

export const EMERGENCY_NUMBERS = [
  {
    id: 'police',
    icon: '👮',
    name: 'Police Control Room',
    tel: '100',
    display: '100 / 040-27852435',
    desc: 'Immediate emergency response & tourist patrol assistance',
    badge: 'Immediate (24x7)',
  },
  {
    id: 'ambulance',
    icon: '🚑',
    name: 'Ambulance & Trauma Care',
    tel: '108',
    display: '108 / 102',
    desc: 'Emergency medical assistance, accident & cardiac transport',
    badge: 'Toll-Free',
  },
  {
    id: 'tourist',
    icon: '🏛️',
    name: 'Telangana Tourism Helpline',
    tel: '180042546464',
    display: '1800-425-46464',
    desc: 'Official 24x7 tourist guidance, lost items & verified support',
    badge: 'Tourism Dept',
  },
  {
    id: 'she-teams',
    icon: '🛡️',
    name: 'SHE Teams (Women Safety)',
    tel: '181',
    display: '181 / 1091 / 9490616555',
    desc: 'Dedicated women protection wing of Telangana Police',
    badge: 'Confidential',
  },
  {
    id: 'fire',
    icon: '🚒',
    name: 'Fire & Rescue Services',
    tel: '101',
    display: '101',
    desc: 'Fire hazards, building rescue & emergency evacuation',
    badge: 'Emergency',
  },
]

export const TOP_HOSPITALS = [
  {
    id: 'osmania',
    name: 'Osmania General Hospital',
    area: 'Afzal Gunj (Near Charminar & Old City)',
    tel: '04024600121',
    telDisplay: '040-24600121',
    position: [17.3785, 78.477],
    beds: '24x7 Emergency Trauma Center',
  },
  {
    id: 'nims',
    name: "NIMS (Nizam's Institute of Medical Sciences)",
    area: 'Punjagutta, Hyderabad',
    tel: '04023396552',
    telDisplay: '040-23396552',
    position: [17.4225, 78.4525],
    beds: 'Premier State Medical Hospital',
  },
  {
    id: 'apollo',
    name: 'Apollo Health City',
    area: 'Jubilee Hills, Hyderabad',
    tel: '04023607777',
    telDisplay: '040-23607777',
    position: [17.4262, 78.4125],
    beds: 'Multispecialty & International Care',
  },
  {
    id: 'care',
    name: 'CARE Hospitals',
    area: 'Road No 1, Banjara Hills',
    tel: '04061656565',
    telDisplay: '040-61656565',
    position: [17.415, 78.4485],
    beds: '24x7 Advanced Emergency Care',
  },
  {
    id: 'gandhi',
    name: 'Gandhi Hospital',
    area: 'Musheerabad, Secunderabad',
    tel: '04027505566',
    telDisplay: '040-27505566',
    position: [17.4255, 78.502],
    beds: 'Govt Multispecialty Hospital',
  },
]

export default function EmergencyHelpModal({ isOpen, onClose }) {
  const { userCoords } = useUserLocation()
  const [copiedCoords, setCopiedCoords] = useState(false)

  if (!isOpen) return null

  const lat = userCoords ? userCoords[1].toFixed(4) : '17.3850'
  const lng = userCoords ? userCoords[0].toFixed(4) : '78.4867'
  const coordsText = `${lat}° N, ${lng}° E (Hyderabad, Telangana)`

  const copyCoordinates = () => {
    navigator.clipboard?.writeText?.(coordsText)
    setCopiedCoords(true)
    setTimeout(() => setCopiedCoords(false), 2500)
  }

  const openHospitalMap = (hospital) => {
    const [hLat, hLng] = hospital.position
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hLat},${hLng}&travelmode=driving`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="emergency-modal-backdrop" onClick={onClose}>
      <div
        className="emergency-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Emergency and Help Directory"
      >
        {/* Header */}
        <div className="emergency-modal-header">
          <div className="emergency-header-title">
            <span className="emergency-shield-icon">
              <ShieldAlert size={22} />
            </span>
            <div>
              <h3>Telangana Emergency &amp; Tourist Help</h3>
              <p>Verified 24x7 emergency contacts, tourist assistance, and top hospitals</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live GPS Coordinates Beacon */}
        <div className="gps-beacon-banner">
          <div className="beacon-info">
            <span className="beacon-pulse" />
            <div className="beacon-text">
              <span className="beacon-label">Your Live GPS Coordinates:</span>
              <strong className="beacon-coords">{coordsText}</strong>
            </div>
          </div>
          <button
            type="button"
            className="copy-coords-btn"
            onClick={copyCoordinates}
            title="Copy coordinates to share with police or contacts"
          >
            {copiedCoords ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedCoords ? 'Copied Coordinates!' : 'Copy Location'}</span>
          </button>
        </div>

        <div className="emergency-modal-body">
          {/* Section 1: Quick Emergency Numbers */}
          <section className="emergency-section-block">
            <h4 className="section-label">
              <AlertTriangle size={15} /> Primary Emergency Numbers (Tap to Call)
            </h4>
            <div className="emergency-numbers-grid">
              {EMERGENCY_NUMBERS.map((item) => (
                <div key={item.id} className="emergency-num-card">
                  <div className="num-card-top">
                    <span className="num-icon">{item.icon}</span>
                    <span className="num-badge">{item.badge}</span>
                  </div>
                  <h5 className="num-title">{item.name}</h5>
                  <p className="num-desc">{item.desc}</p>
                  <a
                    href={`tel:${item.tel}`}
                    className="emergency-call-btn"
                    title={`Call ${item.name}`}
                  >
                    <PhoneCall size={14} />
                    <span>Call {item.display}</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Nearest Multispecialty Hospitals */}
          <section className="emergency-section-block">
            <h4 className="section-label">
              <MapPin size={15} /> Nearest 24x7 Hospitals &amp; Trauma Care
            </h4>
            <div className="hospitals-list-grid">
              {TOP_HOSPITALS.map((hosp) => (
                <div key={hosp.id} className="hospital-item-card">
                  <div className="hospital-meta">
                    <h5>{hosp.name}</h5>
                    <span className="hospital-area">{hosp.area}</span>
                    <span className="hospital-beds-tag">{hosp.beds}</span>
                  </div>
                  <div className="hospital-actions">
                    <a
                      href={`tel:${hosp.tel}`}
                      className="hosp-call-btn"
                      title="Call Hospital"
                    >
                      <Phone size={13} />
                      <span>{hosp.telDisplay}</span>
                    </a>
                    <button
                      type="button"
                      className="hosp-dir-btn"
                      onClick={() => openHospitalMap(hosp)}
                      title="Navigate in Google Maps"
                    >
                      <Compass size={13} />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="emergency-modal-footer">
          <span className="footer-disclaimer">
            💡 For immediate life-threatening situations, dial 100 or 108 directly. Explorex does not replace emergency dispatchers.
          </span>
          <button type="button" className="emergency-done-btn" onClick={onClose}>
            Close Directory
          </button>
        </div>
      </div>
    </div>
  )
}
