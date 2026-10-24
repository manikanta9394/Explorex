import { useState, useEffect } from 'react'
import {
  Calendar,
  HelpCircle,
  Megaphone,
  Plus,
  Trash2,
  CheckCircle,
  Save,
  Edit2,
  X,
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import { TELANGANA_FESTIVALS } from '../../components/FestivalCalendar'

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('banner') // 'banner' | 'festivals' | 'faqs'
  const [actionSuccess, setActionSuccess] = useState('')

  // Announcement Banner State
  const [bannerConfig, setBannerConfig] = useState({
    is_active: true,
    message: 'Celebrate Navratri & Durga Puja across India with verified monument illuminations!',
    type: 'cultural_event', // 'cultural_event' | 'maintenance' | 'tip'
    cta_text: 'Explore Festivals',
    cta_link: '/festivals',
  })

  // Festivals State
  const [festivals, setFestivals] = useState(() => {
    return (TELANGANA_FESTIVALS || []).map((f) => ({
      id: f.id,
      name: f.name,
      state: 'Telangana',
      month: f.period?.split('(')[0]?.trim() || 'Annual',
      dates: f.period || '',
      description: f.description || '',
      relatedPlaces: (f.relatedPlaces || []).map((p) => p.name).join(', '),
    }))
  })
  const [editingFestival, setEditingFestival] = useState(null)
  const [festModalOpen, setFestModalOpen] = useState(false)
  const [festForm, setFestForm] = useState({
    id: '',
    name: '',
    state: 'Telangana',
    month: 'July',
    dates: 'July 15 - August 5',
    description: '',
    relatedPlaces: 'Golconda Fort, Charminar',
  })

  // FAQs State
  const [faqs, setFaqs] = useState([
    {
      id: 'faq_1',
      question: 'How does Explorex verify ticket prices and entry timings?',
      answer: 'All entry fees, student concessions, and photography permits are verified directly against Archeological Survey of India (ASI) circulars and state tourism board gazettes.',
      category: 'General',
    },
    {
      id: 'faq_2',
      question: 'Can I use Explorex without signing in?',
      answer: 'Yes! Explorex supports guest exploration with zero forced signup. You can search, browse states, and plan itineraries. An account is only required to save persistent trips and review places.',
      category: 'Account',
    },
    {
      id: 'faq_3',
      question: 'Are image licenses and attributions trustworthy?',
      answer: 'Every photo is authenticated via Wikimedia Commons property P18 hash matching. SHA-256 deduplication ensures no cross-place photo mismatch.',
      category: 'Media',
    },
  ])
  const [faqModalOpen, setFaqModalOpen] = useState(false)
  const [faqForm, setFaqForm] = useState({ id: '', question: '', answer: '', category: 'General' })

  // Load Settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await adminService.fetchSettings()
        if (res?.settings?.announcement_banner) {
          setBannerConfig(res.settings.announcement_banner)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }
    loadSettings()
  }, [])

  const handleSaveBanner = async (e) => {
    e.preventDefault()
    try {
      await adminService.updateSettings('announcement_banner', bannerConfig)
      // Also persist to localStorage for client-side user app reactivity
      localStorage.setItem('explorex_announcement_banner', JSON.stringify(bannerConfig))
      setActionSuccess('Announcement banner published and visible in user application!')
      setTimeout(() => setActionSuccess(''), 4000)
    } catch (err) {
      alert(`Failed to save announcement banner: ${err.message}`)
    }
  }

  const handleSaveFestival = (e) => {
    e.preventDefault()
    const placesArray = festForm.relatedPlaces.split(',').map((s) => s.trim()).filter(Boolean)
    if (editingFestival) {
      setFestivals((prev) =>
        prev.map((f) => (f.id === editingFestival.id ? { ...festForm, relatedPlaces: placesArray } : f))
      )
    } else {
      const newFest = {
        ...festForm,
        id: festForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        relatedPlaces: placesArray,
      }
      setFestivals((prev) => [newFest, ...prev])
    }
    setFestModalOpen(false)
    setActionSuccess('Festival updated successfully!')
    setTimeout(() => setActionSuccess(''), 3000)
  }

  const handleDeleteFestival = (id) => {
    if (confirm('Delete this festival from the calendar?')) {
      setFestivals((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const handleSaveFAQ = (e) => {
    e.preventDefault()
    if (faqForm.id) {
      setFaqs((prev) => prev.map((item) => (item.id === faqForm.id ? faqForm : item)))
    } else {
      setFaqs((prev) => [...prev, { ...faqForm, id: `faq_${Date.now()}` }])
    }
    setFaqModalOpen(false)
    setActionSuccess('FAQ saved successfully!')
    setTimeout(() => setActionSuccess(''), 3000)
  }

  const handleDeleteFAQ = (id) => {
    if (confirm('Delete this FAQ entry?')) {
      setFaqs((prev) => prev.filter((f) => f.id !== id))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>Content, Festivals & Announcements</h2>
          <p>Manage dynamic announcements, update the national festival calendar, and edit help center FAQs</p>
        </div>

        {/* Tab Switcher */}
        <div className="header-action-group">
          <button
            type="button"
            className={activeTab === 'banner' ? 'adm-btn-primary' : 'adm-btn-secondary'}
            onClick={() => setActiveTab('banner')}
          >
            <Megaphone size={13} />
            <span>Announcement Banner</span>
          </button>
          <button
            type="button"
            className={activeTab === 'festivals' ? 'adm-btn-primary' : 'adm-btn-secondary'}
            onClick={() => setActiveTab('festivals')}
          >
            <Calendar size={13} />
            <span>Festivals ({festivals.length})</span>
          </button>
          <button
            type="button"
            className={activeTab === 'faqs' ? 'adm-btn-primary' : 'adm-btn-secondary'}
            onClick={() => setActiveTab('faqs')}
          >
            <HelpCircle size={13} />
            <span>FAQs ({faqs.length})</span>
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

      {/* 1. Announcement Banner Editor */}
      {activeTab === 'banner' && (
        <div className="admin-table-container">
          <div className="table-toolbar">
            <span style={{ fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Megaphone size={14} /> Active Application Notification Banner
            </span>
          </div>

          <form onSubmit={handleSaveBanner} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={bannerConfig.is_active}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, is_active: e.target.checked })}
                />
                Show Announcement Banner at top of User App
              </label>
              <span className={`status-chip ${bannerConfig.is_active ? 'published' : 'draft'}`}>
                {bannerConfig.is_active ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="adm-form-group">
              <label className="adm-label" htmlFor="banner-message">Banner Notification Message</label>
              <textarea
                id="banner-message"
                className="adm-textarea"
                rows={2}
                required
                value={bannerConfig.message}
                onChange={(e) => setBannerConfig({ ...bannerConfig, message: e.target.value })}
                placeholder="Important cultural celebration, advisory, or feature announcement..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="adm-form-group">
                <label className="adm-label" htmlFor="banner-type">Banner Theme</label>
                <select
                  id="banner-type"
                  className="admin-select"
                  value={bannerConfig.type}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, type: e.target.value })}
                >
                  <option value="cultural_event">Cultural Celebration (Gold)</option>
                  <option value="tip">Curator Travel Tip (Forest)</option>
                  <option value="maintenance">Maintenance Notice (Amber)</option>
                </select>
              </div>

              <div className="adm-form-group">
                <label className="adm-label" htmlFor="banner-cta-text">CTA Button Label</label>
                <input
                  id="banner-cta-text"
                  type="text"
                  className="adm-input"
                  value={bannerConfig.cta_text || ''}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, cta_text: e.target.value })}
                  placeholder="View Details"
                />
              </div>

              <div className="adm-form-group">
                <label className="adm-label" htmlFor="banner-cta-link">Action Link URL / Path</label>
                <input
                  id="banner-cta-link"
                  type="text"
                  className="adm-input"
                  value={bannerConfig.cta_link || ''}
                  onChange={(e) => setBannerConfig({ ...bannerConfig, cta_link: e.target.value })}
                  placeholder="/festivals"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button type="submit" className="adm-btn-primary">
                <Save size={13} />
                <span>Save & Publish Banner</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Festival Calendar Editor */}
      {activeTab === 'festivals' && (
        <div className="admin-table-container">
          <div className="table-toolbar">
            <span style={{ fontWeight: 600, fontSize: '13px' }}>National Festival Calendar</span>
            <button
              type="button"
              className="adm-btn-primary"
              onClick={() => {
                setEditingFestival(null)
                setFestForm({
                  id: '',
                  name: '',
                  state: 'Telangana',
                  month: 'August',
                  dates: 'August 10 - August 18',
                  description: '',
                  relatedPlaces: '',
                })
                setFestModalOpen(true)
              }}
            >
              <Plus size={13} />
              <span>Add Festival</span>
            </button>
          </div>

          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Festival Name</th>
                <th>State</th>
                <th>Month & Dates</th>
                <th>Related Places</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {festivals.map((fest) => (
                <tr key={fest.id}>
                  <td style={{ fontWeight: 600 }}>{fest.name}</td>
                  <td>
                    <span className="status-chip neutral">{fest.state}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>{fest.month}</div>
                    <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>{fest.dates}</div>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>
                    {Array.isArray(fest.relatedPlaces) ? fest.relatedPlaces.join(', ') : fest.relatedPlaces}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button
                        type="button"
                        className="table-action-icon-btn"
                        onClick={() => {
                          setEditingFestival(fest)
                          setFestForm({
                            id: fest.id,
                            name: fest.name,
                            state: fest.state,
                            month: fest.month,
                            dates: fest.dates,
                            description: fest.description || '',
                            relatedPlaces: Array.isArray(fest.relatedPlaces) ? fest.relatedPlaces.join(', ') : fest.relatedPlaces || '',
                          })
                          setFestModalOpen(true)
                        }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="table-action-icon-btn"
                        onClick={() => handleDeleteFestival(fest.id)}
                      >
                        <Trash2 size={13} style={{ color: 'var(--adm-danger)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. FAQ Editor */}
      {activeTab === 'faqs' && (
        <div className="admin-table-container">
          <div className="table-toolbar">
            <span style={{ fontWeight: 600, fontSize: '13px' }}>Help Center & FAQ Editor</span>
            <button
              type="button"
              className="adm-btn-primary"
              onClick={() => {
                setFaqForm({ id: '', question: '', answer: '', category: 'General' })
                setFaqModalOpen(true)
              }}
            >
              <Plus size={13} />
              <span>Add FAQ</span>
            </button>
          </div>

          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Category</th>
                <th>Verified Answer</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td style={{ fontWeight: 600, maxWidth: '280px' }}>{faq.question}</td>
                  <td>
                    <span className="status-chip neutral">{faq.category}</span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--adm-text-muted)', maxWidth: '400px' }}>
                    {faq.answer}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button
                        type="button"
                        className="table-action-icon-btn"
                        onClick={() => {
                          setFaqForm(faq)
                          setFaqModalOpen(true)
                        }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="table-action-icon-btn"
                        onClick={() => handleDeleteFAQ(faq.id)}
                      >
                        <Trash2 size={13} style={{ color: 'var(--adm-danger)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Festival Modal */}
      {festModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setFestModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingFestival ? `Edit "${editingFestival.name}"` : 'Add New Cultural Festival'}</h3>
              <button type="button" className="sidebar-collapse-toggle" onClick={() => setFestModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveFestival}>
              <div className="modal-body">
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="fest-name">Festival Title</label>
                  <input
                    id="fest-name"
                    type="text"
                    className="adm-input"
                    required
                    value={festForm.name}
                    onChange={(e) => setFestForm({ ...festForm, name: e.target.value })}
                    placeholder="e.g. Bonalu Jathara"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="fest-state">State</label>
                    <input
                      id="fest-state"
                      type="text"
                      className="adm-input"
                      required
                      value={festForm.state}
                      onChange={(e) => setFestForm({ ...festForm, state: e.target.value })}
                    />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="fest-dates">Dates & Month</label>
                    <input
                      id="fest-dates"
                      type="text"
                      className="adm-input"
                      required
                      value={festForm.dates}
                      onChange={(e) => setFestForm({ ...festForm, dates: e.target.value })}
                      placeholder="July 15 - August 5"
                    />
                  </div>
                </div>
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="fest-places">Related Places (comma-separated)</label>
                  <input
                    id="fest-places"
                    type="text"
                    className="adm-input"
                    value={festForm.relatedPlaces}
                    onChange={(e) => setFestForm({ ...festForm, relatedPlaces: e.target.value })}
                    placeholder="Golconda Fort, Charminar"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="adm-btn-secondary" onClick={() => setFestModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  Save Festival
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setFaqModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{faqForm.id ? 'Edit FAQ Item' : 'Create FAQ Item'}</h3>
              <button type="button" className="sidebar-collapse-toggle" onClick={() => setFaqModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveFAQ}>
              <div className="modal-body">
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="faq-question">Question</label>
                  <input
                    id="faq-question"
                    type="text"
                    className="adm-input"
                    required
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="faq-category">Category</label>
                  <input
                    id="faq-category"
                    type="text"
                    className="adm-input"
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="faq-answer">Verified Answer</label>
                  <textarea
                    id="faq-answer"
                    className="adm-textarea"
                    rows={4}
                    required
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="adm-btn-secondary" onClick={() => setFaqModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
