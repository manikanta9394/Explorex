import { useState, useEffect } from 'react'
import {
  Settings,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Save,
  Server,
  Zap,
} from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [actionSuccess, setActionSuccess] = useState('')

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    guest_access: true,
    reviews_enabled: true,
    ai_guide_enabled: true,
    emergency_sos: true,
  })

  // Maintenance Mode
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message: 'Explorex is currently upgrading national monument datasets. We will be back online shortly.',
  })

  // API Usages
  const [apiUsage, setApiUsage] = useState({
    openrouter_requests: 12450,
    openrouter_cost_usd: 1.84,
    wikimedia_p18_fetches: 4120,
    openrouteservice_quota_used: 34, // percentage
  })

  useEffect(() => {
    async function loadSettings() {
      setLoading(true)
      try {
        const res = await adminService.fetchSettings()
        if (res?.settings) {
          if (res.settings.feature_flags) setFeatureFlags(res.settings.feature_flags)
          if (res.settings.maintenance_mode) setMaintenance(res.settings.maintenance_mode)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSaveFlags = async (e) => {
    e.preventDefault()
    try {
      await adminService.updateSettings('feature_flags', featureFlags)
      localStorage.setItem('explorex_feature_flags', JSON.stringify(featureFlags))
      setActionSuccess('Feature flags updated and synchronized across all user sessions!')
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      alert(`Save failed: ${err.message}`)
    }
  }

  const handleSaveMaintenance = async (e) => {
    e.preventDefault()
    try {
      await adminService.updateSettings('maintenance_mode', maintenance)
      localStorage.setItem('explorex_maintenance_mode', JSON.stringify(maintenance))
      setActionSuccess(maintenance.enabled ? 'Maintenance mode ACTIVATED!' : 'Maintenance mode deactivated.')
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      alert(`Maintenance update failed: ${err.message}`)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>System Settings & Feature Flags</h2>
          <p>Control production features, configure emergency maintenance mode, and monitor API consumption</p>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            background: 'var(--adm-success-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            padding: '10px 14px',
            color: 'var(--adm-success)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle size={15} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Feature Flags Form */}
      <div className="admin-table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} /> Production Feature Switches
          </span>
        </div>

        <form onSubmit={handleSaveFlags} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--adm-bg)', borderRadius: '6px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Guest Access (Zero Forced Signup)</div>
              <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>
                Allows explorers to search, browse places, and plan itineraries without logging in
              </div>
            </div>
            <input
              type="checkbox"
              checked={featureFlags.guest_access}
              onChange={(e) => setFeatureFlags({ ...featureFlags, guest_access: e.target.checked })}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--adm-bg)', borderRadius: '6px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 600 }}>User Reviews & Moderation</div>
              <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>
                Permits signed-in explorers to post 1-5 star ratings and reviews on place detail pages
              </div>
            </div>
            <input
              type="checkbox"
              checked={featureFlags.reviews_enabled}
              onChange={(e) => setFeatureFlags({ ...featureFlags, reviews_enabled: e.target.checked })}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--adm-bg)', borderRadius: '6px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 600 }}>AI Travel Guide (RAG Chatbot)</div>
              <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>
                Enables verified AI Chat and "Refine with AI" itinerary planning shortcuts
              </div>
            </div>
            <input
              type="checkbox"
              checked={featureFlags.ai_guide_enabled}
              onChange={(e) => setFeatureFlags({ ...featureFlags, ai_guide_enabled: e.target.checked })}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--adm-bg)', borderRadius: '6px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Emergency & SOS Helpline Panel</div>
              <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>
                Surfaces tourist helplines, police, ambulance, and nearest emergency hospital contacts
              </div>
            </div>
            <input
              type="checkbox"
              checked={featureFlags.emergency_sos}
              onChange={(e) => setFeatureFlags({ ...featureFlags, emergency_sos: e.target.checked })}
            />
          </label>

          <div>
            <button type="submit" className="adm-btn-primary">
              <Save size={13} />
              <span>Save Feature Switches</span>
            </button>
          </div>
        </form>
      </div>

      {/* Maintenance Mode Form */}
      <div className="admin-table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={14} /> System Maintenance Mode
          </span>
        </div>

        <form onSubmit={handleSaveMaintenance} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={maintenance.enabled}
              onChange={(e) => setMaintenance({ ...maintenance, enabled: e.target.checked })}
            />
            <span>Enable System Maintenance Mode (Blocks non-admin visitors)</span>
          </label>

          <div className="adm-form-group">
            <label className="adm-label" htmlFor="maintenance-msg">Public Maintenance Notice</label>
            <textarea
              id="maintenance-msg"
              className="adm-textarea"
              rows={3}
              value={maintenance.message}
              onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
            />
          </div>

          <div>
            <button
              type="submit"
              className={maintenance.enabled ? 'adm-btn-danger' : 'adm-btn-secondary'}
            >
              {maintenance.enabled ? 'Confirm Maintenance Mode' : 'Update Message'}
            </button>
          </div>
        </form>
      </div>

      {/* API Cost & Consumption Telemetry */}
      <div className="admin-table-container">
        <div className="table-toolbar">
          <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={14} /> External API Quota & Usage Monitor
          </span>
        </div>

        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div className="kpi-stat-card">
            <span className="kpi-title">OpenRouter AI Invocations</span>
            <span className="kpi-number">{apiUsage.openrouter_requests.toLocaleString()}</span>
            <p className="kpi-subtext">Estimated Cost: ${apiUsage.openrouter_cost_usd} USD</p>
          </div>

          <div className="kpi-stat-card">
            <span className="kpi-title">Wikimedia P18 Fetches</span>
            <span className="kpi-number">{apiUsage.wikimedia_p18_fetches.toLocaleString()}</span>
            <p className="kpi-subtext">0 rate-limit incidents</p>
          </div>

          <div className="kpi-stat-card">
            <span className="kpi-title">ORS Geocoding Quota</span>
            <span className="kpi-number">{apiUsage.openrouteservice_quota_used}%</span>
            <p className="kpi-subtext">Cached locally in Redis / memory</p>
          </div>
        </div>
      </div>
    </div>
  )
}
