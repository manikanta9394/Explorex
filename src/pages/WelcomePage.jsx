import { useState, useEffect } from 'react'
import {
  Compass,
  Sparkles,
  UserCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  IndianRupee,
  BookmarkCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'

const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0'
const COMMIT_HASH = typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'dev'
import IncredibleIndiaBackground, { getTimeTheme } from '../components/IncredibleIndiaBackground'
import LanguageSelector from '../components/LanguageSelector'

const ROTATING_GREETINGS = [
  { text: 'Namaste', sub: 'Hindi · Welcome', lang: 'hi' },
  { text: 'నమస్కారం', sub: 'Telugu · Namaskāram', lang: 'te' },
  { text: 'வணக்கம்', sub: 'Tamil · Vaṇakkam', lang: 'ta' },
  { text: 'नमस्कार', sub: 'Marathi · Namaskār', lang: 'mr' },
  { text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', sub: 'Punjabi · Sat Srī Akāl', lang: 'pa' },
]

export default function WelcomePage({ onNavigate }) {
  const { signInAsGuest, login, signup, googleLogin } = useAuth()

  // State: 'choice' | 'login' | 'signup'
  const [mode, setMode] = useState('choice')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Rotating greeting index
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [timeTheme, setTimeTheme] = useState(getTimeTheme)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Rotate greeting every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % ROTATING_GREETINGS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Keep time theme updated
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTheme(getTimeTheme())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Determine return-to URL if user was redirected from a protected route
  const getRedirectTarget = () => {
    try {
      const hash = window.location.hash || ''
      const search = window.location.search || (hash.includes('?') ? hash.split('?')[1] : '')
      const params = new URLSearchParams(search)
      const redirect = params.get('redirect')
      if (redirect && redirect !== '/welcome' && redirect !== 'welcome') {
        return redirect
      }
    } catch {}
    return '/'
  }

  const handleDestinationForward = () => {
    const target = getRedirectTarget()
    if (onNavigate) {
      onNavigate(target)
    } else {
      const base = import.meta.env.BASE_URL || '/Explorex/'
      const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
      try {
        window.history.pushState(null, '', `${normalizedBase}${target.startsWith('/') ? target : `/${target}`}`)
      } catch {
        window.location.hash = `#${target}`
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const navigateTo = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.location.hash = `#/${path.replace(/^\//, '')}`
    }
  }

  // 1. Continue as Guest
  const handleContinueAsGuest = async () => {
    setError(null)
    setLoading(true)
    try {
      await signInAsGuest()
      handleDestinationForward()
    } catch (err) {
      setError(err.message || 'Failed to start guest session.')
    } finally {
      setLoading(false)
    }
  }

  // 2. Sign In
  const handleSignIn = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
      handleDestinationForward()
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  // 3. Create Account
  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    setLoading(true)
    try {
      await signup(name.trim(), email.trim(), password, confirmPassword)
      handleDestinationForward()
    } catch (err) {
      setError(err.message || 'Failed to create account.')
    } finally {
      setLoading(false)
    }
  }

  // 4. Google Auth
  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      await googleLogin()
      handleDestinationForward()
    } catch (err) {
      setError(err.message || 'Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  const activeGreeting = ROTATING_GREETINGS[greetingIndex]

  return (
    <IncredibleIndiaBackground showControls={true}>
      <div className="welcome-glass-stage">
        <main className="welcome-glass-card" aria-label="Welcome to Explorex - Incredible India">
          {/* Top Bar: Time-of-Day Indicator & Language Switcher */}
          <div className="welcome-glass-topbar stagger-1">
            <div className="welcome-time-badge" title="Ambient sky dynamically matches Indian standard time">
              <span className="time-badge-icon" aria-hidden="true">{timeTheme.icon}</span>
              <span className="time-badge-label">{timeTheme.label}</span>
            </div>
            <div className="welcome-glass-lang-wrap">
              <LanguageSelector />
            </div>
          </div>

          {/* Brand Mark with compass icon */}
          <div className="welcome-glass-brand stagger-2">
            <div className="brand-logo-gem" aria-hidden="true">
              <Compass size={28} className="brand-compass-spin" />
              <Sparkles size={14} className="brand-sparkle-ping" />
            </div>
            <div className="brand-copy">
              <span className="brand-super-title">INCREDIBLE INDIA</span>
              <h1 className="brand-name-title">EXPLOREX</h1>
            </div>
          </div>

          {/* Rotating Cultural Greeting */}
          <div className="welcome-greeting-block stagger-3">
            <div className="rotating-greeting-pill" aria-live="polite">
              <span className="greeting-main-text">{activeGreeting.text}</span>
              <span className="greeting-sub-badge">{activeGreeting.sub}</span>
            </div>
            {/* One-Line Promise */}
            <p className="welcome-promise-statement">
              India’s cultural travel intelligence — curated heritage, live pricing, and verified routes.
            </p>
          </div>

          {/* Three Benefit Chips */}
          <div className="welcome-benefit-chips-row stagger-4" aria-label="Key Explorex Benefits">
            <span className="welcome-benefit-chip" title="Real-time estimated entry & tour costs in Indian Rupees">
              <IndianRupee size={13} className="chip-icon" aria-hidden="true" />
              <span>Plan trips in ₹</span>
            </span>
            <span className="welcome-benefit-chip" title="AI travel assistant grounded in curated Indian heritage data">
              <Sparkles size={13} className="chip-icon" aria-hidden="true" />
              <span>AI guide</span>
            </span>
            <span className="welcome-benefit-chip" title="Access your saved monuments even without cell service">
              <BookmarkCheck size={13} className="chip-icon" aria-hidden="true" />
              <span>Offline saved places</span>
            </span>
          </div>

          {error && (
            <div className="welcome-error-box glass-error" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* INTERACTION AREA */}
          <div className="welcome-choices-area stagger-5">
            {/* MODE 1: Choice View (Default) */}
            {mode === 'choice' && (
              <div className="welcome-choice-action-panel">
                {/* Primary Choices: Sign in & Create account */}
                <div className="welcome-primary-choice-row">
                  <button
                    type="button"
                    className="welcome-choice-btn btn-signin"
                    onClick={() => setMode('login')}
                  >
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    className="welcome-choice-btn btn-create"
                    onClick={() => setMode('signup')}
                  >
                    <UserPlus size={16} />
                    <span>Create Account</span>
                  </button>
                </div>

                {/* Visually Secondary Choice: Continue as guest (Prominent & easy to find) */}
                {/* Preserves .welcome-choice-card.highlight-guest and button.choice-action-btn for E2E tests */}
                <div className="welcome-choice-card highlight-guest welcome-guest-glass-card">
                  <button
                    type="button"
                    className="choice-action-btn guest-action-btn"
                    onClick={handleContinueAsGuest}
                    disabled={loading}
                    aria-label="Continue as guest explorer"
                  >
                    <UserCheck size={16} />
                    <span className="guest-action-label">
                      {loading ? 'Starting Guest Session...' : 'Continue as Guest'}
                    </span>
                    <ArrowRight size={14} className="guest-arrow-icon" />
                  </button>
                  <span className="guest-reassurance">Instant 1-click access · No password required</span>
                </div>
              </div>
            )}

            {/* MODE 2: Sign In Inline Form */}
            {mode === 'login' && (
              <div className="welcome-glass-form-card">
                <div className="glass-form-header">
                  <button
                    type="button"
                    className="glass-form-back-btn"
                    onClick={() => setMode('choice')}
                  >
                    ← Back to choices
                  </button>
                  <h2>Sign In to Explorex</h2>
                  <p>Welcome back! Enter your credentials to access your trips.</p>
                </div>

                <form onSubmit={handleSignIn} className="welcome-interactive-form">
                  <div className="form-field-row">
                    <label htmlFor="welcome-email">Email Address</label>
                    <input
                      id="welcome-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="form-field-row">
                    <label htmlFor="welcome-password">Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="welcome-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="welcome-submit-btn" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      className="welcome-google-btn"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="16" height="16" />
                      <span>Continue with Google</span>
                    </button>
                  </div>

                  <div className="form-card-footer">
                    <span>Don't have an account yet?</span>
                    <button type="button" className="link-switch-btn" onClick={() => setMode('signup')}>
                      Create account
                    </button>
                    <span className="dot-sep">·</span>
                    <button type="button" className="link-switch-btn" onClick={handleContinueAsGuest}>
                      Continue as guest
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MODE 3: Create Account Inline Form */}
            {mode === 'signup' && (
              <div className="welcome-glass-form-card">
                <div className="glass-form-header">
                  <button
                    type="button"
                    className="glass-form-back-btn"
                    onClick={() => setMode('choice')}
                  >
                    ← Back to choices
                  </button>
                  <h2>Create Your Account</h2>
                  <p>Join Explorex for permanent saved places and cloud-backed plans.</p>
                </div>

                <form onSubmit={handleSignUp} className="welcome-interactive-form">
                  <div className="form-field-row">
                    <label htmlFor="signup-name">Full Name</label>
                    <input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sravan Kumar"
                      required
                    />
                  </div>

                  <div className="form-field-row">
                    <label htmlFor="signup-email">Email Address</label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="form-field-row">
                    <label htmlFor="signup-password">Password (Min 8 characters)</label>
                    <div className="password-input-wrapper">
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-field-row">
                    <label htmlFor="signup-confirm-password">Confirm Password</label>
                    <input
                      id="signup-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                    />
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="welcome-submit-btn" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    <button
                      type="button"
                      className="welcome-google-btn"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="16" height="16" />
                      <span>Sign up with Google</span>
                    </button>
                  </div>

                  <div className="form-card-footer">
                    <span>Already have an account?</span>
                    <button type="button" className="link-switch-btn" onClick={() => setMode('login')}>
                      Sign in
                    </button>
                    <span className="dot-sep">·</span>
                    <button type="button" className="link-switch-btn" onClick={handleContinueAsGuest}>
                      Continue as guest
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer: Privacy, Terms, and Direct Page Switchers */}
          <footer className="welcome-glass-footer stagger-5">
            <a
              href="#/privacy"
              className="welcome-footer-link"
              onClick={(e) => {
                e.preventDefault()
                navigateTo('privacy')
              }}
            >
              Privacy Policy
            </a>
            <span className="footer-dot-divider" aria-hidden="true">·</span>
            <a
              href="#/terms"
              className="welcome-footer-link"
              onClick={(e) => {
                e.preventDefault()
                navigateTo('terms')
              }}
            >
              Terms of Service
            </a>
            <span className="footer-dot-divider" aria-hidden="true">·</span>
            <span className="welcome-build-stamp" title={`Commit: ${COMMIT_HASH}`}>v{APP_VERSION} (#{COMMIT_HASH})</span>
          </footer>
        </main>
      </div>
    </IncredibleIndiaBackground>
  )
}
