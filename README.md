# RedTeam Agent Web

React frontend for the RedTeam Agent platform. Provides a split-pane interface with chat/reasoning on the left and terminal output on the right.

## Overview

This frontend provides:
- **Left Panel**: Chat interface for user input and agent reasoning display
- **Right Panel**: Terminal-like interface showing command execution and output
- **Progress Indicator**: Pipeline stage progress
- **Document Upload**: Architecture diagrams and technical specs

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          redteam-agent-web                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         Header                                        │   │
│  │  [Logo]  [Session Info]  [Settings]                [Stage Progress]  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────────┐   │
│  │       LEFT PANEL            │  │         RIGHT PANEL                 │   │
│  │                             │  │                                     │   │
│  │  ┌───────────────────────┐  │  │  ┌─────────────────────────────┐   │   │
│  │  │    Chat Messages      │  │  │  │     Terminal Output         │   │   │
│  │  │                       │  │  │  │                             │   │   │
│  │  │  User: Start scan     │  │  │  │  $ curl -X POST ...         │   │   │
│  │  │                       │  │  │  │  HTTP/1.1 200 OK            │   │   │
│  │  │  Agent: Analyzing...  │  │  │  │  {"status": "success"}      │   │   │
│  │  │  ▼ Reasoning          │  │  │  │  [✓] Request complete       │   │   │
│  │  │    Based on the SQL   │  │  │  │                             │   │   │
│  │  │    injection vuln...  │  │  │  │  $ sqlmap -u ...            │   │   │
│  │  │                       │  │  │  │  [*] Testing parameter...   │   │   │
│  │  └───────────────────────┘  │  │  └─────────────────────────────┘   │   │
│  │                             │  │                                     │   │
│  │  ┌───────────────────────┐  │  │                                     │   │
│  │  │    Chat Input         │  │  │                                     │   │
│  │  │  [Type a message...]  │  │  │                                     │   │
│  │  └───────────────────────┘  │  │                                     │   │
│  └─────────────────────────────┘  └─────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Features

### Left Panel - Chat & Reasoning
- Chat history with user and agent messages
- Collapsible reasoning sections (from GLM-4.7 `<think>` tags)
- Document upload button
- App details form
- Markdown rendering

### Right Panel - Terminal
- xterm.js terminal emulator
- Command display with status indicators
- Streaming output display
- ANSI color support
- Copy/export functionality

### Progress Indicator
- Visual pipeline stage progress
- Current stage highlighting
- Stage timing

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Terminal**: @xterm/xterm
- **WebSocket**: Native WebSocket API
- **HTTP Client**: fetch API

## Configuration

Environment variables (`.env`):

```bash
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Directory Structure

```
src/
├── main.tsx                    # App entry point
├── App.tsx                     # Main app component
├── api/
│   ├── client.ts              # REST API client
│   └── websocket.ts           # WebSocket client
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── chat/
│   │   ├── ChatPanel.tsx      # Left panel container
│   │   ├── ChatMessage.tsx    # Chat message component
│   │   ├── ChatInput.tsx      # Input with send button
│   │   └── ReasoningDisplay.tsx # Collapsible reasoning
│   ├── terminal/
│   │   └── TerminalPanel.tsx  # Right panel with xterm.js
│   ├── layout/
│   │   ├── SplitPane.tsx      # Resizable split pane
│   │   └── Header.tsx         # Top header bar
│   └── agent/
│       └── StageProgress.tsx  # Pipeline progress
├── hooks/
│   ├── useWebSocket.ts        # WebSocket connection hook
│   └── useTerminal.ts         # Terminal hook
├── stores/
│   ├── agentStore.ts          # Main agent state
│   └── chatStore.ts           # Chat state
├── types/
│   └── index.ts               # TypeScript types
└── lib/
    └── utils.ts               # Utility functions
```

## WebSocket Events

The frontend receives these events from the API:

| Event Type | Panel | Description |
|------------|-------|-------------|
| `reasoning` | Left | Agent reasoning text |
| `command` | Right | Command being executed |
| `output` | Right | Command output |
| `stage_change` | Header | Pipeline stage update |
| `exploit_result` | Both | Exploit attempt result |
| `remediation_result` | Both | Remediation result |
| `error` | Both | Error notification |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```

## License

MIT
