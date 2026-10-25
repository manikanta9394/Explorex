import { useState, useEffect } from 'react'
import {
  MessageSquarePlus,
  X,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  FileWarning,
  Heart,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'
import { submitFeedback, fetchUserFeedback } from '../services/feedbackService'
import { Drawer } from './PortalDialog'

// Custom event name for opening drawer with pre-filled payload
export const OPEN_FEEDBACK_EVENT = 'explorex:open_feedback'

export function triggerFeedbackDrawer(payload = {}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_FEEDBACK_EVENT, { detail: payload }))
  }
}

export default function FeedbackDrawer({ currentRoute, activePlace = null }) {
  const { user } = useAuth()
  const { showToast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('new') // 'new' | 'my_reports'
  const [feedbackType, setFeedbackType] = useState('content_error')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [attachedPlace, setAttachedPlace] = useState(activePlace)
  const [submitting, setSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [myFeedbackList, setMyFeedbackList] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const userId = user?.id || null

  // Listen for open events from "Report wrong info" shortcuts
  useEffect(() => {
    const handleTrigger = (e) => {
      const detail = e.detail || {}
      if (detail.type) setFeedbackType(detail.type)
      if (detail.place) setAttachedPlace(detail.place)
      if (detail.message) setMessage(detail.message)
      setActiveTab('new')
      setSubmittedSuccess(false)
      setIsOpen(true)
    }

    window.addEventListener(OPEN_FEEDBACK_EVENT, handleTrigger)
    return () => window.removeEventListener(OPEN_FEEDBACK_EVENT, handleTrigger)
  }, [])

  // Auto-update attached place when prop changes
  useEffect(() => {
    if (activePlace) setAttachedPlace(activePlace)
  }, [activePlace])

  // Load user's past feedback when switching to "my_reports" tab
  useEffect(() => {
    if (activeTab === 'my_reports' && userId) {
      setLoadingHistory(true)
      fetchUserFeedback(userId)
        .then((items) => setMyFeedbackList(items))
        .finally(() => setLoadingHistory(false))
    }
  }, [activeTab, userId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || submitting) return

    setSubmitting(true)
    try {
      await submitFeedback({
        userId,
        type: feedbackType,
        rating,
        message,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        placeId: attachedPlace?.id || null,
        screenshotUrl: screenshotUrl || null,
      })

      setSubmittedSuccess(true)
      showToast('Thank you! Your feedback has been received.', 'success')
      setMessage('')
      setScreenshotUrl('')

      // Refresh history list
      if (userId) {
        fetchUserFeedback(userId).then((items) => setMyFeedbackList(items))
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setSubmittedSuccess(false)
    setMessage('')
    setScreenshotUrl('')
  }

  return (
    <>
      {/* Floating Trigger Button on Every Page (Bottom Right Circular with Tooltip) */}
      <div className="floating-feedback-wrapper">
        <button
          type="button"
          className="floating-feedback-btn-circle"
          onClick={() => setIsOpen(true)}
          title="Share feedback or report an issue"
          aria-label="Feedback & Reports"
        >
          <MessageSquarePlus size={20} />
          <span className="feedback-tooltip" role="tooltip">
            Feedback &amp; Reports
          </span>
        </button>
      </div>

      {/* Slide-over Backdrop & Drawer via React Portal */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="feedback-drawer-backdrop"
        contentClassName="feedback-drawer-container"
        maxWidth="520px"
        ariaLabel="Feedback & Reports"
        raw
      >
        {/* Drawer Header */}
        <div className="feedback-drawer-header">
              <div className="drawer-title-row">
                <div className="drawer-icon-orb">
                  <MessageSquarePlus size={20} color="#C9A227" />
                </div>
                <div>
                  <h3>Explorex Feedback &amp; Curation</h3>
                  <p>Help us preserve authentic, verified Indian travel data</p>
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="feedback-drawer-tabs">
              <button
                type="button"
                className={`drawer-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
                onClick={() => setActiveTab('new')}
              >
                Submit Feedback
              </button>
              <button
                type="button"
                className={`drawer-tab-btn ${activeTab === 'my_reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('my_reports')}
              >
                My Feedback {myFeedbackList.length > 0 && `(${myFeedbackList.length})`}
              </button>
            </div>

            {/* Tab 1: Submit Feedback Form */}
            {activeTab === 'new' && (
              <div className="drawer-body-scroll">
                {submittedSuccess ? (
                  <div className="feedback-success-card">
                    <div className="success-icon-orb">
                      <CheckCircle2 size={36} color="#10B981" />
                    </div>
                    <h4>Report Submitted Successfully</h4>
                    <p>
                      Thank you for contributing to Explorex! Our cultural curation team reviews every submission against official ASI and state tourism records.
                    </p>
                    <div className="success-actions-row">
                      <button
                        type="button"
                        className="btn-submit-another"
                        onClick={handleResetForm}
                      >
                        Submit Another Note
                      </button>
                      <button
                        type="button"
                        className="btn-view-my-reports"
                        onClick={() => setActiveTab('my_reports')}
                      >
                        View My Feedback
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="feedback-form">
                    {/* Attached Place Info Chip */}
                    {attachedPlace && (
                      <div className="attached-place-chip">
                        <span className="chip-label">Referenced Place:</span>
                        <strong>{attachedPlace.name}</strong>
                        <span className="chip-city">({attachedPlace.city}, {attachedPlace.state})</span>
                        <button
                          type="button"
                          className="chip-remove-btn"
                          onClick={() => setAttachedPlace(null)}
                          title="Clear place reference"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {/* Feedback Category Picker */}
                    <div className="form-group">
                      <label className="form-label">What is your feedback about?</label>
                      <div className="feedback-type-grid">
                        <button
                          type="button"
                          className={`type-card-btn ${feedbackType === 'content_error' ? 'active' : ''}`}
                          onClick={() => setFeedbackType('content_error')}
                        >
                          <FileWarning size={16} />
                          <span>Wrong info about a place</span>
                        </button>

                        <button
                          type="button"
                          className={`type-card-btn ${feedbackType === 'bug' ? 'active' : ''}`}
                          onClick={() => setFeedbackType('bug')}
                        >
                          <Bug size={16} />
                          <span>Bug or issue</span>
                        </button>

                        <button
                          type="button"
                          className={`type-card-btn ${feedbackType === 'idea' ? 'active' : ''}`}
                          onClick={() => setFeedbackType('idea')}
                        >
                          <Lightbulb size={16} />
                          <span>Feature idea</span>
                        </button>

                        <button
                          type="button"
                          className={`type-card-btn ${feedbackType === 'praise' ? 'active' : ''}`}
                          onClick={() => setFeedbackType('praise')}
                        >
                          <Heart size={16} />
                          <span>Praise &amp; love</span>
                        </button>
                      </div>
                    </div>

                    {/* 1 to 5 Star Rating */}
                    <div className="form-group">
                      <label className="form-label">How would you rate your experience? (1–5)</label>
                      <div className="star-rating-selector" role="radiogroup" aria-label="Rate 1 to 5 stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`star-select-btn ${rating >= s ? 'active' : ''}`}
                            onClick={() => setRating(s)}
                            aria-label={`${s} Stars`}
                          >
                            <Star size={20} fill={rating >= s ? '#C9A227' : 'none'} color="#C9A227" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Message */}
                    <div className="form-group">
                      <label htmlFor="feedback-message" className="form-label">
                        Message Details <span className="required-star">*</span>
                      </label>
                      <textarea
                        id="feedback-message"
                        rows={4}
                        className="feedback-textarea"
                        placeholder="Please describe what you observed, incorrect prices/timings, or your suggestion in detail..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        minLength={8}
                      />
                      <span className="char-count-hint">
                        {message.length} characters (minimum 8 required)
                      </span>
                    </div>

                    {/* Optional Screenshot URL */}
                    <div className="form-group">
                      <label htmlFor="screenshot-url" className="form-label">
                        Screenshot or Reference URL <span className="optional-tag">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        id="screenshot-url"
                        className="feedback-input"
                        placeholder="https://imgur.com/... or official ASI source URL"
                        value={screenshotUrl}
                        onChange={(e) => setScreenshotUrl(e.target.value)}
                      />
                    </div>

                    {/* Auto Attached Context Metadata Note */}
                    <div className="meta-attachment-pill">
                      <HelpCircle size={13} color="#6B7280" />
                      <span>
                        Current page URL is automatically attached for quick verification.
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="submit-feedback-cta"
                      disabled={submitting || message.trim().length < 8}
                    >
                      <Send size={15} />
                      <span>{submitting ? 'Submitting...' : 'Send Feedback to Curation Team'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Tab 2: My Feedback History */}
            {activeTab === 'my_reports' && (
              <div className="drawer-body-scroll">
                {!userId ? (
                  <div className="guest-history-prompt">
                    <AlertCircle size={28} color="#C9A227" />
                    <h4>Sign in to track your feedback</h4>
                    <p>
                      You are currently exploring as a guest. Create an account or sign in so you can receive status updates and curation replies to your reports.
                    </p>
                  </div>
                ) : loadingHistory ? (
                  <div className="history-loading-wrap">
                    <span className="spin-dot" />
                    <span>Loading your past reports...</span>
                  </div>
                ) : myFeedbackList.length === 0 ? (
                  <div className="empty-history-wrap">
                    <Clock size={28} color="#9CA3AF" />
                    <h4>No reports submitted yet</h4>
                    <p>When you report incorrect info or share ideas, their review status will appear here.</p>
                  </div>
                ) : (
                  <div className="history-items-feed">
                    {myFeedbackList.map((item) => {
                      let statusBadge = { label: 'New', color: '#2563EB', bg: '#EFF6FF' }
                      if (item.status === 'in_review') {
                        statusBadge = { label: 'In Review', color: '#D97706', bg: '#FFFBEB' }
                      } else if (item.status === 'resolved') {
                        statusBadge = { label: 'Resolved & Updated', color: '#059669', bg: '#ECFDF5' }
                      } else if (item.status === 'dismissed') {
                        statusBadge = { label: 'Closed', color: '#6B7280', bg: '#F3F4F6' }
                      }

                      return (
                        <div key={item.id} className="history-card-item">
                          <div className="history-card-top">
                            <span className="report-type-tag">{item.type.replace('_', ' ')}</span>
                            <span
                              className="report-status-pill"
                              style={{ color: statusBadge.color, background: statusBadge.bg }}
                            >
                              {statusBadge.label}
                            </span>
                          </div>

                          <p className="history-msg-text">{item.message}</p>

                          {item.admin_note && (
                            <div className="admin-reply-box">
                              <strong>Curation Team Note:</strong>
                              <p>{item.admin_note}</p>
                            </div>
                          )}

                          <div className="history-meta-footer">
                            <span className="history-date">
                              {new Date(item.created_at).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            {item.page_url && (
                              <a
                                href={item.page_url}
                                target="_blank"
                                rel="noreferrer"
                                className="history-page-link"
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
            )}
      </Drawer>
    </>
  )
}
