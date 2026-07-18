'use client'

import { useEffect } from 'react'
import App from '../App'
import { initAnalytics } from '../analytics'
import { AuthProvider } from '../auth/AuthContext'
import { I18nProvider } from '../i18n/I18nProvider'
import { applyFreshUserFromUrl } from '../utils/freshUser'

export function BindLabApp() {
  useEffect(() => {
    applyFreshUserFromUrl()
    initAnalytics()
  }, [])

  return (
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  )
}
