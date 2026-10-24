import { useState, useEffect, useRef } from 'react'
import {
  Search,
  LayoutDashboard,
  MapPin,
  Image,
  Users,
  MessageSquare,
  Sparkles,
  BookOpen,
  History,
  Settings,
  Plus,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react'

export default function AdminCommandPalette({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const COMMANDS = [
    { id: 'dash', label: 'Go to Dashboard Overview', section: 'Navigation', icon: LayoutDashboard, path: '/admin' },
    { id: 'places', label: 'Go to Places Management Table', section: 'Navigation', icon: MapPin, path: '/admin/places' },
    { id: 'create_place', label: 'Create New Destination / Monument', section: 'Actions', icon: Plus, path: '/admin/places?action=new' },
    { id: 'images', label: 'Go to Image Candidate Review Queue', section: 'Navigation', icon: Image, path: '/admin/images' },
    { id: 'users', label: 'Go to Users & Access Management', section: 'Navigation', icon: Users, path: '/admin/users' },
    { id: 'cleanup', label: 'Trigger Guest Explorer Account Cleanup', section: 'Actions', icon: Trash2, path: '/admin/users?action=cleanup' },
    { id: 'feedback', label: 'Go to Feedback & Wrong Info Inbox', section: 'Navigation', icon: MessageSquare, path: '/admin/feedback' },
    { id: 'ai', label: 'Go to AI Quality & Evaluation Hub', section: 'Navigation', icon: Sparkles, path: '/admin/ai-quality' },
    { id: 'content', label: 'Go to Content (Festivals, FAQs, Banner)', section: 'Navigation', icon: BookOpen, path: '/admin/content' },
    { id: 'audit', label: 'Go to Immutable Audit Log', section: 'Navigation', icon: History, path: '/admin/audit-logs' },
    { id: 'settings', label: 'Go to System Settings & Feature Flags', section: 'Navigation', icon: Settings, path: '/admin/settings' },
    { id: 'user_app', label: 'Switch to User Application', section: 'App', icon: ExternalLink, path: '/' },
  ]

  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          onNavigate(filtered[selectedIndex].path)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, onNavigate, onClose])

  if (!isOpen) return null

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="cmd-palette-box" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-palette-search">
          <Search size={16} color="var(--adm-text-dim)" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-palette-input"
            placeholder="Type a command, section, or jump target... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
          />
          <button type="button" className="sidebar-collapse-toggle" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div className="cmd-palette-results">
          {filtered.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--adm-text-dim)', fontSize: '12px' }}>
              No matching admin commands found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={item.id}
                  className={`cmd-palette-item ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    onNavigate(item.path)
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={14} color={isSelected ? '#FFFFFF' : 'var(--adm-text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '10.5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      opacity: 0.7,
                    }}
                  >
                    {item.section}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
