import { useEffect } from 'react'

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container" id="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const icons = { success: '✅', error: '❌', info: 'ℹ️' }

  return (
    <div className={`toast ${toast.type || 'info'}`} id={`toast-${toast.id}`}>
      <span className="toast-icon">{icons[toast.type] || icons.info}</span>
      <span>{toast.message}</span>
    </div>
  )
}
