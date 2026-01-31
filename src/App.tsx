import { Header } from '@/components/layout/Header'
import { SplitPane } from '@/components/layout/SplitPane'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { TerminalPanel } from '@/components/terminal/TerminalPanel'
import { Toaster } from '@/components/ui/Toaster'

function App() {
  return (
    <div className="h-screen flex flex-col bg-background dark">
      <Header />
      <SplitPane
        left={<ChatPanel />}
        right={<TerminalPanel />}
      />
      <Toaster />
    </div>
  )
}

export default App
