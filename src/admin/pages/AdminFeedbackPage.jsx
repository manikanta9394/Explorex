import { useState, useEffect } from 'react'
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Send,
  Eye,
  Download,
  Tag,
  User,
  Image as ImageIcon,
} from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminFeedbackPage({ onNavigate }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')

  // Detail View Form
  const [replyText, setReplyText] = useState('')
  const [internalNote, setInternalNote] = useState('')
  const [assignee, setAssignee] = useState('')
  const [newStatus, setNewStatus] = useState('resolved')
  const [replyLoading, setReplyLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState('')

  const loadFeedback = async () => {
    setLoading(true)
    try {
      const res = await adminService.fetchFeedbackInbox({
        status: statusFilter,
        type: typeFilter,
      })
      if (res && res.feedback) {
        let list = res.feedback
        if (search) {
          const q = search.toLowerCase()
          list = list.filter(
            (f) =>
              (f.message && f.message.toLowerCase().includes(q)) ||
              (f.user_email && f.user_email.toLowerCase().includes(q)) ||
              (f.place_name && f.place_name.toLowerCase().includes(q))
          )
        }
        setItems(list)
        if (list.length > 0 && !selectedId) {
          setSelectedId(list[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to load feedback inbox:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedback()
  }, [statusFilter, typeFilter, search])

  const selectedItem = items.find((i) => i.id === selectedId) || items[0]

  useEffect(() => {
    if (selectedItem) {
      setReplyText(selectedItem.admin_note || '')
      setInternalNote(selectedItem.internal_note || '')
      setAssignee(selectedItem.assignee || 'curator@explorex.in')
      setNewStatus(selectedItem.status === 'new' ? 'in_review' : selectedItem.status || 'resolved')
    }
  }, [selectedId, selectedItem])

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!selectedItem) return
    setReplyLoading(true)
    try {
      await adminService.replyToFeedback(selectedItem.id, {
        replyText,
        internalNote,
        assignee,
        status: newStatus,
      })

      setActionSuccess('Reply dispatched! Visible in user\'s "My feedback" panel.')
      setTimeout(() => setActionSuccess(''), 4000)
      loadFeedback()
    } catch (err) {
      alert(`Reply failed: ${err.message}`)
    } finally {
      setReplyLoading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['id', 'type', 'rating', 'status', 'user_email', 'message', 'admin_reply', 'created_at']
    const rows = items.map((f) => [
      `"${f.id}"`,
      `"${f.type || f.category || ''}"`,
      f.rating || '',
      `"${f.status || 'new'}"`,
      `"${f.user_email || ''}"`,
      `"${(f.message || '').replace(/"/g, '""')}"`,
      `"${(f.admin_note || '').replace(/"/g, '""')}"`,
      `"${f.created_at || ''}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `feedback_inbox_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isSlaBreached = (createdStr, status) => {
    if (status === 'resolved' || status === 'dismissed') return false
    if (!createdStr) return false
    const diffDays = (new Date() - new Date(createdStr)) / (1000 * 60 * 60 * 24)
    return diffDays > 3
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>Feedback & Wrong Information Inbox</h2>
          <p>Triage explorer reports, correct outdated hours or prices, and dispatch verified replies</p>
        </div>

        <div className="header-action-group">
          <button type="button" className="adm-btn-secondary" onClick={handleExportCSV}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>
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

      {/* Master-Detail Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minHeight: '600px' }}>
        {/* Left Column: Master Table */}
        <div className="admin-table-container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="table-toolbar">
            <div className="toolbar-left" style={{ width: '100%' }}>
              <div className="admin-search-wrap" style={{ flex: 1 }}>
                <Search size={13} className="search-icon" />
                <input
                  type="text"
                  className="admin-search-input"
                  style={{ width: '100%' }}
                  placeholder="Filter feedback message or user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter feedback by status"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>

              <select
                className="admin-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter feedback by type"
              >
                <option value="">All Types</option>
                <option value="wrong_info">Wrong Info</option>
                <option value="bug">Bug</option>
                <option value="idea">Idea</option>
                <option value="praise">Praise</option>
              </select>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Report / Message</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                      Loading feedback items...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                      No feedback reports found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isSelected = selectedItem?.id === item.id
                    const breached = Boolean(item.sla_breached) || isSlaBreached(item.created_at, item.status)

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'var(--adm-accent-subtle)' : undefined,
                        }}
                      >
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div
                              style={{
                                fontWeight: isSelected ? 700 : 500,
                                fontSize: '12px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '240px',
                              }}
                            >
                              {item.message || 'No description provided'}
                            </div>
                            <div style={{ fontSize: '10.5px', color: 'var(--adm-text-dim)', display: 'flex', gap: '6px' }}>
                              <span>{item.user_email || 'Anonymous'}</span>
                              {item.place_name && <span>• {item.place_name}</span>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="status-chip neutral" style={{ textTransform: 'capitalize' }}>
                            {item.type || item.category || 'Feedback'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span className={`status-chip ${item.status || 'draft'}`}>
                              {item.status || 'new'}
                            </span>
                            {breached && (
                              <span className="status-chip sla_breached" style={{ fontSize: '9.5px' }}>
                                &gt;3d SLA
                              </span>
                            )}
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

        {/* Right Column: Detail Inspector & Reply Dispatcher */}
        <div
          style={{
            background: 'var(--adm-surface)',
            border: '1px solid var(--adm-border)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--adm-shadow)',
          }}
        >
          {selectedItem ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Detail Header */}
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--adm-border)',
                  background: 'var(--adm-surface-raised)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--adm-text-dim)', textTransform: 'uppercase' }}>
                    Feedback Ticket #{selectedItem.id.slice(0, 8)}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>
                    Type: {selectedItem.type || selectedItem.category || 'Feedback'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {isSlaBreached(selectedItem.created_at, selectedItem.status) && (
                    <span className="status-chip sla_breached">SLA Breached</span>
                  )}
                  <span className={`status-chip ${selectedItem.status || 'draft'}`}>
                    {selectedItem.status || 'new'}
                  </span>
                </div>
              </div>

              {/* Detail Content */}
              <div style={{ padding: '18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* User Message Box */}
                <div
                  style={{
                    background: 'var(--adm-bg)',
                    border: '1px solid var(--adm-border)',
                    borderRadius: '6px',
                    padding: '14px',
                  }}
                >
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-dim)', marginBottom: '6px' }}>
                    Reported by <strong>{selectedItem.user_email || 'Explorer Guest'}</strong> on{' '}
                    {selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleString() : 'Recent'}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.5, color: 'var(--adm-text)' }}>
                    "{selectedItem.message}"
                  </p>
                </div>

                {/* Related Place Context Shortcut */}
                {selectedItem.place_id && (
                  <div
                    style={{
                      background: 'var(--adm-accent-subtle)',
                      border: '1px solid var(--adm-accent-border)',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--adm-accent)', fontWeight: 600 }}>
                        Related Destination Attached
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>
                        {selectedItem.place_name || selectedItem.place_id}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="adm-btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                      onClick={() => onNavigate?.(`/admin/places?search=${encodeURIComponent(selectedItem.place_name || selectedItem.place_id)}`)}
                    >
                      <span>Edit this place</span>
                      <ExternalLink size={11} />
                    </button>
                  </div>
                )}

                {/* Optional Screenshot Lightbox */}
                {selectedItem.screenshot_url && (
                  <div>
                    <label className="adm-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <ImageIcon size={13} /> Attached Screenshot
                    </label>
                    <div style={{ marginTop: '6px', maxHeight: '180px', overflow: 'hidden', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
                      <img
                        src={selectedItem.screenshot_url}
                        alt="Feedback screenshot"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}

                {/* Curator Reply Form */}
                <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="feedback-reply-input" style={{ color: 'var(--adm-accent)', fontWeight: 700 }}>
                      Public Reply (Immediately visible to user in "My feedback")
                    </label>
                    <textarea
                      id="feedback-reply-input"
                      className="adm-textarea"
                      rows={3}
                      required
                      placeholder="Thank you for bringing this to our attention. We have verified and corrected the entry timings..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="adm-form-group">
                      <label className="adm-label" htmlFor="feedback-status-select">Update Status</label>
                      <select
                        id="feedback-status-select"
                        className="admin-select"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="in_review">In Review</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                      </select>
                    </div>

                    <div className="adm-form-group">
                      <label className="adm-label" htmlFor="feedback-assignee-input">Assignee</label>
                      <input
                        id="feedback-assignee-input"
                        type="text"
                        className="adm-input"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="curator@explorex.in"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="adm-btn-primary"
                    style={{ justifyContent: 'center', marginTop: '6px' }}
                    disabled={replyLoading}
                  >
                    <Send size={13} />
                    <span>{replyLoading ? 'Dispatching...' : 'Send Verified Reply to User'}</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--adm-text-dim)' }}>
              Select a feedback item from the list to inspect details and dispatch reply.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
