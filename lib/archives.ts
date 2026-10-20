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

export type ArchiveAct = {
  key: string
  href: string
  label: string
  title?: string
  estremi?: string
  articles?: string
}

export type ArchiveSection = { title?: string; acts: ArchiveAct[] }

const stripTags = (s: string) => decode(s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '))

/** Links to collections this site renders itself stay local; the plugin's act pages stay on miolegale.it. */
function localizeHref(href: string) {
  const local = /^https?:\/\/(?:www\.)?miolegale\.it\/((?:codici|testi-unici)\/[^/]+|costituzione)\/?$/.exec(href)
  return local ? `/${local[1]}` : href
}

// The miolegale-codici plugin keeps its data outside WordPress and its REST endpoints require auth,
// so its public index page (ml4cod-* markup) is parsed instead.
export async function getArchiveSections(slug: Archive['slug']): Promise<{ intro?: string; sections: ArchiveSection[] }> {
  try {
    const res = await fetch(`${SITE.url}/${slug}/`, { next: { revalidate: 86400 } })
    if (!res.ok) return { sections: [] }
    const html = await res.text()
    const intro = /<p class="ml4cod-meta">([\s\S]*?)<\/p>/.exec(html)?.[1]
    const blocks = html.matchAll(/(?:<h2 class="ml4cod-sezione">([\s\S]*?)<\/h2>\s*)?<ul class="ml4cod-atti">([\s\S]*?)<\/ul>/g)
    const sections: ArchiveSection[] = []
    for (const [, heading, list] of blocks) {
      const acts: ArchiveAct[] = []
      for (const [, item] of list.matchAll(/<li>([\s\S]*?)<\/li>/g)) {
        const link = /<a[^>]*href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/.exec(item)
        if (!link) continue
        const [, href, attrs, text] = link
        const title = /title="([^"]*)"/.exec(attrs)?.[1]
        const estremi = /<span class="ml4cod-estremi">([\s\S]*?)<\/span>/.exec(item)?.[1]
        const articles = /<span>([^<]*articol[^<]*)<\/span>/.exec(item)?.[1]
        acts.push({
          key: href.replace(/\/$/, '').split('/').pop() ?? href,
          href: localizeHref(href),
          label: stripTags(text),
          title: title ? decode(title) : undefined,
          estremi: estremi ? stripTags(estremi).replace(/^\(|\)$/g, '') : undefined,
          articles: articles ? decode(articles) : undefined,
        })
      }
      if (acts.length) sections.push({ title: heading ? stripTags(heading) : undefined, acts })
    }
    return { intro: intro ? stripTags(intro) : undefined, sections }
  } catch {
    return { sections: [] }
  }
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
