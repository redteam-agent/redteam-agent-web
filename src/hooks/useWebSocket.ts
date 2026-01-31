import { useEffect, useRef, useCallback } from 'react'
import { AgentWebSocket } from '@/api/websocket'
import { useAgentStore } from '@/stores/agentStore'
import type { AnyAgentEvent } from '@/types'

export function useWebSocket(sessionId: string | null, token: string | null) {
  const wsRef = useRef<AgentWebSocket | null>(null)
  const { setConnectionStatus, handleEvent } = useAgentStore()

  const connect = useCallback(() => {
    if (!sessionId || !token) return

    if (wsRef.current) {
      wsRef.current.disconnect()
    }

    const ws = new AgentWebSocket(sessionId, token)

    ws.onConnection((status) => {
      setConnectionStatus(status === 'connected' ? 'connected' : 'disconnected')
    })

    ws.onEvent((event: AnyAgentEvent) => {
      handleEvent(event)
    })

    ws.connect()
    wsRef.current = ws
  }, [sessionId, token, setConnectionStatus, handleEvent])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect()
      wsRef.current = null
    }
  }, [])

  const sendAbort = useCallback(() => {
    wsRef.current?.sendAbort()
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return { connect, disconnect, sendAbort }
}
