import { useState } from 'react'
import { ArrowLeft, Check, Compass, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import IncredibleIndiaBackground from '../components/IncredibleIndiaBackground'

export default function LoginPage({ onNavigate }) {
  const { login, googleLogin, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isShaking, setIsShaking] = useState(false)

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailError =
    touched.email &&
    (!email.trim()
      ? 'Email is required'
      : !emailRegex.test(email.trim())
      ? 'Please enter a valid email address (e.g., traveler@explorex.in)'
      : null)

  const passwordError =
    touched.password &&
    (!password
      ? 'Password is required'
      : password.length < 8
      ? 'Password must be at least 8 characters'
      : null)

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 600)
  }

  const navigateTo = (target) => {
    if (onNavigate) {
      onNavigate(target)
    } else {
      window.location.hash = `#/${target.replace(/^\//, '')}`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setErrorMessage(null)

    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      triggerShake()
      return
    }

    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      triggerShake()
      return
    }

    try {
      const loggedInUser = await login(email.trim(), password)
      const firstName = loggedInUser?.name?.split(' ')[0] || 'Explorer'
      setSuccessMessage(`Welcome back, ${firstName}! Redirecting to Explorex...`)
      setTimeout(() => {
        navigateTo('home')
      }, 700)
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password. Please check your credentials.')
      triggerShake()
    }
  }

  const handleGoogleSignIn = async () => {
    setErrorMessage(null)
    try {
      const loggedInUser = await googleLogin()
      const firstName = loggedInUser?.name?.split(' ')[0] || 'Explorer'
      setSuccessMessage(`Welcome, ${firstName}! Redirecting with Google...`)
      setTimeout(() => {
        navigateTo('home')
      }, 700)
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.')
      triggerShake()
    }
  }

  return (
    <IncredibleIndiaBackground showControls={false}>
      <div className="welcome-glass-stage">
        <main className={`welcome-glass-card auth-themed-glass-card ${isShaking ? 'auth-form-shake' : ''}`} aria-label="Sign In to Explorex">
          {/* Top Navigation Row: Back Link & Continue as Guest */}
          <div className="auth-top-actions stagger-1">
            <button
              type="button"
              className="auth-back-nav"
              onClick={() => navigateTo('welcome')}
              aria-label="Back to welcome screen"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button
              type="button"
              className="auth-guest-link"
              onClick={() => navigateTo('home')}
              title="Browse Explorex without signing in"
            >
              <span>Explore as guest</span>
              <Compass size={14} />
            </button>
          </div>

          {/* Brand Logo & Header */}
          <div className="welcome-glass-brand stagger-2">
            <div className="brand-logo-gem" aria-hidden="true">
              <Compass size={28} className="brand-compass-spin" />
              <Sparkles size={14} className="brand-sparkle-ping" />
            </div>
            <div className="brand-copy">
              <span className="brand-super-title">WELCOME BACK</span>
              <h1 className="brand-name-title">Sign In to Explorex</h1>
            </div>
            <p className="welcome-promise-statement" style={{ margin: '4px 0 0' }}>
              Access your synced itineraries, wishlist places, and AI guide.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="welcome-error-box glass-error stagger-3" role="alert">
              <span className="error-dot" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="auth-success-banner stagger-3" role="status">
              <div className="success-icon-wrap">
                <Check size={16} />
              </div>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form className="auth-page-form stagger-4" onSubmit={handleSubmit} noValidate>
            <div className={`floating-field-group ${email ? 'has-value' : ''} ${emailError ? 'field-has-error' : ''}`}>
              <div className="field-input-wrapper">
                <Mail size={18} className="field-leading-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  autoComplete="email"
                  required
                  disabled={loading || !!successMessage}
                  className="floating-input"
                />
                <label htmlFor="login-email" className="floating-label">
                  Email Address
                </label>
              </div>
              {emailError && <span className="auth-field-error">{emailError}</span>}
            </div>

            <div className={`floating-field-group ${password ? 'has-value' : ''} ${passwordError ? 'field-has-error' : ''}`}>
              <div className="field-input-wrapper">
                <Lock size={18} className="field-leading-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  autoComplete="current-password"
                  required
                  disabled={loading || !!successMessage}
                  className="floating-input"
                />
                <label htmlFor="login-password" className="floating-label">
                  Password (min 8 chars)
                </label>
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <span className="auth-field-error">{passwordError}</span>}
            </div>

            <button
              type="submit"
              className={`welcome-submit-btn auth-primary-submit-btn ${successMessage ? 'btn-success-state' : ''}`}
              disabled={loading || !!successMessage}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  <span>Signing in...</span>
                </>
              ) : successMessage ? (
                <>
                  <Check size={18} />
                  <span>Signed In!</span>
                </>
              ) : (
                <span>Sign in to Explorex</span>
              )}
            </button>
          </form>

          {/* Or Continue With */}
          <div className="auth-or-divider stagger-5">
            <span className="divider-line" />
            <span className="divider-text">or continue with</span>
            <span className="divider-line" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="welcome-google-btn auth-google-btn stagger-5"
            onClick={handleGoogleSignIn}
            disabled={loading || !!successMessage}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Switch */}
          <footer className="welcome-glass-footer stagger-5" style={{ marginTop: '20px' }}>
            <span>Don't have an account?</span>
            <button
              type="button"
              className="link-switch-btn"
              onClick={() => navigateTo('signup')}
            >
              Sign up for free
            </button>
          </footer>
        </main>
      </div>
    </IncredibleIndiaBackground>
  )
}
