// Session and Run types
export interface Session {
  id: string;
  github_org: string;
  github_repo: string;
  gcp_project_id: string;
  gcp_region: string;
  gcp_service_name: string;
  created_at: string;
}

export interface AgentRun {
  id: string;
  session_id: string;
  app_name: string;
  app_description: string;
  app_url: string;
  status: RunStatus;
  current_stage: PipelineStage | null;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export type RunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'aborted';

export type PipelineStage =
  | 'processing_documents'
  | 'crawling_vulnerabilities'
  | 'scanning'
  | 'exploiting'
  | 'remediating'
  | 'creating_pr'
  | 'sending_email'
  | 'completed'
  | 'failed';

// WebSocket Event types
export interface AgentEvent {
  event_id: string;
  timestamp: string;
  event_type: string;
  session_id: string;
  run_id: string;
}

export interface ReasoningEvent extends AgentEvent {
  event_type: 'reasoning';
  step_number: number;
  chain_type: 'exploit' | 'remediation';
  reasoning_text: string;
}

export interface CommandEvent extends AgentEvent {
  event_type: 'command';
  step_number: number;
  command: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'timeout';
  executor_type: 'http' | 'shell' | 'cloudrun';
}

export interface OutputEvent extends AgentEvent {
  event_type: 'output';
  step_number: number;
  output: string;
  stream: 'stdout' | 'stderr';
  is_truncated: boolean;
}

export interface StageChangeEvent extends AgentEvent {
  event_type: 'stage_change';
  stage: PipelineStage;
  previous_stage: PipelineStage | null;
  message: string;
}

export interface ExploitResultEvent extends AgentEvent {
  event_type: 'exploit_result';
  success: boolean;
  vulnerability_id: string;
  vulnerability_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  summary: string;
  evidence: string | null;
}

export interface RemediationResultEvent extends AgentEvent {
  event_type: 'remediation_result';
  success: boolean;
  files_changed: string[];
  fix_summary: string;
  verification_passed: boolean;
  pr_url: string | null;
}

export interface ErrorEvent extends AgentEvent {
  event_type: 'error';
  error_code: string;
  error_message: string;
  recoverable: boolean;
  step_number: number | null;
}

export type AnyAgentEvent =
  | ReasoningEvent
  | CommandEvent
  | OutputEvent
  | StageChangeEvent
  | ExploitResultEvent
  | RemediationResultEvent
  | ErrorEvent;

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  reasoning?: ReasoningStep[];
}

export interface ReasoningStep {
  step_number: number;
  chain_type: 'exploit' | 'remediation';
  text: string;
}

// Terminal types
export interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'status';
  content: string;
  stream?: 'stdout' | 'stderr';
  status?: 'pending' | 'running' | 'success' | 'failed' | 'timeout';
  timestamp: string;
}

// Chain step types
export interface ChainStep {
  step_number: number;
  chain_type: 'exploit' | 'remediation';
  reasoning: string;
  command: string;
  command_status: 'pending' | 'running' | 'success' | 'failed' | 'timeout';
  output: string | null;
  started_at: string;
  completed_at: string | null;
}

// Document types
export interface Document {
  id: string;
  session_id: string;
  filename: string;
  doc_type: 'architecture_diagram' | 'api_doc' | 'tech_spec' | 'general';
  uploaded_at: string;
}

// Connection status
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
