'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArsenalTabs } from './components/ArsenalTabs'
import { BuyGrid } from './components/BuyGrid'
import {
  HEADER_MODE_ACCENT,
  HEADER_MODE_IDLE,
  HeaderModeButton,
} from './components/HeaderModeButton'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { ConfigSearch } from './components/ConfigSearch'
import { GuideArticleModal } from './components/GuideArticleModal'
import { Sidebar } from './components/Sidebar'
import { UsageCounter } from './components/UsageCounter'
import { trackGoal } from './analytics'
import type { SearchTarget } from './data/configSearch'
import { BUY_PRESETS } from './data/buyPresets'
import { landingByPath } from './data/seoLandings'
import { ITEM_MAP } from './data/items'
import {
  applyBindKeyToUtility,
  DEFAULT_UTILITIES_CONFIG,
  readUtilityBindKey,
  utilityAcceptsBindKey,
  type UtilityId,
} from './data/utilities'
import { useMessages } from './i18n/I18nProvider'
import type { ArsenalTab, UtilityView } from './types/modes'
import {
  collectActiveBinds,
  findKeyConflicts,
} from './utils/bindConflicts'
import {
  clearShareHash,
  readShareFromHash,
  type ConfigSnapshot,
} from './utils/siteConfigs'
import { loadAppState, saveAppState, saveHistory } from './utils/storage'
import {
  hasSeenWelcomeGuide,
  markWelcomeGuideSeen,
} from './utils/welcomeGuide'
import {
  hasSeenTrialNotice,
  markTrialNoticeSeen,
} from './utils/trialNotice'
import { ClearHistoryModal } from './components/ClearHistoryModal'
import { GuideBangIcon } from './components/GuideBangIcon'
import { PasteExpandModal } from './components/PasteExpandModal'
import { SiteLogo } from './components/SiteLogo'
import { TabTipModal, type TabTipKind } from './components/TabTipModal'
import { WelcomeGuide } from './components/WelcomeGuide'
import type { HomeHintMode } from './components/HomeIdlePanel'
import { useAuth } from './auth/AuthContext'
import { hasSeenTabTip, markTabTipSeen } from './utils/tabTips'
import { SEARCH_PULSE_MS } from './utils/searchHighlight'
import {
  appendBuyBind,
  createBuyBind,
  formatBuyLoadout,
  removeBuyBind,
  sameBuyBind,
  type BuyBind,
} from './utils/buyBinds'

export type { UtilityView }

export default function App() {
  const m = useMessages()
  const {
    configured: authConfigured,
    ready: authReady,
    hasAccess,
  } = useAuth()
  const [boot] = useState(loadAppState)
  const [selectedIds, setSelectedIds] = useState(boot.selectedIds)
  const [quantities, setQuantities] = useState(boot.quantities)
  const [bindKey, setBindKey] = useState(boot.bindKey)
  const [buyBinds, setBuyBinds] = useState<BuyBind[]>(boot.buyBinds)
  const [arsenalTab, setArsenalTab] = useState(boot.arsenalTab)
  const [utilitySelectedIds, setUtilitySelectedIds] = useState(
    boot.utilitySelectedIds,
  )
  const [utilityActiveId, setUtilityActiveId] = useState(boot.utilityActiveId)
  const [utilityView, setUtilityView] = useState(boot.utilityView)
  const [utilitiesConfig, setUtilitiesConfig] = useState(boot.utilitiesConfig)
  const [shareBanner, setShareBanner] = useState<string | null>(null)
  const [buyConflictBanner, setBuyConflictBanner] = useState<string | null>(null)
  /** Buy bind opened from Profile / Alerts — replaced on next Copy. */
  const [editingBuyBindId, setEditingBuyBindId] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(() => !hasSeenWelcomeGuide())
  /** Lock site until welcome dismissed (and Google sign-in when Auth is on). */
  const [guideLockBlur, setGuideLockBlur] = useState(() => !hasSeenWelcomeGuide())
  const [showClearHistory, setShowClearHistory] = useState(false)
  const [pasteViewer, setPasteViewer] = useState<{
    chunks: string[]
    index: number
  } | null>(null)
  const [tabTip, setTabTip] = useState<TabTipKind | null>(null)
  const [homeHint, setHomeHint] = useState<HomeHintMode | null>(() =>
    hasSeenWelcomeGuide() && boot.arsenalTab == null ? 'start' : null,
  )
  const [trialNoticeUnread, setTrialNoticeUnread] = useState(
    () => !hasSeenTrialNotice(),
  )
  const [searchHighlight, setSearchHighlight] = useState<SearchTarget | null>(
    null,
  )
  const [openGuidePath, setOpenGuidePath] = useState<string | null>(null)
  const shareHandled = useRef(false)

  /** Gate the site: Firebase Auth on → Google or guest trial before using the app. */
  useEffect(() => {
    if (!authReady) return
    if (authConfigured && !hasAccess) {
      setShowGuide(true)
      setGuideLockBlur(true)
      return
    }
    if (hasAccess && hasSeenWelcomeGuide() && guideLockBlur) {
      setGuideLockBlur(false)
      setShowGuide(false)
      setHomeHint((prev) => prev ?? 'start')
    }
  }, [authReady, authConfigured, hasAccess, guideLockBlur])

  const resetSelectionsToDefaults = () => {
    setSelectedIds([])
    setQuantities({})
    setBindKey('')
    setBuyBinds([])
    setEditingBuyBindId(null)
    setUtilitiesConfig(
      JSON.parse(JSON.stringify(DEFAULT_UTILITIES_CONFIG)) as typeof DEFAULT_UTILITIES_CONFIG,
    )
    setUtilitySelectedIds([])
    setUtilityActiveId(null)
    setUtilityView('home')
  }

  const conflicts = useMemo(
    () =>
      findKeyConflicts(
        collectActiveBinds(utilitiesConfig, {
          bindKey,
          selectedWeaponIds: selectedIds,
          utilitySelectedIds,
          buyBinds,
          quantities,
        }),
      ),
    [utilitiesConfig, bindKey, selectedIds, utilitySelectedIds, buyBinds, quantities],
  )

  const applySnapshot = (snapshot: ConfigSnapshot) => {
    setSelectedIds(snapshot.selectedIds)
    setQuantities(snapshot.quantities)
    setBindKey(snapshot.bindKey)
    setBuyBinds(snapshot.buyBinds ?? [])
    setEditingBuyBindId(null)
    setUtilitiesConfig(snapshot.utilitiesConfig)
    setUtilityView('home')
    setUtilityActiveId(null)
    setUtilitySelectedIds([])
    setArsenalTab('profile')
    setHomeHint(null)
    maybeShowTabTip('profile')
  }

  useEffect(() => {
    if (shareHandled.current) return
    shareHandled.current = true
    const shared = readShareFromHash()
    if (shared) {
      applySnapshot(shared)
      clearShareHash()
      setShareBanner(
        shared.name
          ? m.profile.importedNamed.replace('{name}', shared.name)
          : m.profile.imported,
      )
      const t = window.setTimeout(() => setShareBanner(null), 5000)
      return () => window.clearTimeout(t)
    }
    // Do not wipe selections when history is empty: clear-history already
    // resets them, and users may reload a Profile config with empty history.
  }, [m.profile.imported, m.profile.importedNamed])

  useEffect(() => {
    saveAppState({
      selectedIds,
      quantities,
      bindKey,
      buyBinds,
      arsenalTab,
      utilitySelectedIds,
      utilityActiveId,
      utilityView,
      utilitiesConfig,
    })
  }, [
    selectedIds,
    quantities,
    bindKey,
    buyBinds,
    arsenalTab,
    utilitySelectedIds,
    utilityActiveId,
    utilityView,
    utilitiesConfig,
  ])

  const commitBuyBind = () => {
    const created = createBuyBind(bindKey, selectedIds, quantities)
    if (!created) return

    const others = editingBuyBindId
      ? buyBinds.filter((b) => b.id !== editingBuyBindId)
      : buyBinds
    const keyTaken = others.some(
      (b) =>
        b.key.trim().toLowerCase() === created.key.toLowerCase() &&
        !sameBuyBind(b, created),
    )
    const exactExists = others.some((b) => sameBuyBind(b, created))

    if (editingBuyBindId) {
      setBuyBinds((prev) => {
        const without = removeBuyBind(prev, editingBuyBindId)
        const deduped = without.filter((b) => !sameBuyBind(b, created))
        return [...deduped, { ...created, id: editingBuyBindId }]
      })
    } else if (exactExists) {
      setBuyConflictBanner(m.notifications.buyAlreadySaved)
      window.setTimeout(() => setBuyConflictBanner(null), 4000)
      setSelectedIds([])
      setQuantities({})
      setBindKey('')
      return
    } else {
      setBuyBinds((prev) => appendBuyBind(prev, created))
    }

    setEditingBuyBindId(null)
    setSelectedIds([])
    setQuantities({})
    setBindKey('')
    if (keyTaken) {
      setBuyConflictBanner(
        m.notifications.buyKeyConflict.replace('{key}', created.key),
      )
      window.setTimeout(() => setBuyConflictBanner(null), 6000)
    } else {
      setBuyConflictBanner(null)
    }
  }

  /** Open weapons editor on a saved buy bind; next Copy replaces this bind. */
  const openBuyBind = (id: string) => {
    const entry = buyBinds.find((b) => b.id === id)
    if (!entry) return
    setSelectedIds([...entry.itemIds])
    setQuantities({ ...entry.quantities })
    setBindKey(entry.key)
    setEditingBuyBindId(id)
    setShowGuide(false)
    setHomeHint(null)
    setArsenalTab('weapons')
    setBuyConflictBanner(null)
  }

  const applyBuyPreset = (presetId: string) => {
    const preset = BUY_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    const quantities: Record<string, number> = {}
    for (const id of preset.itemIds) {
      quantities[id] = preset.quantities?.[id] ?? 1
    }
    setSelectedIds([...preset.itemIds])
    setQuantities(quantities)
    setBindKey(preset.bindKey)
    setEditingBuyBindId(null)
    setShowGuide(false)
    setHomeHint(null)
    setArsenalTab('weapons')
    setBuyConflictBanner(null)
    trackGoal('apply_buy_preset', { preset: presetId })
  }

  const cancelEditBuyBind = () => {
    setEditingBuyBindId(null)
  }

  const deleteBuyBind = (id: string) => {
    setBuyBinds((prev) => removeBuyBind(prev, id))
    setEditingBuyBindId((cur) => (cur === id ? null : cur))
  }

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

  const maybeShowTabTip = (tab: TabTipKind) => {
    if (guideLockBlur || showClearHistory || pasteViewer) return
    if (hasSeenTabTip(tab)) return
    setShowGuide(false)
    setTabTip(tab)
  }

  const openTabInstruction = (tab: TabTipKind) => {
    if (guideLockBlur || showClearHistory || pasteViewer || tabTip) return
    setShowGuide(false)
    setHomeHint(null)
    setArsenalTab(tab)
    setTabTip(tab)
  }

  const openUtility = (id: UtilityId) => {
    setShowGuide(false)
    setHomeHint(null)
    setEditingBuyBindId(null)
    setArsenalTab('utilities')
    setUtilitySelectedIds([id])
    setUtilityActiveId(id)
    setUtilityView('detail')
    if (utilityAcceptsBindKey(id)) {
      const primary = readUtilityBindKey(utilitiesConfig, id)
      if (primary) setBindKey(primary)
    }
    maybeShowTabTip('utilities')
  }

  const openWeapons = () => {
    setShowGuide(false)
    setHomeHint(null)
    setEditingBuyBindId(null)
    setArsenalTab('weapons')
    maybeShowTabTip('weapons')
  }

  const backToUtilityHome = () => {
    setUtilityView('home')
  }

  const handleSidebarBindKeyChange = (key: string) => {
    setBindKey(key)
    if (
      arsenalTab === 'utilities' &&
      utilityView === 'detail' &&
      utilityActiveId &&
      utilityAcceptsBindKey(utilityActiveId)
    ) {
      setUtilitiesConfig((prev) =>
        applyBindKeyToUtility(prev, utilityActiveId, key),
      )
    }
  }

  const handleClearHistoryAndSelections = () => {
    saveHistory([])
    resetSelectionsToDefaults()
    setShowClearHistory(false)
  }

  useEffect(() => {
    if (arsenalTab !== 'notifications' || !trialNoticeUnread) return
    markTrialNoticeSeen()
    setTrialNoticeUnread(false)
  }, [arsenalTab, trialNoticeUnread])

  useEffect(() => {
    if (!searchHighlight) return
    const t = window.setTimeout(() => setSearchHighlight(null), SEARCH_PULSE_MS)
    return () => window.clearTimeout(t)
  }, [searchHighlight])

  useEffect(() => {
    if (!searchHighlight || searchHighlight.type !== 'utility') return
    const t = window.setTimeout(() => {
      document
        .getElementById(`search-target-${searchHighlight.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [searchHighlight, utilityActiveId, utilityView, arsenalTab])

  const dismissTabTip = () => {
    if (tabTip) markTabTipSeen(tabTip)
    setTabTip(null)
  }

  const selectHeaderMode = (id: Extract<ArsenalTab, 'profile' | 'notifications'>) => {
    if (guideLockBlur || showClearHistory || pasteViewer || tabTip) return
    setShowGuide(false)
    setHomeHint(null)
    setEditingBuyBindId(null)
    setArsenalTab(id)
    maybeShowTabTip(id)
  }

  const changeArsenalTab = (tab: ArsenalTab) => {
    if (guideLockBlur || showClearHistory || pasteViewer || tabTip) return
    setShowGuide(false)
    setHomeHint(null)
    if (tab !== 'weapons') setEditingBuyBindId(null)
    setArsenalTab(tab)
    maybeShowTabTip(tab)
  }

  const navigateFromSearch = (target: SearchTarget) => {
    if (target.type === 'guide') {
      setOpenGuidePath(target.path)
      return
    }
    setSearchHighlight(target)
    if (target.type === 'utility') {
      openUtility(target.id)
      return
    }
    if (target.tab === 'profile' || target.tab === 'notifications') {
      selectHeaderMode(target.tab)
      return
    }
    changeArsenalTab(target.tab)
  }

  const openGeneratorFromGuide = (href: string) => {
    setOpenGuidePath(null)
    try {
      const url = new URL(href, 'https://bindlab.ru')
      const tab = url.searchParams.get('tab')
      if (tab === 'weapons' || tab === 'utilities' || tab === 'unbind') {
        changeArsenalTab(tab)
        return
      }
      if (tab === 'profile' || tab === 'notifications') {
        selectHeaderMode(tab)
        return
      }
    } catch {
      // fall through
    }
    setArsenalTab(null)
    setHomeHint('start')
  }

  const openGuideLanding = openGuidePath
    ? landingByPath(openGuidePath)
    : null

  const dismissGuide = () => {
    if (authConfigured && !hasAccess) return
    markWelcomeGuideSeen()
    setGuideLockBlur(false)
    setShowGuide(false)
    setArsenalTab(null)
    setHomeHint('start')
  }

  const toggleGuide = () => {
    if (guideLockBlur || showClearHistory || pasteViewer || tabTip) return
    // Same welcome + search reminder as after first visit
    if (homeHint === 'start' || homeHint === 'tour') {
      setHomeHint(null)
      return
    }
    setShowGuide(false)
    setArsenalTab(null)
    setHomeHint('start')
  }

  // Center guide when idle (no tab) or when user reopened !
  const pageBlurred =
    guideLockBlur || showClearHistory || Boolean(pasteViewer) || Boolean(tabTip)
  const notificationBadge =
    conflicts.length + (trialNoticeUnread ? 1 : 0)
  const themeAttr = arsenalTab ?? 'home'

  // Drive ambient body glow from <html> so background orbs match the tab
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeAttr)
    return () => {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [themeAttr])

  return (
    <div className="app-shell relative min-h-screen text-white" data-theme={themeAttr}>
      <div
        className={[
          pageBlurred
            ? 'pointer-events-none select-none blur-md brightness-75'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={pageBlurred || undefined}
      >
        {/* Same grid as main: language ends where sidebar (bind key) / profile starts */}
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[color-mix(in_srgb,var(--panel-solid)_72%,transparent)] py-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-90 shadow-[0_0_12px_rgba(var(--accent-rgb),0.8)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(var(--accent-rgb),0.08)] to-transparent"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-[1480px] items-center gap-2 px-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">
              <h1 className="font-display flex flex-wrap items-center gap-2.5 text-2xl font-extrabold tracking-[0.02em] text-[var(--accent)] sm:text-[1.7rem]">
                <SiteLogo className="h-9 w-9 shrink-0 text-[var(--accent)] transition-colors duration-300" />
                <span>{m.app.title}</span>
                <button
                  type="button"
                  onClick={toggleGuide}
                  title={m.guide.openTitle}
                  aria-label={m.guide.openTitle}
                  aria-pressed={homeHint === 'start' || homeHint === 'tour'}
                  className={[
                    'inline-grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all duration-200',
                    'border-[var(--accent)] text-[var(--accent)]',
                    'hover:bg-[var(--accent-soft)] hover:scale-105',
                    homeHint === 'start' || homeHint === 'tour'
                      ? 'bg-[var(--accent-soft)]'
                      : 'bg-transparent',
                  ].join(' ')}
                >
                  <GuideBangIcon />
                </button>
              </h1>
              <p className="mt-1.5 text-sm text-[var(--text-muted)]">{m.app.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <ConfigSearch
                disabled={pageBlurred}
                onNavigate={navigateFromSearch}
                hintPulse={
                  (homeHint === 'start' || homeHint === 'tour') && !pageBlurred
                }
              />
              <LanguageSwitcher />
              <HeaderModeButton
                id="profile"
                label={m.tabs.profile}
                active={arsenalTab === 'profile'}
                onClick={() => selectHeaderMode('profile')}
                onViewInstruction={() => openTabInstruction('profile')}
                instructionTitle={m.tips.viewInstruction}
                accentClass={HEADER_MODE_ACCENT.profile}
                idleBorderClass={HEADER_MODE_IDLE.profile}
                iconSrc="/icons/profile.svg"
                searchPulse={
                  searchHighlight?.type === 'tab' &&
                  searchHighlight.tab === 'profile'
                }
              />
              <HeaderModeButton
                id="notifications"
                label={m.tabs.notifications}
                active={arsenalTab === 'notifications'}
                onClick={() => selectHeaderMode('notifications')}
                onViewInstruction={() => openTabInstruction('notifications')}
                instructionTitle={m.tips.viewInstruction}
                badge={notificationBadge}
                accentClass={HEADER_MODE_ACCENT.notifications}
                idleBorderClass={HEADER_MODE_IDLE.notifications}
                iconSrc="/icons/notifications.svg"
                searchPulse={
                  searchHighlight?.type === 'tab' &&
                  searchHighlight.tab === 'notifications'
                }
              />
              <div className="ml-auto">
                <UsageCounter />
              </div>
            </div>
          </div>
          {shareBanner && (
            <p className="mx-auto mt-3 max-w-[1480px] px-4">
              <span className="ui-toast-strip">{shareBanner}</span>
            </p>
          )}
          {buyConflictBanner && (
            <p className="mx-auto mt-3 max-w-[1480px] px-4">
              <button
                type="button"
                onClick={() => {
                  setBuyConflictBanner(null)
                  selectHeaderMode('notifications')
                }}
                className="ui-toast-strip"
              >
                {buyConflictBanner}
              </button>
            </p>
          )}
        </header>

        <main className="mx-auto grid max-w-[1480px] items-start gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div
            className={[
              'flex min-w-0 gap-3',
              arsenalTab === 'utilities' && utilityView === 'detail'
                ? 'min-h-[min(70vh,720px)]'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <ArsenalTabs
              tab={arsenalTab}
              onChange={changeArsenalTab}
              onViewInstruction={openTabInstruction}
              searchHighlight={searchHighlight}
            />
            <BuyGrid
              tab={arsenalTab}
              selectedIds={selectedIds}
              quantities={quantities}
              onToggle={toggleItem}
              onSetQuantity={setItemQuantity}
              onApplyBuyPreset={applyBuyPreset}
              utilitySelectedIds={utilitySelectedIds}
              utilityActiveId={utilityActiveId}
              utilityView={utilityView}
              onOpenUtility={openUtility}
              onBackUtility={backToUtilityHome}
              onOpenWeapons={openWeapons}
              onApplySnapshot={applySnapshot}
              utilitiesConfig={utilitiesConfig}
              onUtilitiesConfigChange={setUtilitiesConfig}
              bindKey={bindKey}
              buyBinds={buyBinds}
              onBindKeyChange={setBindKey}
              onRemoveBuyBind={deleteBuyBind}
              onOpenBuyBind={openBuyBind}
              conflicts={conflicts}
              matchSidebarHeight={false}
              showGuide={false}
              onDismissGuide={dismissGuide}
              homeHint={homeHint}
              searchHighlight={searchHighlight}
            />
          </div>

          <div>
            <Sidebar
              tab={arsenalTab}
              selectedIds={selectedIds}
              quantities={quantities}
              bindKey={bindKey}
              onBindKeyChange={handleSidebarBindKeyChange}
              buyBinds={buyBinds}
              onCommitBuyBind={commitBuyBind}
              editingBuyBindId={editingBuyBindId}
              editingBuyLabel={
                editingBuyBindId
                  ? (() => {
                      const b = buyBinds.find((x) => x.id === editingBuyBindId)
                      return b
                        ? `${b.key} · ${formatBuyLoadout(b)}`
                        : null
                    })()
                  : null
              }
              onCancelEditBuyBind={cancelEditBuyBind}
              utilitySelectedIds={utilitySelectedIds}
              utilityActiveId={utilityActiveId}
              utilityView={utilityView}
              utilitiesConfig={utilitiesConfig}
              conflictCount={conflicts.length}
              onRequestClearHistory={() => {
                if (guideLockBlur || pasteViewer || tabTip) return
                setShowGuide(false)
                setShowClearHistory(true)
              }}
              onExpandPaste={(chunks, index = 0) => {
                if (guideLockBlur || showClearHistory || tabTip) return
                if (chunks.length === 0) return
                setShowGuide(false)
                setPasteViewer({ chunks, index })
              }}
            />
          </div>
        </main>
      </div>

      {((showGuide && guideLockBlur) ||
        (authReady && authConfigured && !hasAccess)) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-8 backdrop-blur-md sm:items-center">
          <WelcomeGuide onDismiss={dismissGuide} locked />
        </div>
      )}

      {tabTip && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-8 backdrop-blur-md sm:items-center">
          <TabTipModal kind={tabTip} onDismiss={dismissTabTip} />
        </div>
      )}

      {showClearHistory && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-8 backdrop-blur-md sm:items-center">
          <ClearHistoryModal
            onCancel={() => setShowClearHistory(false)}
            onConfirm={handleClearHistoryAndSelections}
          />
        </div>
      )}

      {pasteViewer && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 px-4 py-8 backdrop-blur-md sm:items-center">
          <PasteExpandModal
            chunks={pasteViewer.chunks}
            initialIndex={pasteViewer.index}
            onClose={() => setPasteViewer(null)}
          />
        </div>
      )}

      {openGuideLanding && (
        <GuideArticleModal
          landing={openGuideLanding}
          onClose={() => setOpenGuidePath(null)}
          onOpenGenerator={openGeneratorFromGuide}
        />
      )}
    </div>
  )
}
