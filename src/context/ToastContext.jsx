import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext({
  showToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info', duration = 3200) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      const toast = { id, message, type }

      setToasts((prev) => [...prev, toast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
      return id
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="explorex-toast-container" aria-live="polite" role="region" aria-label="Notifications">
        {toasts.map((toast) => {
          let Icon = Info
          let badgeColor = '#C9A227'
          if (toast.type === 'success') {
            Icon = CheckCircle2
            badgeColor = '#10B981'
          } else if (toast.type === 'error') {
            Icon = AlertCircle
            badgeColor = '#EF4444'
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle
            badgeColor = '#F59E0B'
          }

          return (
            <div key={toast.id} className={`explorex-toast-item toast-${toast.type}`}>
              <div className="toast-icon-wrap" style={{ color: badgeColor }}>
                <Icon size={18} />
              </div>
              <p className="toast-message">{toast.message}</p>
              <button
                type="button"
                className="toast-close-btn"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss toast"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
