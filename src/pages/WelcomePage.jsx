import { useState } from 'react'
import {
  Compass,
  Sparkles,
  UserCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  Shield,
  MapPin,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function WelcomePage({ onNavigate }) {
  const { signInAsGuest, login, signup, googleLogin } = useAuth()

  // State: 'choice' | 'login' | 'signup'
  const [mode, setMode] = useState('choice')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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

  return (
    <div className="welcome-gate-shell">
      <div className="welcome-gate-container">
        {/* Brand Header */}
        <div className="welcome-brand-row">
          <div className="welcome-brand-mark">
            <Compass size={24} className="welcome-compass-icon" />
            <span className="brand-text">EXPLOREX</span>
          </div>
          <span className="brand-region-tag">Telangana &amp; Hyderabad Guide</span>
        </div>

        {/* Hero Section */}
        <div className="welcome-hero-card">
          <span className="welcome-eyebrow">
            <Sparkles size={14} /> Official Travel &amp; Heritage Companion
          </span>
          <h1>Plan Hyderabad the way locals do.</h1>
          <p className="welcome-subtitle">
            Explore 400 verified Nizami monuments, clustered day itineraries, live weather, and dataset-grounded AI guidance. Choose how you would like to proceed:
          </p>
        </div>

        {error && (
          <div className="welcome-error-box" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* STATE A: Three Choice Cards */}
        {mode === 'choice' && (
          <div className="welcome-choices-grid">
            {/* Card 1: Continue as Guest */}
            <div className="welcome-choice-card highlight-guest" onClick={handleContinueAsGuest}>
              <div className="choice-card-top">
                <div className="choice-icon-wrap guest">
                  <UserCheck size={22} />
                </div>
                <span className="choice-badge-popular">Fastest · 1 Click</span>
              </div>
              <h2>Continue as Guest</h2>
              <p>
                Explore freely right now. Your saved places and custom itineraries are stored in our database and can be upgraded anytime.
              </p>
              <button
                type="button"
                className="choice-action-btn primary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleContinueAsGuest()
                }}
                disabled={loading}
              >
                <span>{loading ? 'Starting Guest Session...' : 'Enter as Guest'}</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Card 2: Sign In */}
            <div className="welcome-choice-card" onClick={() => setMode('login')}>
              <div className="choice-card-top">
                <div className="choice-icon-wrap login">
                  <LogIn size={22} />
                </div>
                <span className="choice-badge-sec">Returning Traveler</span>
              </div>
              <h2>Sign In</h2>
              <p>
                Access your existing saved places, customized itineraries, and synced travel preferences across all devices.
              </p>
              <button
                type="button"
                className="choice-action-btn secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  setMode('login')
                }}
              >
                <span>Sign In to Account</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Card 3: Create Account */}
            <div className="welcome-choice-card" onClick={() => setMode('signup')}>
              <div className="choice-card-top">
                <div className="choice-icon-wrap signup">
                  <UserPlus size={22} />
                </div>
                <span className="choice-badge-sec">Permanent Profile</span>
              </div>
              <h2>Create Account</h2>
              <p>
                Sign up with your email to create a permanent travel profile with unlimited wishlist saves and cloud-backed plans.
              </p>
              <button
                type="button"
                className="choice-action-btn secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  setMode('signup')
                }}
              >
                <span>Create Free Account</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STATE B: Sign In Form */}
        {mode === 'login' && (
          <div className="welcome-form-card">
            <div className="form-card-header">
              <button type="button" className="form-back-btn" onClick={() => setMode('choice')}>
                ← Back to choices
              </button>
              <h2>Sign In to Explorex</h2>
              <p>Enter your credentials to access your trips and saved destinations.</p>
            </div>

            <form onSubmit={handleSignIn} className="welcome-interactive-form">
              <div className="form-field-row">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-field-row">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
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

        {/* STATE C: Create Account Form */}
        {mode === 'signup' && (
          <div className="welcome-form-card">
            <div className="form-card-header">
              <button type="button" className="form-back-btn" onClick={() => setMode('choice')}>
                ← Back to choices
              </button>
              <h2>Create Your Account</h2>
              <p>Join Explorex for permanent saved places, custom plans, and synced AI chat.</p>
            </div>

            <form onSubmit={handleSignUp} className="welcome-interactive-form">
              <div className="form-field-row">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sravan Kumar"
                  required
                />
              </div>

              <div className="form-field-row">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-field-row">
                <label>Password (Min 8 characters)</label>
                <div className="password-input-wrapper">
                  <input
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
                <label>Confirm Password</label>
                <input
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

        {/* Security & Verification Guarantee */}
        <div className="welcome-trust-strip">
          <div className="trust-item">
            <Shield size={14} />
            <span>Row-Level Security Guaranteed</span>
          </div>
          <div className="trust-item">
            <MapPin size={14} />
            <span>400 Verified Telangana Landmarks</span>
          </div>
          <div className="trust-item">
            <Check size={14} />
            <span>Seamless Guest to Account Upgrade</span>
          </div>
        </div>
      </div>
    </div>
  )
}
