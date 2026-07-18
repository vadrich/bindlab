/**
 * Public site URL + brand (re-exports SEO core for Vite / app).
 */
export {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE_RU,
  SITE_TITLE_EN,
  SITE_DESCRIPTION_RU,
  SITE_DESCRIPTION_EN,
  SITE_TAGLINE_RU,
  SITE_TAGLINE_EN,
  META_KEYWORDS,
  SEMANTIC_CORE,
  SEO_FAQ_RU,
} from './seo.config'

/** @deprecated use SITE_TAGLINE_EN */
export { SITE_TAGLINE_EN as SITE_TAGLINE } from './seo.config'
