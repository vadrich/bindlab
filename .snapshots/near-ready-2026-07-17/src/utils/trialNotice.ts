const TRIAL_NOTICE_SEEN_KEY = 'cs2-trial-notice-seen'

export function hasSeenTrialNotice(): boolean {
  try {
    return localStorage.getItem(TRIAL_NOTICE_SEEN_KEY) === '1'
  } catch {
    return true
  }
}

export function markTrialNoticeSeen(): void {
  try {
    localStorage.setItem(TRIAL_NOTICE_SEEN_KEY, '1')
  } catch {
    // ignore
  }
}
