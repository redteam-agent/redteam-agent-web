import { useAgentStore } from '@/stores/agentStore'
import type { PipelineStage } from '@/types'

const STAGES: { key: PipelineStage; label: string }[] = [
  { key: 'processing_documents', label: 'Docs' },
  { key: 'crawling_vulnerabilities', label: 'Crawl' },
  { key: 'scanning', label: 'Scan' },
  { key: 'exploiting', label: 'Exploit' },
  { key: 'remediating', label: 'Fix' },
  { key: 'creating_pr', label: 'PR' },
  { key: 'completed', label: 'Done' },
]

export function StageProgress() {
  const { currentStage } = useAgentStore()

  if (!currentStage) return null

  const currentIndex = STAGES.findIndex((s) => s.key === currentStage)

  return (
    <div className="flex items-center gap-1">
      {STAGES.map((stage, index) => {
        const isActive = stage.key === currentStage
        const isComplete = index < currentIndex
        const isFailed = currentStage === 'failed'

        return (
          <div key={stage.key} className="flex items-center">
            <div
              className={`px-2 py-1 text-xs rounded ${
                isActive
                  ? isFailed
                    ? 'bg-red-500/20 text-red-500'
                    : 'bg-primary text-primary-foreground animate-pulse'
                  : isComplete
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {stage.label}
            </div>
            {index < STAGES.length - 1 && (
              <div
                className={`w-4 h-0.5 ${
                  isComplete ? 'bg-green-500' : 'bg-border'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
