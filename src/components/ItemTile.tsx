import type { BuyItem } from '../types'
import { formatCardPrice } from '../utils/storage'

interface ItemTileProps {
  item: BuyItem
  slot: number
  selected: boolean
  quantity: number
  /** 1-based order in the buy bind when selected */
  order?: number
  onToggle: () => void
  onSetQuantity: (qty: number) => void
}

export function ItemTile({
  item,
  slot,
  selected,
  quantity,
  order,
  onToggle,
  onSetQuantity,
}: ItemTileProps) {
  const slotLabel = item.quantityLabel ?? String(slot)
  const maxQty = item.maxQuantity ?? 1
  const showQtyPicker = selected && maxQty > 1
  const displayPrice = item.price * (selected ? quantity : 1)

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={[
        'group relative aspect-[98/68] w-full overflow-hidden rounded-lg transition-all duration-300 ease-out',
        selected
          ? 'bg-[var(--accent-soft-bg)] shadow-[inset_0_0_0_2px_var(--accent-ring),0_0_22px_rgba(var(--accent-rgb),0.35)] scale-[1.01]'
          : 'bg-[rgba(0,0,0,0.55)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-[rgba(8,12,20,0.75)] hover:shadow-[inset_0_0_0_1px_rgba(var(--accent-rgb),0.35),0_0_16px_rgba(var(--accent-rgb),0.12)] hover:-translate-y-0.5',
      ].join(' ')}
    >
      {/* readable strip behind name / price */}
      <span
        className={[
          'pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-7 bg-gradient-to-t to-transparent',
          selected ? 'from-black/55' : 'from-black/70',
        ].join(' ')}
        aria-hidden
      />

      <span
        className={[
          'absolute left-1 top-0.5 z-10 text-[10px] font-semibold leading-none tabular-nums',
          selected ? 'text-[var(--accent-muted)]' : 'text-[#a3a3a3]',
        ].join(' ')}
      >
        {slotLabel}
      </span>

      {selected && order != null && (
        <span className="absolute right-1 top-0.5 z-10 flex h-4 min-w-4 items-center justify-center rounded-sm bg-[var(--accent)] px-0.5 text-[9px] font-black leading-none text-[var(--accent-on)]">
          {order}
        </span>
      )}

      <div
        className={[
          'absolute inset-x-1 bottom-5 top-3.5 flex items-center justify-center transition-transform duration-150',
          selected ? 'scale-[1.04]' : 'group-hover:scale-[1.02]',
        ].join(' ')}
      >
        <img
          src={item.image}
          alt=""
          className={[
            'max-h-full max-w-[88%] object-contain transition-[filter,opacity] duration-150',
            selected
              ? 'opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.12)]'
              : 'opacity-90 group-hover:opacity-100',
          ].join(' ')}
          loading="lazy"
          draggable={false}
        />
      </div>

      {showQtyPicker && (
        <div
          className="absolute bottom-1 left-1 z-20 flex gap-0.5"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {Array.from({ length: maxQty }, (_, i) => {
            const qty = i + 1
            const active = quantity === qty
            return (
              <span
                key={qty}
                role="button"
                tabIndex={0}
                onClick={() => onSetQuantity(qty)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSetQuantity(qty)
                  }
                }}
                className={[
                  'flex h-[18px] min-w-[18px] cursor-pointer items-center justify-center border text-[9px] font-bold leading-none',
                  active
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on)]'
                    : 'border-white/35 bg-black/55 text-white/90 hover:border-white/70',
                ].join(' ')}
              >
                {qty}
              </span>
            )
          })}
        </div>
      )}

      <span
        className={[
          'absolute bottom-0.5 z-10 max-w-[62%] truncate text-left text-[10px] font-semibold leading-tight tracking-tight',
          showQtyPicker ? 'left-12' : 'left-1',
          selected ? 'text-white' : 'text-[#e8e8e8]',
        ].join(' ')}
        title={item.name}
      >
        {item.name}
      </span>

      <span
        className={[
          'absolute bottom-0.5 right-1 z-10 text-[10px] font-bold leading-none tracking-tight tabular-nums',
          selected ? 'text-[var(--accent-muted)]' : 'text-[#d4d4d4]',
        ].join(' ')}
      >
        {formatCardPrice(displayPrice)}
      </span>
    </button>
  )
}
