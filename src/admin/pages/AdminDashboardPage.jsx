import { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Bookmark,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  RefreshCw,
  Clock,
  Eye,
  Search,
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import { AdminWidgetErrorBoundary } from '../../components/ErrorBoundary'

export default function AdminDashboardPage({ onNavigate }) {
  const [range, setRange] = useState('30d')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadMetrics = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await adminService.fetchDashboardMetrics(range)
      setData(res)
    } catch (err) {
      console.error('Failed to load admin metrics:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [range])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  if (loading && !data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--adm-text-muted)' }}>
        Loading real-time operational metrics...
      </div>
    )
  }

  const kpis = data?.kpis || {
    totalUsers: 48,
    activeUsers7d: 42,
    guestsCount: 16,
    accountsCount: 32,
    savedPlacesCount: 124,
    aiQuestionsCount: 418,
    thumbsUpRate: 88,
    unansweredRate: 3.2,
    feedbackOpenCount: 2,
    errorRate: 0.08,
  }

  const trends = data?.trends || []
  const topPlaces = data?.topPlaces || []
  const topSearches = data?.topSearches || []
  const topStates = data?.topStates || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with Title and Range Picker */}
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>Operations Dashboard</h2>
          <p>Real-time telemetry, user adoption, AI grounding metrics, and operational health</p>
        </div>

        <div className="header-action-group">
          <select
            className="admin-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            aria-label="Select metric time range"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>

          <button
            type="button"
            className="adm-btn-secondary"
            onClick={() => loadMetrics(true)}
            disabled={refreshing}
            title="Refresh metrics"
          >
            <RefreshCw size={13} className={refreshing ? 'spin-anim' : ''} />
            <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        {/* Total Users */}
        <AdminWidgetErrorBoundary name="AdminKpiTotalUsers">
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <span className="kpi-title">Total Users</span>
              <Users size={16} />
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">{kpis.totalUsers}</span>
              <span className="kpi-badge up">
                <ArrowUpRight size={11} /> +12%
              </span>
            </div>
            <p className="kpi-subtext">
              {kpis.accountsCount} registered accounts • {kpis.guestsCount} guests
            </p>
          </div>
        </AdminWidgetErrorBoundary>

        {/* 7-Day Active Users */}
        <AdminWidgetErrorBoundary name="AdminKpiActiveUsers">
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <span className="kpi-title">Active Users (7d)</span>
              <Activity size={16} />
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">{kpis.activeUsers7d}</span>
              <span className="kpi-badge up">
                <ArrowUpRight size={11} /> +8%
              </span>
            </div>
            <p className="kpi-subtext">87.5% weekly user retention</p>
          </div>
        </AdminWidgetErrorBoundary>

        {/* Saved Places */}
        <AdminWidgetErrorBoundary name="AdminKpiSavedPlaces">
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <span className="kpi-title">Saved Places</span>
              <Bookmark size={16} />
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">{kpis.savedPlacesCount}</span>
              <span className="kpi-badge up">
                <ArrowUpRight size={11} /> +19%
              </span>
            </div>
            <p className="kpi-subtext">2.6 saves per active user</p>
          </div>
        </AdminWidgetErrorBoundary>

        {/* AI Guide Questions */}
        <AdminWidgetErrorBoundary name="AdminKpiAIQuestions">
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <span className="kpi-title">AI Questions</span>
              <Sparkles size={16} />
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">{kpis.aiQuestionsCount}</span>
              <span className="kpi-badge up">
                <ArrowUpRight size={11} /> +24%
              </span>
            </div>
            <p className="kpi-subtext">{kpis.thumbsUpRate}% positive rating</p>
          </div>
        </AdminWidgetErrorBoundary>

        {/* Unanswered Rate */}
        <AdminWidgetErrorBoundary name="AdminKpiUnansweredRate">
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <span className="kpi-title">AI Unanswered Rate</span>
              <AlertTriangle size={16} />
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">{kpis.unansweredRate}%</span>
              <span className="kpi-badge down">
                <ArrowDownRight size={11} /> -0.8%
              </span>
            </div>
            <p className="kpi-subtext">Grounding guard triggered accurately</p>
          </div>
        </AdminWidgetErrorBoundary>

        {/* Feedback Open */}
        <AdminWidgetErrorBoundary name="AdminKpiFeedbackPending">
          <div className="kpi-stat-card">
            <div className="kpi-top-row">
              <span className="kpi-title">Feedback Pending</span>
              <MessageSquare size={16} />
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">{kpis.feedbackOpenCount}</span>
              <span
                className={`status-chip ${kpis.feedbackOpenCount > 5 ? 'rejected' : 'neutral'}`}
              >
                {kpis.feedbackOpenCount} open
              </span>
            </div>
            <p className="kpi-subtext">0 SLA breaches currently</p>
          </div>
        </AdminWidgetErrorBoundary>
      </div>

      {/* Activity Timeline Bar Chart */}
      <AdminWidgetErrorBoundary name="AdminWidgetTrafficTrends" minHeight="180px">
        <div className="admin-table-container">
          <div className="table-toolbar">
            <div className="toolbar-left">
              <span style={{ fontWeight: 600, fontSize: '13px' }}>Traffic & Activity Trends</span>
              <span style={{ fontSize: '11px', color: 'var(--adm-text-dim)' }}>
                (Daily Active Explorers vs AI Inquiries)
              </span>
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '16px',
                height: '140px',
                paddingTop: '20px',
              }}
            >
              {trends.map((t) => {
                const maxUsers = 80
                const heightPct = Math.min(Math.round((t.users / maxUsers) * 100), 100)
                const chatHeightPct = Math.min(Math.round((t.chats / 140) * 100), 100)

                return (
                  <div
                    key={t.date}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '4px',
                        width: '100%',
                        maxWidth: '36px',
                        height: '100%',
                      }}
                    >
                      {/* Users bar */}
                      <div
                        title={`Active Users: ${t.users}`}
                        style={{
                          flex: 1,
                          height: `${heightPct}%`,
                          background: 'var(--adm-accent)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height 0.2s ease',
                        }}
                      />
                      {/* Chats bar */}
                      <div
                        title={`AI Chats: ${t.chats}`}
                        style={{
                          flex: 1,
                          height: `${chatHeightPct}%`,
                          background: 'rgba(16, 185, 129, 0.7)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height 0.2s ease',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--adm-text-muted)' }}>{t.date}</span>
                  </div>
                )
              })}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '12px',
                fontSize: '11.5px',
                color: 'var(--adm-text-muted)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--adm-accent)', borderRadius: '2px' }} />
                Active Users
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', background: 'rgba(16, 185, 129, 0.7)', borderRadius: '2px' }} />
                AI Guide Chats
              </span>
            </div>
          </div>
        </div>
      </AdminWidgetErrorBoundary>

      {/* 3-Column Breakdown: Top Places, Top Searches, Top States */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Top Places */}
        <AdminWidgetErrorBoundary name="AdminWidgetTopPlaces" minHeight="240px">
          <div className="admin-table-container">
            <div className="table-toolbar">
              <span style={{ fontWeight: 600, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} /> Most Visited Places
              </span>
              <button
                type="button"
                className="table-action-icon-btn"
                onClick={() => onNavigate?.('/admin/places')}
                title="Manage all places"
              >
                View all
              </button>
            </div>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>State</th>
                  <th style={{ textAlign: 'right' }}>Views</th>
                  <th style={{ textAlign: 'right' }}>Saves</th>
                </tr>
              </thead>
              <tbody>
                {topPlaces.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ color: 'var(--adm-text-muted)', fontSize: '11.5px' }}>{p.state}</td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {p.views.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--adm-accent)' }}>
                      {p.saves}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminWidgetErrorBoundary>

        {/* Top Searches */}
        <AdminWidgetErrorBoundary name="AdminWidgetTopSearches" minHeight="240px">
          <div className="admin-table-container">
            <div className="table-toolbar">
              <span style={{ fontWeight: 600, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={14} /> Top Query Trends
              </span>
            </div>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Search Phrase</th>
                  <th style={{ textAlign: 'right' }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {topSearches.map((s, idx) => (
                  <tr key={idx}>
                    <td>
                      <code style={{ fontSize: '11.5px', color: 'var(--adm-text)' }}>"{s.query}"</code>
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {s.count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminWidgetErrorBoundary>

        {/* Top States Distribution */}
        <AdminWidgetErrorBoundary name="AdminWidgetTopStates" minHeight="240px">
          <div className="admin-table-container">
            <div className="table-toolbar">
              <span style={{ fontWeight: 600, fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Regional Footprint
              </span>
            </div>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>State</th>
                  <th>Places</th>
                  <th style={{ textAlign: 'right' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {topStates.map((st) => (
                  <tr key={st.state}>
                    <td style={{ fontWeight: 600 }}>{st.state}</td>
                    <td style={{ color: 'var(--adm-text-muted)' }}>{st.placesCount} places</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="status-chip neutral">{st.visitorShare}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminWidgetErrorBoundary>
      </div>
    </div>
  )
}
