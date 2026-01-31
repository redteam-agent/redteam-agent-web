import { useRef, useCallback } from 'react'
import { Copy, Download } from 'lucide-react'
import { useTerminal } from '@/hooks/useTerminal'
import { useAgentStore } from '@/stores/agentStore'
import '@xterm/xterm/css/xterm.css'

export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  useTerminal(containerRef)
  const { terminalLines } = useAgentStore()

  const getTerminalContent = useCallback(() => {
    return terminalLines.map((line) => line.content).join('\n')
  }, [terminalLines])

  const handleCopy = useCallback(async () => {
    const content = getTerminalContent()
    await navigator.clipboard.writeText(content)
  }, [getTerminalContent])

  const handleDownload = useCallback(() => {
    const content = getTerminalContent()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `terminal-output-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [getTerminalContent])

  return (
    <div className="h-full flex flex-col bg-[#1a1b26]">
      <div className="h-10 border-b border-white/10 bg-[#1a1b26] px-4 flex items-center justify-between">
        <span className="text-sm text-white/60">Terminal Output</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Copy all"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Download log"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 p-2" />
    </div>
  )
}
