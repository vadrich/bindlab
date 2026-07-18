/**
 * Public env for Next.js.
 * IMPORTANT: values must be read via static `process.env.NEXT_PUBLIC_*`
 * property access so Next can inline them into the client bundle.
 * Dynamic `process.env[key]` does NOT work in the browser.
 */

function pick(
  nextVal: string | undefined,
  viteVal: string | undefined,
): string | undefined {
  if (typeof nextVal === 'string' && nextVal.length > 0) return nextVal
  if (typeof viteVal === 'string' && viteVal.length > 0) return viteVal
  return undefined
}

export const publicEnv = {
  siteUrl: () =>
    pick(process.env.NEXT_PUBLIC_SITE_URL, process.env.VITE_SITE_URL),
  yandexMetrikaId: () =>
    pick(
      process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID,
      process.env.VITE_YANDEX_METRIKA_ID,
    ),
  firebase: {
    apiKey: () =>
      pick(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        process.env.VITE_FIREBASE_API_KEY,
      ),
    authDomain: () =>
      pick(
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        process.env.VITE_FIREBASE_AUTH_DOMAIN,
      ),
    projectId: () =>
      pick(
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        process.env.VITE_FIREBASE_PROJECT_ID,
      ),
    storageBucket: () =>
      pick(
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        process.env.VITE_FIREBASE_STORAGE_BUCKET,
      ),
    messagingSenderId: () =>
      pick(
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      ),
    appId: () =>
      pick(
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        process.env.VITE_FIREBASE_APP_ID,
      ),
  },
} as const
