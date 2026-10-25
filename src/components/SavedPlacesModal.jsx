import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Heart, MapPin, Navigation, Star, Trash2, X } from 'lucide-react'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { formatPriceWithUnit } from '../utils/formatCurrency'
import SafeImage from './SafeImage'
import { Modal } from './PortalDialog'

export default function SavedPlacesModal({
  isOpen,
  onClose,
  allPlaces = [],
  onSelectPlace,
  onGetDirections,
}) {
  const { savedIds, toggleSave } = useSavedPlaces()
  const [places, setPlaces] = useState(allPlaces)

  useEffect(() => {
    if (allPlaces && allPlaces.length > 0) {
      setPlaces(allPlaces)
    } else if (isOpen) {
      import('../data/tourismData').then((mod) => {
        if (mod && mod.allDatasetPlaces) {
          setPlaces(mod.allDatasetPlaces)
        }
      }).catch(() => {})
    }
  }, [isOpen, allPlaces])

  // Look up place objects for all saved IDs
  const savedItems = useMemo(() => {
    const activePlaces = places && places.length > 0 ? places : allPlaces
    if (!Array.isArray(activePlaces) || !Array.isArray(savedIds)) return []
    const placeMap = new Map(activePlaces.map((p) => [p.id, p]))
    return savedIds
      .map((id) => placeMap.get(id))
      .filter(Boolean)
  }, [places, allPlaces, savedIds])

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="saved-modal-overlay"
      contentClassName="saved-modal-card"
      maxWidth="740px"
      ariaLabel="Saved Places"
      raw
    >
      {/* Header */}
      <div className="saved-modal-header">
          <div className="saved-header-left">
            <span className="saved-heart-badge">
              <Heart size={18} fill="#C9682D" color="#C9682D" />
            </span>
            <div>
              <h2>Your Saved Places</h2>
              <p>{savedItems.length} {savedItems.length === 1 ? 'place' : 'places'} curated for your journey</p>
            </div>
          </div>
          <button className="saved-modal-close" onClick={onClose} aria-label="Close saved places">
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div className="saved-modal-body">
          {savedItems.length === 0 ? (
            <div className="saved-empty-state">
              <div className="empty-heart-bubble">
                <Heart size={36} strokeWidth={1.5} color="#C9682D" />
              </div>
              <h3>No saved places yet</h3>
              <p>
                Browse Hyderabad attractions, heritage hotels, and iconic restaurants.
                Click the heart icon on any card to save it to your wishlist.
              </p>
              <button
                type="button"
                className="saved-browse-btn"
                onClick={() => {
                  onClose()
                  const el = document.getElementById('nearby')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Explore Destinations <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="saved-items-grid">
              {savedItems.map((item) => {
                const fallbackType = item.category?.toLowerCase().includes('hotel')
                  ? 'hotel'
                  : item.category?.toLowerCase().includes('restaurant') || item.category?.toLowerCase().includes('dining')
                  ? 'restaurant'
                  : 'attraction'
                const { priceDisplay, unitDisplay } = formatPriceWithUnit(item.price, fallbackType)

                return (
                  <article key={item.id} className="saved-card">
                    <div className="saved-card-thumb" onClick={() => { onSelectPlace?.(item); onClose(); }}>
                      <SafeImage
                        src={item.image}
                        category={item.category}
                        type={fallbackType}
                        fallbackSrc={item.fallbackImage}
                        alt={item.name}
                      />
                      <span className="saved-card-chip">{item.category || 'Attraction'}</span>
                    </div>

                    <div className="saved-card-details">
                      <div className="saved-card-top-row">
                        <h4 onClick={() => { onSelectPlace?.(item); onClose(); }}>{item.name}</h4>
                        <button
                          type="button"
                          className="saved-remove-btn"
                          onClick={() => toggleSave(item.id)}
                          title="Remove from saved places"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <p className="saved-card-addr">
                        <MapPin size={13} /> {item.location?.address || 'Hyderabad, Telangana'}
                      </p>

                      <div className="saved-card-footer">
                        <div className="saved-card-meta">
                          <span className="saved-rating">
                            <Star size={13} fill="#C9A227" color="#C9A227" />
                            <strong>{(Number(item.rating) || 4.7).toFixed(1)}</strong>
                          </span>
                          <span className="saved-price">
                            <strong>{priceDisplay}</strong>
                            <small>/{unitDisplay}</small>
                          </span>
                        </div>

                        <div className="saved-card-actions">
                          {onGetDirections && (
                            <button
                              type="button"
                              className="saved-action-btn directions"
                              onClick={() => {
                                onGetDirections(item)
                                onClose()
                              }}
                              title="Get directions in Google Maps"
                            >
                              <Navigation size={13} /> Directions
                            </button>
                          )}
                          <button
                            type="button"
                            className="saved-action-btn view-details"
                            onClick={() => {
                              onSelectPlace?.(item)
                              onClose()
                            }}
                          >
                            Details <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
    </Modal>
  )
}
