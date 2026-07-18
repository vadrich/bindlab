import { useMemo } from 'react'
import { BUY_PRESETS } from '../data/buyPresets'
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  calcTotal,
  getItemsByCategory,
} from '../data/items'
import type { UtilitiesConfig, UtilityId } from '../data/utilities'
import type { BuyBind } from '../utils/buyBinds'
import { useMessages } from '../i18n/I18nProvider'
import type { ArsenalTab } from '../types/modes'
import type { SearchTarget } from '../data/configSearch'
import type { KeyConflict } from '../utils/bindConflicts'
import { isTabSearchHighlight, searchSpotlightClass } from '../utils/searchHighlight'
import {
  findLoadoutConflicts,
  type LoadoutGroup,
} from '../utils/loadoutGroups'
import type { ConfigSnapshot } from '../utils/siteConfigs'
import { formatPrice } from '../utils/storage'
import { HomeIdlePanel, type HomeHintMode } from './HomeIdlePanel'
import { ItemTile } from './ItemTile'
import { NotificationsPanel } from './NotificationsPanel'
import { ProfilePanel } from './ProfilePanel'
import { UnbindPanel } from './UnbindPanel'
import { UtilitiesPanel } from './UtilitiesPanel'
import { WelcomeGuide } from './WelcomeGuide'

interface BuyGridProps {
  tab: ArsenalTab | null
  selectedIds: string[]
  quantities: Record<string, number>
  onToggle: (id: string) => void
  onSetQuantity: (id: string, qty: number) => void
  /** One-click buy loadout presets */
  onApplyBuyPreset?: (presetId: string) => void
  utilitySelectedIds: UtilityId[]
  utilityActiveId: UtilityId | null
  utilityView: 'home' | 'detail'
  onOpenUtility: (id: UtilityId) => void
  onBackUtility: () => void
  onOpenWeapons: () => void
  onApplySnapshot: (snapshot: ConfigSnapshot) => void
  utilitiesConfig: UtilitiesConfig
  onUtilitiesConfigChange: (config: UtilitiesConfig) => void
  bindKey: string
  buyBinds: BuyBind[]
  onBindKeyChange: (key: string) => void
  onRemoveBuyBind?: (id: string) => void
  onOpenBuyBind?: (id: string) => void
  conflicts: KeyConflict[]
  matchSidebarHeight?: boolean
  /** Show first-visit / help guide in the center panel */
  showGuide?: boolean
  onDismissGuide?: () => void
  /** Post-welcome / ! tour with colored arrows */
  homeHint?: HomeHintMode | null
  searchHighlight?: SearchTarget | null
}

export function BuyGrid({
  tab,
  selectedIds,
  quantities,
  onToggle,
  onSetQuantity,
  onApplyBuyPreset,
  utilitySelectedIds,
  utilityActiveId,
  utilityView,
  onOpenUtility,
  onBackUtility,
  onOpenWeapons,
  onApplySnapshot,
  utilitiesConfig,
  onUtilitiesConfigChange,
  bindKey,
  buyBinds,
  onBindKeyChange,
  onRemoveBuyBind,
  onOpenBuyBind,
  conflicts,
  matchSidebarHeight = false,
  showGuide = false,
  onDismissGuide,
  homeHint = null,
  searchHighlight = null,
}: BuyGridProps) {
  const m = useMessages()
  const isIdle = tab == null
  const isWeapons = tab === 'weapons'
  const isUtilities = tab === 'utilities'
  const isUnbind = tab === 'unbind'
  const isProfile = tab === 'profile'
  const isNotifications = tab === 'notifications'
  const total = calcTotal(selectedIds, quantities)
  const count = selectedIds.reduce((n, id) => n + (quantities[id] ?? 1), 0)

  const loadoutConflicts = useMemo(
    () => (isWeapons ? findLoadoutConflicts(selectedIds) : []),
    [isWeapons, selectedIds],
  )

  const loadoutGroupMessage = (group: LoadoutGroup) => {
    const b = m.tips.loadoutBanner
    switch (group) {
      case 'armor':
        return b.armor
      case 'pistol':
        return b.pistol
      case 'primary':
        return b.primary
      case 'fire_nade':
        return b.fire_nade
    }
  }
  const showUtilityBack = isUtilities && utilityView === 'detail' && !showGuide

  const headerTitle = showGuide
    ? m.guide.openTitle
    : homeHint
      ? m.guide.homeTitle
      : isIdle
        ? m.guide.openTitle
        : isUnbind
          ? m.buy.unbindTitle
          : isProfile
            ? m.buy.profileTitle
            : isNotifications
              ? m.buy.notificationsTitle
              : m.buy.utilitiesTitle

  return (
    <section
      key={tab ?? 'home'}
      className={[
        'panel-enter ui-panel relative flex min-w-0 flex-1 flex-col',
        matchSidebarHeight ? 'h-full min-h-0 overflow-hidden' : '',
      ].join(' ')}
    >
      <div className="relative z-[1] flex shrink-0 items-center justify-between rounded-t-[var(--radius-panel)] border-b border-white/[0.07] bg-gradient-to-r from-[rgba(var(--accent-rgb),0.1)] via-transparent to-transparent px-4 py-3">
        {showGuide || homeHint || isIdle ? (
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-dim)]">
            {headerTitle}
          </span>
        ) : isWeapons ? (
          <span className="font-display text-lg font-bold tabular-nums text-white drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.35)]">
            {formatPrice(total)}
          </span>
        ) : showUtilityBack ? (
          <button
            type="button"
            onClick={onBackUtility}
            className="ui-btn-ghost flex items-center gap-2 !normal-case tracking-normal"
            title={m.common.back}
          >
            <span className="text-base leading-none" aria-hidden>
              ←
            </span>
            <span>{m.common.back}</span>
          </button>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
            {headerTitle}
          </span>
        )}

        {isUnbind && !showGuide && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            {m.buy.unbindBanner}
          </span>
        )}

        <span
          className={[
            'text-xs font-semibold uppercase tracking-widest',
            isWeapons && !showGuide
              ? count > 0
                ? 'text-[var(--accent-muted)]'
                : 'text-[#6b7280]'
              : 'invisible',
          ].join(' ')}
        >
          {count} {m.buy.selected}
        </span>
      </div>

      {showGuide && onDismissGuide ? (
        <div className="relative z-[1] min-h-0 flex-1 overflow-auto p-4">
          <WelcomeGuide onDismiss={onDismissGuide} />
        </div>
      ) : homeHint ? (
        <div className="relative z-[1] min-h-0 flex-1 overflow-auto p-4">
          <HomeIdlePanel mode={homeHint} />
        </div>
      ) : isIdle ? (
        <div className="relative z-[1] min-h-0 flex-1 overflow-auto p-4">
          <HomeIdlePanel mode="start" />
        </div>
      ) : isWeapons ? (
        <div
          className={[
            'relative z-[1] flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-lg border border-transparent',
            searchSpotlightClass(isTabSearchHighlight(searchHighlight, 'weapons')),
          ].join(' ')}
        >
          {onApplyBuyPreset ? (
            <div className="shrink-0 border-b border-[var(--accent)]/25 bg-black/25 px-3 py-2.5">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent-muted)]">
                {m.buyPresets.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BUY_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onApplyBuyPreset(preset.id)}
                    className="rounded-lg border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft-bg)]"
                  >
                    {m.buyPresets[preset.labelKey]}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-[#6b7280]">
                {m.buyPresets.hint}
              </p>
            </div>
          ) : null}
          {loadoutConflicts.length > 0 && (
            <div className="shrink-0 border-b border-[var(--accent)]/30 bg-[var(--accent-soft)] px-3 py-2.5">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                {m.tips.loadoutBanner.title}
              </p>
              <ul className="flex flex-col gap-1">
                {loadoutConflicts.map((c) => (
                  <li
                    key={c.group}
                    className="text-[11px] leading-relaxed text-[#e5e7eb]"
                  >
                    {loadoutGroupMessage(c.group)}
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 text-[10px] leading-relaxed text-[#9ca3af]">
                {m.tips.loadoutBanner.orderNote}
              </p>
            </div>
          )}
          <div className="relative min-h-0 flex-1 overflow-x-auto p-3">
          <div className="grid min-w-[720px] grid-cols-6 gap-2 lg:min-w-0">
            {CATEGORY_ORDER.map((category) => {
              const items = getItemsByCategory(category)
              const meta = CATEGORY_META[category]
              const selectedInCat = items.filter((it) =>
                selectedIds.includes(it.id),
              ).length

              return (
                <div key={category} className="flex min-w-0 flex-col gap-1.5">
                  <h3 className="mb-0.5 flex items-center justify-center gap-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-[#9ca3af]">
                    <span>{meta.label}</span>
                    {selectedInCat > 0 && (
                      <span className="rounded bg-[var(--accent-soft)] px-1 py-px font-mono text-[8px] tabular-nums text-[var(--accent)]">
                        {selectedInCat}
                      </span>
                    )}
                  </h3>
                  {items.map((item, index) => {
                    const selected = selectedIds.includes(item.id)
                    return (
                      <ItemTile
                        key={item.id}
                        item={item}
                        slot={index + 1}
                        selected={selected}
                        quantity={quantities[item.id] ?? 1}
                        order={
                          selected ? selectedIds.indexOf(item.id) + 1 : undefined
                        }
                        onToggle={() => onToggle(item.id)}
                        onSetQuantity={(qty) => onSetQuantity(item.id, qty)}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
          </div>
        </div>
      ) : isUtilities ? (
        <div
          className={[
            'relative z-[1] p-4',
            utilityView === 'detail' ? 'min-h-0 flex-1 overflow-auto' : '',
            searchSpotlightClass(
              isTabSearchHighlight(searchHighlight, 'utilities') &&
                searchHighlight?.type === 'tab',
            ),
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <UtilitiesPanel
            view={utilityView}
            selectedIds={utilitySelectedIds}
            activeId={utilityActiveId}
            onOpen={onOpenUtility}
            config={utilitiesConfig}
            onConfigChange={onUtilitiesConfigChange}
            bindKey={bindKey}
            onBindKeyChange={onBindKeyChange}
            searchHighlight={searchHighlight}
          />
        </div>
      ) : isProfile ? (
        <div
          className={[
            'relative z-[1] rounded-b-lg border border-transparent p-4',
            searchSpotlightClass(isTabSearchHighlight(searchHighlight, 'profile')),
          ].join(' ')}
        >
          <ProfilePanel
            selectedIds={selectedIds}
            quantities={quantities}
            bindKey={bindKey}
            buyBinds={buyBinds}
            utilitiesConfig={utilitiesConfig}
            utilitySelectedIds={utilitySelectedIds}
            onApplySnapshot={onApplySnapshot}
            onOpenUtility={onOpenUtility}
            onOpenWeapons={onOpenWeapons}
            onRemoveBuyBind={onRemoveBuyBind}
            onOpenBuyBind={onOpenBuyBind}
          />
        </div>
      ) : isNotifications ? (
        <div
          className={[
            'relative z-[1] rounded-b-lg border border-transparent p-4',
            searchSpotlightClass(
              isTabSearchHighlight(searchHighlight, 'notifications'),
            ),
          ].join(' ')}
        >
          <NotificationsPanel
            conflicts={conflicts}
            onOpenUtility={onOpenUtility}
            onOpenWeapons={onOpenWeapons}
            onOpenBuyBind={onOpenBuyBind}
          />
        </div>
      ) : (
        <div
          className={[
            'relative z-[1] rounded-b-lg border border-transparent p-4',
            searchSpotlightClass(isTabSearchHighlight(searchHighlight, 'unbind')),
          ].join(' ')}
        >
          <UnbindPanel
            bindKey={bindKey}
            selectedIds={selectedIds}
            buyBinds={buyBinds}
            utilitiesConfig={utilitiesConfig}
            utilitySelectedIds={utilitySelectedIds}
          />
        </div>
      )}

      {isWeapons && !showGuide ? (
        <p className="relative z-[1] shrink-0 border-t border-white/[0.07] bg-gradient-to-r from-transparent via-[rgba(var(--accent-rgb),0.08)] to-transparent px-4 py-2 text-center text-[10px] uppercase tracking-widest text-[var(--text-dim)]">
          {m.buy.footer}
        </p>
      ) : null}
    </section>
  )
}
