import { SEO_CATALOG } from './seoCatalog.generated'
import {
  TOPIC_PACKS,
  type SeoCatalogRow,
  type SeoGroup,
  type SeoTopic,
} from './seoTopicTemplates'

export type SeoLanding = {
  slug: string
  path: string
  group: SeoGroup
  title: string
  description: string
  h1: string
  lead: string
  sections: { heading: string; body: string }[]
  steps?: { name: string; text: string }[]
  keywords: string[]
  ctaHref: string
  ctaLabel: string
  faq?: { question: string; answer: string }[]
  topic: SeoTopic
}

function pathFor(row: SeoCatalogRow): string {
  return `/${row.group}/${row.slug}`
}

function capitalizeKw(kw: string): string {
  if (!kw) return kw
  return kw.charAt(0).toUpperCase() + kw.slice(1)
}

function buildLanding(row: SeoCatalogRow): SeoLanding {
  const pack = TOPIC_PACKS[row.topic]
  const kw = row.kw.trim()
  const h1 = capitalizeKw(kw)
  const soft = Boolean(pack.softFunnel)
  const keywords = Array.from(
    new Set([kw, ...(row.extra ?? []), 'CS2', 'кс2', 'ксго2', 'BindLab']),
  )

  const title = soft
    ? `${h1} — гайд CS2 | BindLab`
    : `${h1} — онлайн | BindLab`
  const description = soft
    ? `${h1}: кратко для игроков CS2 / ксго2. Практичные советы и переход к настройке биндов в BindLab.`
    : `${h1}: соберите команды в BindLab и скопируйте в консоль CS2 (~). Бесплатно.`

  const lead = soft
    ? `Ищете «${kw}»? Ниже — коротко по теме CS2 / ксго2. Когда будете готовы ускорить закупку и утилиты — соберите бинды в BindLab и вставьте в консоль.`
    : `Запрос «${kw}» часто ищут игроки CS2 / ксго2. В BindLab это собирается в ${pack.tabHint}: отметьте опции и скопируйте команды.`

  const midHeading = soft
    ? 'Как это связано с биндами и настройками'
    : 'Как сделать это в BindLab'

  const closing = soft
    ? 'BindLab — бесплатный генератор биндов и настроек CS2: бай-меню, jumpthrow, прицел, радар, unbind. Откройте сайт, соберите конфиг и скопируйте в консоль (~).'
    : 'Не нужно вручную набирать длинные команды. Отметили нужное в BindLab — скопировали в консоль (~) или autoexec.cfg.'

  return {
    slug: row.slug,
    path: pathFor(row),
    group: row.group,
    topic: row.topic,
    title: title.length > 72 ? `${h1} | BindLab` : title,
    description: description.slice(0, 160),
    h1,
    lead,
    sections: [
      {
        heading: soft ? `Про «${kw}» в CS2` : `Что значит «${kw}»`,
        body: `${pack.about} Тема актуальна для игроков, которые пишут в поиске «ксго2», «кс2» и CS2.`,
      },
      {
        heading: midHeading,
        body: pack.tip,
      },
      {
        heading: soft ? 'Следующий шаг — BindLab' : 'Почему удобен онлайн-генератор',
        body: closing,
      },
    ],
    steps: pack.steps,
    keywords,
    ctaHref: pack.ctaHref,
    ctaLabel: pack.ctaLabel,
    faq: [
      {
        question: soft
          ? `Где настроить бинды после гайда «${kw}»?`
          : `${h1} — как быстро?`,
        answer: soft
          ? `Откройте https://bindlab.ru — соберите бай-бинды, jumpthrow и настройки, затем скопируйте в консоль CS2. Гайд: https://bindlab.ru${pathFor(row)}`
          : `Откройте BindLab (${pack.tabHint}), соберите нужное и скопируйте команды в консоль. Страница: https://bindlab.ru${pathFor(row)}`,
      },
      {
        question: 'Это про CS2 / ксго2?',
        answer:
          'Да. Материалы ориентированы на Counter-Strike 2 (в поиске часто пишут кс2 и ксго2). BindLab помогает с биндами и конфигом под эту игру.',
      },
    ],
  }
}

export const SEO_LANDINGS: SeoLanding[] = SEO_CATALOG.map(buildLanding)

export function landingByPath(path: string): SeoLanding | undefined {
  return SEO_LANDINGS.find((l) => l.path === path)
}

export function landingsByGroup(group: SeoGroup): SeoLanding[] {
  return SEO_LANDINGS.filter((l) => l.group === group)
}

export function landingSlugs(group: SeoGroup): string[] {
  return landingsByGroup(group).map((l) => l.slug)
}
