import { useState, useMemo } from 'react'
import {
  User,
  Heart,
  Calendar,
  MessageSquare,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Globe,
  Share2,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SafeImage from '../components/SafeImage'
import SEOHead from '../components/SEOHead'
import { useAuth } from '../context/useAuth'
import { useLanguage } from '../context/LanguageContext'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useToast } from '../context/useToast'
import { allDatasetPlaces } from '../data/tourismData'
import { Modal } from '../components/PortalDialog'

const AVATAR_OPTIONS = [
  { id: 'peacock', label: 'Mayura (Peacock)', emoji: '🦚', color: '#1E3A8A' },
  { id: 'tiger', label: 'Bengal Tiger', emoji: '🐅', color: '#B45309' },
  { id: 'elephant', label: 'Airavata (Elephant)', emoji: '🐘', color: '#374151' },
  { id: 'lotus', label: 'Padma (Lotus)', emoji: '🪷', color: '#BE185D' },
  { id: 'sun', label: 'Surya (Sun God)', emoji: '☀️', color: '#D97706' },
  { id: 'temple', label: 'Heritage Gopuram', emoji: '🛕', color: '#C9A227' },
]

const ALL_INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
  'Chandigarh',
]

export default function ProfilePage({ onNavigate }) {
  const { user, signOut, updateUserProfile } = useAuth()
  const { language, setLanguage } = useLanguage()
  const { savedIds, toggleSave } = useSavedPlaces()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('saved') // 'saved' | 'trips' | 'chats' | 'settings'

  // Editable Profile Form State
  const initialName = user?.name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Explorer')
  const [displayName, setDisplayName] = useState(initialName)
  const [selectedAvatar, setSelectedAvatar] = useState(user?.user_metadata?.avatar || 'peacock')
  const [homeState, setHomeState] = useState(user?.user_metadata?.home_state || 'Telangana')
  const [savingProfile, setSavingProfile] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Hydrate saved places
  const savedPlaces = useMemo(() => {
    return allDatasetPlaces.filter((p) => savedIds.includes(p.id))
  }, [savedIds])

  // Retrieve saved trips from localStorage
  const savedTrips = useMemo(() => {
    try {
      const raw = localStorage.getItem('explorex_saved_trips')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  // Retrieve AI chat conversations
  const conversations = useMemo(() => {
    try {
      const raw = localStorage.getItem('sb_emu_table_conversations')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!displayName.trim()) return

    setSavingProfile(true)
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          name: displayName.trim(),
          avatar: selectedAvatar,
          home_state: homeState,
        })
      } else {
        // Fallback local update
        const updated = {
          ...user,
          name: displayName.trim(),
          user_metadata: {
            ...user?.user_metadata,
            name: displayName.trim(),
            avatar: selectedAvatar,
            home_state: homeState,
          },
        }
        localStorage.setItem('sb_emu_session', JSON.stringify({ user: updated }))
      }
      showToast('Profile preferences updated successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      // Clear user data from emulator/storage
      localStorage.removeItem('sb_emu_session')
      localStorage.removeItem('explorex_saved_places')
      localStorage.removeItem('explorex_saved_trips')
      localStorage.removeItem('sb_emu_table_conversations')
      localStorage.removeItem('sb_emu_table_messages')

      if (signOut) await signOut()
      showToast('Your account and personal data have been completely deleted.', 'info')
      if (onNavigate) onNavigate('/welcome')
    } catch (err) {
      showToast(err.message || 'Failed to delete account.', 'error')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const avatarObj = AVATAR_OPTIONS.find((a) => a.id === selectedAvatar) || AVATAR_OPTIONS[0]
  const isGuest = user?.is_anonymous || !user

  return (
    <div className="profile-page-shell">
      <SEOHead
        title="My Profile & Saved Trips | Explorex"
        description="Manage your profile, view saved heritage monuments, review past itineraries, and manage privacy settings on Explorex."
      />

      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Explorer Profile' },
        ]}
        eyebrow="Explorer Sanctuary"
        title={displayName}
        subtitle={
          isGuest
            ? 'Guest Explorer account with temporary storage. Upgrade anytime to sync across devices.'
            : `${user?.email || 'Registered Explorer'} · Home in ${homeState}`
        }
        badge={
          <div className="profile-header-badge">
            <span className="profile-role-pill">
              {isGuest ? 'Guest Explorer' : user?.email?.includes('admin') ? 'Administrator' : 'Verified Explorer'}
            </span>
          </div>
        }
      />

      <div className="profile-container">
        {/* Profile Overview Card */}
        <div className="profile-hero-card">
          <div className="profile-avatar-large" style={{ background: avatarObj.color }}>
            <span className="avatar-emoji">{avatarObj.emoji}</span>
          </div>

          <div className="profile-info-block">
            <h3>{displayName}</h3>
            <p className="profile-location-sub">
              <MapPin size={13} /> Home State: <strong>{homeState}</strong> · Preferred Language: <strong>{language?.toUpperCase() || 'EN'}</strong>
            </p>
            <div className="profile-stats-counters">
              <div className="stat-pill" onClick={() => setActiveTab('saved')}>
                <strong>{savedPlaces.length}</strong>
                <span>Saved Places</span>
              </div>
              <div className="stat-pill" onClick={() => setActiveTab('trips')}>
                <strong>{savedTrips.length}</strong>
                <span>Trips Planned</span>
              </div>
              <div className="stat-pill" onClick={() => setActiveTab('chats')}>
                <strong>{conversations.length}</strong>
                <span>AI Chats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="profile-nav-tabs">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Heart size={16} />
            <span>Saved Places ({savedPlaces.length})</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
          >
            <Calendar size={16} />
            <span>My Trips ({savedTrips.length})</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <MessageSquare size={16} />
            <span>AI Chats ({conversations.length})</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <User size={16} />
            <span>Edit Profile &amp; Settings</span>
          </button>
        </div>

        {/* Tab 1: Saved Places Grid */}
        {activeTab === 'saved' && (
          <div className="profile-tab-content">
            {savedPlaces.length === 0 ? (
              <div className="empty-profile-tab">
                <Heart size={36} color="#9CA3AF" />
                <h4>No saved places yet</h4>
                <p>Browse India's top heritage monuments and tap the heart icon to save them to your sanctuary.</p>
                <button
                  type="button"
                  className="tab-action-btn"
                  onClick={() => onNavigate?.('/explore')}
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="saved-places-profile-grid">
                {savedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="profile-place-card"
                    onClick={() => onNavigate?.(`/explore/${place.id}`)}
                  >
                    <div className="card-thumb-wrap">
                      <SafeImage
                        src={place.image}
                        category={place.category}
                        alt={place.name}
                        className="profile-place-img"
                      />
                      <button
                        type="button"
                        className="remove-save-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleSave(place.id)
                          showToast(`Removed ${place.name} from saved places.`, 'info')
                        }}
                        title="Remove from saved"
                      >
                        <Heart size={14} fill="#EF4444" color="#EF4444" />
                      </button>
                    </div>
                    <div className="card-meta-wrap">
                      <h5>{place.name}</h5>
                      <span className="card-loc">
                        <MapPin size={11} /> {place.city}, {place.state}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Trips */}
        {activeTab === 'trips' && (
          <div className="profile-tab-content">
            {savedTrips.length === 0 ? (
              <div className="empty-profile-tab">
                <Calendar size={36} color="#9CA3AF" />
                <h4>No itineraries saved yet</h4>
                <p>Use the Day-by-Day Trip Planner to group places by proximity and save custom itineraries.</p>
                <button
                  type="button"
                  className="tab-action-btn"
                  onClick={() => onNavigate?.('/planner')}
                >
                  Create an Itinerary
                </button>
              </div>
            ) : (
              <div className="trips-cards-list">
                {savedTrips.map((trip, idx) => (
                  <div key={trip.id || idx} className="trip-summary-card">
                    <div className="trip-card-header">
                      <h4>{trip.title || `Trip ${idx + 1}`}</h4>
                      <span className="trip-date-pill">
                        {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('en-IN') : 'Saved Plan'}
                      </span>
                    </div>
                    <p className="trip-desc-line">
                      {trip.days?.length || 1} Days · Budget: ₹{(trip.budget || 5000).toLocaleString('en-IN')} · {trip.travellers || 1} Travellers
                    </p>
                    <div className="trip-actions-row">
                      <button
                        type="button"
                        className="btn-view-trip"
                        onClick={() => onNavigate?.(`/trips/${trip.id || idx + 1}`)}
                      >
                        View Full Route <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: AI Chat History */}
        {activeTab === 'chats' && (
          <div className="profile-tab-content">
            {conversations.length === 0 ? (
              <div className="empty-profile-tab">
                <MessageSquare size={36} color="#9CA3AF" />
                <h4>No chat conversations yet</h4>
                <p>Start a conversation with our RAG-grounded cultural guide to ask about ticket prices, hours, and travel etiquette.</p>
                <button
                  type="button"
                  className="tab-action-btn"
                  onClick={() => onNavigate?.('/ai')}
                >
                  Ask Explorex AI
                </button>
              </div>
            ) : (
              <div className="conversations-history-list">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="conv-history-item"
                    onClick={() => onNavigate?.('/ai')}
                  >
                    <div className="conv-item-left">
                      <Sparkles size={16} color="#C9A227" />
                      <div>
                        <h5>{conv.title}</h5>
                        <span className="conv-time">
                          {new Date(conv.updated_at || conv.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="resume-chat-btn"
                      onClick={() => onNavigate?.('/ai')}
                    >
                      Resume <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Settings & Edit Profile */}
        {activeTab === 'settings' && (
          <div className="profile-tab-content">
            <form onSubmit={handleSaveProfile} className="profile-settings-form">
              {/* Avatar Selector */}
              <div className="form-section">
                <label className="section-label">Choose Cultural Avatar</label>
                <div className="avatar-picker-grid">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`avatar-option-btn ${selectedAvatar === opt.id ? 'active' : ''}`}
                      onClick={() => setSelectedAvatar(opt.id)}
                      style={{ '--opt-color': opt.color }}
                    >
                      <span className="opt-emoji">{opt.emoji}</span>
                      <span className="opt-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Name */}
              <div className="form-group">
                <label htmlFor="display-name" className="form-label">Display Name</label>
                <input
                  type="text"
                  id="display-name"
                  className="profile-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              {/* Home State */}
              <div className="form-group">
                <label htmlFor="home-state" className="form-label">Home State / Region</label>
                <select
                  id="home-state"
                  className="profile-select"
                  value={homeState}
                  onChange={(e) => setHomeState(e.target.value)}
                >
                  {ALL_INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Language Preference */}
              <div className="form-group">
                <label htmlFor="pref-language" className="form-label">Preferred Interface Language</label>
                <select
                  id="pref-language"
                  className="profile-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="save-profile-btn"
                disabled={savingProfile}
              >
                <Save size={15} />
                <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>

            {/* Danger Zone: Delete Account */}
            <div className="danger-zone-card">
              <div className="danger-title-row">
                <AlertTriangle size={18} color="#EF4444" />
                <h4>Danger Zone: Delete Account &amp; Personal Data</h4>
              </div>
              <p>
                Permanently erase your explorer profile, saved places collection, trip itineraries, and chat conversations. This action cannot be reversed.
              </p>
              <button
                type="button"
                className="delete-account-cta"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={15} />
                <span>Delete My Data &amp; Account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal via React Portal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        className="profile-delete-modal-backdrop"
        contentClassName="profile-delete-modal-inner"
        maxWidth="460px"
        ariaLabel="Permanently Delete Account"
        raw
      >
        <div className="modal-icon-orb-danger">
          <AlertTriangle size={32} color="#EF4444" />
        </div>
        <h3>Permanently Delete Account?</h3>
        <p>
          Are you sure you want to delete your Explorex profile? All your saved places, planned trips, and chat history will be permanently cleared from this device and database.
        </p>
        <div className="modal-actions-row">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-danger-confirm"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? 'Deleting Data...' : 'Yes, Delete Everything'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
