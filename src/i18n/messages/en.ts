/** Flat message dictionary — shared shape for every locale. */
export type Messages = {
  app: {
    title: string
    subtitle: string
  }
  usage: {
    label: string
    title: string
  }
  lang: {
    label: string
    title: string
  }
  search: {
    label: string
    openTitle: string
    placeholder: string
    hint: string
    noResults: string
    open: string
    example: string
    guideBadge: string
    closeGuide: string
    tabHint: {
      weapons: string
      utilities: string
      unbind: string
      profile: string
      notifications: string
    }
    extra: {
      buy_bind: { title: string; body: string }
      unbind_all: { title: string; body: string }
      share_config: { title: string; body: string }
      bind_conflicts: { title: string; body: string }
      jumpthrow_help: { title: string; body: string }
    }
  }
  tabs: {
    weapons: string
    utilities: string
    unbind: string
    notifications: string
    profile: string
  }
  common: {
    back: string
    key: string
    copy: string
    copied: string
    settings: string
    binds: string
    phrase: string
    resetRecommended: string
    resetRecommendedHint: string
  }
  buy: {
    selected: string
    footer: string
    utilitiesTitle: string
    unbindTitle: string
    unbindBanner: string
    notificationsTitle: string
    profileTitle: string
  }
  sidebar: {
    bindKey: string
    bindKeyPlaceholder: string
    bindKeyHintWeapons: string
    bindKeyHintUtilities: string
    bindKeyHintShared: string
    listenKey: string
    listeningCancel: string
    pressKey: string
    pressKeyHint: string
    listenKeyHint: string
    quickKeys: string
    buyCommand: string
    buyPlaceholder: string
    savedBuyBinds: string
    savedBuyBindsHint: string
    savedBuyBindsEmpty: string
    removeBuyBind: string
    editingBuyBind: string
    editingBuyBindHint: string
    cancelEditBuyBind: string
    settingsBlock: string
    settingsHint: string
    settingsPlaceholder: string
    bindsBlock: string
    bindsHint: string
    bindsPlaceholder: string
    allBlock: string
    history: string
    historyEmpty: string
    clearHistory: string
    clearHistoryHint: string
    clearHistoryConfirm: string
    clearHistoryTitle: string
    clearHistoryLead: string
    clearHistoryWarn: string
    clearHistoryUnbindNote: string
    clearHistorySaveBefore: string
    clearHistorySaveWhere: string
    clearHistoryCancel: string
    clearHistoryConfirmBtn: string
    clearHistoryWait: string
    unbindCopy: string
    unbindHint: string
    unbindHistoryCopy: string
    unbindHistoryHint: string
    unbindHistoryEmpty: string
    unbindHistoryKeys: string
    activeUtility: string
    shareAfterCopy: string
    shareFriend: string
    shareLinkCopied: string
  }
  buyPresets: {
    title: string
    hint: string
    eco: string
    force: string
    fullT: string
    fullCt: string
    awp: string
  }
  utilHome: {
    tip: string
    settingsTitle: string
    settingsHint: string
    bindsTitle: string
    bindsHint: string
  }
  utilMeta: Record<
    string,
    {
      label: string
      hint: string
    }
  >
  mapCleanup: {
    title: string
    body: string
  }
  unbind: {
    title: string
    leadBefore: string
    leadMark1: string
    leadMid: string
    leadMark2: string
    leadAfter: string
    choiceTitle: string
    choiceAllTitle: string
    choiceAllBody: string
    choiceHistoryTitle: string
    choiceHistoryBody: string
    choiceHistoryEmpty: string
    choiceHistoryKeys: string
    selectAll: string
    selectNone: string
    pickKeysHint: string
    pickKeysNone: string
    howTitle: string
    how1a: string
    how1b: string
    how2a: string
    how2b: string
    how3a: string
    how3b: string
    how4: string
    how5a: string
    how5b: string
    how6a: string
    how6b: string
    how7: string
    altTitle: string
    altLead: string
    alt1a: string
    alt1b: string
    alt2a: string
    alt2b: string
    alt2c: string
    alt3a: string
    alt3b: string
    alt4a: string
    alt4b: string
    alt5: string
    footerBefore: string
    footerAfter: string
  }
  video: {
    previewTitle: string
    previewTip: string
    gammaHint: string
    gammaLabel: string
    brighter: string
    darker: string
    sectionMonitor: string
    sectionEffects: string
    tipFullscreen: string
  }
  notifications: {
    title: string
    lead: string
    emptyTitle: string
    emptyBody: string
    conflictCount: string
    keyLabel: string
    conflictLead: string
    buyKeyConflict: string
    buyAlreadySaved: string
    sourceBuy: string
    sidebarHint: string
    sidebarOk: string
    sidebarWarn: string
    trialTitle: string
    trialBodyBefore: string
    trialBodyAfter: string
    trialLinkLabel: string
    actions: Record<string, string>
  }
  profile: {
    title: string
    lead: string
    currentBinds: string
    currentHint: string
    currentSettings: string
    currentSettingsHint: string
    noSettings: string
    noBinds: string
    openEdit: string
    saveTitle: string
    saveHint: string
    namePlaceholder: string
    saveButton: string
    shareCurrent: string
    importTitle: string
    importHint: string
    importButton: string
    importOk: string
    importFail: string
    defaultName: string
    savedTitle: string
    savedHint: string
    savedEmpty: string
    loadButton: string
    shareButton: string
    deleteButton: string
    weaponsShort: string
    savedToast: string
    loadedToast: string
    linkCopied: string
    linkCopyFail: string
    imported: string
    importedNamed: string
    sidebarTitle: string
    sidebarLead: string
    sidebarHint: string
    pasteTitle: string
    pasteHint: string
    pasteSummary: string
    pasteLimitWarn: string
    pasteLimitSplit: string
    pasteEmpty: string
    pastePart: string
    pasteChars: string
    pasteCopied: string
    pasteExpand: string
    pasteExpandTitle: string
    pasteClose: string
    pastePrev: string
    pasteNext: string
    guestLockedTitle: string
    guestLocked: string
    sharePromoTitle: string
    sharePromoBody: string
  }
  auth: {
    title: string
    lead: string
    loading: string
    notConfigured: string
    signedInHint: string
    anonymousLabel: string
    guestLabel: string
    guestButton: string
    guestHint: string
    guestSignedInHint: string
    signOut: string
    busy: string
    or: string
    google: string
    errorUserDisabled: string
    errorPopupClosed: string
    errorPopupBlocked: string
    errorTooMany: string
    errorNetwork: string
    errorNotAllowed: string
    errorUnauthorizedDomain: string
    errorNotConfigured: string
    errorGeneric: string
  }
  guide: {
    openTitle: string
    title: string
    lead: string
    pathImmediateTitle: string
    pathImmediateBody: string
    pathConfigTitle: string
    pathConfigBody: string
    tabsTitle: string
    tabWeapons: string
    tabUtilities: string
    tabUnbind: string
    tabProfile: string
    tabNotifications: string
    sidebarNote: string
    reopenHint: string
    importantRead: string
    gotIt: string
    gotItWait: string
    gotItNeedAuth: string
    authGateTitle: string
    authGateBody: string
    authGateGoogle: string
    authGateGuest: string
    authGateSignedIn: string
    authGateLoading: string
    authGateNotConfigured: string
    continue: string
    homeEyebrowStart: string
    homeEyebrowTour: string
    homeTitle: string
    homeLead: string
    homeTourLead: string
    homeLeftHint: string
    homeHeaderHint: string
    homeStartFooter: string
    homeSearchHint: string
    homeSearchHintSub: string
    homeRmbTitle: string
    homeRmbBody: string
  }
  tips: {
    gotIt: string
    viewInstruction: string
    reopenHint: string
    reopenCalloutTitle: string
    rmbShortcut: string
    instructionBadge: string
    howLabel: string
    tipsLabel: string
    idleTitle: string
    idleBody: string
    weapons: {
      title: string
      lead: string
      points: string[]
      footer: string
    }
    utilities: {
      title: string
      lead: string
      points: string[]
      footer: string
    }
    unbind: {
      title: string
      lead: string
      points: string[]
      footer: string
      rows: { label: string; body: string }[]
    }
    profile: {
      title: string
      lead: string
      points: string[]
      footer: string
    }
    notifications: {
      title: string
      lead: string
      points: string[]
      footer: string
    }
    loadoutBanner: {
      title: string
      armor: string
      pistol: string
      primary: string
      fire_nade: string
      orderNote: string
    }
  }
}

export const en: Messages = {
  app: {
    title: 'BindLab',
    subtitle: 'Binds, settings and buy menus for CS2 — build, copy to console, save and share',
  },
  usage: {
    label: 'Total uses',
    title:
      'How many times all users copied a bind on this site (at most once per 15 sec per browser)',
  },
  lang: {
    label: 'Language',
    title: 'Site language',
  },
  search: {
    label: 'Search',
    openTitle: 'Find a setting, command, bind or CS2 guide (Ctrl+K)',
    placeholder: 'Buy bind, Dust 2, jumpthrow, crosshair…',
    hint: 'Search settings and CS2 guides without leaving BindLab. Guides open in a panel here.',
    noResults: 'Nothing found. Try: buy binds, dust2, jumpthrow, crosshair, fps…',
    open: 'Open',
    example: 'Example',
    guideBadge: 'Guide',
    closeGuide: 'Close',
    tabHint: {
      weapons: 'Buy menu — pick weapons and copy a buy bind.',
      utilities: 'All settings and binds — open the card you need.',
      unbind: 'Reset binds — full wipe or keys from this app only.',
      profile: 'Save, load and share your config; paste long commands in parts.',
      notifications: 'Duplicate keys and site notices.',
    },
    extra: {
      buy_bind: {
        title: 'Buy bind (weapons tab)',
        body: 'Select weapons on the left, set a key on the right, copy bind f3 "buy …".',
      },
      unbind_all: {
        title: 'Reset all binds (unbindall)',
        body: 'Open the Reset binds tab — choose full wipe or only keys from this app, with restore steps.',
      },
      share_config: {
        title: 'Save and share config',
        body: 'Profile tab: save a named setup, copy a share link, or paste commands into CS2 in chunks.',
      },
      bind_conflicts: {
        title: 'Duplicate bind keys',
        body: 'Alerts tab lists the same key on two actions — fix before pasting into the console.',
      },
      jumpthrow_help: {
        title: 'Jumpthrow bind',
        body: 'Utilities → Jumps: jumpthrow alias and scroll jump. Valve may block old macro styles in MM.',
      },
    },
  },
  tabs: {
    weapons: 'Weapons',
    utilities: 'Utilities',
    unbind: 'Reset binds',
    notifications: 'Alerts',
    profile: 'Profile',
  },
  common: {
    back: 'Back',
    key: 'Key',
    copy: 'Copy',
    copied: 'Copied!',
    settings: 'Settings',
    binds: 'Binds',
    phrase: 'Phrase',
    resetRecommended: 'Reset recommended',
    resetRecommendedHint: 'Restore all sliders and options on this card to recommended values',
  },
  buy: {
    selected: 'SELECTED',
    footer: 'Click items to add to bind · selected total shown above',
    utilitiesTitle: 'Utilities',
    unbindTitle: 'Reset binds',
    unbindBanner: 'Read carefully',
    notificationsTitle: 'Alerts',
    profileTitle: 'Profile',
  },
  sidebar: {
    bindKey: 'Bind key',
    bindKeyPlaceholder: 'Choose bind key',
    bindKeyHintWeapons: 'Key for the buy command',
    bindKeyHintUtilities: 'Applied to the open utility card',
    bindKeyHintShared: 'Shared key for network display',
    listenKey: 'Listen',
    listeningCancel: 'Esc',
    pressKey: 'Press a key…',
    pressKeyHint: 'Any key, Alt, Ctrl, mouse side buttons, or scroll wheel. Esc to cancel.',
    listenKeyHint: 'Type a key name, or press Listen and hit the key on your keyboard.',
    quickKeys: 'Quick keys',
    buyCommand: 'Buy command',
    buyPlaceholder: 'Select weapons on the left',
    savedBuyBinds: 'Saved buy binds',
    savedBuyBindsHint:
      'Copy saves the bind into your config. Change the key and loadout to add another.',
    savedBuyBindsEmpty: 'No saved buy binds yet — copy one above',
    removeBuyBind: 'Remove',
    editingBuyBind: 'Editing buy bind',
    editingBuyBindHint: 'Copy will replace this bind. Cancel keeps it as-is.',
    cancelEditBuyBind: 'Cancel',
    settingsBlock: 'Settings',
    settingsHint: 'Paste into console (~) — no key required',
    settingsPlaceholder: 'Enable options in the utility card',
    bindsBlock: 'Binds',
    bindsHint: 'Needs a key — set on the card or here',
    bindsPlaceholder: 'Enable binds in the utility card',
    allBlock: 'All',
    history: 'History',
    historyEmpty: 'No copies yet',
    clearHistory: 'Clear history',
    clearHistoryHint: 'Clear also resets checked options',
    clearHistoryConfirm:
      'Clear copy history?\n\nAll checked weapons and utility options will be reset.\n\nBefore clearing, save your setup in Profile so you can restore it or share with friends.',
    clearHistoryTitle: 'Clear history?',
    clearHistoryLead:
      'This cannot be undone. Copy history and every checked option will be wiped.',
    clearHistoryWarn:
      'Weapons, utility checkboxes, bind keys and copy history will all reset to empty defaults.',
    clearHistoryUnbindNote:
      'After clearing, History has no keys for the selective unbind. If you save a setup in Profile and load it again, “Only binds from this app” will rebuild keys from your current selection — even with empty History.',
    clearHistorySaveBefore: 'Before you clear, save your setup in',
    clearHistorySaveWhere:
      ' — open it from the header (lime icon), enter a name and tap Save. You can restore or share the config later.',
    clearHistoryCancel: 'Cancel',
    clearHistoryConfirmBtn: 'Clear everything',
    clearHistoryWait: 'Wait {n}…',
    unbindCopy: 'Copy unbindall',
    unbindHint: 'Removes every key bind. Restore defaults in CS2 settings after.',
    unbindHistoryCopy: 'Copy binds unbind',
    unbindHistoryHint:
      'Unbinds keys from History and from your current selected/loaded config. Game defaults like WASD stay.',
    unbindHistoryEmpty:
      'No keys yet — copy a bind or load a Profile config that has binds.',
    unbindHistoryKeys: 'Keys to unbind',
    activeUtility: 'Active',
    shareAfterCopy: 'Copied! Send this setup to a friend — they open the link and get the same binds.',
    shareFriend: 'Copy share link for a friend',
    shareLinkCopied: 'Share link copied — paste it in Discord / Telegram',
  },
  buyPresets: {
    title: 'Quick loadouts',
    hint: 'Tap a preset → set your key if needed → Copy on the right → share with a friend',
    eco: 'Eco',
    force: 'Force',
    fullT: 'Full T',
    fullCt: 'Full CT',
    awp: 'AWP',
  },
  utilHome: {
    tip: 'Settings and binds copy as one line joined by ";" so the CS2 console (~) runs everything at once. Pick a section with the cards.',
    settingsTitle: 'Settings',
    settingsHint: 'No key — paste into console (~) or autoexec',
    bindsTitle: 'Binds',
    bindsHint: 'Needs a key — set on the card or on the right for network',
  },
  utilMeta: {
    net_display: {
      label: 'Network display',
      hint: 'Telemetry / cl_showfps on a key',
    },
    performance: {
      label: 'Performance',
      hint: 'FPS, input latency and HUD cleanup — no key',
    },
    network: {
      label: 'Network',
      hint: 'Rate, interp, MM search ping and prediction — no key',
    },
    crosshair: {
      label: 'Crosshair',
      hint: 'Crosshair settings — one console / autoexec line',
    },
    grenades: {
      label: 'Grenades',
      hint: 'Nades equip only; bomb can equip or drop',
    },
    radar: {
      label: 'Radar & HUD',
      hint: 'Radar and safezone — one console / autoexec line',
    },
    movement: {
      label: 'Jumps',
      hint: 'Scroll jump and jumpthrow via autoexec (Valve blocked old macros)',
    },
    audio: {
      label: 'Sound',
      hint: 'Volumes, music, voice and radio — settings and binds',
    },
    mouse: {
      label: 'Mouse',
      hint: 'Sensitivity, raw input and sens binds',
    },
    inspect: {
      label: 'Inspect & drop',
      hint: 'Inspect skin, drop weapon, hand toggle and viewmodel FOV',
    },
    chat: {
      label: 'Chat',
      hint: 'say / say_team, voice mute and chat filter',
    },
    quick: {
      label: 'Quick commands',
      hint: 'clear / status / disconnect / retry and more',
    },
    practice: {
      label: 'Practice / offline',
      hint: 'Local matches, bots and nade training — needs sv_cheats',
    },
    map_cleanup: {
      label: 'Map cleanup',
      hint: 'Temporarily unavailable',
    },
    video: {
      label: 'Video & monitor',
      hint: 'Gamma, VSync, FSR/CMAA and effects — with brightness preview',
    },
  },
  mapCleanup: {
    title: 'Map cleanup unavailable',
    body: 'Counter-Strike 2 has no working public command to clear blood and bullet decals in official matchmaking. When Valve adds one, it will appear here.',
  },
  unbind: {
    title: 'Reset binds',
    leadBefore: 'You can wipe',
    leadMark1: 'all',
    leadMid: 'game binds, or only the ones you took from',
    leadMark2: 'this app',
    leadAfter: '(copy History and your current selected/loaded config).',
    choiceTitle: 'Choose what to reset',
    choiceAllTitle: 'Everything in the game',
    choiceAllBody:
      'unbindall removes movement, jump, shoot, buy menu and custom binds. After that restore defaults in CS2 settings.',
    choiceHistoryTitle: 'Only binds from this app',
    choiceHistoryBody:
      'Builds unbind for keys from History and from your current selected or loaded config. Safer if you only want to undo configs from this site.',
    choiceHistoryEmpty:
      'No keys yet — copy a bind or load a Profile config that has binds.',
    choiceHistoryKeys: 'Keys that will be unbound',
    selectAll: 'All',
    selectNone: 'None',
    pickKeysHint: 'Check only the keys you want to clear in-game.',
    pickKeysNone: 'No keys selected — tick at least one key above.',
    howTitle: 'How to restore default controls after unbindall',
    how1a: 'Launch the game on the main menu',
    how1b: '(not in a match — otherwise you cannot move or open menus).',
    how2a: 'Open the developer console (default',
    how2b: 'or Yo on a Russian keyboard).',
    how3a: 'Type',
    how3b: 'and press Enter (or copy the command on the right).',
    how4: 'Open game settings (gear icon).',
    how5a: 'Go to the',
    how5b: 'Keyboard / Mouse tab.',
    how6a: 'At the bottom, click',
    how6b: 'Restore to defaults.',
    how7: 'Default actions (WASD, shoot, buy menu) will be restored.',
    altTitle: 'If that did not help',
    altLead: 'You can delete config files in the Steam client and reset the game:',
    alt1a: 'Open Steam Library, right-click CS2 and choose',
    alt1b: 'Properties.',
    alt2a: 'Open',
    alt2b: 'Installed Files',
    alt2c: 'and click Browse.',
    alt3a: 'Go to',
    alt3b: 'game > csgo > cfg.',
    alt4a: 'Delete',
    alt4b: 'config.cfg (it stores your binds).',
    alt5: 'Restart the game — it will recreate the default file.',
    footerBefore: 'Do not put',
    footerAfter: 'in autoexec.cfg — or binds will reset every launch.',
  },
  video: {
    previewTitle: 'Monitor preview',
    previewTip:
      'Watch the silhouette in the left shadow: lower gamma makes it easier to see — same idea as r_fullscreen_gamma in fullscreen.',
    gammaHint:
      'Lower value = brighter shadows (easier to spot enemies in dark corners). Valve default ≈ 2.2; competitive often uses 1.8–2.1.',
    gammaLabel: 'Brightness (gamma)',
    brighter: 'Brighter',
    darker: 'Darker',
    sectionMonitor: 'Monitor & image',
    sectionEffects: 'Effects & extras',
    tipFullscreen:
      'Gamma works best in Fullscreen (not Borderless). Preview is approximate — in-game look depends on your monitor and HDR.',
  },
  notifications: {
    title: 'Alerts',
    lead: 'We check enabled binds for duplicate keys. If two actions share a key, the last one pasted wins in CS2.',
    emptyTitle: 'No conflicts',
    emptyBody:
      'Every enabled bind uses a unique key. Assign the same key to two actions to see a warning here.',
    conflictCount: '{n} key conflict(s)',
    keyLabel: 'Key',
    conflictLead: 'These binds use the same key — click one to open and change it:',
    buyKeyConflict:
      'Key «{key}» is already used by another buy bind. Both were kept — open Alerts to fix.',
    buyAlreadySaved: 'This buy bind is already saved — nothing new was added.',
    sourceBuy: 'Buy menu',
    sidebarHint: 'Duplicate keys are listed in Alerts. Fix them before pasting into the console.',
    sidebarOk: 'No key conflicts right now.',
    sidebarWarn: '{n} conflict(s) — open Alerts',
    trialTitle: 'Trial mode',
    trialBodyBefore:
      'The site is currently in trial mode — we are still shaping it with care. If you have ideas, wishes, or simply want to share how it felt to use, write to us on Telegram ',
    trialBodyAfter:
      '. Your feedback matters a lot, and kind words are especially warm for the author.',
    trialLinkLabel: 'Open Telegram',
    actions: {
      buy: 'Buy bind (selected weapons)',
      net_display: 'Network / FPS display',
      'grenades.flash': 'Equip flashbang',
      'grenades.smoke': 'Equip smoke',
      'grenades.he': 'Equip HE grenade',
      'grenades.decoy': 'Equip decoy',
      'grenades.molotov': 'Equip molotov / incendiary',
      'grenades.bomb': 'Bomb (equip / drop)',
      'movement.jumpthrow': 'Jumpthrow',
      'movement.scroll_up': 'Jump on mouse wheel up',
      'movement.scroll_down': 'Jump on mouse wheel down',
      'audio.voice': 'Voice chat (hold)',
      'audio.voice_mute_toggle': 'Toggle voice mute',
      'audio.volume_up': 'Volume up',
      'audio.volume_down': 'Volume down',
      'mouse.sens_low': 'Lower sensitivity',
      'mouse.sens_reset': 'Reset sensitivity',
      'inspect.inspect': 'Inspect weapon',
      'inspect.drop': 'Drop weapon',
      'inspect.hand_toggle': 'Toggle left / right hand',
      'quick.clear': 'Clear console',
      'quick.status': 'status',
      'quick.disconnect': 'disconnect',
      'quick.retry': 'retry',
      'quick.ping': 'ping',
      'quick.write_config': 'host_writeconfig',
      'quick.exec_autoexec': 'exec autoexec.cfg',
      'quick.quit': 'quit',
      'chat.all': 'Say (all chat)',
      'chat.team': 'Say (team chat)',
      'chat.voice_mute': 'Toggle voice mute',
      'chat.ignore_msg': 'ignoremsg',
      'practice.noclip': 'noclip',
      'practice.god': 'god',
      'practice.restart': 'Restart round',
      'practice.kill': 'kill',
      'practice.respawn': 'Respawn on death',
      'practice.bot_kick': 'Kick bots',
      'practice.bot_add_t': 'Add T bot',
      'practice.bot_add_ct': 'Add CT bot',
      'practice.bot_place': 'Place bot',
      'practice.toggle_bot_stop': 'Toggle bot_stop',
      'practice.bot_mimic': 'Toggle bot_mimic',
      'practice.rethrow': 'Rethrow last grenade',
      'practice.clear_smokes': 'Clear smokes',
    },
  },
  profile: {
    title: 'Your profile',
    lead: 'Review the binds you set up, save them as a site config, and share a link with friends.',
    currentBinds: 'Your current binds',
    currentHint: 'Enabled options from utilities and the buy menu — still checked until you clear history.',
    currentSettings: 'Your current settings',
    currentSettingsHint:
      'Cvars still checked in Utilities (performance, crosshair, video, …). Cleared when you wipe copy history.',
    noSettings: 'No settings enabled yet.',
    noBinds: 'No binds yet — pick weapons or enable options in Utilities.',
    openEdit: 'Edit',
    saveTitle: 'Save site config',
    saveHint: 'Stores buy selection + all utility settings in this browser.',
    namePlaceholder: 'Config name, e.g. My AWP setup',
    saveButton: 'Save',
    shareCurrent: 'Copy share link (current)',
    importTitle: 'Paste a config',
    importHint:
      'Paste a share link (or cfg= payload) from the clipboard to load a friend’s setup into the editor.',
    importButton: 'Paste config',
    importOk: 'Config loaded from clipboard',
    importFail: 'Clipboard has no valid share link or config',
    defaultName: 'My config',
    savedTitle: 'Saved configs',
    savedHint: 'Load into the editor, share a link, or delete.',
    savedEmpty: 'No saved configs yet.',
    loadButton: 'Load',
    shareButton: 'Share',
    deleteButton: 'Delete',
    weaponsShort: 'weapons',
    savedToast: 'Config saved',
    loadedToast: 'Config loaded',
    linkCopied: 'Share link copied',
    linkCopyFail: 'Could not copy link',
    imported: 'Friend config loaded from link',
    importedNamed: 'Loaded config: {name}',
    sidebarTitle: 'Profile',
    sidebarLead: 'Save and share your setup',
    sidebarHint:
      'Friends open your link — their editor fills with your weapons, keys and utilities.',
    pasteTitle: 'Paste into CS2',
    pasteHint:
      'Copy each part into the console (~) in order. Full code is hidden — only size and paste count.',
    pasteSummary: '{chars} characters · paste {n} time(s)',
    pasteLimitWarn:
      'CS2 console truncates long pastes (~{limit} characters safe). Paste each part below in order.',
    pasteLimitSplit: 'Split into {n} parts so everything fits.',
    pasteEmpty: 'Nothing to copy yet — enable options or select weapons.',
    pastePart: 'Part {i} / {n}',
    pasteChars: '{n} chars',
    pasteCopied: 'Part copied',
    pasteExpand: 'Expand',
    pasteExpandTitle: 'Full command for CS2',
    pasteClose: 'Close',
    pastePrev: 'Previous part',
    pasteNext: 'Next part',
    guestLockedTitle: 'Guest mode',
    guestLocked:
      'Profile save, share, import and saved configs need a Google account. You can still browse binds and build configs.',
    sharePromoTitle: 'Share with friends',
    sharePromoBody:
      'One link opens BindLab with your weapons, keys and utilities already filled in. Perfect for Discord, Telegram and Faceit chats.',
  },
  auth: {
    title: 'Account',
    lead: 'Sign in with Google to unlock Profile, or continue as a guest for a quick try.',
    loading: 'Checking sign-in…',
    notConfigured:
      'Firebase is not configured yet. Add NEXT_PUBLIC_FIREBASE_* keys to .env.local (see .env.example).',
    signedInHint: 'You are signed in. Bind configs still save in this browser for now.',
    anonymousLabel: 'Signed in',
    guestLabel: 'Guest',
    guestButton: 'Continue as guest',
    guestHint:
      'Guest mode unlocks the site, but Profile save / share / import stay locked until Google sign-in.',
    guestSignedInHint:
      'You are in guest mode. Sign in with Google to unlock Profile features.',
    signOut: 'Sign out',
    busy: 'Please wait…',
    or: 'or',
    google: 'Continue with Google',
    errorUserDisabled: 'This account is disabled.',
    errorPopupClosed: 'Google sign-in was closed.',
    errorPopupBlocked: 'Popup was blocked — allow popups for this site.',
    errorTooMany: 'Too many attempts — wait a bit and try again.',
    errorNetwork: 'Network error — check your connection.',
    errorNotAllowed: 'This sign-in method is disabled in Firebase Console.',
    errorUnauthorizedDomain:
      'This domain is not allowed for sign-in. Add bindlab.ru in Firebase Console → Authentication → Settings → Authorized domains.',
    errorNotConfigured: 'Firebase Auth is not configured.',
    errorGeneric: 'Something went wrong. Try again.',
  },
  guide: {
    openTitle: 'How this site works',
    title: 'Welcome — how it works',
    lead:
      'You’re about to build CS2 binds and settings, then paste them into the console (~). No rush — pick a path that fits you.',
    pathImmediateTitle: 'Paste right away',
    pathImmediateBody:
      'Pick weapons or utility options, copy from the right panel, open the CS2 console (~) and paste. Done — no file needed.',
    pathConfigTitle: 'Save a config and share',
    pathConfigBody:
      'In Profile, save a named setup. Later paste it into CS2 once (split into short parts if needed), or share a link with friends so they get the same binds.',
    tabsTitle: 'What each tab does',
    tabWeapons:
      'select weapons and gear, set a key, copy the buy bind.',
    tabUtilities:
      'crosshair, radar, video, grenades, jumps, practice and more. Tick what you need, then copy.',
    tabUnbind:
      'clear all keys (unbindall) or only keys you copied here before.',
    tabProfile:
      'see enabled binds and settings, save named configs, share a link, paste everything into CS2.',
    tabNotifications:
      'warns when two actions use the same key so you can fix them before pasting.',
    sidebarNote:
      'The right column is always for the key, copy buttons, and history of what you copied.',
    reopenHint: 'Tap the ! next to the site title anytime to open this guide again.',
    importantRead: 'Important · read before you continue',
    gotIt: 'Got it · start',
    gotItWait: 'Wait {n}…',
    gotItNeedAuth: 'Sign in with Google or continue as guest',
    authGateTitle: 'Sign in',
    authGateBody:
      'Continue with Google for full Profile access, or enter as a guest for a quick try (Profile save/share stay locked). Start unlocks after you choose.',
    authGateGoogle: 'Continue with Google',
    authGateGuest: 'Continue as guest',
    authGateSignedIn: 'Signed in as {name} — you can press Start',
    authGateLoading: 'Checking sign-in…',
    authGateNotConfigured:
      'Sign-in is not configured on this build — Start will unlock after the short wait.',
    continue: 'Continue',
    homeEyebrowStart: 'You’re in — let’s build binds',
    homeEyebrowTour: 'Quick tour · tap ! anytime',
    homeTitle: 'Welcome aboard',
    homeLead:
      'Pick a colored section on the left and start assembling. The arrows point the way — Weapons, Utilities, or Reset.',
    homeTourLead:
      'Pick a colored section on the left and start assembling. The arrows point the way — Weapons, Utilities, or Reset.',
    homeLeftHint: 'Start here · left side',
    homeHeaderHint: 'Also up top · header',
    homeStartFooter:
      'Need an answer? Magnifier in the header or Ctrl+K — search settings and CS2 guides on the site.',
    homeSearchHint: 'Looking for an answer? Use search ↑',
    homeSearchHintSub:
      'Magnifier in the header or Ctrl+K — settings and CS2 guides stay inside BindLab',
    homeRmbTitle: 'Looking for an answer? Use search ↑',
    homeRmbBody:
      'Magnifier in the header or Ctrl+K — settings and CS2 guides stay inside BindLab',
  },
  tips: {
    gotIt: 'Got it',
    viewInstruction: 'View instruction',
    reopenHint:
      'You can open this tip again anytime: right-click the tab icon and choose “View instruction”.',
    reopenCalloutTitle: 'Open this again anytime',
    rmbShortcut: 'Right-click icon → “View instruction”',
    instructionBadge: 'Tab instruction',
    howLabel: 'How this tab works — read this',
    tipsLabel: 'Tips',
    idleTitle: 'Choose a tab to begin',
    idleBody:
      'Pick Weapons, Utilities, Reset binds on the left — or Profile / Alerts in the header. Nothing is selected yet.',
    weapons: {
      title: 'Weapons — how this tab works',
      lead:
        'Build a buy bind: pick items, set a key on the right, copy into the CS2 console. You can select anything — we will not block you. In a live match CS2 still follows inventory rules:',
      points: [
        'One inventory slot, one item for yourself. Two rifles, two pistols, or two SMGs in the same bind will not both stay on you — the game keeps one primary and one secondary.',
        'Armor works the same way: Kevlar and Kevlar+Helmet replace each other. Putting both in one bind does not give you two vests.',
        'Order in the bind is the order of buy commands when you press the key. That order matters for the command string, but it does not override inventory limits in-game.',
        'Multi-select still has uses (shared buys, experimenting, copying a long line). Just know which lines actually equip you.',
      ],
      footer:
        'Right-click the Weapons icon → “View instruction”.',
    },
    utilities: {
      title: 'Utilities — how this tab works',
      lead:
        'Open a card, read the options, enable only what you need, then copy settings and/or binds from the right panel.',
      points: [
        'Read the short description under every option before you enable it.',
        'Turn on only what you actually need — unused binds and cvars add noise and raise the chance of key conflicts.',
        'If a card mentions autoexec, aliases, or “advanced” modes, make sure you understand the effect before copying to CS2.',
        'The key field on the right applies to the open card when that utility uses a bind key.',
      ],
      footer:
        'Right-click the Utilities icon → “View instruction”.',
    },
    unbind: {
      title: 'Reset binds — read carefully',
      lead:
        'This tab builds console commands that remove key binds in the live game. Mistakes can leave you without movement, shoot, or buy keys until you restore defaults. Always read what you copy.',
      points: [
        'unbindall wipes every key bind in CS2 — afterwards use Keyboard / Mouse → Restore defaults (or a backup config).',
        'Selective unbind is safer: only the keys you check. Still double-check the list before pasting.',
        'Prefer pasting from the main menu, not mid-match. After a full wipe you may be unable to move or open menus.',
        'This site cannot undo what you pasted into CS2. Save a Profile config first if you might need the binds again.',
      ],
      footer:
        'Right-click the Reset icon → “View instruction”.',
      rows: [
        {
          label: 'unbindall',
          body: 'Wipes every key bind in CS2. You will need Keyboard / Mouse → Restore defaults (or a backup config) afterwards.',
        },
        {
          label: 'Selective unbind',
          body: 'Safer: only the keys you check. Still double-check the list — those keys lose their actions immediately after paste.',
        },
        {
          label: 'When to paste',
          body: 'Prefer the main menu, not mid-match. After a full wipe you may be unable to move or open menus until defaults are restored.',
        },
        {
          label: 'Irreversible here',
          body: 'This site cannot undo what you pasted into CS2. Save a Profile config first if you might need the binds again.',
        },
      ],
    },
    profile: {
      title: 'Profile — how this tab works',
      lead:
        'Your current setup, saved named configs, sharing links, and pasting everything into CS2 in short chunks.',
      points: [
        'Current binds and settings show what is enabled right now — click a group to jump to that section.',
        'Save a named config so you can restore it after clearing history or share the same setup later.',
        'Share creates a link with your snapshot; friends open it and get the same selection.',
        'Paste to CS2 may split into parts if the command is long — copy each part into the console (~).',
      ],
      footer:
        'Right-click the Profile icon → “View instruction”.',
    },
    notifications: {
      title: 'Alerts — how this tab works',
      lead:
        'Warnings about key conflicts and site notices so you can fix problems before pasting into CS2.',
      points: [
        'If two actions share the same key, they appear here — open the linked section and change one of the keys.',
        'Fix conflicts before you copy binds; otherwise the last bind on that key wins in-game.',
        'Unread site notices (for example trial info) also show up here and clear after you open the tab.',
      ],
      footer:
        'Right-click the Alerts icon → “View instruction”.',
    },
    loadoutBanner: {
      title: 'Inventory note',
      armor: 'Kevlar and Kevlar+Helmet replace each other — only one armor purchase applies on you.',
      pistol: 'Several pistols in one bind: in-game you still keep a single secondary.',
      primary:
        'Several primaries (rifles / SMGs / mid-tier) in one bind: in-game you still keep a single primary.',
      fire_nade:
        'Molotov and Incendiary share the same grenade slot — only one fire grenade stays on you.',
      orderNote:
        'Bind order is the buy sequence on key press; it does not let you hold two items in one slot.',
    },
  },
}
