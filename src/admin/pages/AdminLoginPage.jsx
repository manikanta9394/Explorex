import { useState } from 'react'
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { adminService } from '../../services/adminService'

export default function AdminLoginPage({ onNavigate }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('admin@explorex.in')
  const [password, setPassword] = useState('ExplorexAdmin2026!')
  const [totpCode, setTotpCode] = useState('123456')
  const [step, setStep] = useState('credentials') // 'credentials' | 'totp'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Test credential verification
      const res = await signIn(email, password)
      if (res?.error) {
        throw new Error(res.error.message || 'Invalid administrator credentials')
      }

      // Check role
      const userRole = res?.user?.role || res?.user?.user_metadata?.role || (email.includes('admin') ? 'admin' : 'user')
      if (userRole !== 'admin') {
        throw new Error('Access Denied: This account does not have administrator privileges.')
      }

      // Progress to TOTP step
      setStep('totp')
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleTotpSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!totpCode || totpCode.trim().length < 6) {
        throw new Error('Please enter a valid 6-digit TOTP verification code.')
      }

      const totpRes = await adminService.verifyTOTP(totpCode.trim())
      if (totpRes && totpRes.valid === false) {
        throw new Error('Invalid TOTP token. Please check your authenticator app.')
      }

      setSuccess('2FA Verification successful. Redirecting to Admin Operations...')
      window.location.hash = '#/admin'
      onNavigate?.('/admin')
    } catch (err) {
      setError(err.message || 'TOTP verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemoAdminLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await signIn('admin@explorex.in', 'ExplorexAdmin2026!')
      // Set emulator session with admin role
      const adminSession = {
        access_token: 'mock_admin_token',
        user: {
          id: 'a0000000-0000-0000-0000-000000000001',
          email: 'admin@explorex.in',
          role: 'admin',
          display_name: 'Explorex Head Curator',
          totp_enabled: true,
        },
      }
      localStorage.setItem('sb_emu_session', JSON.stringify(adminSession))
      setSuccess('Admin Session Initialized!')
      window.location.hash = '#/admin'
      onNavigate?.('/admin')
    } catch (err) {
      setError(err.message || 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="admin-app-root"
      data-admin-theme="slate-dark"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: '#090D16',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#111827',
          border: '1px solid #2D3748',
          borderRadius: '10px',
          padding: '32px 28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#3B82F6',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              marginBottom: '12px',
            }}
          >
            E
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: '#F9FAFB' }}>
            Explorex Operations
          </h1>
          <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
            {step === 'credentials'
              ? 'Enter verified administrative credentials to continue'
              : 'Enter 6-digit TOTP code from your authenticator device'}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '10px 12px',
              color: '#EF4444',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '6px',
              padding: '10px 12px',
              color: '#10B981',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="adm-form-group">
              <label className="adm-label" htmlFor="admin-email">Admin Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={14} style={{ position: 'absolute', left: '10px', color: '#6B7280' }} />
                <input
                  id="admin-email"
                  type="email"
                  className="adm-input"
                  style={{ width: '100%', paddingLeft: '32px' }}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@explorex.in"
                />
              </div>
            </div>

            <div className="adm-form-group">
              <label className="adm-label" htmlFor="admin-pwd">Administrator Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={14} style={{ position: 'absolute', left: '10px', color: '#6B7280' }} />
                <input
                  id="admin-pwd"
                  type="password"
                  className="adm-input"
                  style={{ width: '100%', paddingLeft: '32px' }}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="adm-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '9px 14px', marginTop: '4px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Continue to 2FA Verification'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="adm-form-group">
              <label className="adm-label" htmlFor="admin-totp">Authenticator Security Token (TOTP)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <KeyRound size={14} style={{ position: 'absolute', left: '10px', color: '#6B7280' }} />
                <input
                  id="admin-totp"
                  type="text"
                  maxLength={6}
                  className="adm-input"
                  style={{
                    width: '100%',
                    paddingLeft: '32px',
                    letterSpacing: '4px',
                    fontFamily: 'monospace',
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                  required
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  autoFocus
                />
              </div>
              <span style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                Default demo passkey: <code>123456</code>
              </span>
            </div>

            <button
              type="submit"
              className="adm-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '9px 14px' }}
              disabled={loading}
            >
              <ShieldCheck size={14} />
              {loading ? 'Verifying...' : 'Verify Token & Access Console'}
            </button>

            <button
              type="button"
              className="adm-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setStep('credentials')}
            >
              Back to Credentials
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #2D3748', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="adm-btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '11.5px', background: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.25)' }}
            onClick={handleQuickDemoAdminLogin}
            disabled={loading}
          >
            ⚡ Quick Demo Admin Login
          </button>

          <button
            type="button"
            className="adm-btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '11.5px' }}
            onClick={() => onNavigate?.('/')}
          >
            <ArrowLeft size={13} />
            Return to User Application
          </button>
        </div>
      </div>
    </div>
  )
}
