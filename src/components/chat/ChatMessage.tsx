import type { ChatMessage as ChatMessageType } from '@/types'
import { ReasoningDisplay } from './ReasoningDisplay'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.role === 'agent'

  return (
    <div
      className={cn(
        'flex gap-3',
        isAgent ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          isAgent
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        )}
      >
        {isAgent ? 'A' : 'U'}
      </div>
      <div
        className={cn(
          'flex-1 max-w-[80%]',
          isAgent ? 'text-left' : 'text-right'
        )}
      >
        <div
          className={cn(
            'rounded-lg px-4 py-2 inline-block',
            isAgent
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-primary text-primary-foreground'
          )}
        >
          <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
            {message.content}
          </ReactMarkdown>
        </div>
        {message.reasoning && message.reasoning.length > 0 && (
          <div className="mt-2">
            {message.reasoning.map((step, index) => (
              <ReasoningDisplay key={index} step={step} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
