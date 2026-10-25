import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  MapPin,
  Image,
  Users,
  MessageSquare,
  Sparkles,
  BookOpen,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import AdminCommandPalette from './AdminCommandPalette'
import './admin.css'

export default function AdminLayout({ children, currentRoute, onNavigate }) {
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('explorex_admin_theme') || 'slate-dark'
  })
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false)
  const [pendingGKey, setPendingGKey] = useState(false)

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-admin-theme', theme)
    localStorage.setItem('explorex_admin_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'slate-dark' ? 'slate-light' : 'slate-dark'))
  }

  // Keyboard shortcut listeners (Cmd+K and g + <key>)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input or textarea
      const tag = e.target.tagName.toLowerCase()
      const isInput = tag === 'input' || tag === 'textarea' || e.target.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdPaletteOpen((prev) => !prev)
        return
      }

      if (isInput) return

      if (e.key.toLowerCase() === 'g') {
        setPendingGKey(true)
        setTimeout(() => setPendingGKey(false), 1200)
        return
      }

      if (pendingGKey) {
        setPendingGKey(false)
        const key = e.key.toLowerCase()
        if (key === 'd') { e.preventDefault(); onNavigate?.('/admin'); }
        else if (key === 'p') { e.preventDefault(); onNavigate?.('/admin/places'); }
        else if (key === 'i') { e.preventDefault(); onNavigate?.('/admin/images'); }
        else if (key === 'u') { e.preventDefault(); onNavigate?.('/admin/users'); }
        else if (key === 'f') { e.preventDefault(); onNavigate?.('/admin/feedback'); }
        else if (key === 'q') { e.preventDefault(); onNavigate?.('/admin/ai-quality'); }
        else if (key === 'c') { e.preventDefault(); onNavigate?.('/admin/content'); }
        else if (key === 'a') { e.preventDefault(); onNavigate?.('/admin/audit-logs'); }
        else if (key === 's') { e.preventDefault(); onNavigate?.('/admin/settings'); }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pendingGKey, onNavigate])

  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, path: '/admin', shortcut: 'g d' },
    { id: 'places', label: 'Places', icon: MapPin, path: '/admin/places', shortcut: 'g p' },
    { id: 'images', label: 'Image Queue', icon: Image, path: '/admin/images', shortcut: 'g i' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users', shortcut: 'g u' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/admin/feedback', shortcut: 'g f' },
    { id: 'ai', label: 'AI Quality', icon: Sparkles, path: '/admin/ai-quality', shortcut: 'g q' },
    { id: 'content', label: 'Content', icon: BookOpen, path: '/admin/content', shortcut: 'g c' },
    { id: 'audit', label: 'Audit Log', icon: History, path: '/admin/audit-logs', shortcut: 'g a' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings', shortcut: 'g s' },
  ]

  const activePath = currentRoute?.route || '/admin'
  const currentNavItem = navItems.find((item) => activePath === item.path || activePath.startsWith(item.path + '/'))

  return (
    <div className="admin-app-root">
      {/* Collapsible Left Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Admin Navigation Sidebar">
        <div className="sidebar-header">
          {!collapsed && (
            <div className="admin-brand">
              <div className="brand-icon-box">E</div>
              <div className="brand-title-group">
                <span className="brand-name">Explorex Admin</span>
                <span className="brand-badge">Ops Console</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="brand-icon-box" style={{ margin: '0 auto' }}>E</div>
          )}
          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav-scroll">
          {!collapsed && <div className="sidebar-group-label">Core Operations</div>}
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === '/admin'
                ? activePath === '/admin'
                : activePath === item.path || activePath.startsWith(item.path)

            return (
              <a
                key={item.id}
                href={`#${item.path}`}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate?.(item.path)
                }}
                title={collapsed ? `${item.label} (${item.shortcut})` : undefined}
              >
                <span className="sidebar-nav-icon">
                  <Icon size={16} />
                </span>
                {!collapsed && (
                  <>
                    <span className="sidebar-nav-label">{item.label}</span>
                    <span className="kbd-shortcut-chip" style={{ opacity: 0.6 }}>{item.shortcut.split(' ')[1]}</span>
                  </>
                )}
              </a>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          {!collapsed ? (
            <div className="sidebar-admin-user">
              <div className="admin-avatar-tiny">
                {(user?.display_name || user?.email || 'A')[0].toUpperCase()}
              </div>
              <div className="admin-meta-mini">
                <span className="admin-name-mini" title={user?.email || 'Admin'}>
                  {user?.display_name || user?.email?.split('@')[0] || 'Administrator'}
                </span>
                <span className="admin-role-tag" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={10} /> 2FA Active
                </span>
              </div>
            </div>
          ) : (
            <div className="admin-avatar-tiny" style={{ margin: '0 auto' }}>
              {(user?.display_name || user?.email || 'A')[0].toUpperCase()}
            </div>
          )}
        </div>
      </aside>

      {/* Main Admin Stage */}
      <div className="admin-main-stage">
        {/* Top Bar */}
        <header className="admin-top-bar">
          <div className="top-bar-left">
            <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
              <span>Admin</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{currentNavItem?.label || 'Overview'}</span>
            </nav>

            <button
              type="button"
              className="top-bar-cmd-palette-btn"
              onClick={() => setCmdPaletteOpen(true)}
              aria-label="Open Command Palette"
            >
              <Search size={13} />
              <span>Search actions or places...</span>
              <kbd className="kbd-shortcut-chip">⌘K</kbd>
            </button>
          </div>

          <div className="top-bar-right">
            {/* Theme Switcher */}
            <button
              type="button"
              className="top-action-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'slate-dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle slate theme"
            >
              {theme === 'slate-dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'slate-dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* View Site */}
            <button
              type="button"
              className="top-action-btn"
              onClick={() => onNavigate?.('/')}
              title="Open User Explorer Application"
            >
              <ExternalLink size={14} />
              <span>View Site</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              className="top-action-btn"
              onClick={async () => {
                await signOut?.()
                onNavigate?.('/admin/login')
              }}
              title="Log out from Admin Console"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-page-content" id="admin-main-content">
          {children}
        </main>
      </div>

      {/* Global Cmd+K Command Palette Modal */}
      <AdminCommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  )
}
