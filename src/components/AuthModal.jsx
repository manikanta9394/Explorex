import { useEffect, useState } from 'react'
import { CheckCircle2, Lock, Mail, Sparkles, User, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, signup } = useAuth()

  const [prevProps, setPrevProps] = useState({ isOpen, initialMode })
  if (prevProps.isOpen !== isOpen || prevProps.initialMode !== initialMode) {
    setPrevProps({ isOpen, initialMode })
    if (isOpen) {
      setMode(initialMode)
      setError('')
      setSuccess('')
    }
  }

  // ESC key listener
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long')
      return
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name')
      return
    }

    if (mode === 'login') {
      const userObj = login(email, password)
      setSuccess(`Welcome back, ${userObj.name}!`)
    } else {
      const userObj = signup(name, email, password)
      setSuccess(`Account created! Welcome to TourMate, ${userObj.name}!`)
    }

    setTimeout(() => {
      onClose()
    }, 1200)
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-round" onClick={onClose} aria-label="Close authentication modal">
          <X size={18} />
        </button>

        <div className="auth-modal-header">
          <span className="auth-eyebrow">
            <Sparkles size={14} /> TourMate AI Account
          </span>
          <h2>{mode === 'login' ? 'Welcome back' : 'Start your journey'}</h2>
          <p>{mode === 'login' ? 'Log in to access your saved places and travel history.' : 'Create your account to unlock personalized AI travel recommendations.'}</p>

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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              {mode === 'login' ? 'Log In to TourMate' : 'Create Free Account'}
            </button>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="auth-social-buttons">
              <button
                type="button"
                className="social-btn google-btn"
                onClick={() => {
                  login('demo.user@gmail.com', 'demo123')
                  setSuccess('Logged in with Google!')
                  setTimeout(onClose, 1000)
                }}
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                className="social-btn apple-btn"
                onClick={() => {
                  login('apple.explorer@icloud.com', 'demo123')
                  setSuccess('Logged in with Apple!')
                  setTimeout(onClose, 1000)
                }}
              >
                <span>Apple</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
