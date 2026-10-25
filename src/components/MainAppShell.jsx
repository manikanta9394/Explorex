import { useState, lazy, Suspense } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollProgressBar from './ScrollProgressBar'
import AuthModal from './AuthModal'
import AccessGate from './AccessGate'
import GuestUpgradeBanner from './GuestUpgradeBanner'
import FeedbackDrawer from './FeedbackDrawer'
import PageSkeletonLoader from './PageSkeletonLoader'
import { FeedbackDrawerErrorBoundary } from './ErrorBoundary'
import AnnouncementBanner from './AnnouncementBanner'
import NetworkStatusIndicator from './NetworkStatusIndicator'
import { useAuth } from '../context/useAuth'
import '../App.css'

// Lazy load DirectionsModal with in-app Leaflet routing so Leaflet isn't loaded until directions are requested
const DirectionsModal = lazy(() => import('./DirectionsModal'))

// Lazy load user app pages
const HomePage = lazy(() => import('../pages/HomePage'))
const ExplorePage = lazy(() => import('../pages/ExplorePage'))
const PlaceDetailPage = lazy(() => import('../pages/PlaceDetailPage'))
const MapPage = lazy(() => import('../pages/MapPage'))
const TripPlannerPage = lazy(() => import('../pages/TripPlannerPage'))
const AIGuidePage = lazy(() => import('../pages/AIGuidePage'))
const SavedPlacesPage = lazy(() => import('../pages/SavedPlacesPage'))
const FestivalCalendarPage = lazy(() => import('../pages/FestivalCalendarPage'))
const StateLandingPage = lazy(() => import('../pages/StateLandingPage'))
const TripViewerPage = lazy(() => import('../pages/TripViewerPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const FeedbackPage = lazy(() => import('../pages/FeedbackPage'))
const HelpPage = lazy(() => import('../pages/HelpPage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'))
const TermsPage = lazy(() => import('../pages/TermsPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export default function MainAppShell({ currentRoute, navigateTo }) {
  const { authModalOpen, closeAuthModal, authModalMode } = useAuth()
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false)
  const [directionsTarget, setDirectionsTarget] = useState(null)

  const handleGetDirections = (place) => {
    if (place) {
      setDirectionsTarget(place)
      setDirectionsModalOpen(true)
    }
  }

  const routeKey =
    currentRoute.route === '/explore/:id'
      ? `place-${currentRoute.id}`
      : currentRoute.route === '/states/:slug'
      ? `state-${currentRoute.slug}`
      : currentRoute.route === '/trips/:id'
      ? `trip-${currentRoute.id}`
      : currentRoute.route

  const renderCurrentPage = () => {
    switch (currentRoute.route) {
      case '/explore':
        return (
          <ExplorePage
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
            onGetDirections={handleGetDirections}
          />
        )
      case '/explore/:id':
        return (
          <PlaceDetailPage
            placeId={currentRoute.id}
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
            onGetDirections={handleGetDirections}
          />
        )
      case '/map':
        return (
          <MapPage
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
            onGetDirections={handleGetDirections}
          />
        )
      case '/planner':
        return (
          <TripPlannerPage
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
            onGetDirections={handleGetDirections}
          />
        )
      case '/festivals':
        return (
          <FestivalCalendarPage
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
          />
        )
      case '/states/:slug':
        return (
          <StateLandingPage
            slug={currentRoute.slug}
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
            onGetDirections={handleGetDirections}
          />
        )
      case '/ai':
        return (
          <AIGuidePage
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
            onGetDirections={handleGetDirections}
          />
        )
      case '/saved':
        return (
          <SavedPlacesPage
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
            onGetDirections={handleGetDirections}
          />
        )
      case '/trips/:id':
        return (
          <TripViewerPage
            tripId={currentRoute.id}
            onNavigate={navigateTo}
          />
        )
      case '/profile':
        return (
          <ProfilePage
            onNavigate={navigateTo}
          />
        )
      case '/feedback':
        return (
          <FeedbackPage
            onNavigate={navigateTo}
          />
        )
      case '/help':
        return (
          <HelpPage
            onNavigate={navigateTo}
          />
        )
      case '/about':
        return (
          <AboutPage
            onNavigate={navigateTo}
          />
        )
      case '/privacy':
        return (
          <PrivacyPage
            onNavigate={navigateTo}
          />
        )
      case '/terms':
        return (
          <TermsPage
            onNavigate={navigateTo}
          />
        )
      case '/404':
        return (
          <NotFoundPage
            onNavigate={navigateTo}
          />
        )
      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            onSelectPlace={(place) => navigateTo(`/explore/${place.id}`)}
          />
        )
    }
  }

  return (
    <AccessGate currentRoute={currentRoute} onNavigate={navigateTo}>
      <div className="explorex-app-shell">
        {/* Skip to Content for Screen Readers & Keyboard Access */}
        <a href="#main-content" className="skip-to-content-link">
          Skip to main content
        </a>

        {/* Global Announcement Banner from Admin Content Studio */}
        <AnnouncementBanner onNavigate={navigateTo} />

        <ScrollProgressBar />
        <GuestUpgradeBanner />
        <Navbar
          currentRoute={currentRoute.route === '/explore/:id' ? `/explore/${currentRoute.id}` : currentRoute.route}
          onNavigate={navigateTo}
          onGetDirections={handleGetDirections}
        />

        <main className="main-content-area" id="main-content" tabIndex="-1">
          <div key={routeKey} className="page-transition-wrap">
            <Suspense fallback={<PageSkeletonLoader />}>
              {renderCurrentPage()}
            </Suspense>
          </div>
        </main>

        <Footer onNavigate={navigateTo} />

        {/* Global Floating Feedback Drawer */}
        <FeedbackDrawerErrorBoundary>
          <FeedbackDrawer
            currentRoute={currentRoute.route === '/explore/:id' ? `/explore/${currentRoute.id}` : currentRoute.route}
          />
        </FeedbackDrawerErrorBoundary>

        {/* Global Offline / Online Network Indicator */}
        <NetworkStatusIndicator />

        {/* Global Directions Modal with In-App Leaflet Routing (lazy loaded) */}
        {directionsModalOpen && (
          <Suspense fallback={null}>
            <DirectionsModal
              isOpen={directionsModalOpen}
              onClose={() => setDirectionsModalOpen(false)}
              destination={directionsTarget}
            />
          </Suspense>
        )}

        <AuthModal
          isOpen={authModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
          onNavigate={navigateTo}
        />
      </div>
    </AccessGate>
  )
}
