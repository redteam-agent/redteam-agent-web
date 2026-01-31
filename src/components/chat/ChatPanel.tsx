import { useChatStore } from '@/stores/chatStore'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

export function ChatPanel() {
  const { messages } = useChatStore()

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a security assessment by entering app details below.</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      <ChatInput />
    </div>
  )
}
