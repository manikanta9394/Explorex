import { useState } from 'react'
import { Check, Eye, EyeOff, Lock, Mail, Sparkles, User, X } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function GuestUpgradeModal({ isOpen, onClose }) {
  const { upgradeGuest, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState(user?.name === 'Guest Explorer' ? '' : user?.name || '')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  // Password strength calculation
  const getPasswordStrength = () => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }
  const strength = getPasswordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setSubmitting(true)
    try {
      await upgradeGuest(email.trim(), password, displayName.trim())
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1800)
    } catch (err) {
      setError(err.message || 'Failed to upgrade guest account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="guest-upgrade-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="guest-upgrade-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="upgrade-close-btn" onClick={onClose} aria-label="Close upgrade modal">
          <X size={18} />
        </button>

        {success ? (
          <div className="upgrade-success-view">
            <div className="success-icon-wrap">
              <Check size={32} />
            </div>
            <h3>Account Upgraded!</h3>
            <p>Your guest profile, saved places, and custom itineraries are now permanently saved to your account.</p>
          </div>
        ) : (
          <>
            <div className="upgrade-header">
              <span className="upgrade-badge">
                <Sparkles size={14} /> Keep Everything You Found
              </span>
              <h3>Upgrade to a Permanent Account</h3>
              <p>
                Link an email and password to preserve your saved places, custom plans, and AI discussions forever across all devices.
              </p>
            </div>

            {error && <div className="upgrade-error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="upgrade-form">
              <div className="upgrade-field-group">
                <label>Your Name</label>
                <div className="upgrade-input-wrap">
                  <User size={15} className="input-icon" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              <div className="upgrade-field-group">
                <label>Email Address</label>
                <div className="upgrade-input-wrap">
                  <Mail size={15} className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="upgrade-field-group">
                <label>Create Password</label>
                <div className="upgrade-input-wrap">
                  <Lock size={15} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="pw-strength-bar">
                    <div
                      className={`strength-seg ${strength >= 1 ? 'filled weak' : ''} ${strength >= 2 ? 'medium' : ''} ${strength >= 3 ? 'strong' : ''}`}
                    />
                    <div
                      className={`strength-seg ${strength >= 2 ? 'filled medium' : ''} ${strength >= 3 ? 'strong' : ''}`}
                    />
                    <div className={`strength-seg ${strength >= 3 ? 'filled strong' : ''}`} />
                    <div className={`strength-seg ${strength >= 4 ? 'filled very-strong' : ''}`} />
                    <span className="strength-label">
                      {strength <= 1 ? 'Weak' : strength <= 2 ? 'Fair' : strength <= 3 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div className="upgrade-actions">
                <button type="submit" className="upgrade-submit-btn" disabled={submitting}>
                  {submitting ? 'Upgrading Account...' : 'Upgrade & Keep My Data'}
                </button>
              </div>

              <p className="upgrade-guarantee-note">
                🔒 Your User ID and all database records remain untouched. Nothing is lost.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
