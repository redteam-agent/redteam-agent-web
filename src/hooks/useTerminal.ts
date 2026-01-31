import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { useAgentStore } from '@/stores/agentStore'

export function useTerminal(containerRef: React.RefObject<HTMLDivElement>) {
  const terminalRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const { terminalLines } = useAgentStore()
  const lastLineCountRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return

    const terminal = new Terminal({
      theme: {
        background: '#1a1b26',
        foreground: '#a9b1d6',
        cursor: '#c0caf5',
        cursorAccent: '#1a1b26',
        red: '#f7768e',
        green: '#9ece6a',
        yellow: '#e0af68',
        blue: '#7aa2f7',
        magenta: '#bb9af7',
        cyan: '#7dcfff',
        white: '#c0caf5',
      },
      fontFamily: 'JetBrains Mono, Menlo, Monaco, monospace',
      fontSize: 14,
      cursorBlink: false,
      disableStdin: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(webLinksAddon)

    terminal.open(containerRef.current)
    fitAddon.fit()

    terminalRef.current = terminal
    fitAddonRef.current = fitAddon

    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [containerRef])

  // Write new lines to terminal
  useEffect(() => {
    if (!terminalRef.current) return

    const newLines = terminalLines.slice(lastLineCountRef.current)
    lastLineCountRef.current = terminalLines.length

    newLines.forEach((line) => {
      let output = line.content

      // Apply colors based on type
      if (line.type === 'command') {
        output = `\x1b[32m${output}\x1b[0m` // Green for commands
      } else if (line.stream === 'stderr') {
        output = `\x1b[31m${output}\x1b[0m` // Red for stderr
      } else if (line.type === 'status') {
        if (output.includes('[✓]')) {
          output = `\x1b[32m${output}\x1b[0m` // Green for success
        } else if (output.includes('[✗]') || output.includes('[ERROR]')) {
          output = `\x1b[31m${output}\x1b[0m` // Red for failure
        } else {
          output = `\x1b[33m${output}\x1b[0m` // Yellow for info
        }
      }

      terminalRef.current?.writeln(output)
    })
  }, [terminalLines])

  return { terminal: terminalRef.current }
}
