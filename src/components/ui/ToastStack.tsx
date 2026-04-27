import { useEffect } from 'react'
import type { ToastMessage } from '../../types/models'

interface ToastStackProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        onDismiss(toast.id)
      }, 4500),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [toasts, onDismiss])

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast toast--${toast.tone}`}>
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
            x
          </button>
        </article>
      ))}
    </div>
  )
}
