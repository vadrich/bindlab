const WELCOME_SEEN_KEY = 'cs2-welcome-guide-seen'

export function hasSeenWelcomeGuide(): boolean {
  try {
    return localStorage.getItem(WELCOME_SEEN_KEY) === '1'
  } catch {
    return true
  }
}

export function markWelcomeGuideSeen(): void {
  try {
    localStorage.setItem(WELCOME_SEEN_KEY, '1')
  } catch {
    // ignore quota / private mode
  }
}
