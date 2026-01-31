import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

interface SplitPaneProps {
  left: React.ReactNode
  right: React.ReactNode
}

export function SplitPane({ left, right }: SplitPaneProps) {
  return (
    <PanelGroup direction="horizontal" className="flex-1">
      <Panel defaultSize={50} minSize={30}>
        {left}
      </Panel>
      <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
      <Panel defaultSize={50} minSize={30}>
        {right}
      </Panel>
    </PanelGroup>
  )
}
