import { create } from 'zustand'
import type {
  Session,
  AgentRun,
  PipelineStage,
  ChainStep,
  TerminalLine,
  ConnectionStatus,
  AnyAgentEvent,
} from '@/types'
import { generateId } from '@/lib/utils'

interface AgentState {
  // Connection
  connectionStatus: ConnectionStatus

  // Session/Run
  session: Session | null
  run: AgentRun | null

  // Pipeline
  currentStage: PipelineStage | null
  stageMessage: string

  // Chains
  exploitChain: ChainStep[]
  remediationChain: ChainStep[]

  // Terminal
  terminalLines: TerminalLine[]

  // Results
  exploitsSuccessful: number
  fixesApplied: number
  prUrl: string | null

  // Actions
  setConnectionStatus: (status: ConnectionStatus) => void
  setSession: (session: Session | null) => void
  setRun: (run: AgentRun | null) => void
  handleEvent: (event: AnyAgentEvent) => void
  addTerminalLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void
  reset: () => void
}

const initialState = {
  connectionStatus: 'disconnected' as ConnectionStatus,
  session: null,
  run: null,
  currentStage: null,
  stageMessage: '',
  exploitChain: [],
  remediationChain: [],
  terminalLines: [],
  exploitsSuccessful: 0,
  fixesApplied: 0,
  prUrl: null,
}

export const useAgentStore = create<AgentState>((set, get) => ({
  ...initialState,

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setSession: (session) => set({ session }),

  setRun: (run) => set({ run }),

  handleEvent: (event) => {
    switch (event.event_type) {
      case 'stage_change':
        set({
          currentStage: event.stage,
          stageMessage: event.message,
        })
        break

      case 'command':
        get().addTerminalLine({
          type: 'command',
          content: `$ ${event.command}`,
          status: event.status,
        })
        break

      case 'output':
        get().addTerminalLine({
          type: 'output',
          content: event.output,
          stream: event.stream,
        })
        break

      case 'exploit_result':
        if (event.success) {
          set((state) => ({
            exploitsSuccessful: state.exploitsSuccessful + 1,
          }))
        }
        get().addTerminalLine({
          type: 'status',
          content: event.success
            ? `[✓] Exploit successful: ${event.summary}`
            : `[✗] Exploit failed: ${event.summary}`,
        })
        break

      case 'remediation_result':
        if (event.success) {
          set((state) => ({
            fixesApplied: state.fixesApplied + 1,
            prUrl: event.pr_url || state.prUrl,
          }))
        }
        get().addTerminalLine({
          type: 'status',
          content: event.success
            ? `[✓] Fix applied: ${event.fix_summary}`
            : `[✗] Fix failed: ${event.fix_summary}`,
        })
        break

      case 'error':
        get().addTerminalLine({
          type: 'status',
          content: `[ERROR] ${event.error_message}`,
          stream: 'stderr',
        })
        break
    }
  },

  addTerminalLine: (line) =>
    set((state) => ({
      terminalLines: [
        ...state.terminalLines,
        {
          ...line,
          id: generateId(),
          timestamp: new Date().toISOString(),
        },
      ],
    })),

  reset: () => set(initialState),
}))
