import { useState, useEffect } from 'react'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  FileWarning,
  Bug,
  Lightbulb,
  Heart,
  Star,
  ExternalLink,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import PageHeaderBand from '../components/PageHeaderBand'
import SEOHead from '../components/SEOHead'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'
import { submitFeedback, fetchUserFeedback } from '../services/feedbackService'

export default function FeedbackPage({ onNavigate }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [feedbackType, setFeedbackType] = useState('content_error')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [placeReference, setPlaceReference] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [userReports, setUserReports] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const userId = user?.id || null

  useEffect(() => {
    if (userId) {
      setLoadingHistory(true)
      fetchUserFeedback(userId)
        .then((items) => setUserReports(items))
        .finally(() => setLoadingHistory(false))
    }
  }, [userId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || submitting) return

    setSubmitting(true)
    try {
      const fullMessage = placeReference.trim()
        ? `[Referenced Destination: ${placeReference.trim()}]\n\n${message.trim()}`
        : message.trim()

      await submitFeedback({
        userId,
        type: feedbackType,
        rating,
        message: fullMessage,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        screenshotUrl: screenshotUrl || null,
      })

      setSubmittedSuccess(true)
      showToast('Thank you! Your feedback has been submitted.', 'success')
      setMessage('')
      setPlaceReference('')
      setScreenshotUrl('')

      if (userId) {
        fetchUserFeedback(userId).then((items) => setUserReports(items))
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredReports = userReports.filter((r) => {
    if (filterStatus === 'all') return true
    return r.status === filterStatus
  })

  return (
    <div className="feedback-page-shell">
      <SEOHead
        title="Community Feedback & Data Curation | Explorex"
        description="Submit corrections, report broken features, or share suggestions to help maintain accurate Indian heritage data on Explorex."
      />

      <PageHeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Community Feedback' },
        ]}
        eyebrow="Truth in Heritage Data"
        title="Community Feedback &amp; Curation"
        subtitle="Explorex relies on strict verification. If you notice an outdated ticket fee, altered visiting hours, or wish to suggest new destinations, report it here."
        badge={
          <div className="feedback-header-badge">
            <span className="curation-verified-pill">
              <ShieldCheck size={13} color="#C9A227" /> Curation Monitored
            </span>
          </div>
        }
      />

      <div className="feedback-page-layout">
        {/* Left Column: Submission Form */}
        <div className="feedback-form-column">
          <div className="feedback-card-shell">
            {submittedSuccess ? (
              <div className="feedback-success-state">
                <div className="success-icon-badge">
                  <CheckCircle2 size={40} color="#10B981" />
                </div>
                <h3>Feedback Received</h3>
                <p>
                  Thank you for helping us maintain verified cultural accuracy. Our team verifies submissions against Archaeological Survey of India (ASI) official notices and gazettes.
                </p>
                <button
                  type="button"
                  className="btn-submit-more"
                  onClick={() => setSubmittedSuccess(false)}
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="page-feedback-form">
                <h4>Submit a Report or Suggestion</h4>
                <p className="form-sub-hint">
                  Your feedback is reviewed directly by our editorial moderators.
                </p>

                {/* Category Selection */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <div className="feedback-type-selector-grid">
                    <button
                      type="button"
                      className={`type-option ${feedbackType === 'content_error' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('content_error')}
                    >
                      <FileWarning size={16} />
                      <span>Wrong Place Info</span>
                    </button>
                    <button
                      type="button"
                      className={`type-option ${feedbackType === 'bug' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('bug')}
                    >
                      <Bug size={16} />
                      <span>Technical Bug</span>
                    </button>
                    <button
                      type="button"
                      className={`type-option ${feedbackType === 'idea' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('idea')}
                    >
                      <Lightbulb size={16} />
                      <span>Feature Idea</span>
                    </button>
                    <button
                      type="button"
                      className={`type-option ${feedbackType === 'praise' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('praise')}
                    >
                      <Heart size={16} />
                      <span>Praise &amp; Review</span>
                    </button>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="form-group">
                  <label className="form-label">Overall Experience (1–5 Stars)</label>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`star-btn ${rating >= s ? 'lit' : ''}`}
                        onClick={() => setRating(s)}
                        aria-label={`Rate ${s} Stars`}
                      >
                        <Star size={22} fill={rating >= s ? '#C9A227' : 'none'} color="#C9A227" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination Reference */}
                <div className="form-group">
                  <label htmlFor="place-reference" className="form-label">
                    Referenced Destination / State <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="place-reference"
                    className="form-input"
                    placeholder="e.g. Golconda Fort, Konark Sun Temple, Kerala"
                    value={placeReference}
                    onChange={(e) => setPlaceReference(e.target.value)}
                  />
                </div>

                {/* Message Textarea */}
                <div className="form-group">
                  <label htmlFor="feedback-body" className="form-label">
                    Detailed Message <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="feedback-body"
                    rows={5}
                    className="form-textarea"
                    placeholder="Please explain the issue or your suggestion with context or official website references..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={8}
                  />
                  <span className="char-count">{message.length} characters (min 8)</span>
                </div>

                {/* Screenshot URL */}
                <div className="form-group">
                  <label htmlFor="screenshot-input" className="form-label">
                    Screenshot / Evidence URL <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    id="screenshot-input"
                    className="form-input"
                    placeholder="https://... photo link"
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="btn-submit-feedback"
                  disabled={submitting || message.trim().length < 8}
                >
                  <Send size={15} />
                  <span>{submitting ? 'Submitting Report...' : 'Submit Feedback'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: User History & Curation Mission */}
        <div className="feedback-history-column">
          {/* Curation Pledge Box */}
          <div className="curation-pledge-card">
            <h4>Our Verification Standard</h4>
            <ul>
              <li><strong>Zero Fabrications:</strong> Entry ticket costs are sourced exclusively from official ASI or state tourism departments.</li>
              <li><strong>Image Integrity:</strong> Every monument photo is tied uniquely to that place via Wikidata ID; no cross-place image sharing.</li>
              <li><strong>Timely Updates:</strong> Community reports are reviewed within 48 hours and incorporated into the live dataset.</li>
            </ul>
          </div>

          {/* User's Reports Feed */}
          <div className="user-reports-card">
            <div className="reports-header-row">
              <h4>My Submitted Reports</h4>
              {userReports.length > 0 && (
                <div className="status-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All ({userReports.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${filterStatus === 'resolved' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('resolved')}
                  >
                    Resolved
                  </button>
                </div>
              )}
            </div>

            {!userId ? (
              <div className="history-guest-notice">
                <AlertCircle size={24} color="#C9A227" />
                <p>
                  You are browsing as a guest. Reports submitted in this session are recorded, but you must sign in to view status updates.
                </p>
                <button
                  type="button"
                  className="btn-signin-prompt"
                  onClick={() => onNavigate?.('/login')}
                >
                  Sign In to Track
                </button>
              </div>
            ) : loadingHistory ? (
              <div className="history-loading-indicator">
                <Clock size={20} className="spin-icon" />
                <span>Loading your reports...</span>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="history-empty-indicator">
                <Clock size={28} color="#9CA3AF" />
                <p>No submitted reports found in this category.</p>
              </div>
            ) : (
              <div className="reports-list">
                {filteredReports.map((report) => {
                  let pillStyle = { color: '#2563EB', bg: '#EFF6FF', text: 'New' }
                  if (report.status === 'in_review') {
                    pillStyle = { color: '#D97706', bg: '#FFFBEB', text: 'In Review' }
                  } else if (report.status === 'resolved') {
                    pillStyle = { color: '#059669', bg: '#ECFDF5', text: 'Resolved' }
                  } else if (report.status === 'dismissed') {
                    pillStyle = { color: '#6B7280', bg: '#F3F4F6', text: 'Closed' }
                  }

                  return (
                    <div key={report.id} className="report-item-box">
                      <div className="item-top">
                        <span className="type-badge">{report.type.replace('_', ' ')}</span>
                        <span
                          className="status-pill"
                          style={{ color: pillStyle.color, background: pillStyle.bg }}
                        >
                          {pillStyle.text}
                        </span>
                      </div>
                      <p className="item-msg">{report.message}</p>
                      {report.admin_note && (
                        <div className="curation-reply">
                          <strong>Admin Reply:</strong> {report.admin_note}
                        </div>
                      )}
                      <div className="item-meta">
                        <span>{new Date(report.created_at).toLocaleDateString('en-IN')}</span>
                        {report.page_url && (
                          <a
                            href={report.page_url}
                            target="_blank"
                            rel="noreferrer"
                            className="item-link"
                          >
                            View Page <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
