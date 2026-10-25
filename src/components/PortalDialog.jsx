import { useEffect, useRef, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * Shared Portal Dialog Component (Modal / Drawer / Popover)
 * 
 * Complies with accessible dialog standards:
 * - Rendered directly into document.body via React portal
 * - Backdrop click to close
 * - Escape key to close
 * - Integrated accessible close button
 * - Focus trap ensuring Tab/Shift+Tab cycle strictly inside dialog
 * - Focus returning to trigger element upon closing
 * - Body scroll lock while dialog is mounted
 * - aria-modal="true", role="dialog", and aria-labelledby title binding
 * - Fluid entry/exit animation
 */
export default function PortalDialog({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  type = 'modal', // 'modal' | 'drawer' | 'popover'
  variant = 'default', // 'default' | 'emergency' | 'admin' | 'full'
  className = '',
  contentClassName = '',
  showCloseButton = true,
  closeButtonLabel = 'Close dialog',
  maxWidth,
  ariaLabel,
  headerContent = null,
  footerContent = null,
  raw = false,
}) {
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const backdropRef = useRef(null)
  const titleId = useId()
  const descId = useId()

  // 1. Capture trigger element on open & return focus on close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement
    } else if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [isOpen])

  // 2. Lock body scroll while open
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus()
      }
    }
  }, [isOpen])

  // 3. Escape key listener
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // 4. Focus Trap (Tab & Shift+Tab cycle within dialog)
  const handleKeyDownTrap = useCallback((e) => {
    if (e.key !== 'Tab' || !dialogRef.current) return

    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      '[tabindex]:not([tabindex="-1"])',
      '[contentEditable=true]',
    ].join(', ')

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll(focusableSelectors)
    ).filter((el) => el.offsetParent !== null)

    if (focusableElements.length === 0) {
      e.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstElement || !dialogRef.current.contains(document.activeElement)) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement || !dialogRef.current.contains(document.activeElement)) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }, [])

  // 5. Auto-focus dialog on mount
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return

    const timer = setTimeout(() => {
      const focusTarget =
        dialogRef.current?.querySelector('[data-autofocus]') ||
        dialogRef.current?.querySelector('button:not(.portal-close-btn), input, select, textarea') ||
        dialogRef.current?.querySelector('.portal-close-btn') ||
        dialogRef.current

      focusTarget?.focus?.()
    }, 50)

    return () => clearTimeout(timer)
  }, [isOpen])

  // Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose?.()
    }
  }

  if (!isOpen || typeof document === 'undefined') {
    return null
  }

  // Determine container classes
  const isDrawer = type === 'drawer'
  const isEmergency = variant === 'emergency'
  const backdropClasses = [
    'portal-dialog-backdrop',
    isDrawer ? 'portal-drawer-backdrop' : 'portal-modal-backdrop',
    isEmergency ? 'portal-emergency-backdrop' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const contentClasses = raw && contentClassName
    ? contentClassName
    : [
        'portal-dialog-card',
        isDrawer ? 'portal-drawer-card' : 'portal-modal-card',
        isEmergency ? 'portal-emergency-card' : '',
        contentClassName,
      ]
        .filter(Boolean)
        .join(' ')

  const dialogElement = (
    <div
      ref={backdropRef}
      className={backdropClasses}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDownTrap}
    >
      <div
        ref={dialogRef}
        className={contentClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? descId : undefined}
        aria-label={!title ? ariaLabel || 'Dialog' : undefined}
        tabIndex={-1}
        style={maxWidth ? { maxWidth } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {raw ? (
          children
        ) : (
          <>
            {/* Close Button */}
            {showCloseButton && (
              <button
                type="button"
                className="portal-close-btn"
                onClick={onClose}
                aria-label={closeButtonLabel}
                title={closeButtonLabel}
              >
                <X size={18} />
              </button>
            )}

            {/* Optional Header */}
            {(title || headerContent) && (
              <div className="portal-dialog-header">
                {title && (
                  <div className="portal-title-block">
                    <h3 id={titleId} className="portal-dialog-title">
                      {title}
                    </h3>
                    {subtitle && (
                      <p id={descId} className="portal-dialog-subtitle">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
                {headerContent}
              </div>
            )}

            {/* Body Content */}
            <div className="portal-dialog-body">{children}</div>

            {/* Optional Footer */}
            {footerContent && <div className="portal-dialog-footer">{footerContent}</div>}
          </>
        )}
      </div>
    </div>
  )

  return createPortal(dialogElement, document.body)
}

// Convenient Named Wrappers
export function Modal(props) {
  return <PortalDialog type="modal" {...props} />
}

export function Drawer(props) {
  return <PortalDialog type="drawer" {...props} />
}

export function Popover(props) {
  return <PortalDialog type="popover" {...props} />
}

export function SOSModal(props) {
  return <PortalDialog type="modal" variant="emergency" {...props} />
}
