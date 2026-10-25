import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Search,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Download,
  Upload,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  X,
  MapPin,
} from 'lucide-react'
import { adminService } from '../../services/adminService'
import { allDatasetPlaces } from '../../data/tourismData'
import { resolveImageSrc } from '../../utils/imageUtils'
import { AdminWidgetErrorBoundary } from '../../components/ErrorBoundary'

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 15

  // Filters
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [filterMissingImage, setFilterMissingImage] = useState(false)
  const [filterStaleData, setFilterStaleData] = useState(false)

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState(null)
  const [duplicateWarning, setDuplicateWarning] = useState('')
  const [coordError, setCoordError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'attraction',
    category: 'Heritage',
    lat: 17.385,
    lng: 78.4867,
    description: '',
    price_amount: 50,
    price_unit: 'per person',
    price_note: 'Entry ticket for adults',
    source_url: 'https://asi.nic.in',
    last_verified_at: new Date().toISOString().slice(0, 10),
    opening_hours: '09:00 - 17:30',
    best_time: 'October to March',
    image_url: '',
    image_license: 'CC BY-SA 4.0',
    image_attribution: 'Wikimedia Commons',
    rules_json: '["Modest clothing requested", "Photography allowed with permit"]',
    is_published: true,
  })

  // Load places
  const loadPlaces = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminService.fetchPlaces({
        page,
        limit,
        search,
        state: selectedState,
        type: selectedType,
        published: selectedStatus === 'published' ? 'true' : selectedStatus === 'draft' ? 'false' : undefined,
      })
      if (res && res.places) {
        let items = res.places

        if (filterMissingImage) {
          items = items.filter((p) => !p.image && !p.imageUrl && !p.place_images?.length)
        }

        if (filterStaleData) {
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
          items = items.filter((p) => {
            const dt = p.last_verified_at ? new Date(p.last_verified_at) : null
            return !dt || dt < sixMonthsAgo
          })
        }

        setPlaces(items)
        setTotal(res.total || items.length)
      }
    } catch (err) {
      console.error('Failed to load places:', err)
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, selectedState, selectedType, selectedStatus, filterMissingImage, filterStaleData])

  useEffect(() => {
    loadPlaces()
  }, [loadPlaces])

  // Get unique states from all dataset
  const availableStates = useMemo(() => {
    const states = new Set(allDatasetPlaces.map((p) => p.state).filter(Boolean))
    return Array.from(states).sort()
  }, [])

  const handleOpenCreate = () => {
    setEditingPlace(null)
    setFormData({
      name: '',
      slug: '',
      state: 'Telangana',
      city: 'Hyderabad',
      type: 'attraction',
      category: 'Heritage',
      lat: 17.385,
      lng: 78.4867,
      description: '',
      price_amount: 50,
      price_unit: 'per person',
      price_note: 'Verified entry fee',
      source_url: 'https://asi.nic.in',
      last_verified_at: new Date().toISOString().slice(0, 10),
      opening_hours: '09:00 - 17:30',
      best_time: 'October to March',
      image_url: '',
      image_license: 'CC BY-SA 4.0',
      image_attribution: 'Wikimedia Commons',
      rules_json: '["Valid ID proof required for entry"]',
      is_published: true,
    })
    setDuplicateWarning('')
    setCoordError('')
    setModalOpen(true)
  }

  const handleOpenEdit = (p) => {
    setEditingPlace(p)
    const lat = typeof p.lat === 'number' ? p.lat : (p.coordinates ? p.coordinates[0] : 17.385)
    const lng = typeof p.lng === 'number' ? p.lng : (p.coordinates ? p.coordinates[1] : 78.4867)

    setFormData({
      id: p.id,
      name: p.name || '',
      slug: p.slug || p.id || '',
      state: p.state || 'Telangana',
      city: p.city || '',
      type: p.type || 'attraction',
      category: p.category || 'General',
      lat,
      lng,
      description: p.description || '',
      price_amount: p.price_amount ?? (p.priceInr || 0),
      price_unit: p.price_unit || 'per person',
      price_note: p.price_note || '',
      source_url: p.source_url || p.officialSourceUrl || '',
      last_verified_at: p.last_verified_at ? p.last_verified_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      opening_hours: p.opening_hours || p.timings || '',
      best_time: p.best_time || p.bestTimeToVisit || '',
      image_url: p.image || p.imageUrl || '',
      image_license: p.license || 'CC BY-SA 4.0',
      image_attribution: p.attribution || 'Wikimedia Commons',
      rules_json: JSON.stringify(p.rules || ['Entry subject to local guidelines']),
      is_published: p.is_published !== false,
    })
    setDuplicateWarning('')
    setCoordError('')
    setModalOpen(true)
  }

  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingPlace ? prev.slug : slug,
    }))

    // Duplicate detection check
    const existing = allDatasetPlaces.find(
      (item) => item.name.toLowerCase() === name.toLowerCase().trim() && (!editingPlace || item.id !== editingPlace.id)
    )
    if (existing) {
      setDuplicateWarning(`Warning: Place "${existing.name}" already exists in ${existing.state} (${existing.id}).`)
    } else {
      setDuplicateWarning('')
    }
  }

  const handleSavePlace = async (e) => {
    e.preventDefault()
    setCoordError('')

    const lat = parseFloat(formData.lat)
    const lng = parseFloat(formData.lng)

    // India geographic boundary validation: Lat [6.0, 37.5], Lng [68.0, 98.0]
    if (isNaN(lat) || lat < 6.0 || lat > 37.5 || isNaN(lng) || lng < 68.0 || lng > 98.0) {
      setCoordError(`Invalid Indian coordinates: Lat must be between 6.0 and 37.5, Lng between 68.0 and 98.0 (Given: ${lat}, ${lng})`)
      return
    }

    let parsedRules = []
    try {
      parsedRules = JSON.parse(formData.rules_json)
      if (!Array.isArray(parsedRules)) parsedRules = [formData.rules_json]
    } catch {
      parsedRules = formData.rules_json.split('\n').filter(Boolean)
    }

    const payload = {
      ...formData,
      id: editingPlace ? editingPlace.id : formData.slug,
      lat,
      lng,
      rules: parsedRules,
    }

    try {
      await adminService.savePlace(payload)
      setModalOpen(false)
      setActionSuccess(`Place "${payload.name}" saved and verified successfully.`)
      setTimeout(() => setActionSuccess(''), 4000)
      loadPlaces()
    } catch (err) {
      alert(`Save failed: ${err.message}`)
    }
  }

  const handleTogglePublish = async (p) => {
    try {
      await adminService.togglePublishPlace(p.id)
      setActionSuccess(`Status toggled for ${p.name}`)
      setTimeout(() => setActionSuccess(''), 3000)
      loadPlaces()
    } catch (err) {
      alert(`Publish toggle failed: ${err.message}`)
    }
  }

  const handleDeletePlace = async (p) => {
    if (!confirm(`Are you sure you want to soft-delete "${p.name}"? It will be removed from public view.`)) {
      return
    }
    try {
      await adminService.softDeletePlace(p.id)
      setActionSuccess(`Place "${p.name}" soft-deleted.`)
      setTimeout(() => setActionSuccess(''), 3000)
      loadPlaces()
    } catch (err) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  const handleExportCSV = () => {
    const headers = ['id', 'name', 'state', 'city', 'type', 'category', 'price_inr', 'is_published']
    const rows = places.map((p) => [
      `"${p.id}"`,
      `"${p.name || ''}"`,
      `"${p.state || ''}"`,
      `"${p.city || ''}"`,
      `"${p.type || 'attraction'}"`,
      `"${p.category || ''}"`,
      p.price_amount ?? p.priceInr ?? 0,
      p.is_published !== false ? 'true' : 'false',
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `explorex_places_export_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="admin-page-header">
        <div className="page-title-group">
          <h2>Destination & Place Management</h2>
          <p>Curate verified Indian attractions, verify entry pricing in INR, and inspect geo-boundaries</p>
        </div>

        <div className="header-action-group">
          <button type="button" className="adm-btn-secondary" onClick={handleExportCSV}>
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="adm-btn-primary" onClick={handleOpenCreate}>
            <Plus size={14} />
            <span>Create New Place</span>
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

      {/* Main Table Container */}
      <AdminWidgetErrorBoundary name="AdminPlacesTable">
        <div className="admin-table-container">
        {/* Table Filters & Toolbar */}
        <div className="table-toolbar">
          <div className="toolbar-left">
            <div className="admin-search-wrap">
              <Search size={13} className="search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search destination, city, or tag..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            {/* State Filter */}
            <select
              className="admin-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by state"
            >
              <option value="">All States ({availableStates.length})</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              className="admin-select"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by type"
            >
              <option value="">All Types</option>
              <option value="attraction">Attraction</option>
              <option value="stay">Stay</option>
              <option value="food">Food</option>
            </select>

            {/* Status Filter */}
            <select
              className="admin-select"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setPage(1)
              }}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft / Unpublished</option>
            </select>
          </div>

          <div className="toolbar-right">
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', cursor: 'pointer', color: 'var(--adm-text-muted)' }}>
              <input
                type="checkbox"
                checked={filterMissingImage}
                onChange={(e) => setFilterMissingImage(e.target.checked)}
              />
              Missing Image
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', cursor: 'pointer', color: 'var(--adm-text-muted)' }}>
              <input
                type="checkbox"
                checked={filterStaleData}
                onChange={(e) => setFilterStaleData(e.target.checked)}
              />
              Stale (&gt;6mo)
            </label>
          </div>
        </div>

        {/* Data Table */}
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Place / Destination</th>
              <th>State & City</th>
              <th>Category / Type</th>
              <th>Entry Fee</th>
              <th>Verification</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                  Loading destinations database...
                </td>
              </tr>
            ) : places.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--adm-text-dim)' }}>
                  No destinations match the active criteria.
                </td>
              </tr>
            ) : (
              places.map((p) => {
                const isPub = p.is_published !== false
                const price = p.price_amount ?? p.priceInr ?? 0
                const verifiedDate = p.last_verified_at ? p.last_verified_at.slice(0, 10) : 'Pending'

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            background: 'var(--adm-surface-raised)',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={resolveImageSrc(p.image || p.imageUrl) || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=100'}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=100'
                            }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--adm-text)' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--adm-text-dim)' }}>ID: {p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.state}</div>
                      <div style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>{p.city}</div>
                    </td>
                    <td>
                      <span className="status-chip neutral">{p.category || 'Attraction'}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {price === 0 ? 'Free' : `₹${price}`}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', color: 'var(--adm-text-muted)' }}>{verifiedDate}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(p)}
                        className={`status-chip ${isPub ? 'published' : 'draft'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to toggle publish status"
                      >
                        {isPub ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="table-action-icon-btn"
                          onClick={() => handleOpenEdit(p)}
                          title="Edit place metadata & coordinates"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="table-action-icon-btn"
                          onClick={() => handleDeletePlace(p)}
                          title="Soft delete place"
                        >
                          <Trash2 size={13} style={{ color: 'var(--adm-danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination Row */}
        <div className="table-pagination-row">
          <span>
            Showing {places.length} of {total} destinations
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="adm-btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span style={{ padding: '0 8px', fontWeight: 600 }}>Page {page}</span>
            <button
              type="button"
              className="adm-btn-secondary"
              disabled={places.length < limit}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      </AdminWidgetErrorBoundary>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPlace ? `Edit "${editingPlace.name}"` : 'Create New Destination'}</h3>
              <button type="button" className="sidebar-collapse-toggle" onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePlace}>
              <div className="modal-body">
                {duplicateWarning && (
                  <div
                    style={{
                      background: 'var(--adm-warning-bg)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'var(--adm-warning)',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <span>{duplicateWarning}</span>
                  </div>
                )}

                {coordError && (
                  <div
                    style={{
                      background: 'var(--adm-danger-bg)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      color: 'var(--adm-danger)',
                      fontSize: '12px',
                    }}
                  >
                    {coordError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-name">Destination Name</label>
                    <input
                      id="place-name"
                      type="text"
                      className="adm-input"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Golconda Fort"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-slug">Slug Identifier</label>
                    <input
                      id="place-slug"
                      type="text"
                      className="adm-input"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="golconda-fort-hyderabad"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-state">State</label>
                    <input
                      id="place-state"
                      type="text"
                      className="adm-input"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Telangana"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-city">City / District</label>
                    <input
                      id="place-city"
                      type="text"
                      className="adm-input"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Hyderabad"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-category">Category</label>
                    <input
                      id="place-category"
                      type="text"
                      className="adm-input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Heritage / Nature"
                    />
                  </div>
                </div>

                {/* Coordinates & India Boundary Check */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-lat">Latitude (India: 6.0 to 37.5)</label>
                    <input
                      id="place-lat"
                      type="number"
                      step="any"
                      className="adm-input"
                      required
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-lng">Longitude (India: 68.0 to 98.0)</label>
                    <input
                      id="place-lng"
                      type="number"
                      step="any"
                      className="adm-input"
                      required
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    />
                  </div>
                </div>

                {/* Price & Source Verification */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-price">Price (₹ INR)</label>
                    <input
                      id="place-price"
                      type="number"
                      className="adm-input"
                      value={formData.price_amount}
                      onChange={(e) => setFormData({ ...formData, price_amount: Number(e.target.value) })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-source">Official Source URL</label>
                    <input
                      id="place-source"
                      type="url"
                      className="adm-input"
                      value={formData.source_url}
                      onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                      placeholder="https://asi.nic.in"
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-label" htmlFor="place-verified">Last Verified At</label>
                    <input
                      id="place-verified"
                      type="date"
                      className="adm-input"
                      value={formData.last_verified_at}
                      onChange={(e) => setFormData({ ...formData, last_verified_at: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="place-desc">Factual Summary</label>
                  <textarea
                    id="place-desc"
                    className="adm-textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Concise, verified description from official / Wikipedia sources..."
                  />
                </div>

                {/* Rules Editor */}
                <div className="adm-form-group">
                  <label className="adm-label" htmlFor="place-rules">Rules & Visitor Guidelines (JSON array or one per line)</label>
                  <textarea
                    id="place-rules"
                    className="adm-textarea"
                    rows={2}
                    value={formData.rules_json}
                    onChange={(e) => setFormData({ ...formData, rules_json: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="adm-btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  {editingPlace ? 'Update Destination' : 'Create & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
