import {

  CATEGORY_META,

  CATEGORY_ORDER,

  calcTotal,

  getItemsByCategory,

} from '../data/items'

import type { NetDisplayConfig } from '../data/netDisplay'

import type { ArsenalTab } from '../types/modes'

import { formatPrice } from '../utils/storage'

import { ItemTile } from './ItemTile'

import { UtilitiesPanel } from './UtilitiesPanel'



interface BuyGridProps {

  tab: ArsenalTab

  selectedIds: string[]

  quantities: Record<string, number>

  onToggle: (id: string) => void

  onSetQuantity: (id: string, qty: number) => void

  netDisplaySelected: boolean

  onToggleNetDisplay: () => void

  netDisplayConfig: NetDisplayConfig

  onNetDisplayConfigChange: (config: NetDisplayConfig) => void

  bindKey: string

  onBindKeyChange: (key: string) => void

}



export function BuyGrid({

  tab,

  selectedIds,

  quantities,

  onToggle,

  onSetQuantity,

  netDisplaySelected,

  onToggleNetDisplay,

  netDisplayConfig,

  onNetDisplayConfigChange,

  bindKey,

  onBindKeyChange,

}: BuyGridProps) {

  const isWeapons = tab === 'weapons'

  const total = calcTotal(selectedIds, quantities)

  const count = selectedIds.reduce((n, id) => n + (quantities[id] ?? 1), 0)



  return (

    <section className="relative flex min-w-0 flex-1 flex-col rounded-lg border border-[#2a3340] bg-[#121820]">

      <div className="flex items-center justify-between border-b border-[#2a3340] px-4 py-3">

        <span

          className={[

            'text-lg font-bold text-white',

            isWeapons ? '' : 'invisible',

          ].join(' ')}

        >

          {formatPrice(total)}

        </span>

        <span

          className={[

            'text-xs font-semibold uppercase tracking-widest text-[#6b7280]',

            isWeapons ? '' : 'invisible',

          ].join(' ')}

        >

          {count} SELECTED

        </span>

      </div>



      <div className="relative flex-1 overflow-x-auto p-2.5">

        <div

          className={[

            'grid min-w-[640px] grid-cols-6 gap-1.5 lg:min-w-0',

            isWeapons ? '' : 'invisible pointer-events-none select-none',

          ].join(' ')}

          aria-hidden={!isWeapons}

        >

          {CATEGORY_ORDER.map((category) => {

            const items = getItemsByCategory(category)

            const meta = CATEGORY_META[category]



            return (

              <div key={category} className="flex min-w-0 flex-col gap-1">

                <h3 className="mb-0.5 text-center text-[8px] font-bold uppercase tracking-wider text-[#6b7280]">

                  {meta.label}

                </h3>

                {items.map((item, index) => (

                  <ItemTile

                    key={item.id}

                    item={item}

                    slot={index + 1}

                    selected={selectedIds.includes(item.id)}

                    quantity={quantities[item.id] ?? 1}

                    onToggle={() => onToggle(item.id)}

                    onSetQuantity={(qty) => onSetQuantity(item.id, qty)}

                  />

                ))}

              </div>

            )

          })}

        </div>



        {!isWeapons && (

          <div className="absolute inset-0 overflow-auto p-4">

            <UtilitiesPanel

              selected={netDisplaySelected}

              onSelect={onToggleNetDisplay}

              config={netDisplayConfig}

              onConfigChange={onNetDisplayConfigChange}

              bindKey={bindKey}

              onBindKeyChange={onBindKeyChange}

            />

          </div>

        )}

      </div>



      <p

        className={[

          'border-t border-[#2a3340] px-4 py-2 text-center text-[10px] uppercase tracking-widest text-[#4b5563]',

          isWeapons ? '' : 'invisible',

        ].join(' ')}

      >

        Click items to add to bind · selected total shown above

      </p>

    </section>

  )

}

