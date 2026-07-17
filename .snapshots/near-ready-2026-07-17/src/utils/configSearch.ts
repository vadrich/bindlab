import {
  SEARCH_CATALOG,
  type SearchCatalogEntry,
  type SearchTarget,
} from '../data/configSearch'
import type { Messages } from '../i18n/messages/en'

export interface SearchResult {
  entry: SearchCatalogEntry
  score: number
  title: string
  body: string
  command?: string
  target: SearchTarget
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function resolveMeta(entry: SearchCatalogEntry, m: Messages): { title: string; body: string } {
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

function scoreEntry(entry: SearchCatalogEntry, query: string, m: Messages): number {
  const q = normalize(query.trim())
  if (!q) return 0

  const { title, body } = resolveMeta(entry, m)
  const haystack = normalize(
    [...entry.keywords, title, body, entry.command ?? ''].join(' '),
  )
  const tokens = q.split(/\s+/).filter(Boolean)

  let score = 0
  if (haystack.includes(q)) score += 24
  for (const token of tokens) {
    if (token.length < 2) continue
    if (haystack.includes(token)) score += 6
    for (const kw of entry.keywords) {
      if (normalize(kw).startsWith(token)) score += 3
    }
  }
  return score
}

export function searchConfig(query: string, m: Messages, limit = 8): SearchResult[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const ranked = SEARCH_CATALOG.map((entry) => {
    const score = scoreEntry(entry, trimmed, m)
    const meta = resolveMeta(entry, m)
    return {
      entry,
      score,
      title: meta.title,
      body: meta.body,
      command: entry.command,
      target: entry.target,
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
        : `t:${row.target.tab}:${row.title}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(row)
    if (out.length >= limit) break
  }
  return out
}
