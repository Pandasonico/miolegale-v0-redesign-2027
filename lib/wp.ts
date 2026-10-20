const WP_API = process.env.WP_API_URL ?? 'https://miolegale.it/wp-json/wp/v2'

export type WPCategory = { id: number; name: string; slug: string; count: number; description?: string }

export type WPPost = {
  id: number
  date: string
  modified: string
  slug: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content?: { rendered: string }
  categories: number[]
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[]
    'wp:term'?: { id: number; name: string; slug: string; taxonomy: string }[][]
  }
}

type WPMedia = {
  source_url?: string
  alt_text?: string
  media_details?: { sizes?: Record<string, { source_url: string } | undefined> }
}

export type PostCard = {
  id: number
  title: string
  excerpt: string
  date: string
  href: string
  section: string
  image?: string
  imageAlt?: string
}

export function featuredImage(post: WPPost, size: 'medium_large' | 'large' = 'medium_large') {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media?.source_url) return null
  const sizes = media.media_details?.sizes
  return {
    src: sizes?.[size]?.source_url ?? sizes?.medium_large?.source_url ?? media.source_url,
    alt: decodeEntities(media.alt_text ?? ''),
  }
}

const LIST_FIELDS = 'id,date,slug,link,title,excerpt,categories,_links,_embedded'

async function wpFetch<T>(path: string, revalidate = 600): Promise<{ data: T; total: number; totalPages: number }> {
  const res = await fetch(`${WP_API}${path}`, { next: { revalidate } })
  if (!res.ok) {
    if (res.status === 400) return { data: [] as T, total: 0, totalPages: 0 }
    throw new Error(`WordPress API ${res.status} su ${path}`)
  }
  return {
    data: (await res.json()) as T,
    total: Number(res.headers.get('x-wp-total') ?? 0),
    totalPages: Number(res.headers.get('x-wp-totalpages') ?? 0),
  }
}

export type UtilityPage = { id: number; title: string; excerpt: string; href: string; modified: string }

const UTILITY_PARENT_SLUG = 'utilita'

export async function getUtilityPages(): Promise<UtilityPage[]> {
  try {
    const { data: parents } = await wpFetch<{ id: number }[]>(`/pages?slug=${UTILITY_PARENT_SLUG}&_fields=id`, 86400)
    const parentId = parents[0]?.id
    if (!parentId) return []
    const { data } = await wpFetch<{ id: number; link: string; modified: string; title: { rendered: string }; excerpt: { rendered: string } }[]>(
      `/pages?parent=${parentId}&per_page=100&orderby=title&order=asc&_fields=id,link,modified,title,excerpt`,
      3600,
    )
    return data.map((p) => ({
      id: p.id,
      title: decodeEntities(p.title.rendered),
      excerpt: decodeEntities(p.excerpt.rendered),
      href: p.link,
      modified: p.modified,
    }))
  } catch {
    return []
  }
}

export function decodeEntities(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '…')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Converte un link WordPress (https://miolegale.it/massime/slug/) in un percorso locale. */
export function toLocalPath(link: string) {
  try {
    const { pathname } = new URL(link)
    return pathname.replace(/\/$/, '') || '/'
  } catch {
    return '/'
  }
}

export function toCard(post: WPPost): PostCard {
  const path = toLocalPath(post.link)
  const img = featuredImage(post)
  return {
    id: post.id,
    title: decodeEntities(post.title.rendered),
    excerpt: decodeEntities(post.excerpt.rendered),
    date: post.date,
    href: path,
    section: path.split('/')[1] ?? '',
    image: img?.src,
    imageAlt: img?.alt,
  }
}

let categoryCache: Promise<WPCategory[]> | null = null

export function getCategories() {
  categoryCache ??= wpFetch<WPCategory[]>('/categories?per_page=100&_fields=id,name,slug,count,description', 3600)
    .then((r) => r.data)
    .catch(() => {
      categoryCache = null
      return []
    })
  return categoryCache
}

export async function getCategoryBySlug(slug: string) {
  const cats = await getCategories()
  return cats.find((c) => c.slug === slug)
}

export async function getPosts({
  categorySlug,
  page = 1,
  perPage = 10,
  search,
  withImages = false,
}: {
  categorySlug?: string
  page?: number
  perPage?: number
  search?: string
  withImages?: boolean
} = {}) {
  const params = new URLSearchParams({ per_page: String(perPage), page: String(page), _fields: LIST_FIELDS })
  if (withImages) params.set('_embed', 'wp:featuredmedia')
  if (search) params.set('search', search)
  if (categorySlug) {
    const cat = await getCategoryBySlug(categorySlug)
    if (!cat) return { posts: [] as PostCard[], total: 0, totalPages: 0 }
    params.set('categories', String(cat.id))
  }
  try {
    const { data, total, totalPages } = await wpFetch<WPPost[]>(`/posts?${params}`, search ? 300 : 600)
    return { posts: data.map(toCard), total, totalPages }
  } catch {
    return { posts: [] as PostCard[], total: 0, totalPages: 0 }
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const { data } = await wpFetch<WPPost[]>(
      `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,wp:term`,
      600,
    )
    return data[0] ?? null
  } catch {
    return null
  }
}

export async function getLongExcerpt(href: string, maxChars = 560) {
  const slug = href.split('/').filter(Boolean).pop()
  if (!slug) return null
  const post = await getPostBySlug(slug)
  const text = post?.content?.rendered ? decodeEntities(post.content.rendered) : ''
  if (!text) return null
  if (text.length <= maxChars) return text
  return `${text.slice(0, text.lastIndexOf(' ', maxChars))}…`
}

export type TocItem = { id: string; title: string; depth: 0 | 1 | 2 }

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

/**
 * Aggiunge un id ai titoli h2–h4 (se mancante) e restituisce l'indice dell'articolo.
 * Il primo livello dell'indice è il più alto che compare almeno due volte
 * (es. nei testi normativi strutturati in h3/h4 l'unico h2 viene ignorato).
 */
export function withHeadingAnchors(html: string) {
  const headings: { level: number; id: string; title: string }[] = []
  const used = new Set<string>()
  const out = html.replace(/<h([234])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, lvl: string, attrs: string, inner: string) => {
    const title = decodeEntities(inner)
    if (!title) return match
    const existing = attrs.match(/\sid=["']([^"']+)["']/i)?.[1]
    let id = existing ?? (slugify(title) || `sezione-${headings.length + 1}`)
    if (!existing) {
      const base = id
      let n = 2
      while (used.has(id)) id = `${base}-${n++}`
    }
    used.add(id)
    headings.push({ level: Number(lvl), id, title })
    return existing ? match : `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`
  })
  const top = [2, 3, 4].find((l) => headings.filter((h) => h.level === l).length >= 2)
  const toc: TocItem[] = top
    ? headings
        .filter((h) => h.level >= top)
        .map((h) => ({ id: h.id, title: h.title, depth: (h.level - top) as TocItem['depth'] }))
    : []
  return { html: out, toc }
}

export function readingMinutes(html: string) {
  const words = decodeEntities(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

/** Divide l'HTML a metà dei paragrafi per inserire un annuncio in-article. */
export function splitContent(html: string): [string, string] {
  const parts = html.split('</p>')
  if (parts.length < 6) return [html, '']
  const mid = Math.floor(parts.length / 2)
  return [parts.slice(0, mid).join('</p>') + '</p>', parts.slice(mid).join('</p>')]
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}
