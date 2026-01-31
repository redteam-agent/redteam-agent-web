import { useState } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ReasoningStep } from '@/types'

interface ReasoningDisplayProps {
  step: ReasoningStep
}

export function ReasoningDisplay({ step }: ReasoningDisplayProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors rounded-lg border border-border mt-2">
        {open ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <span>
          Step {step.step_number} Reasoning ({step.chain_type})
        </span>
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
        <div className="px-3 py-2 text-sm text-muted-foreground border-x border-b border-border rounded-b-lg">
          {step.text}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
