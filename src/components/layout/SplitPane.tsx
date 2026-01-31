import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

interface SplitPaneProps {
  left: React.ReactNode
  right: React.ReactNode
}

const LAYOUT_STORAGE_KEY = 'redteam-panel-layout'

export function SplitPane({ left, right }: SplitPaneProps) {
  const handleLayout = (sizes: number[]) => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(sizes))
  }

  const getDefaultLayout = (): number[] => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return [50, 50]
      }
    }
    return [50, 50]
  }

  const defaultLayout = getDefaultLayout()

  return (
    <PanelGroup
      direction="horizontal"
      className="flex-1"
      onLayout={handleLayout}
    >
      <Panel defaultSize={defaultLayout[0]} minSize={30}>
        {left}
      </Panel>
      <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
      <Panel defaultSize={defaultLayout[1]} minSize={30}>
        {right}
      </Panel>
    </PanelGroup>
  )
}
