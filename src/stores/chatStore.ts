import { create } from 'zustand'
import type { ChatMessage, ReasoningStep } from '@/types'
import { generateId } from '@/lib/utils'

interface ChatState {
  messages: ChatMessage[]
  addMessage: (role: 'user' | 'agent', content: string) => void
  addReasoning: (messageId: string, reasoning: ReasoningStep) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: generateId(),
          role,
          content,
          timestamp: new Date().toISOString(),
          reasoning: [],
        },
      ],
    })),

  addReasoning: (messageId, reasoning) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, reasoning: [...(msg.reasoning || []), reasoning] }
          : msg
      ),
    })),

  clearMessages: () => set({ messages: [] }),
}))
