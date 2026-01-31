import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ReasoningStep } from '@/types'

interface ReasoningDisplayProps {
  step: ReasoningStep
}

export function ReasoningDisplay({ step }: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-border rounded-lg mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <span>
          Step {step.step_number} Reasoning ({step.chain_type})
        </span>
      </button>
      {isExpanded && (
        <div className="px-3 py-2 text-sm text-muted-foreground border-t border-border">
          {step.text}
        </div>
      )}
    </div>
  )
}
