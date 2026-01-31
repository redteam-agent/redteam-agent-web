import { useAgentStore } from '@/stores/agentStore'
import { StageProgress } from '@/components/agent/StageProgress'

export function Header() {
  const { connectionStatus, session } = useAgentStore()

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">RedTeam Agent</h1>
        {session && (
          <span className="text-sm text-muted-foreground">
            {session.github_org}/{session.github_repo}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <StageProgress />
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-green-500'
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-muted-foreground capitalize">
            {connectionStatus}
          </span>
        </div>
      </div>
    </header>
  )
}
