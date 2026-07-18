import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initAnalytics } from './analytics'
import { AuthProvider } from './auth/AuthContext'
import { I18nProvider } from './i18n/I18nProvider'
import { applyFreshUserFromUrl } from './utils/freshUser'

applyFreshUserFromUrl()
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
)
