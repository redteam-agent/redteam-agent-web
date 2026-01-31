# Integration Contracts

This document defines how `redteam-agent-web` integrates with the API service.

## API Client

### REST API

Base URL: `VITE_API_URL` (default: `http://localhost:8000`)

#### Sessions

```typescript
// Create session
POST /api/v1/sessions
Request: { github_org, github_repo, gcp_project_id, gcp_region, gcp_service_name }
Response: Session

// Get session
GET /api/v1/sessions/{id}
Response: Session
```

#### Agent Runs

```typescript
// Start run
POST /api/v1/sessions/{session_id}/runs
Request: { app_name, app_description, app_url, additional_context? }
Response: AgentRun

// Get run
GET /api/v1/runs/{id}
Response: AgentRun

// Get run steps
GET /api/v1/runs/{id}/steps
Response: { steps: ChainStep[] }

// Abort run
POST /api/v1/runs/{id}/abort
Response: { status: 'aborting', message: string }
```

#### Documents

```typescript
// Upload document
POST /api/v1/sessions/{session_id}/documents
Request: FormData with 'file' and 'type'
Response: Document

// List documents
GET /api/v1/sessions/{session_id}/documents
Response: { documents: Document[] }
```

---

## WebSocket Events

WebSocket URL: `VITE_WS_URL` (default: `ws://localhost:8000`)

Connection: `ws://host/ws/agent/{session_id}?token={jwt}`

### Events Received (Server → Client)

All events extend this base:
```typescript
interface AgentEvent {
  event_id: string;
  timestamp: string;  // ISO 8601
  event_type: string;
  session_id: string;
  run_id: string;
}
```

#### reasoning
Display in left panel (chat/reasoning area).

```typescript
interface ReasoningEvent extends AgentEvent {
  event_type: 'reasoning';
  step_number: number;
  chain_type: 'exploit' | 'remediation';
  reasoning_text: string;  // From GLM-4.7 <think> tags
}
```

**Display**: Add as collapsible section under agent message.

#### command
Display in right panel (terminal).

```typescript
interface CommandEvent extends AgentEvent {
  event_type: 'command';
  step_number: number;
  command: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'timeout';
  executor_type: 'http' | 'shell' | 'cloudrun';
}
```

**Display**: Add line with `$` prefix, show status indicator.

#### output
Display in right panel (terminal).

```typescript
interface OutputEvent extends AgentEvent {
  event_type: 'output';
  step_number: number;
  output: string;
  stream: 'stdout' | 'stderr';
  is_truncated: boolean;
}
```

**Display**: Append to terminal. Use red color for stderr.

#### stage_change
Update progress indicator.

```typescript
interface StageChangeEvent extends AgentEvent {
  event_type: 'stage_change';
  stage: PipelineStage;
  previous_stage: PipelineStage | null;
  message: string;
}

type PipelineStage =
  | 'processing_documents'
  | 'crawling_vulnerabilities'
  | 'scanning'
  | 'exploiting'
  | 'remediating'
  | 'creating_pr'
  | 'sending_email'
  | 'completed'
  | 'failed';
```

**Display**: Update stage progress component.

#### exploit_result
Display in both panels.

```typescript
interface ExploitResultEvent extends AgentEvent {
  event_type: 'exploit_result';
  success: boolean;
  vulnerability_id: string;
  vulnerability_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  summary: string;
  evidence: string | null;
}
```

**Display**:
- Left panel: Add summary message
- Right panel: Add status line with checkmark/X

#### remediation_result
Display in both panels.

```typescript
interface RemediationResultEvent extends AgentEvent {
  event_type: 'remediation_result';
  success: boolean;
  files_changed: string[];
  fix_summary: string;
  verification_passed: boolean;
  pr_url: string | null;
}
```

**Display**:
- Left panel: Add summary with PR link
- Right panel: Add status line

#### error
Display in both panels.

```typescript
interface ErrorEvent extends AgentEvent {
  event_type: 'error';
  error_code: string;
  error_message: string;
  recoverable: boolean;
  step_number: number | null;
}
```

**Display**: Show error toast/notification, add to terminal if step-related.

### Messages Sent (Client → Server)

#### ping
Keep-alive message.

```json
{ "type": "ping" }
```

Response: `{ "type": "pong" }`

#### abort
Request to abort the current run.

```json
{ "type": "abort" }
```

Response: `{ "type": "ack", "message": "Abort requested" }`

---

## Component Layout

### Left Panel (Chat & Reasoning)

```
┌─────────────────────────────────────┐
│  Chat Messages                      │
│  ┌────────────────────────────────┐ │
│  │ [User Avatar]                  │ │
│  │ Start security assessment      │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ [Agent Avatar]                 │ │
│  │ I'll begin by analyzing...    │ │
│  │                                │ │
│  │ ▼ Step 1 Reasoning             │ │ ← Collapsible
│  │   Based on the SQL injection   │ │
│  │   vulnerability identified...  │ │
│  │                                │ │
│  │ ▼ Step 2 Reasoning             │ │
│  │   The login endpoint...        │ │
│  └────────────────────────────────┘ │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ [Input field]         [Send]  │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Right Panel (Terminal)

```
┌─────────────────────────────────────┐
│  Terminal Output                    │
│  ┌────────────────────────────────┐ │
│  │ $ curl -X POST https://app...  │ │
│  │ HTTP/1.1 200 OK                │ │
│  │ Content-Type: application/json │ │
│  │ {"status": "success"}          │ │
│  │ [✓] Request complete (1.2s)    │ │
│  │                                │ │
│  │ $ sqlmap -u "https://app..."   │ │
│  │ [*] testing connection...      │ │
│  │ [*] testing 'id' parameter     │ │
│  │ [!] parameter is vulnerable    │ │
│  │ [✓] SQL injection confirmed    │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## State Management

### Zustand Stores

#### agentStore
Main agent state.

```typescript
interface AgentState {
  // Connection
  connectionStatus: ConnectionStatus;

  // Session/Run
  session: Session | null;
  run: AgentRun | null;

  // Pipeline
  currentStage: PipelineStage | null;
  stageMessage: string;

  // Chains
  exploitChain: ChainStep[];
  remediationChain: ChainStep[];

  // Terminal
  terminalLines: TerminalLine[];

  // Results
  exploitsSuccessful: number;
  fixesApplied: number;
  prUrl: string | null;

  // Event handler
  handleEvent: (event: AnyAgentEvent) => void;
}
```

#### chatStore
Chat-specific state.

```typescript
interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}
```

---

## Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── SessionInfo
│   └── StageProgress
├── SplitPane
│   ├── ChatPanel (left)
│   │   ├── ChatMessages
│   │   │   ├── ChatMessage
│   │   │   └── ReasoningDisplay
│   │   ├── DocumentUpload
│   │   └── ChatInput
│   └── TerminalPanel (right)
│       ├── TerminalHeader
│       └── TerminalOutput (xterm.js)
└── Toaster (notifications)
```
