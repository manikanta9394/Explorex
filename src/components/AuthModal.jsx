import { useState } from 'react'
import { CheckCircle2, Lock, Mail, Sparkles, User, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { Modal } from './PortalDialog'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onNavigate }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, signup, googleLogin, authPromptMessage } = useAuth()

  const [prevProps, setPrevProps] = useState({ isOpen, initialMode })
  if (prevProps.isOpen !== isOpen || prevProps.initialMode !== initialMode) {
    setPrevProps({ isOpen, initialMode })
    if (isOpen) {
      setMode(initialMode)
      setError('')
      setSuccess('')
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name')
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'login') {
        const userObj = await login(email, password)
        setSuccess(`Welcome back, ${userObj.name}!`)
      } else {
        const userObj = await signup(name, email, password, password)
        setSuccess(`Account created! Welcome to Explorex, ${userObj.name}!`)
      }

      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setSubmitting(true)
    setError('')
    try {
      const userObj = await googleLogin()
      setSuccess(`Signed in with Google! Welcome, ${userObj.name}!`)
      setTimeout(() => {
        onClose()
      }, 900)
    } catch (err) {
      setError(err.message || 'Google sign in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="auth-modal-overlay"
      contentClassName="auth-modal-card"
      maxWidth="460px"
      ariaLabel={mode === 'login' ? 'Log in to Explorex' : 'Create Free Account'}
      raw
    >
      <button className="modal-close-round" onClick={onClose} aria-label="Close authentication modal">
        <X size={18} />
      </button>

      <div className="auth-modal-header">
          <span className="auth-eyebrow">
            <Sparkles size={14} /> Explorex Intelligence
          </span>
          <h2>{mode === 'login' ? 'Welcome back' : 'Start your journey'}</h2>
          <p>
            {authPromptMessage || (mode === 'login'
              ? 'Log in to access your saved places and travel history.'
              : 'Create your account to unlock personalized AI travel recommendations.')}
          </p>

          <div className="auth-segmented-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login')
                setError('')
              }}
            >
              Log In
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setMode('signup')
                setError('')
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {success ? (
          <div className="auth-success-box">
            <CheckCircle2 size={32} className="success-icon" />
            <h3>{success}</h3>
            <p>You are now logged in.</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error-banner">{error}</div>}

            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="auth-name">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="auth-password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? 'Please wait...' : mode === 'login' ? 'Log In to Explorex' : 'Create Free Account'}
            </button>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="auth-social-buttons">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={handleGoogle}
                disabled={submitting}
              >
                <span>Google</span>
              </button>
            </div>

            {onNavigate && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '13px',
                    color: 'var(--green, #1F3A2E)',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    onClose()
                    onNavigate(mode)
                  }}
                >
                  Open dedicated {mode === 'login' ? 'login' : 'signup'} page
                </button>
              </div>
            )}
          </form>
        )}
    </Modal>
  )
}
