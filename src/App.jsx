import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgressBar from './components/ScrollProgressBar'
import AuthModal from './components/AuthModal'
import AccessGate from './components/AccessGate'
import GuestUpgradeBanner from './components/GuestUpgradeBanner'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { useAuth } from './context/useAuth'
import { SavedPlacesProvider } from './context/SavedPlacesContext'
import { TravelModeProvider } from './context/TravelModeContext'
import { useTravelMode } from './context/useTravelMode'
import { UserLocationProvider } from './context/UserLocationContext'
import { useUserLocation } from './context/useUserLocation'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import PlaceDetailPage from './pages/PlaceDetailPage'
import MapPage from './pages/MapPage'
import TripPlannerPage from './pages/TripPlannerPage'
import AIGuidePage from './pages/AIGuidePage'
import SavedPlacesPage from './pages/SavedPlacesPage'
import FestivalCalendarPage from './pages/FestivalCalendarPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import WelcomePage from './pages/WelcomePage'
import StateLandingPage from './pages/StateLandingPage'
import { allDatasetPlaces } from './data/tourismData'
import { openGoogleMapsDirections } from './utils/googleMaps'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function getRouteFromLocation() {
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
    !['top', 'destinations', 'overview', 'nearby', 'features', 'how-it-works', 'about', 'ask'].includes(hash.slice(1))
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

  if (cleanPath === '/welcome') return { route: '/welcome', id: null }
  if (cleanPath === '/login') return { route: '/login', id: null }
  if (cleanPath === '/signup') return { route: '/signup', id: null }
  if (cleanPath === '/explore') return { route: '/explore', id: null }
  if (cleanPath.startsWith('/explore/')) {
    const id = cleanPath.slice('/explore/'.length)
    return { route: '/explore/:id', id }
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

  return { route: '/', id: null }
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

  // Auth pages have dedicated centered glassmorphic cards without Navbar/Footer
  if (currentRoute.route === '/welcome') {
    return <WelcomePage onNavigate={navigateTo} />
  }

  if (currentRoute.route === '/login') {
    return <LoginPage onNavigate={navigateTo} />
  }

  if (currentRoute.route === '/signup') {
    return <SignupPage onNavigate={navigateTo} />
  }

  const routeKey = currentRoute.route === '/explore/:id' ? `place-${currentRoute.id}` : currentRoute.route

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
        <ScrollProgressBar />
        <GuestUpgradeBanner />
        <Navbar
          currentRoute={currentRoute.route === '/explore/:id' ? `/explore/${currentRoute.id}` : currentRoute.route}
          onNavigate={navigateTo}
          allPlaces={allDatasetPlaces}
          onGetDirections={handleGetDirections}
        />
        <main className="main-content-area" id="main-content">
          <div key={routeKey} className="page-transition-wrap">
            {renderCurrentPage()}
          </div>
        </main>
        <Footer onNavigate={navigateTo} />
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
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
