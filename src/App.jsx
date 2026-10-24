import { useEffect, useState, useMemo, lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgressBar from './components/ScrollProgressBar'
import AuthModal from './components/AuthModal'
import AccessGate from './components/AccessGate'
import GuestUpgradeBanner from './components/GuestUpgradeBanner'
import FeedbackDrawer from './components/FeedbackDrawer'
import PageSkeletonLoader from './components/PageSkeletonLoader'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { useAuth } from './context/useAuth'
import { SavedPlacesProvider } from './context/SavedPlacesContext'
import { TravelModeProvider } from './context/TravelModeContext'
import { useTravelMode } from './context/useTravelMode'
import { UserLocationProvider } from './context/UserLocationContext'
import { useUserLocation } from './context/useUserLocation'
import { ToastProvider } from './context/ToastContext'
import { allDatasetPlaces } from './data/tourismData'
import { openGoogleMapsDirections } from './utils/googleMaps'
import AnnouncementBanner from './components/AnnouncementBanner'
import AdminLayout from './admin/AdminLayout'
import AdminAuthGuard from './admin/AdminAuthGuard'
import './admin/admin.css'
import './App.css'

// User App Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const PlaceDetailPage = lazy(() => import('./pages/PlaceDetailPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const TripPlannerPage = lazy(() => import('./pages/TripPlannerPage'))
const AIGuidePage = lazy(() => import('./pages/AIGuidePage'))
const SavedPlacesPage = lazy(() => import('./pages/SavedPlacesPage'))
const FestivalCalendarPage = lazy(() => import('./pages/FestivalCalendarPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const WelcomePage = lazy(() => import('./pages/WelcomePage'))
const StateLandingPage = lazy(() => import('./pages/StateLandingPage'))
const TripViewerPage = lazy(() => import('./pages/TripViewerPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Admin App Pages
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('./admin/pages/AdminDashboardPage'))
const AdminPlacesPage = lazy(() => import('./admin/pages/AdminPlacesPage'))
const AdminImagesPage = lazy(() => import('./admin/pages/AdminImagesPage'))
const AdminUsersPage = lazy(() => import('./admin/pages/AdminUsersPage'))
const AdminFeedbackPage = lazy(() => import('./admin/pages/AdminFeedbackPage'))
const AdminAIQualityPage = lazy(() => import('./admin/pages/AdminAIQualityPage'))
const AdminContentPage = lazy(() => import('./admin/pages/AdminContentPage'))
const AdminAuditLogsPage = lazy(() => import('./admin/pages/AdminAuditLogsPage'))
const AdminSettingsPage = lazy(() => import('./admin/pages/AdminSettingsPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function getRouteFromLocation() {
  if (typeof window === 'undefined') return { route: '/', id: null }

  const hash = window.location.hash || ''
  const pathname = window.location.pathname || ''
  const base = import.meta.env.BASE_URL || '/Explorex/'
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base

  // Determine effective path
  let path = ''
  if (hash.startsWith('#/')) {
    path = hash.slice(1)
  } else if (
    hash.startsWith('#') &&
    hash.length > 1 &&
    !['top', 'destinations', 'overview', 'nearby', 'features', 'how-it-works', 'ask'].includes(hash.slice(1))
  ) {
    path = '/' + hash.slice(1)
  } else if (normalizedBase && pathname.startsWith(normalizedBase)) {
    path = pathname.slice(normalizedBase.length) || '/'
  } else {
    path = pathname || '/'
  }

  // Normalize path
  if (!path.startsWith('/')) path = '/' + path
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)

  // Strip query params for route matching
  const cleanPath = path.split('?')[0].split('#')[0]

  if (cleanPath === '' || cleanPath === '/') return { route: '/', id: null }
  if (cleanPath === '/welcome') return { route: '/welcome', id: null }
  if (cleanPath === '/login') return { route: '/login', id: null }
  if (cleanPath === '/signup') return { route: '/signup', id: null }
  if (cleanPath === '/explore') return { route: '/explore', id: null }
  if (cleanPath.startsWith('/explore/')) {
    const id = cleanPath.slice('/explore/'.length)
    return { route: '/explore/:id', id }
  }
  if (cleanPath.startsWith('/places/')) {
    const slug = cleanPath.slice('/places/'.length)
    return { route: '/explore/:id', id: slug }
  }
  if (cleanPath.startsWith('/place/')) {
    const id = cleanPath.slice('/place/'.length)
    return { route: '/explore/:id', id }
  }
  if (cleanPath === '/map') return { route: '/map', id: null }
  if (cleanPath === '/planner') return { route: '/planner', id: null }
  if (cleanPath === '/festivals') return { route: '/festivals', id: null }
  if (cleanPath.startsWith('/states/')) {
    const slug = cleanPath.slice('/states/'.length)
    return { route: '/states/:slug', slug }
  }
  if (cleanPath === '/ai') return { route: '/ai', id: null }
  if (cleanPath === '/saved') return { route: '/saved', id: null }
  if (cleanPath.startsWith('/trips/')) {
    const id = cleanPath.slice('/trips/'.length)
    return { route: '/trips/:id', id }
  }
  if (cleanPath === '/trips') return { route: '/trips/:id', id: '1' }
  if (cleanPath === '/feedback') return { route: '/feedback', id: null }
  if (cleanPath === '/profile') return { route: '/profile', id: null }
  if (cleanPath === '/help' || cleanPath === '/faq') return { route: '/help', id: null }
  if (cleanPath === '/about') return { route: '/about', id: null }
  if (cleanPath === '/privacy') return { route: '/privacy', id: null }
  if (cleanPath === '/terms') return { route: '/terms', id: null }

  // Admin Routes
  if (cleanPath === '/admin/login') return { route: '/admin/login', id: null }
  if (cleanPath === '/admin' || cleanPath === '/admin/') return { route: '/admin', id: null }
  if (cleanPath === '/admin/places') return { route: '/admin/places', id: null }
  if (cleanPath === '/admin/images') return { route: '/admin/images', id: null }
  if (cleanPath === '/admin/users') return { route: '/admin/users', id: null }
  if (cleanPath === '/admin/feedback') return { route: '/admin/feedback', id: null }
  if (cleanPath === '/admin/ai-quality') return { route: '/admin/ai-quality', id: null }
  if (cleanPath === '/admin/content') return { route: '/admin/content', id: null }
  if (cleanPath === '/admin/audit-logs') return { route: '/admin/audit-logs', id: null }
  if (cleanPath === '/admin/settings') return { route: '/admin/settings', id: null }
  if (cleanPath.startsWith('/admin/')) {
    const sub = cleanPath.slice('/admin/'.length)
    return { route: `/admin/${sub}`, id: sub }
  }

  return { route: '/404', id: null }
}

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromLocation)
  const { travelMode } = useTravelMode()
  const { userCoords } = useUserLocation()
  const { authModalOpen, closeAuthModal, authModalMode } = useAuth()

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(getRouteFromLocation())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    window.addEventListener('popstate', handleRouteChange)
    window.addEventListener('hashchange', handleRouteChange)
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      window.removeEventListener('hashchange', handleRouteChange)
    }
  }, [])

  const navigateTo = (path) => {
    let target = path || '/'
    if (!target.startsWith('/')) target = `/${target}`

    const base = import.meta.env.BASE_URL || '/Explorex/'
    const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base

    const newUrl = `${normalizedBase}${target === '/' ? '/' : target}`
    try {
      window.history.pushState(null, '', newUrl)
    } catch {
      window.location.hash = `#${target}`
    }

    setCurrentRoute(getRouteFromLocation())
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const handleGetDirections = (place) => {
    const userLatLng = userCoords ? { lat: userCoords[1], lng: userCoords[0] } : null
    openGoogleMapsDirections(place, travelMode, userLatLng)
  }

  // Admin App Login Route (dense slate aesthetic, no user hero/footer)
  if (currentRoute.route === '/admin/login') {
    return (
      <Suspense fallback={<PageSkeletonLoader />}>
        <AdminLoginPage onNavigate={navigateTo} />
      </Suspense>
    )
  }

  // Admin App Shell & Routes (dense, functional slate dashboard guarded by admin role)
  if (currentRoute.route.startsWith('/admin')) {
    const renderAdminSection = () => {
      switch (currentRoute.route) {
        case '/admin/places':
          return <AdminPlacesPage onNavigate={navigateTo} />
        case '/admin/images':
          return <AdminImagesPage onNavigate={navigateTo} />
        case '/admin/users':
          return <AdminUsersPage onNavigate={navigateTo} />
        case '/admin/feedback':
          return <AdminFeedbackPage onNavigate={navigateTo} />
        case '/admin/ai-quality':
          return <AdminAIQualityPage onNavigate={navigateTo} />
        case '/admin/content':
          return <AdminContentPage onNavigate={navigateTo} />
        case '/admin/audit-logs':
          return <AdminAuditLogsPage onNavigate={navigateTo} />
        case '/admin/settings':
          return <AdminSettingsPage onNavigate={navigateTo} />
        case '/admin':
        default:
          return <AdminDashboardPage onNavigate={navigateTo} />
      }
    }

    return (
      <AdminAuthGuard onNavigate={navigateTo}>
        <AdminLayout currentRoute={currentRoute} onNavigate={navigateTo}>
          <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--adm-text-dim)' }}>Loading admin console...</div>}>
            {renderAdminSection()}
          </Suspense>
        </AdminLayout>
      </AdminAuthGuard>
    )
  }

  // Auth pages have dedicated split/centered layouts without full Navbar/Footer
  if (currentRoute.route === '/welcome') {
    return (
      <Suspense fallback={<PageSkeletonLoader />}>
        <WelcomePage onNavigate={navigateTo} />
      </Suspense>
    )
  }

  if (currentRoute.route === '/login') {
    return (
      <Suspense fallback={<PageSkeletonLoader />}>
        <LoginPage onNavigate={navigateTo} />
      </Suspense>
    )
  }

  if (currentRoute.route === '/signup') {
    return (
      <Suspense fallback={<PageSkeletonLoader />}>
        <SignupPage onNavigate={navigateTo} />
      </Suspense>
    )
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
            allPlaces={allDatasetPlaces}
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
          allPlaces={allDatasetPlaces}
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
        <FeedbackDrawer
          currentRoute={currentRoute.route === '/explore/:id' ? `/explore/${currentRoute.id}` : currentRoute.route}
        />

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

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <LanguageProvider>
              <TravelModeProvider>
                <UserLocationProvider>
                  <SavedPlacesProvider>
                    <AppContent />
                  </SavedPlacesProvider>
                </UserLocationProvider>
              </TravelModeProvider>
            </LanguageProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
