import { useRef } from 'react'
import { useTerminal } from '@/hooks/useTerminal'
import '@xterm/xterm/css/xterm.css'

export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  useTerminal(containerRef)

  return (
    <div className="h-full flex flex-col bg-[#1a1b26]">
      <div className="h-10 border-b border-border bg-background px-4 flex items-center">
        <span className="text-sm text-muted-foreground">Terminal Output</span>
      </div>
      <div ref={containerRef} className="flex-1 p-2" />
    </div>
  )
}
