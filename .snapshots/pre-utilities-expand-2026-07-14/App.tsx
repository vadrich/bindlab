import { useState } from 'react'
import { ArsenalTabs } from './components/ArsenalTabs'
import { BuyGrid } from './components/BuyGrid'
import { Sidebar } from './components/Sidebar'
import { UsageCounter } from './components/UsageCounter'
import { ITEM_MAP } from './data/items'
import { DEFAULT_NET_DISPLAY, type NetDisplayConfig } from './data/netDisplay'
import type { ArsenalTab } from './types/modes'

export default function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [bindKey, setBindKey] = useState('')
  const [arsenalTab, setArsenalTab] = useState<ArsenalTab>('weapons')
  const [netDisplaySelected, setNetDisplaySelected] = useState(false)
  const [netDisplayConfig, setNetDisplayConfig] =
    useState<NetDisplayConfig>(DEFAULT_NET_DISPLAY)

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        setQuantities((q) => {
          const next = { ...q }
          delete next[id]
          return next
        })
        return prev.filter((x) => x !== id)
      }
      setQuantities((q) => ({ ...q, [id]: 1 }))
      return [...prev, id]
    })
  }

  const setItemQuantity = (id: string, qty: number) => {
    const max = ITEM_MAP[id]?.maxQuantity ?? 1
    const clamped = Math.max(1, Math.min(max, qty))
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setQuantities((q) => ({ ...q, [id]: clamped }))
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white" data-theme={arsenalTab}>
      <header className="border-b border-[#2a3340] bg-[#121820] px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--accent)]">
              CS2 Bind Configurator
            </h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Генератор команд покупки для Counter-Strike 2
            </p>
          </div>
          <UsageCounter />
        </div>
      </header>

      <main className="mx-auto grid max-w-[1480px] gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 gap-2">
          <ArsenalTabs tab={arsenalTab} onChange={setArsenalTab} />
          <BuyGrid
            tab={arsenalTab}
            selectedIds={selectedIds}
            quantities={quantities}
            onToggle={toggleItem}
            onSetQuantity={setItemQuantity}
            netDisplaySelected={netDisplaySelected}
            onToggleNetDisplay={() => setNetDisplaySelected((v) => !v)}
            netDisplayConfig={netDisplayConfig}
            onNetDisplayConfigChange={setNetDisplayConfig}
            bindKey={bindKey}
            onBindKeyChange={setBindKey}
          />
        </div>

        <Sidebar
          tab={arsenalTab}
          selectedIds={selectedIds}
          quantities={quantities}
          bindKey={bindKey}
          onBindKeyChange={setBindKey}
          netDisplaySelected={netDisplaySelected}
          netDisplayConfig={netDisplayConfig}
        />
      </main>
    </div>
  )
}
