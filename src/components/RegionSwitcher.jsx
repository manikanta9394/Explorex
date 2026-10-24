import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check, Globe } from 'lucide-react'

const POPULAR_STATES = [
  { name: 'All India', slug: 'all', isAll: true, emoji: '🇮🇳' },
  { name: 'Tamil Nadu', slug: 'tamil-nadu', region: 'South', emoji: '🏛️' },
  { name: 'Rajasthan', slug: 'rajasthan', region: 'West', emoji: '🏰' },
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', region: 'North', emoji: '🕌' },
  { name: 'Maharashtra', slug: 'maharashtra', region: 'West', emoji: '🌊' },
  { name: 'Karnataka', slug: 'karnataka', region: 'South', emoji: '🪨' },
  { name: 'Kerala', slug: 'kerala', region: 'South', emoji: '🌴' },
  { name: 'Telangana', slug: 'telangana', region: 'South', emoji: '💎' },
  { name: 'Odisha', slug: 'odisha', region: 'East', emoji: '☀️' },
  { name: 'West Bengal', slug: 'west-bengal', region: 'East', emoji: '🐅' },
  { name: 'Delhi', slug: 'delhi', region: 'North', emoji: '🏛️' },
  { name: 'Punjab', slug: 'punjab', region: 'North', emoji: '🌾' },
  { name: 'Gujarat', slug: 'gujarat', region: 'West', emoji: '🦁' },
  { name: 'Himachal Pradesh', slug: 'himachal-pradesh', region: 'North', emoji: '🏔️' },
  { name: 'Goa', slug: 'goa', region: 'West', emoji: '🏖️' },
  { name: 'Jammu and Kashmir', slug: 'jammu-and-kashmir', region: 'North', emoji: '🛶' },
  { name: 'Ladakh', slug: 'ladakh', region: 'North', emoji: '❄️' },
  { name: 'Assam', slug: 'assam', region: 'Northeast', emoji: '🦏' },
  { name: 'Meghalaya', slug: 'meghalaya', region: 'Northeast', emoji: '🌿' },
  { name: 'Sikkim', slug: 'sikkim', region: 'Northeast', emoji: '🌸' },
]

export default function RegionSwitcher({ _currentRoute = '', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const menuRef = useRef(null)

  // Determine current active region label
  const activeLabel = (() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || ''
      const hash = window.location.hash || ''
      const searchParams = new URLSearchParams(window.location.search || (hash.includes('?') ? hash.split('?')[1] : ''))
      const stateParam = searchParams.get('state')
      if (stateParam) return stateParam

      const stateMatch = path.match(/\/states\/([^/?#]+)/) || hash.match(/#\/states\/([^/?#]+)/)
      if (stateMatch) {
        const found = POPULAR_STATES.find((s) => s.slug === stateMatch[1])
        if (found) return found.name
        return stateMatch[1].split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
    }
    return 'All India'
  })()

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const filtered = POPULAR_STATES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.region && s.region.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSelect = (item) => {
    setIsOpen(false)
    setSearch('')
    if (onNavigate) {
      if (item.isAll) {
        onNavigate('explore')
      } else {
        onNavigate(`states/${item.slug}`)
      }
    }
  }

  return (
    <div className="region-switcher-container" ref={menuRef}>
      <button
        type="button"
        className={`region-switcher-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Switch region or Indian State"
      >
        <span className="region-trigger-icon">
          <Globe size={14} />
        </span>
        <span className="region-trigger-text">{activeLabel}</span>
        <ChevronDown size={13} className={`chevron-arrow ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="region-dropdown-card" role="menu">
          <div className="region-dropdown-search-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search Indian state or territory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="region-options-list">
            {filtered.map((item) => {
              const isActive =
                (item.isAll && activeLabel === 'All India') ||
                (!item.isAll && activeLabel.toLowerCase() === item.name.toLowerCase())

              return (
                <button
                  key={item.slug}
                  type="button"
                  className={`region-option-item ${isActive ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  role="menuitem"
                >
                  <span className="region-item-emoji">{item.emoji}</span>
                  <div className="region-item-info">
                    <span className="region-item-name">{item.name}</span>
                    {item.region && <span className="region-item-sub">{item.region}</span>}
                  </div>
                  {isActive && <Check size={14} className="region-check-icon" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
