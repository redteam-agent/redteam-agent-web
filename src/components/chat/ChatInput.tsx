import { useState } from 'react'
import { Send } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'

export function ChatInput() {
  const [input, setInput] = useState('')
  const { addMessage } = useChatStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    addMessage('user', input.trim())
    setInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border p-4 flex gap-2"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter app details or ask a question..."
        className="flex-1 bg-secondary text-secondary-foreground rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}
