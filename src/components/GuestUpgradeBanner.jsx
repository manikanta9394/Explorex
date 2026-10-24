import { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import GuestUpgradeModal from './GuestUpgradeModal'

export default function GuestUpgradeBanner() {
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Only render if current session is an anonymous guest and not dismissed
  if (!user || !user.is_guest || dismissed) {
    return null
  }

  return (
    <>
      <div className="guest-upgrade-banner" role="banner" aria-label="Guest account upgrade reminder">
        <div className="banner-content-wrap">
          <span className="banner-badge">
            <Sparkles size={13} /> Guest Mode
          </span>
          <span className="banner-message">
            Create a free account to permanently save your wishlist, customized itineraries, and AI chats across devices.
          </span>
          <button
            type="button"
            className="banner-upgrade-btn"
            onClick={() => setModalOpen(true)}
            title="Convert guest account to permanent profile"
          >
            <span>Upgrade Account</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <button
          type="button"
          className="banner-dismiss-btn"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss guest upgrade banner"
        >
          <X size={14} />
        </button>
      </div>

      <GuestUpgradeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
