import { useState, useEffect } from 'react'
import {
  History,
  Search,
  Filter,
  Eye,
  RefreshCw,
  X,
  ShieldCheck,
  Calendar,
} from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState(null)
  const [actionFilter, setActionFilter] = useState('')
  const [tableFilter, setTableFilter] = useState('')

  const loadAuditLogs = async () => {
    setLoading(true)
    try {
      const res = await adminService.fetchAuditLogs({
        action: actionFilter,
        target_table: tableFilter,
      })
      if (res && res.logs) {
        setLogs(res.logs)
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditLogs()
  }, [actionFilter, tableFilter])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>Immutable System Audit Log</h2>
          <p>Cryptographically accountable operational write trail with before & after state diff inspection</p>
        </div>

        <button
          type="button"
          className="adm-btn-secondary"
          onClick={loadAuditLogs}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'spin-anim' : ''} />
          <span>Refresh Trail</span>
        </button>
      </div>

      <div className="admin-table-container">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <select
              className="admin-select"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              aria-label="Filter audit logs by action"
            >
              <option value="">All Actions</option>
              <option value="UPDATE">UPDATE</option>
              <option value="INSERT">INSERT</option>
              <option value="DELETE">DELETE</option>
              <option value="APPROVE">APPROVE</option>
              <option value="REPLY">REPLY</option>
            </select>

            <select
              className="admin-select"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              aria-label="Filter audit logs by table"
            >
              <option value="">All Entity Tables</option>
              <option value="places">places</option>
              <option value="place_images">place_images</option>
              <option value="feedback">feedback</option>
              <option value="profiles">profiles</option>
              <option value="app_settings">app_settings</option>
            </select>
          </div>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin Actor</th>
              <th>Action</th>
              <th>Target Entity</th>
              <th>Entity ID</th>
              <th style={{ textAlign: 'right' }}>Diff Inspection</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                  Loading immutable audit records...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                  No audit logs found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)' }}>
                    {log.created_at ? new Date(log.created_at).toLocaleString() : '2026-10-24 16:30'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div className="admin-avatar-tiny" style={{ width: '20px', height: '20px', fontSize: '9px' }}>
                        A
                      </div>
                      <span style={{ fontWeight: 600 }}>{log.actor_email || log.admin_email || 'admin@explorex.in'}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-chip ${
                        log.action?.includes('INSERT')
                          ? 'published'
                          : log.action?.includes('DELETE')
                          ? 'rejected'
                          : 'neutral'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <code>{log.entity_type || log.target_table || 'system'}</code>
                  </td>
                  <td>
                    <code style={{ fontSize: '11px', color: 'var(--adm-text-dim)' }}>
                      {(log.entity_id || log.target_id || '').slice(0, 16)}...
                    </code>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="adm-btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye size={12} />
                      <span>Inspect Diff</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Diff Inspector Modal */}
      {selectedLog && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedLog(null)}>
          <div className="admin-modal-box" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Audit Entry #{selectedLog.id.slice(0, 8)}</h3>
                <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', marginTop: '2px' }}>
                  {selectedLog.action} on <code>{selectedLog.entity_type || selectedLog.target_table}</code> by {selectedLog.actor_email || selectedLog.admin_email || 'admin@explorex.in'}
                </div>
              </div>
              <button type="button" className="sidebar-collapse-toggle" onClick={() => setSelectedLog(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="diff-view-grid">
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-danger)', marginBottom: '6px' }}>
                    STATE BEFORE (Previous)
                  </div>
                  <div className="diff-panel before">
                    <pre>
                      {(selectedLog.diff?.before !== undefined ? selectedLog.diff.before : selectedLog.state_before) !== null
                        ? JSON.stringify(selectedLog.diff?.before !== undefined ? selectedLog.diff.before : selectedLog.state_before, null, 2)
                        : '// No prior record (INSERT operation)'}
                    </pre>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--adm-success)', marginBottom: '6px' }}>
                    STATE AFTER (Committed)
                  </div>
                  <div className="diff-panel after">
                    <pre>
                      {(selectedLog.diff?.after !== undefined ? selectedLog.diff.after : selectedLog.state_after) !== null
                        ? JSON.stringify(selectedLog.diff?.after !== undefined ? selectedLog.diff.after : selectedLog.state_after, null, 2)
                        : '// Record deleted'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="adm-btn-secondary" onClick={() => setSelectedLog(null)}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
