import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Bookmark,
  Calendar,
} from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [cleanupLoading, setCleanupLoading] = useState(false)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await adminService.fetchUsers({ search, role: roleFilter })
      if (res && res.users) {
        setUsers(res.users)
      }
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [search, roleFilter])

  const handleToggleRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Are you sure you want to change ${u.email}'s role to "${nextRole}"?`)) {
      return
    }
    try {
      await adminService.updateUserRole(u.id, nextRole)
      setActionMsg(`Role updated to ${nextRole} for ${u.email}`)
      setTimeout(() => setActionMsg(''), 3000)
      loadUsers()
    } catch (err) {
      alert(`Role change failed: ${err.message}`)
    }
  }

  const handleToggleStatus = async (u) => {
    const nextStatus = u.is_disabled ? 'enable' : 'disable'
    if (!confirm(`Are you sure you want to ${nextStatus} account for ${u.email}?`)) {
      return
    }
    try {
      await adminService.toggleUserStatus(u.id)
      setActionMsg(`Account ${nextStatus}d for ${u.email}`)
      setTimeout(() => setActionMsg(''), 3000)
      loadUsers()
    } catch (err) {
      alert(`Status toggle failed: ${err.message}`)
    }
  }

  const handleRunGuestCleanup = async () => {
    setCleanupLoading(true)
    try {
      const res = await adminService.runGuestCleanupJob()
      setActionMsg(`Guest account cleanup completed: ${res.cleaned || 0} orphaned guest sessions purged.`)
      setTimeout(() => setActionMsg(''), 4000)
      loadUsers()
    } catch (err) {
      alert(`Guest cleanup failed: ${err.message}`)
    } finally {
      setCleanupLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>User & Access Control Management</h2>
          <p>Review registered accounts, grant administrator privileges, and prune stale guest sessions</p>
        </div>

        <div className="header-action-group">
          <button
            type="button"
            className="adm-btn-secondary"
            onClick={handleRunGuestCleanup}
            disabled={cleanupLoading}
            title="Purge inactive guest records older than 30 days"
          >
            <Trash2 size={13} />
            <span>{cleanupLoading ? 'Cleaning...' : 'Prune Stale Guests'}</span>
          </button>
        </div>
      </div>

      {actionMsg && (
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
          <span>{actionMsg}</span>
        </div>
      )}

      <div className="admin-table-container">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="admin-search-wrap">
              <Search size={13} className="search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search user email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="admin-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by role"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="toolbar-right">
            <button type="button" className="adm-btn-secondary" onClick={loadUsers}>
              <RefreshCw size={12} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Explorer / Account</th>
              <th>Role</th>
              <th>Type</th>
              <th>Saved Items</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                  Loading user records...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                  No user accounts found matching query.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isAdmin = u.role === 'admin'
                const isDisabled = Boolean(u.is_disabled)

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="admin-avatar-tiny">
                          {(u.display_name || u.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.display_name || 'Unnamed Explorer'}</div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-chip ${isAdmin ? 'published' : 'neutral'}`}>
                        {isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span className="status-chip neutral">
                        {u.is_guest ? 'Guest Session' : 'Verified Member'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontVariantNumeric: 'tabular-nums' }}>
                        <Bookmark size={12} style={{ color: 'var(--adm-accent)' }} />
                        {u.saved_count || 0}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)' }}>
                        {u.created_at ? u.created_at.slice(0, 10) : '2026-09-01'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-chip ${isDisabled ? 'disabled' : 'active'}`}>
                        {isDisabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="adm-btn-secondary"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                          onClick={() => handleToggleRole(u)}
                          title={`Toggle role to ${isAdmin ? 'user' : 'admin'}`}
                        >
                          <Shield size={11} />
                          <span>{isAdmin ? 'Demote' : 'Make Admin'}</span>
                        </button>

                        <button
                          type="button"
                          className="table-action-icon-btn"
                          onClick={() => handleToggleStatus(u)}
                          title={isDisabled ? 'Enable account' : 'Disable account'}
                        >
                          {isDisabled ? <UserCheck size={13} style={{ color: 'var(--adm-success)' }} /> : <UserX size={13} style={{ color: 'var(--adm-danger)' }} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
