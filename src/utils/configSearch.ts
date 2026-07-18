import {
  SEARCH_CATALOG,
  type SearchCatalogEntry,
  type SearchTarget,
} from '../data/configSearch'
import { SEO_LANDINGS } from '../data/seoLandings'
import type { Messages } from '../i18n/messages/en'

export interface SearchResult {
  entry: SearchCatalogEntry
  score: number
  title: string
  body: string
  command?: string
  target: SearchTarget
  kind: 'setting' | 'guide'
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function resolveMeta(
  entry: SearchCatalogEntry,
  m: Messages,
): { title: string; body: string } {
  if (entry.extraKey) {
    const x = m.search.extra[entry.extraKey as keyof typeof m.search.extra]
    if (x) return { title: x.title, body: x.body }
  }
  const t = entry.target
  if (t.type === 'utility') {
    const meta = m.utilMeta[t.id]
    if (meta) return { title: meta.label, body: meta.hint }
  }
  if (t.type === 'tab') {
    const label = m.tabs[t.tab]
    if (label) {
      return {
        title: label,
        body: m.search.tabHint[t.tab] ?? m.search.hint,
      }
    }
  }
  return { title: entry.id, body: m.search.hint }
}

function scoreHaystack(haystackRaw: string, query: string): number {
  const q = normalize(query.trim())
  if (!q) return 0
  const haystack = normalize(haystackRaw)
  const tokens = q.split(/\s+/).filter(Boolean)
  let score = 0
  if (haystack.includes(q)) score += 24
  for (const token of tokens) {
    if (token.length < 2) continue
    if (haystack.includes(token)) score += 6
    for (const part of haystack.split(/\s+/)) {
      if (part.startsWith(token)) score += 2
    }
  }
  return score
}

function scoreEntry(
  entry: SearchCatalogEntry,
  query: string,
  m: Messages,
): number {
  const { title, body } = resolveMeta(entry, m)
  return scoreHaystack(
    [...entry.keywords, title, body, entry.command ?? ''].join(' '),
    query,
  )
}

function searchSettings(query: string, m: Messages, limit: number): SearchResult[] {
  const ranked = SEARCH_CATALOG.map((entry) => {
    const score = scoreEntry(entry, query, m)
    const meta = resolveMeta(entry, m)
    return {
      entry,
      score,
      title: meta.title,
      body: meta.body,
      command: entry.command,
      target: entry.target,
      kind: 'setting' as const,
    }
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  const seen = new Set<string>()
  const out: SearchResult[] = []
  for (const row of ranked) {
    const key =
      row.target.type === 'utility'
        ? `u:${row.target.id}`
        : row.target.type === 'tab'
          ? `t:${row.target.tab}`
          : `g:${row.target.path}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(row)
    if (out.length >= limit) break
  }
  return out
}

function searchGuides(query: string, limit: number): SearchResult[] {
  const ranked = SEO_LANDINGS.map((landing) => {
    const score = scoreHaystack(
      [
        landing.h1,
        landing.lead,
        landing.description,
        ...landing.keywords,
        ...landing.sections.map((s) => `${s.heading} ${s.body}`),
      ].join(' '),
      query,
    )
    const entry: SearchCatalogEntry = {
      id: `guide-${landing.path}`,
      keywords: landing.keywords,
      target: { type: 'guide', path: landing.path },
    }
    return {
      entry,
      score,
      title: landing.h1,
      body: landing.lead.slice(0, 140),
      target: entry.target,
      kind: 'guide' as const,
    }
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  return ranked.slice(0, limit)
}

/** Settings + SEO guides in one ranked list (guides stay inside BindLab via modal). */
export function searchConfig(query: string, m: Messages, limit = 12): SearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const settings = searchSettings(trimmed, m, Math.ceil(limit * 0.55))
  const guides = searchGuides(trimmed, Math.ceil(limit * 0.7))

  const merged = [...settings, ...guides].sort((a, b) => {
    // Prefer a bit of settings when scores are close
    if (Math.abs(a.score - b.score) <= 2) {
      if (a.kind !== b.kind) return a.kind === 'setting' ? -1 : 1
    }
    return b.score - a.score
  })

  const seen = new Set<string>()
  const out: SearchResult[] = []
  for (const row of merged) {
    const key = row.entry.id
    if (seen.has(key)) continue
    seen.add(key)
    out.push(row)
    if (out.length >= limit) break
  }
  return out
}
