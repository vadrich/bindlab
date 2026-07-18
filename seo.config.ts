/**
 * SEO + semantic keyword core for BindLab (CS2).
 * Primary market: RU. Secondary: EN.
 */

export const SITE_URL = (
  process.env.VITE_SITE_URL || 'https://bindlab.ru'
).replace(/\/$/, '')

export const SITE_NAME = 'BindLab'

/** Title ≤ ~60–70 chars for SERP */
export const SITE_TITLE_RU =
  'BindLab — бинды CS2 онлайн: бай-меню, jumpthrow, конфиг'
export const SITE_TITLE_EN =
  'BindLab — free CS2 binds online: buy menu, jumpthrow, config'

/** Meta description ≤ ~155–160 chars */
export const SITE_DESCRIPTION_RU =
  'Бесплатный генератор биндов и настроек CS2: визуальное бай-меню, jumpthrow, прицел, радар, FPS, звук, unbind. Собери autoexec, скопируй в консоль (~) и поделись ссылкой.'
export const SITE_DESCRIPTION_EN =
  'Free CS2 bind & settings generator: buy menu, jumpthrow, crosshair, radar, FPS, audio, unbind. Build autoexec, copy to console (~), save and share.'

export const SITE_TAGLINE_RU =
  'Собери бинды CS2 за минуту — без ручного набора команд в консоли'
export const SITE_TAGLINE_EN =
  'Free CS2 bind & settings generator: buy menu, jumpthrow, crosshair, FPS, unbind — copy to console'

/**
 * Semantic core (clusters). Used for keywords meta + FAQ + noscript SEO copy.
 * Focus: high-intent RU queries around binds/config/CS2.
 */
export const SEMANTIC_CORE = {
  /** Primary / head terms */
  primary: [
    'бинды CS2',
    'бинды кс 2',
    'CS2 binds',
    'генератор биндов CS2',
    'бай бинды CS2',
    'buy binds CS2',
    'конфиг CS2',
    'autoexec CS2',
    'настройки CS2',
  ],
  /** Feature / mid-tail */
  features: [
    'jumpthrow CS2',
    'джамптроу бинд',
    'прицел CS2',
    'crosshair CS2',
    'радар CS2',
    'unbindall CS2',
    'сброс биндов CS2',
    'viewmodel FOV CS2',
    'бинды гранат CS2',
    'практика CS2 команды',
    'консоль CS2 бинды',
  ],
  /** Long-tail intent */
  longTail: [
    'как сделать бай бинды CS2',
    'как забиндить jumpthrow CS2',
    'скопировать бинды в консоль CS2',
    'визуальный buy menu CS2',
    'генератор конфига CS2 онлайн',
    'поделиться конфигом CS2 ссылкой',
    'лучшие бинды для CS2',
    'настроить прицел CS2 онлайн',
  ],
  /** Brand */
  brand: ['BindLab', 'Bind Lab', 'CS2 Bind Configurator', 'bindlab.ru'],
} as const

export const META_KEYWORDS = [
  ...SEMANTIC_CORE.brand,
  ...SEMANTIC_CORE.primary,
  ...SEMANTIC_CORE.features,
  ...SEMANTIC_CORE.longTail.slice(0, 6),
].join(', ')

export interface SeoFaqItem {
  question: string
  answer: string
}

/** FAQ for JSON-LD FAQPage (helps rich results / Yandex). */
export const SEO_FAQ_RU: SeoFaqItem[] = [
  {
    question: 'Что такое BindLab?',
    answer:
      'BindLab — бесплатный онлайн-генератор биндов и настроек Counter-Strike 2. Вы выбираете оружие, утилиты и опции визуально, а сайт собирает готовые команды для консоли CS2.',
  },
  {
    question: 'Как вставить бинды CS2 в игру?',
    answer:
      'Скопируйте команды справа на сайте, откройте консоль CS2 клавишей ~ и вставьте (Ctrl+V). Либо сохраните конфиг в autoexec.cfg и добавьте +exec autoexec.cfg в параметры запуска.',
  },
  {
    question: 'Можно ли сделать бай-бинды и jumpthrow?',
    answer:
      'Да. Во вкладке «Оружие» собирается визуальное бай-меню, в «Утилитах» — jumpthrow, гранаты, прицел, радар, звук, FPS и практика. Есть предупреждения о конфликтах клавиш.',
  },
  {
    question: 'BindLab бесплатный?',
    answer:
      'Да, сайт полностью бесплатный: генерация биндов, сохранение конфигов и шаринг ссылкой доступны без оплаты.',
  },
  {
    question: 'Как сбросить бинды в CS2?',
    answer:
      'Во вкладке «Сброс» можно скопировать unbindall или выборочно снять клавиши, которые вы раньше копировали из BindLab, и вставить команды в консоль.',
  },
]

export function buildWebApplicationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    alternateName: [
      'CS2 Bind Configurator',
      'Генератор биндов CS2',
      'Bind Lab',
    ],
    url: `${SITE_URL}/`,
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'Counter-Strike 2',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    inLanguage: ['ru', 'en', 'es', 'zh', 'hi'],
    isAccessibleForFree: true,
    description: SITE_DESCRIPTION_RU,
    keywords: META_KEYWORDS,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
    image: `${SITE_URL}/og-image.png`,
    screenshot: `${SITE_URL}/og-image.png`,
    featureList: [
      'Визуальные бай-бинды CS2',
      'Jumpthrow и бинды гранат',
      'Прицел, радар, видео, звук, сеть',
      'Unbind и сброс клавиш',
      'Сохранение конфига и шаринг ссылкой',
      'Мультиязычный интерфейс',
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  }
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Генератор биндов CS2',
    url: `${SITE_URL}/`,
    inLanguage: 'ru-RU',
    description: SITE_DESCRIPTION_RU,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildFaqJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SEO_FAQ_RU.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function buildSoftwareAppJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Windows, macOS, Linux, Web',
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION_RU,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
  }
}
