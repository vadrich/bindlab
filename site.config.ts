/**
 * Public site URL (no trailing slash).
 * Set VITE_SITE_URL when deploying, e.g. https://bindlab.example.com
 */
export const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://YOUR-DOMAIN.com'
).replace(/\/$/, '')

export const SITE_NAME = 'BindLab'
export const SITE_TAGLINE_EN =
  'Free CS2 bind & settings generator: buy menu, jumpthrow, crosshair, FPS, unbind — copy to console'
