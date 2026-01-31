import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'info' | 'success' | 'error'
}

// Simple toast store
const toastListeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

export function toast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const id = Math.random().toString(36).substring(2, 9)
  toasts = [...toasts, { id, message, type }]
  toastListeners.forEach((listener) => listener(toasts))

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    toastListeners.forEach((listener) => listener(toasts))
  }, 5000)
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    toastListeners.push(setCurrentToasts)
    return () => {
      const index = toastListeners.indexOf(setCurrentToasts)
      if (index > -1) toastListeners.splice(index, 1)
    }
  }, [])

  const dismiss = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id)
    toastListeners.forEach((listener) => listener(toasts))
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
            t.type === 'error'
              ? 'bg-red-500 text-white'
              : t.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          <span className="text-sm">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
