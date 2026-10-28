import { SITE } from './site'

export type ActLink = { href: string; label: string; rubrica?: string; current?: boolean }

export type ActArticle = {
  path: string
  number: string
  rubrica?: string
  act: { href: string; title: string; estremi?: string }
  trail: ActLink[]
  textHtml: string
  commaCount: number
  meta: string[]
  commentHtml?: string
  prev?: ActLink
  next?: ActLink
  siblings: { group?: string; articles: ActLink[] }
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

const ORIGIN = SITE.url.replace(/\/$/, '')

/** Riporta i link interni di miolegale.it a percorsi locali, lasciando media e admin sul dominio WordPress. */
export function localHref(href: string) {
  if (!href.startsWith(ORIGIN) && !href.startsWith('https://miolegale.it')) return href
  const { pathname, hash } = new URL(href)
  if (/^\/wp-(content|admin|json)\//.test(pathname)) return href
  return (pathname.replace(/\/$/, '') || '/') + hash
}

function localizeHtml(html: string) {
  return html.replace(/href="(https:\/\/(?:www\.)?miolegale\.it[^"]*)"/g, (_, url) => `href="${localHref(url)}"`)
}

function between(html: string, startMarker: string, endMarker: string) {
  const start = html.indexOf(startMarker)
  if (start < 0) return undefined
  const from = html.indexOf('>', start) + 1
  const end = html.indexOf(endMarker, from)
  return html.slice(from, end > 0 ? end : undefined)
}

function parseNeighbour(html: string, cls: string): ActLink | undefined {
  const m = new RegExp(`<a class="${cls}" href="([^"]+)">([\\s\\S]*?)</a>`).exec(html)
  if (!m) return undefined
  const text = clean(m[2]).replace(/^←\s*|\s*→$/g, '')
  const parts = /^(Art\.\s*\S+(?:\s+(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies))?)\s*(.*)$/i.exec(text)
  return { href: localHref(m[1]), label: parts?.[1] ?? text, rubrica: parts?.[2] || undefined }
}

// Articoli resi dal plugin miolegale-codici: il markup pubblico ml4cod-* è l'unica fonte accessibile.
export async function getActArticle(path: string): Promise<ActArticle | null> {
  try {
    const res = await fetch(`${SITE.url}/${path}/`, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const page = await res.text()
    const start = page.indexOf('<article class="ml4cod-scheda')
    if (start < 0) return null
    const article = page.slice(start, page.indexOf('</article>', start))

    const number = clean(between(article, 'class="ml4cod-titolo-num"', '</span>') ?? '')
    if (!number) return null
    const rubrica = clean(between(article, 'class="ml4cod-titolo-rubrica"', '</span>') ?? '') || undefined

    const estremiHtml = between(article, 'class="ml4cod-estremi-sotto"', '</h2>') ?? ''
    const actLink = /<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/.exec(estremiHtml)
    const estremi = clean(estremiHtml.replace(/<a[\s\S]*?<\/a>/, '')).replace(/^[–-]\s*/, '') || undefined

    const textHtml = between(article, '<div class="ml4cod-testo"', '</div>') ?? ''
    const meta = [...article.matchAll(/<p class="ml4cod-meta">([\s\S]*?)<\/p>/g)].map((m) => localizeHtml(m[1]))

    const commentStart = article.indexOf('<div class="ml4cod-commento')
    let commentHtml: string | undefined
    if (commentStart >= 0) {
      const from = article.indexOf('>', commentStart) + 1
      const navAt = article.indexOf('<nav class="ml4cod-vicini"', from)
      commentHtml = article
        .slice(from, navAt > 0 ? navAt : undefined)
        .replace(/<\/div>\s*$/, '')
        .replace(/^\s*<h2>\s*Commento\s*<\/h2>/i, '')
        .trim()
    }

    const breadcrumb = between(page, 'id="breadcrumb"', '</nav>') ?? ''
    const trail = [...breadcrumb.matchAll(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      .map((m) => ({ href: localHref(m[1]), label: clean(m[2]) }))
      .filter((l) => l.href !== '/')

    const preview = between(page, 'class="ml4cod-anteprima"', '</aside>') ?? ''
    const groups = [...preview.matchAll(/<strong class="ml4cod-p">([\s\S]*?)<\/strong>/g)].map((m) => clean(m[1]))
    const siblingArticles = [...preview.matchAll(/<li class="ml4cod-art([^"]*)"[^>]*>([\s\S]*?)<\/li>/g)].flatMap((m) => {
      const href = /href="([^"]+)"/.exec(m[2])?.[1]
      if (!href) return []
      const rub = /<span>([\s\S]*?)<\/span>/.exec(m[2])?.[1]
      return [
        {
          href: localHref(href),
          label: clean(/<strong>([\s\S]*?)<\/strong>/.exec(m[2])?.[1] ?? ''),
          rubrica: rub ? clean(rub) : undefined,
          current: m[1].includes('ml4cod-corrente'),
        },
      ]
    })

    return {
      path,
      number,
      rubrica,
      act: {
        href: actLink ? localHref(actLink[1]) : `/${path.split('/').slice(0, -1).join('/')}`,
        title: actLink ? clean(actLink[2]) : '',
        estremi,
      },
      trail,
      textHtml: localizeHtml(textHtml),
      commaCount: (textHtml.match(/class="ml4cod-ncomma"/g) ?? []).length,
      meta,
      commentHtml: commentHtml ? localizeHtml(commentHtml) : undefined,
      prev: parseNeighbour(article, 'ml4cod-prec'),
      next: parseNeighbour(article, 'ml4cod-succ'),
      siblings: { group: groups.at(-1), articles: siblingArticles },
    }
  } catch {
    return null
  }
}
