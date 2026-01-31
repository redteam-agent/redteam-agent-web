/**
 * WebSocket client for real-time agent events
 */

import type { AnyAgentEvent } from '@/types'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

type EventHandler = (event: AnyAgentEvent) => void
type ConnectionHandler = (status: 'connected' | 'disconnected' | 'error') => void

export class AgentWebSocket {
  private ws: WebSocket | null = null
  private sessionId: string
  private token: string
  private eventHandlers: EventHandler[] = []
  private connectionHandlers: ConnectionHandler[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private pingInterval: number | null = null

  constructor(sessionId: string, token: string) {
    this.sessionId = sessionId
    this.token = token
  }

  connect() {
    const url = `${WS_URL}/ws/agent/${this.sessionId}?token=${this.token}`
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.notifyConnection('connected')
      this.startPing()
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'pong') return
        this.notifyEvent(data as AnyAgentEvent)
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    this.ws.onclose = () => {
      this.stopPing()
      this.notifyConnection('disconnected')
      this.attemptReconnect()
    }

    this.ws.onerror = () => {
      this.notifyConnection('error')
    }
  }

  disconnect() {
    this.stopPing()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  sendAbort() {
    this.send({ type: 'abort' })
  }

  onEvent(handler: EventHandler) {
    this.eventHandlers.push(handler)
    return () => {
      this.eventHandlers = this.eventHandlers.filter((h) => h !== handler)
    }
  }

  onConnection(handler: ConnectionHandler) {
    this.connectionHandlers.push(handler)
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter((h) => h !== handler)
    }
  }

  private send(data: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private startPing() {
    this.pingInterval = window.setInterval(() => {
      this.send({ type: 'ping' })
    }, 30000)
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    setTimeout(() => {
      this.connect()
    }, delay)
  }

  private notifyEvent(event: AnyAgentEvent) {
    this.eventHandlers.forEach((handler) => handler(event))
  }

  private notifyConnection(status: 'connected' | 'disconnected' | 'error') {
    this.connectionHandlers.forEach((handler) => handler(status))
  }
}
