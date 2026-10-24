import { useState, useEffect } from 'react'
import {
  Image as ImageIcon,
  Check,
  X,
  ExternalLink,
  AlertOctagon,
  RefreshCw,
  Hash,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { adminService } from '../../services/adminService'

export default function AdminImagesPage() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' })
  const [replaceModalItem, setReplaceModalItem] = useState(null)
  const [replacementUrl, setReplacementUrl] = useState('')

  const loadCandidates = async () => {
    setLoading(true)
    try {
      const res = await adminService.fetchCandidateImages()
      if (res && res.candidates) {
        setCandidates(res.candidates)
      }
    } catch (err) {
      console.error('Failed to load candidate images:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  const handleReviewAction = async (candidate, action, customUrl = null) => {
    setActionMsg({ type: '', text: '' })
    try {
      const res = await adminService.reviewCandidateImage({
        candidateId: candidate.id,
        action,
        replacementUrl: customUrl || candidate.candidate_url,
        sha256: candidate.sha256,
      })

      if (res.error) {
        throw new Error(res.error)
      }

      setActionMsg({
        type: 'success',
        text: `Successfully performed "${action}" on photo for ${candidate.place_name}.`,
      })
      setTimeout(() => setActionMsg({ type: '', text: '' }), 4000)
      loadCandidates()
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.message || 'Image review action failed.',
      })
    }
  }

  const handleConfirmReplace = async (e) => {
    e.preventDefault()
    if (!replacementUrl) return
    await handleReviewAction(replaceModalItem, 'replace', replacementUrl)
    setReplaceModalItem(null)
    setReplacementUrl('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>Image Integrity & Verification Queue</h2>
          <p>Prevent cross-place photo mismatch with SHA-256 deduplication and license verification</p>
        </div>

        <button
          type="button"
          className="adm-btn-secondary"
          onClick={loadCandidates}
          disabled={loading}
        >
          <RefreshCw size={13} className={loading ? 'spin-anim' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionMsg.text && (
        <div
          style={{
            background: actionMsg.type === 'error' ? 'var(--adm-danger-bg)' : 'var(--adm-success-bg)',
            border: `1px solid ${actionMsg.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '6px',
            padding: '10px 14px',
            color: actionMsg.type === 'error' ? 'var(--adm-danger)' : 'var(--adm-success)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {actionMsg.type === 'error' ? <AlertOctagon size={15} /> : <ShieldCheck size={15} />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--adm-text-dim)' }}>
          Loading candidate image queue...
        </div>
      ) : candidates.length === 0 ? (
        <div
          style={{
            background: 'var(--adm-surface)',
            border: '1px solid var(--adm-border)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <ShieldCheck size={32} style={{ color: 'var(--adm-success)', margin: '0 auto 12px auto' }} />
          <h3 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>All Candidate Images Verified</h3>
          <p style={{ margin: 0, color: 'var(--adm-text-muted)', fontSize: '12.5px' }}>
            No unverified or conflicting photo hashes currently awaiting curator moderation.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {candidates.map((cand) => (
            <div
              key={cand.id}
              style={{
                background: 'var(--adm-surface)',
                border: '1px solid var(--adm-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--adm-shadow)',
              }}
            >
              {/* Image Split / Display */}
              <div style={{ position: 'relative', height: '220px', background: 'var(--adm-bg)' }}>
                <img
                  src={cand.candidate_url}
                  alt={cand.place_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=600'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  <span className="status-chip neutral" style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                    {cand.state}
                  </span>
                  <span className="status-chip draft">Pending Review</span>
                </div>
              </div>

              {/* Metadata Details */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700 }}>
                    {cand.place_name}
                  </h3>
                  <div style={{ fontSize: '11.5px', color: 'var(--adm-text-muted)', display: 'flex', gap: '10px' }}>
                    <span>City: {cand.city}</span>
                    <span>Wikidata: <code>{cand.wikidata_id}</code></span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--adm-surface-raised)',
                    border: '1px solid var(--adm-border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--adm-text-dim)' }}>Attribution:</span>
                    <span style={{ fontWeight: 500 }}>{cand.attribution}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--adm-text-dim)' }}>License:</span>
                    <span style={{ fontWeight: 600, color: 'var(--adm-accent)' }}>{cand.license}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <Hash size={12} style={{ color: 'var(--adm-text-dim)', flexShrink: 0 }} />
                    <code style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cand.sha256}
                    </code>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={cand.wikipedia_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '11px',
                      color: 'var(--adm-accent)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Inspect Wikipedia Article</span>
                    <ExternalLink size={11} />
                  </a>
                </div>

                {/* Review Action Buttons */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginTop: 'auto',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--adm-border)',
                  }}
                >
                  <button
                    type="button"
                    className="adm-btn-primary"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleReviewAction(cand, 'approve')}
                    title="Approve image (verifies sha256 uniqueness across all places)"
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    className="adm-btn-secondary"
                    style={{ justifyContent: 'center' }}
                    onClick={() => {
                      setReplaceModalItem(cand)
                      setReplacementUrl(cand.candidate_url)
                    }}
                  >
                    <Upload size={13} />
                    <span>Replace...</span>
                  </button>

                  <button
                    type="button"
                    className="adm-btn-secondary"
                    style={{ justifyContent: 'center', fontSize: '11px' }}
                    onClick={() => handleReviewAction(cand, 'mark_illustration')}
                  >
                    Illustration
                  </button>

                  <button
                    type="button"
                    className="adm-btn-danger"
                    style={{ justifyContent: 'center' }}
                    onClick={() => handleReviewAction(cand, 'reject')}
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Replace Image Modal */}
      {replaceModalItem && (
        <div className="admin-modal-backdrop" onClick={() => setReplaceModalItem(null)}>
          <div className="admin-modal-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Replace Photo for {replaceModalItem.place_name}</h3>
              <button type="button" className="sidebar-collapse-toggle" onClick={() => setReplaceModalItem(null)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleConfirmReplace}>
              <div className="modal-body">
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--adm-text-muted)' }}>
                  Provide an official Wikimedia Commons or verified high-resolution photograph URL. The hash will be checked against all other places before linking.
                </p>
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="photo-url-input">Replacement Photo URL</label>
                  <input
                    id="photo-url-input"
                    type="url"
                    className="adm-input"
                    required
                    value={replacementUrl}
                    onChange={(e) => setReplacementUrl(e.target.value)}
                    placeholder="https://upload.wikimedia.org/wikipedia/commons/..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="adm-btn-secondary" onClick={() => setReplaceModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  Verify & Replace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
