import { useState, useMemo } from 'react'
import { ArrowLeft, Check, Compass, Eye, EyeOff, Lock, Mail, Sparkles, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import HyderabadDuskScene from '../components/HyderabadDuskScene'

export default function SignupPage({ onNavigate }) {
  const { signup, googleLogin, loading } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isShaking, setIsShaking] = useState(false)

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', feedback: '' }

    let score = 0
    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1

    // Any non-empty password starts at least as Weak
    if (score === 0) score = 1

    switch (score) {
      case 1:
        return {
          score: 1,
          label: 'Weak',
          color: '#E04838',
          feedback: 'Must be at least 8 chars; add mixed case or numbers',
        }
      case 2:
        return {
          score: 2,
          label: 'Fair',
          color: '#E08A20',
          feedback: 'Good start; try adding symbols like !@#$ for better security',
        }
      case 3:
        return {
          score: 3,
          label: 'Good',
          color: '#C9A227',
          feedback: 'Solid password; almost unbeatable',
        }
      case 4:
        return {
          score: 4,
          label: 'Strong',
          color: '#2D7D46',
          feedback: 'Excellent! Highly secure royal vault standard',
        }
      default:
        return { score: 1, label: 'Weak', color: '#E04838', feedback: 'Too short' }
    }
  }, [password])

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const nameError = touched.name && !name.trim() ? 'Full name is required' : null
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

  const confirmError =
    touched.confirmPassword &&
    (!confirmPassword
      ? 'Please confirm your password'
      : confirmPassword !== password
      ? 'Passwords do not match'
      : null)

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 600)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.')
      triggerShake()
      return
    }

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

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both passwords match.')
      triggerShake()
      return
    }

    try {
      const newUser = await signup(name, email, password, confirmPassword)
      const firstName = newUser?.name?.split(' ')[0] || name.split(' ')[0] || 'Explorer'
      setSuccessMessage(`Account created! Welcome to Explorex, ${firstName}...`)
      setTimeout(() => {
        onNavigate?.('home')
      }, 950)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create account. Please try again.')
      triggerShake()
    }
  }

  const handleGoogleSignUp = async () => {
    setErrorMessage(null)
    try {
      const newUser = await googleLogin()
      const firstName = newUser?.name?.split(' ')[0] || 'Explorer'
      setSuccessMessage(`Welcome, ${firstName}! Google sign-up complete...`)
      setTimeout(() => {
        onNavigate?.('home')
      }, 950)
    } catch (err) {
      setErrorMessage(err.message || 'Google sign-up failed. Please try again.')
      triggerShake()
    }
  }

  return (
    <div className="auth-page-shell split-screen-mode">
      <div className="auth-split-container">
        {/* Left Panel: Animated Hyderabad Dusk Scene */}
        <aside className="auth-split-left" aria-label="Explorex Story Scene">
          <HyderabadDuskScene onBrandClick={() => onNavigate?.('home')} />
        </aside>

        {/* Right Panel: Cream Background Form Container */}
        <main className="auth-split-right" aria-label="Create Account Form">
          <div className="auth-form-inner">
            {/* Top Navigation Row: Back Link & Continue as Guest */}
            <div className="auth-top-actions">
              <button
                type="button"
                className="auth-back-nav"
                onClick={() => onNavigate?.('home')}
                aria-label="Back to Explorex Home"
              >
                <ArrowLeft size={16} />
                <span>Back to Explorex</span>
              </button>

              <button
                type="button"
                className="auth-guest-link"
                onClick={() => onNavigate?.('home')}
                title="Browse Explorex without signing in"
              >
                <span>Continue as guest</span>
                <Compass size={14} />
              </button>
            </div>

            {/* Auth Glass / Cream Card */}
            <div className={`auth-glass-card ${isShaking ? 'auth-form-shake' : ''}`}>
              {/* Card Header & Brand */}
              <div className="auth-card-header">
                <div className="auth-logo-badge">
                  <div className="badge-compass-icon">
                    <Compass size={20} />
                  </div>
                  <span className="badge-brand-title">Explorex</span>
                </div>
                <h2>Begin Your Journey</h2>
                <p>Create your free account to curate wishlists and get tailored AI itineraries</p>
              </div>

              {/* Inline Error Banner */}
              {errorMessage && (
                <div className="auth-error-banner" role="alert">
                  <span className="error-dot" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Green Success Banner before Redirect */}
              {successMessage && (
                <div className="auth-success-banner" role="status">
                  <div className="success-icon-wrap">
                    <Check size={16} />
                  </div>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form with Floating Labels */}
              <form className="auth-page-form" onSubmit={handleSubmit} noValidate>
                {/* Floating Full Name Field */}
                <div className={`floating-field-group ${name ? 'has-value' : ''} ${nameError ? 'field-has-error' : ''}`}>
                  <div className="field-input-wrapper">
                    <User size={18} className="field-leading-icon" />
                    <input
                      id="signup-name"
                      type="text"
                      placeholder=" "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                      autoComplete="name"
                      required
                      disabled={loading || !!successMessage}
                      className="floating-input"
                    />
                    <label htmlFor="signup-name" className="floating-label">
                      Full Name
                    </label>
                  </div>
                  {nameError && <span className="auth-field-error">{nameError}</span>}
                </div>

                {/* Floating Email Field */}
                <div className={`floating-field-group ${email ? 'has-value' : ''} ${emailError ? 'field-has-error' : ''}`}>
                  <div className="field-input-wrapper">
                    <Mail size={18} className="field-leading-icon" />
                    <input
                      id="signup-email"
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
                    <label htmlFor="signup-email" className="floating-label">
                      Email Address
                    </label>
                  </div>
                  {emailError && <span className="auth-field-error">{emailError}</span>}
                </div>

                {/* Floating Password Field */}
                <div className={`floating-field-group ${password ? 'has-value' : ''} ${passwordError ? 'field-has-error' : ''}`}>
                  <div className="field-input-wrapper">
                    <Lock size={18} className="field-leading-icon" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      autoComplete="new-password"
                      required
                      disabled={loading || !!successMessage}
                      className="floating-input"
                    />
                    <label htmlFor="signup-password" className="floating-label">
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

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="password-strength-container" aria-live="polite">
                      <div className="strength-bars-track">
                        <div
                          className="strength-bar-unit"
                          style={{
                            background: passwordStrength.score >= 1 ? passwordStrength.color : '#E2E0D8',
                          }}
                        />
                        <div
                          className="strength-bar-unit"
                          style={{
                            background: passwordStrength.score >= 2 ? passwordStrength.color : '#E2E0D8',
                          }}
                        />
                        <div
                          className="strength-bar-unit"
                          style={{
                            background: passwordStrength.score >= 3 ? passwordStrength.color : '#E2E0D8',
                          }}
                        />
                        <div
                          className="strength-bar-unit"
                          style={{
                            background: passwordStrength.score >= 4 ? passwordStrength.color : '#E2E0D8',
                          }}
                        />
                      </div>
                      <div className="strength-meta-row">
                        <span className="strength-label" style={{ color: passwordStrength.color }}>
                          <ShieldCheck size={12} /> {passwordStrength.label} Password
                        </span>
                        <span className="strength-feedback">{passwordStrength.feedback}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating Confirm Password Field */}
                <div className={`floating-field-group ${confirmPassword ? 'has-value' : ''} ${confirmError ? 'field-has-error' : ''}`}>
                  <div className="field-input-wrapper">
                    <Lock size={18} className="field-leading-icon" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder=" "
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
                      autoComplete="new-password"
                      required
                      disabled={loading || !!successMessage}
                      className="floating-input"
                    />
                    <label htmlFor="signup-confirm-password" className="floating-label">
                      Confirm Password
                    </label>
                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmError && <span className="auth-field-error">{confirmError}</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`auth-primary-submit-btn ${successMessage ? 'btn-success-state' : ''}`}
                  disabled={loading || !!successMessage}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Creating Account...</span>
                    </>
                  ) : successMessage ? (
                    <>
                      <Check size={18} />
                      <span>Account Ready!</span>
                    </>
                  ) : (
                    <span>Create Your Free Account</span>
                  )}
                </button>
              </form>

              {/* Or Divider */}
              <div className="auth-or-divider">
                <span className="divider-line" />
                <span className="divider-text">or continue with</span>
                <span className="divider-line" />
              </div>

              {/* Google Sign-up */}
              <button
                type="button"
                className="auth-google-btn"
                onClick={handleGoogleSignUp}
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
                <span>Sign up with Google</span>
              </button>

              {/* Footer Switch Link */}
              <div className="auth-card-footer">
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={() => onNavigate?.('login')}
                  >
                    Log in here
                  </button>
                </p>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="auth-bottom-row">
              <span className="auth-bottom-tagline">
                <Sparkles size={13} /> Explorex · Telangana Travel Intelligence
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
