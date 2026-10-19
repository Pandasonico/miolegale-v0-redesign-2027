import { SITE, type Archive } from './site'

export type ArchiveEntry = {
  key: string
  href: string
  label: string
  title?: string
}

const ENTITIES: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' }

function decode(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&([a-z]+);/g, (m, name) => ENTITIES[name] ?? m)
    .trim()
}

function fallbackLabel(key: string) {
  const art = /^art-(\d+)$/.exec(key)
  if (art) return `Art. ${art[1]}`
  const disp = /^disp-trans-(\d+)$/.exec(key)
  if (disp) return `Disp. trans. ${disp[1]}`
  return key.replace(/-/g, ' ')
}

function sortKey(key: string) {
  const n = Number(/(\d+)$/.exec(key)?.[1] ?? 0)
  return (key.startsWith('disp-trans') ? 1000 : 0) + n
}

// The miolegale-codici REST endpoints require auth, so the public index pages are parsed instead.
export async function getArchiveIndex(slug: Archive['slug']): Promise<ArchiveEntry[]> {
  const base = `${SITE.url}/${slug}/`
  try {
    const res = await fetch(base, { next: { revalidate: 86400 } })
    if (!res.ok) return []
    const html = await res.text()
    const pattern = new RegExp(`<a[^>]*href="${base.replace(/[.]/g, '\\.')}([^"/]+)/"([^>]*)>(?:<strong>)?([^<]*)`, 'g')
    const entries = new Map<string, ArchiveEntry>()
    for (const [, key, attrs, text] of html.matchAll(pattern)) {
      if (entries.has(key)) continue
      const title = /title="([^"]*)"/.exec(attrs)?.[1]
      entries.set(key, {
        key,
        href: `${base}${key}/`,
        label: decode(text) || fallbackLabel(key),
        title: title ? decode(title) : undefined,
      })
    }
    const list = [...entries.values()]
    if (slug === 'costituzione') list.sort((a, b) => sortKey(a.key) - sortKey(b.key))
    else list.sort((a, b) => a.label.localeCompare(b.label, 'it'))
    return list
  } catch {
    return []
  }
}
