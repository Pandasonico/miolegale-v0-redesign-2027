import { localHref } from './act-article'
import { SITE } from './site'

export type ActArticle = { slug: string; href: string; label: string; rubrica?: string; group?: string }

export type ActNode = { id: string; title: string; level: number; articles: ActArticle[]; children: ActNode[] }

export type ActIndex = {
  path: string
  title: string
  estremi?: string
  officialTitle?: string
  root: ActNode
  total: number
}

const ENTITIES: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', laquo: '«', raquo: '»' }

function clean(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&([a-z]+);/g, (m, name) => ENTITIES[name] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
}

const TOKEN =
  /<details([^>]*)>|<\/details>|<summary>\s*<h([2-6])[^>]*>([\s\S]*?)<\/h\2>\s*<\/summary>|<li class="ml4cod-art"([^>]*)>([\s\S]*?)<\/li>/g

// Pages rendered by the proprietary miolegale-codici plugin: its tables live outside WordPress
// and its REST API needs auth, so the public index (ml4cod-* markup) is parsed.
export async function getActIndex(path: string): Promise<ActIndex | null> {
  try {
    const res = await fetch(`${SITE.url}/${path}/`, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const html = await res.text()
    const start = html.indexOf('<div class="ml4cod-indice')
    if (start < 0) return null
    const end = html.indexOf('</main>', start)
    const body = html.slice(start, end > 0 ? end : undefined)

    const title = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(body)?.[1]
    if (!title) return null
    const estremi = /class="ml4cod-estremi-sotto">([\s\S]*?)<\/h2>/.exec(body)?.[1]
    const official = /class="ml4cod-titolo-ufficiale">([\s\S]*?)<\/p>/.exec(body)?.[1]

    const root: ActNode = { id: 'root', title: '', level: 1, articles: [], children: [] }
    const stack = [root]
    let total = 0
    let auto = 0

    for (const m of body.matchAll(TOKEN)) {
      const [token, detailsAttrs, level, heading, liAttrs, liBody] = m
      const current = stack[stack.length - 1]
      if (detailsAttrs !== undefined) {
        const id = /\bid="([^"]+)"/.exec(detailsAttrs)?.[1] ?? `n${auto++}`
        const node: ActNode = { id, title: '', level: 2, articles: [], children: [] }
        current.children.push(node)
        stack.push(node)
      } else if (token === '</details>') {
        if (stack.length > 1) stack.pop()
      } else if (heading !== undefined) {
        current.title = clean(heading)
        current.level = Number(level)
      } else if (liAttrs !== undefined) {
        const href = /href="([^"]+)"/.exec(liBody)?.[1]
        if (!href) continue
        const label = clean(/<strong>([\s\S]*?)<\/strong>/.exec(liBody)?.[1] ?? '')
        const rubrica = /<span>([\s\S]*?)<\/span>/.exec(liBody)?.[1]
        current.articles.push({
          slug: /data-slug="([^"]+)"/.exec(liAttrs)?.[1] ?? href,
          href: localHref(href),
          label,
          rubrica: rubrica ? clean(rubrica) : undefined,
          group: /data-c="([^"]+)"/.exec(liAttrs)?.[1],
        })
        total++
      }
    }

    return {
      path,
      title: clean(title),
      estremi: estremi ? clean(estremi) : undefined,
      officialTitle: official ? clean(official) : undefined,
      root,
      total,
    }
  } catch {
    return null
  }
}
