import { useEffect, useRef, useState, useMemo } from 'react'
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  Compass,
  Heart,
  LogOut,
  Map as MapIcon,
  MapPin,
  ShieldAlert,
  User,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useSavedPlaces } from '../context/useSavedPlaces'
import { useLanguage } from '../context/LanguageContext'
import AuthModal from './AuthModal'
import EmergencyHelpModal from './EmergencyHelpModal'
import LanguageSelector from './LanguageSelector'
import RegionSwitcher from './RegionSwitcher'
import SavedPlacesModal from './SavedPlacesModal'

export function Logo({ onClick }) {
  return (
    <a
      className="explorex-logo"
      href="#top"
      onClick={onClick}
      aria-label="Explorex home"
    >
      <span className="logo-compass-mark">
        <svg
          className="compass-svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Compass outer dial ring */}
          <circle cx="12" cy="12" r="10" />
          {/* Compass needle that gently sways */}
          <polygon
            className="compass-needle"
            points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="logo-brand-text">
        Explore<span className="logo-x-accent">x</span>
      </span>
    </a>
  )
}

const BASE_NAV_LINKS = [
  { id: 'home', translationKey: 'nav_home', defaultLabel: 'Home', path: '/', icon: Compass },
  { id: 'explore', translationKey: 'nav_explore', defaultLabel: 'Explore', path: '/explore', icon: MapPin },
  { id: 'map', translationKey: 'nav_map', defaultLabel: 'Map', path: '/map', icon: MapIcon },
  { id: 'planner', translationKey: 'nav_planner', defaultLabel: 'Planner', path: '/planner', icon: CalendarDays },
  { id: 'festivals', translationKey: 'nav_festivals', defaultLabel: 'Festivals', path: '/festivals', icon: Calendar },
  { id: 'ai', translationKey: 'nav_ai', defaultLabel: 'AI Guide', path: '/ai', icon: null, isNew: true },
]

export default function Navbar({
  currentRoute = '/',
  onSelectPlace,
  allPlaces = [],
  onGetDirections,
  onNavigate,
}) {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [isNavHidden, setIsNavHidden] = useState(false)
  const [isSolidGlass, setIsSolidGlass] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [localAuthModalOpen, setLocalAuthModalOpen] = useState(false)
  const [localAuthModalMode, setLocalAuthModalMode] = useState('login')
  const [savedModalOpen, setSavedModalOpen] = useState(false)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [hoveredPath, setHoveredPath] = useState(null)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const navLinks = useMemo(() => {
    return BASE_NAV_LINKS.map((link) => ({
      ...link,
      label: t(link.translationKey) || link.defaultLabel,
    }))
  }, [t])

  const {
    user,
    logout,
    authModalOpen: globalAuthModalOpen,
    authModalMode: globalAuthModalMode,
    closeAuthModal,
  } = useAuth()
  const { savedIds } = useSavedPlaces()
  const dropdownRef = useRef(null)
  const navListRef = useRef(null)
  const lastScrollYRef = useRef(0)

  const isAuthModalVisible = localAuthModalOpen || globalAuthModalOpen
  const activeAuthMode = globalAuthModalOpen ? globalAuthModalMode : localAuthModalMode

  // Normalized active path
  const activePath = useMemo(() => {
    if (!currentRoute) return '/'
    const norm = currentRoute.startsWith('/') ? currentRoute : `/${currentRoute}`
    if (norm === '/' || norm === '' || norm === '/home') return '/'
    for (const link of BASE_NAV_LINKS) {
      if (link.path !== '/' && norm.startsWith(link.path)) {
        return link.path
      }
    }
    return null
  }, [currentRoute])

  // Scroll listener:
  // 1. Hide on scroll down, show on scroll up
  // 2. Solid glass blur after hero on home page; always solid on pages without dark hero
  // 3. Shrink on scroll
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const prevScrollY = lastScrollYRef.current
          const diff = scrollY - prevScrollY

          setScrolled(scrollY > 24)

          // On pages without a dark hero (any page other than '/'), it is ALWAYS solid glass.
          // On the home page, it is transparent over the hero and becomes solid glass after scrolling about 24px.
          const isHomePage = currentRoute === '/' || currentRoute === '' || currentRoute === 'home'
          const shouldBeSolid = !isHomePage || scrollY > 24
          setIsSolidGlass(shouldBeSolid)

          // Hide on scroll down, return on scroll up
          if (!mobileDrawerOpen && !userDropdownOpen) {
            if (diff > 6 && scrollY > 60) {
              setIsNavHidden(true)
            } else if (diff < -4 || scrollY <= 24) {
              setIsNavHidden(false)
            }
          } else {
            setIsNavHidden(false)
          }

          lastScrollYRef.current = scrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentRoute, mobileDrawerOpen, userDropdownOpen])

  // Sliding Highlight Pill Positioning
  useEffect(() => {
    const updatePill = () => {
      if (!navListRef.current) return
      const targetPath = hoveredPath !== null ? hoveredPath : activePath
      if (!targetPath) {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }))
        return
      }

      const activeEl = navListRef.current.querySelector(`[data-nav-path="${targetPath}"]`)
      if (activeEl) {
        const parentRect = navListRef.current.getBoundingClientRect()
        const elRect = activeEl.getBoundingClientRect()
        setPillStyle({
          left: elRect.left - parentRect.left,
          width: elRect.width,
          opacity: 1,
        })
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }))
      }
    }

    updatePill()
    window.addEventListener('resize', updatePill)
    return () => window.removeEventListener('resize', updatePill)
  }, [hoveredPath, activePath, currentRoute])

  // Close dropdown on outside click or ESC
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false)
        setMobileDrawerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileDrawerOpen])

  const handleLinkClick = (e, path) => {
    if (e) e.preventDefault()
    setMobileDrawerOpen(false)
    setUserDropdownOpen(false)
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleOpenAuth = (mode) => {
    if (onNavigate) {
      onNavigate(mode === 'signup' ? '/signup' : '/login')
    } else {
      setLocalAuthModalMode(mode)
      setLocalAuthModalOpen(true)
    }
    setMobileDrawerOpen(false)
    setUserDropdownOpen(false)
  }

  const handleCloseAuth = () => {
    setLocalAuthModalOpen(false)
    closeAuthModal()
  }

  const handleOpenSaved = () => {
    if (onNavigate) {
      onNavigate('/saved')
    } else {
      setSavedModalOpen(true)
    }
    setUserDropdownOpen(false)
    setMobileDrawerOpen(false)
  }

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    setMobileDrawerOpen(false)
    if (onNavigate) {
      onNavigate('/welcome')
    }
  }

  const isLinkActive = (path) => {
    return activePath === path
  }

  const navClass = [
    'explorex-navbar',
    'nav-slide-down-entry',
    isNavHidden ? 'nav-hidden' : 'nav-visible',
    scrolled ? 'nav-scrolled' : 'nav-top',
    isSolidGlass ? 'nav-solid-glass' : 'nav-hero-glass',
  ].join(' ')

  return (
    <>
      <header className={navClass} role="banner">
        <div className="explorex-nav-inner">
          {/* Left: Logo with Swaying Compass Needle & Spin on Hover */}
          <div className="nav-left">
            <Logo onClick={(e) => handleLinkClick(e, '/')} />
          </div>

          {/* Center: Desktop Navigation with Sliding Highlight Pill */}
          <nav className="nav-center" aria-label="Main navigation">
            <ul
              className="nav-menu-list"
              ref={navListRef}
              onMouseLeave={() => setHoveredPath(null)}
            >
              {/* Sliding Highlight Pill */}
              <li
                className="nav-sliding-pill"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
                aria-hidden="true"
              />

              {navLinks.map((link) => {
                const isActive = isLinkActive(link.path)
                return (
                  <li
                    key={link.id}
                    className="nav-menu-item"
                    data-nav-path={link.path}
                    onMouseEnter={() => setHoveredPath(link.path)}
                  >
                    <a
                      href={link.path}
                      className={`nav-link-btn ${isActive ? 'active' : ''}`}
                      onClick={(e) => handleLinkClick(e, link.path)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="nav-link-label">{link.label}</span>
                      {link.isNew && (
                        <span className="nav-new-pill" aria-label="New feature">
                          <span className="pulse-ping" />
                          <span className="pulse-core" />
                          <span className="new-text">New</span>
                        </span>
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Right: Actions (Region Switcher, Language, SOS Help, Wishlist, Auth / User Profile) */}
          <div className="nav-right">
            <div className="nav-region-wrap">
              <RegionSwitcher currentRoute={currentRoute} onNavigate={onNavigate} />
            </div>

            <div className="nav-lang-wrap">
              <LanguageSelector />
            </div>

            {/* Emergency & Tourist Help SOS Button */}
            <button
              type="button"
              className="nav-emergency-sos-btn"
              onClick={() => setEmergencyOpen(true)}
              title="Telangana Emergency & Tourist Helplines"
              aria-label="Emergency Help"
            >
              <ShieldAlert size={15} />
              <span className="emergency-btn-text">SOS / Help</span>
            </button>

            {/* Saved Places Wishlist Button */}
            <button
              type="button"
              className={`nav-wishlist-icon-btn ${isLinkActive('/saved') ? 'active' : ''}`}
              onClick={handleOpenSaved}
              title={`Saved Places (${savedIds.length})`}
              aria-label={`Saved Places (${savedIds.length})`}
            >
              <Heart
                size={18}
                fill={savedIds.length > 0 ? '#C9A227' : 'none'}
                color={savedIds.length > 0 ? '#C9A227' : 'currentColor'}
              />
              {savedIds.length > 0 && (
                <span className="nav-saved-badge">{savedIds.length}</span>
              )}
            </button>

            {user ? (
              /* Signed-in State: Avatar with Animated Dropdown */
              <div className="nav-user-container" ref={dropdownRef}>
                <button
                  type="button"
                  className={`nav-user-profile-btn ${userDropdownOpen ? 'active' : ''}`}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Account menu"
                >
                  <span className="nav-user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <span className="nav-user-name">{user.name}</span>
                  <ChevronDown
                    size={14}
                    className={`nav-dropdown-chevron ${userDropdownOpen ? 'rotate' : ''}`}
                  />
                </button>

                {userDropdownOpen && (
                  <div
                    className="nav-profile-dropdown animated-dropdown"
                    role="menu"
                    aria-label="User options"
                  >
                    <div className="dropdown-user-header">
                      <span className="dropdown-avatar-circle">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                      <div className="dropdown-user-info">
                        <strong>{user.name}</strong>
                        <small>{user.email || 'Traveler'}</small>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={(e) => handleLinkClick(e, '/profile')}
                    >
                      <span className="menu-item-icon">
                        <User size={16} />
                      </span>
                      <span className="menu-item-text">My Profile</span>
                    </button>

                    <button
                      type="button"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={handleOpenSaved}
                    >
                      <span className="menu-item-icon heart">
                        <Heart
                          size={16}
                          fill={savedIds.length > 0 ? '#C9A227' : 'none'}
                          color="#C9A227"
                        />
                      </span>
                      <span className="menu-item-text">Saved places</span>
                      <span className="saved-counter-badge">{savedIds.length}</span>
                    </button>

                    <button
                      type="button"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={(e) => handleLinkClick(e, '/planner')}
                    >
                      <span className="menu-item-icon">
                        <CalendarDays size={16} />
                      </span>
                      <span className="menu-item-text">Trip planner</span>
                    </button>

                    <button
                      type="button"
                      className="dropdown-menu-item"
                      role="menuitem"
                      onClick={(e) => handleLinkClick(e, '/feedback')}
                    >
                      <span className="menu-item-icon">
                        <MessageSquare size={16} />
                      </span>
                      <span className="menu-item-text">Feedback &amp; Reports</span>
                    </button>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-menu-item logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <span className="menu-item-icon">
                        <LogOut size={15} />
                      </span>
                      <span className="menu-item-text">Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated: Log in & Sign up */
              <div className="nav-auth-group">
                <button
                  type="button"
                  className="nav-btn-login"
                  onClick={() => handleOpenAuth('login')}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="nav-btn-signup"
                  onClick={() => handleOpenAuth('signup')}
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Mobile Animated Hamburger that Morphs into an X */}
            <button
              type="button"
              className={`nav-hamburger-btn ${mobileDrawerOpen ? 'is-active' : ''}`}
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              aria-label={mobileDrawerOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileDrawerOpen}
            >
              <span className="burger-box">
                <span className="burger-line line-top" />
                <span className="burger-line line-mid" />
                <span className="burger-line line-bot" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer with Staggered Links */}
      <div
        className={`mobile-drawer-backdrop ${mobileDrawerOpen ? 'drawer-visible' : ''}`}
        onClick={() => setMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`mobile-drawer-panel ${mobileDrawerOpen ? 'drawer-visible' : ''}`}
        aria-label="Mobile Navigation"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <Logo onClick={(e) => handleLinkClick(e, '/')} />
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close menu"
          >
            <span className="burger-box close-x-box">
              <span className="burger-line line-top close-diag-1" />
              <span className="burger-line line-bot close-diag-2" />
            </span>
          </button>
        </div>

        {/* User Status Card inside Drawer */}
        <div className="drawer-user-section stagger-item" style={{ '--stagger': 0 }}>
          {user ? (
            <div className="drawer-user-card">
              <span className="drawer-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <div className="drawer-user-meta">
                <strong>{user.name}</strong>
                <small>{user.email || 'Traveler'}</small>
              </div>
              <button
                type="button"
                className="drawer-saved-btn"
                onClick={handleOpenSaved}
                title="View saved places"
              >
                <Heart
                  size={16}
                  fill={savedIds.length > 0 ? '#C9A227' : 'none'}
                  color="#C9A227"
                />
                <span>{savedIds.length}</span>
              </button>
            </div>
          ) : (
            <div className="drawer-auth-buttons">
              <button
                type="button"
                className="drawer-btn-login"
                onClick={() => handleOpenAuth('login')}
              >
                Log in
              </button>
              <button
                type="button"
                className="drawer-btn-signup"
                onClick={() => handleOpenAuth('signup')}
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Staggered Navigation Links */}
        <nav className="drawer-nav">
          <span className="drawer-section-label stagger-item" style={{ '--stagger': 1 }}>
            Navigation
          </span>
          <ul className="drawer-links-list">
            {navLinks.map((link, idx) => {
              const Icon = link.icon
              const isActive = isLinkActive(link.path)
              return (
                <li
                  key={link.id}
                  className="stagger-item"
                  style={{ '--stagger': idx + 2 }}
                >
                  <a
                    href={link.path}
                    className={`drawer-link-item ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleLinkClick(e, link.path)}
                  >
                    <span className="drawer-item-icon">
                      {Icon ? <Icon size={18} /> : <Compass size={18} />}
                    </span>
                    <span className="drawer-item-label">{link.label}</span>
                    {link.isNew && (
                      <span className="nav-new-pill" aria-label="New feature">
                        <span className="pulse-ping" />
                        <span className="pulse-core" />
                        <span className="new-text">New</span>
                      </span>
                    )}
                  </a>
                </li>
              )
            })}
            {/* My Profile in Drawer */}
            <li
              className="stagger-item"
              style={{ '--stagger': navLinks.length + 2 }}
            >
              <button
                type="button"
                className={`drawer-link-item ${isLinkActive('/profile') ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, '/profile')}
              >
                <span className="drawer-item-icon">
                  <User size={18} />
                </span>
                <span className="drawer-item-label">My Profile</span>
              </button>
            </li>

            {/* Saved Places in Drawer */}
            <li
              className="stagger-item"
              style={{ '--stagger': navLinks.length + 3 }}
            >
              <button
                type="button"
                className={`drawer-link-item ${isLinkActive('/saved') ? 'active' : ''}`}
                onClick={handleOpenSaved}
              >
                <span className="drawer-item-icon">
                  <Heart
                    size={18}
                    fill={savedIds.length > 0 ? '#C9A227' : 'none'}
                    color="#C9A227"
                  />
                </span>
                <span className="drawer-item-label">Saved places</span>
                <span className="saved-counter-badge">{savedIds.length}</span>
              </button>
            </li>

            {/* Feedback & Support in Drawer */}
            <li
              className="stagger-item"
              style={{ '--stagger': navLinks.length + 4 }}
            >
              <button
                type="button"
                className={`drawer-link-item ${isLinkActive('/feedback') ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, '/feedback')}
              >
                <span className="drawer-item-icon">
                  <MessageSquare size={18} />
                </span>
                <span className="drawer-item-label">Feedback &amp; Reports</span>
              </button>
            </li>

            {/* Emergency & Tourist Help in Drawer */}
            <li
              className="stagger-item"
              style={{ '--stagger': navLinks.length + 5 }}
            >
              <button
                type="button"
                className="drawer-link-item drawer-emergency-item"
                onClick={() => {
                  setMobileDrawerOpen(false)
                  setEmergencyOpen(true)
                }}
              >
                <span className="drawer-item-icon">
                  <ShieldAlert size={18} color="#DC2626" />
                </span>
                <span className="drawer-item-label">Emergency &amp; Help</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div
          className="drawer-footer stagger-item"
          style={{ '--stagger': navLinks.length + 4 }}
        >
          <div className="drawer-footer-region">
            <span>Region:</span>
            <RegionSwitcher
              currentRoute={currentRoute}
              onNavigate={(path) => {
                setMobileDrawerOpen(false)
                onNavigate(path)
              }}
            />
          </div>

          <div className="drawer-footer-lang">
            <span>Language:</span>
            <LanguageSelector />
          </div>

          {user && (
            <button
              type="button"
              className="drawer-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Log out
            </button>
          )}

          <p className="drawer-tagline">
            Explorex · India Travel Intelligence
          </p>
        </div>
      </aside>

      {/* Auth Modal (Fallback) */}
      <AuthModal
        isOpen={isAuthModalVisible}
        onClose={handleCloseAuth}
        initialMode={activeAuthMode}
        onNavigate={onNavigate}
      />

      {/* Saved Places Modal (Fallback) */}
      <SavedPlacesModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        allPlaces={allPlaces}
        onSelectPlace={onSelectPlace}
        onGetDirections={onGetDirections}
      />

      {/* Emergency & Tourist Help Modal */}
      <EmergencyHelpModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />
    </>
  )
}
