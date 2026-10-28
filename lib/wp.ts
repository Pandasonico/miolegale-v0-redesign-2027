const WP_API = process.env.WP_API_URL ?? 'https://miolegale.it/wp-json/wp/v2'

export type WPCategory = { id: number; name: string; slug: string; count: number; parent?: number; description?: string }

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
  tags?: number[]
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

const WP_UPLOADS = 'https://miolegale.it/wp-content/uploads/'

function devSameOrigin(url: string) {
  if (process.env.NODE_ENV === 'production' || !url.startsWith(WP_UPLOADS)) return url
  return `/wp-img/${url.slice(WP_UPLOADS.length)}`
}

export function featuredImage(post: WPPost, size: 'medium_large' | 'large' = 'medium_large') {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media?.source_url) return null
  const sizes = media.media_details?.sizes
  return {
    src: devSameOrigin(sizes?.[size]?.source_url ?? sizes?.medium_large?.source_url ?? media.source_url),
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

export type UtilityPage = {
  id: number
  title: string
  excerpt: string
  href: string
  modified: string
  category: string
  popular?: boolean
}

export const UTILITY_CATEGORY_FIELD = 'categoria_utilita'

export const UTILITY_CATEGORIES = [
  { slug: 'avvocati', label: 'Utilità per avvocati' },
  { slug: 'tassi-istat', label: 'Tassi di interesse e indici Istat' },
  { slug: 'medicina-legale', label: 'Medicina legale' },
  { slug: 'codice-strada', label: 'Codice della strada' },
  { slug: 'proprieta-catasto', label: 'Proprietà e catasto' },
  { slug: 'formulari-civili-penali', label: 'Formulario civile e penale' },
  { slug: 'altre-utilita', label: 'Altre utilità' },
] as const

const POPULAR_UTILITY_SLUGS = new Set([
  'tabella-contributo-unificato',
  'ultimo-indice-istat',
  'coefficienti-calcolo-usufrutto',
  'categorie-catastali',
  'testimonianza-scritta',
  'decreto-ingiuntivo',
  'tabelle-tribunale-milano',
  'tabelle-tribunale-roma',
])

/* Copia della suddivisione pubblicata su miolegale.it/utilita/, nello stesso ordine. */
const LIVE_UTILITY_GROUPS: Record<string, string[]> = {
  avvocati: ['parametri-forensi', 'tabella-contributo-unificato', 'tabella-diritti-di-copia', 'riforma-cartabia-civile', 'codici-iscrizione-ruolo'],
  'tassi-istat': ['ultimo-indice-istat', 'tasso-interesse-legale', 'tabella-tassi-soglia-usura', 'tasso-interessi-moratori', 'tabella-interessi-moratori-appalti-pubblici'],
  'medicina-legale': [
    'tabelle-tribunale-milano',
    'tabella-menomazioni-inail',
    'tabelle-indennizzo-danno-biologico-inail',
    'tabella-lesioni-micropermanenti',
    'lesioni-infermita-causa-servizio',
    'tabella-risarcimento-micropermanenti',
    'tabelle-tribunale-roma',
  ],
  'codice-strada': ['tabella-punti-patente', 'tabelle-alcolemiche'],
  'proprieta-catasto': ['coefficienti-calcolo-usufrutto', 'categorie-catastali'],
}

const LIVE_UTILITY_ORDER = new Map(
  Object.entries(LIVE_UTILITY_GROUPS).flatMap(([category, slugs]) => slugs.map((slug, index) => [slug, { category, index }] as const)),
)

const LIVE_FORMULARI: { title: string; href: string }[] = [
  { title: 'Dichiarazione ex art. 137, comma 7 c.p.c.', href: 'https://miolegale.it/formulario-civile/dichiarazione-137-cpc/' },
  { title: 'Rinuncia al mandato difensivo avvocato', href: 'https://miolegale.it/formulario-civile/rinuncia-al-mandato-difensivo/' },
  { title: 'Verbale di rinuncia al mandato difensivo', href: 'https://miolegale.it/formulario-civile/verbale-rinuncia-al-mandato-difensivo/' },
  { title: 'Revoca mandato avvocato', href: 'https://miolegale.it/formulario-civile/revoca-mandato-avvocato/' },
  { title: 'Ricorso congiunto di divorzio', href: 'https://miolegale.it/formulario-civile/ricorso-congiunto-divorzio/' },
  { title: 'Atto di citazione Tribunale (riforma Cartabia)', href: 'https://miolegale.it/formulario-civile/atto-di-citazione-tribunale/' },
  {
    title: 'Istanza ex art. 492 bis c.p.c. per l’accesso ai dati contenuti nelle banche dati delle pubbliche amministrazioni',
    href: 'https://miolegale.it/formulario-civile/istanza-art-492-bis-cpc/',
  },
  { title: 'Istanza ex art. 335, comma 3 ter c.p.p. della persona offesa dal reato', href: 'https://miolegale.it/formulario-penale/istanza-335-comma-3-ter/' },
  { title: 'Avviso iscrizione al ruolo pignoramento ex art 543, 5 comma c.p.c.', href: 'https://miolegale.it/formulario-civile/avviso-iscrizione-al-ruolo-pignoramento/' },
  {
    title: 'Comparsa di costituzione e richiesta di prosecuzione del processo interrotto',
    href: 'https://miolegale.it/formulario-civile/costituzione-processo-interrotto/',
  },
]

function utilitySlug(href: string) {
  try {
    return new URL(href).pathname.split('/').filter(Boolean).pop() ?? ''
  } catch {
    return ''
  }
}

function utilityCategory(href: string): string {
  const live = LIVE_UTILITY_ORDER.get(utilitySlug(href))
  if (live) return live.category
  const path = href.toLowerCase()
  if (path.includes('/parametri-forensi')) return 'avvocati'
  if (path.includes('tasso') || path.includes('interess') || path.includes('istat') || path.includes('usura')) return 'tassi-istat'
  if (path.includes('inail') || path.includes('lesion') || path.includes('menomaz') || path.includes('biologic') || path.includes('medicina')) return 'medicina-legale'
  if (path.includes('codice-strada') || path.includes('patente') || path.includes('autovelox')) return 'codice-strada'
  if (path.includes('catast') || path.includes('usufrutto') || path.includes('propriet') || path.includes('immobil')) return 'proprieta-catasto'
  if (path.includes('formulario') || path.includes('atto-') || path.includes('ricorso') || path.includes('istanza')) return 'formulari-civili-penali'
  return 'altre-utilita'
}

function utilityCategoryFromAcf(raw: unknown): string | undefined {
  if (typeof raw === 'string') return UTILITY_CATEGORIES.some((category) => category.slug === raw) ? raw : undefined
  if (raw && typeof raw === 'object' && 'value' in raw) return utilityCategoryFromAcf((raw as { value?: unknown }).value)
  return undefined
}

export async function getUtilityPages(): Promise<UtilityPage[]> {
  try {
    type WpUtility = { id: number; link: string; modified: string; title: { rendered: string }; excerpt: { rendered: string }; acf?: Record<string, unknown> }
    const first = await wpFetch<WpUtility[]>(
      `/pages?per_page=100&page=1&orderby=title&order=asc&_fields=id,link,modified,title,excerpt,acf&_utility_index=2`,
      3600,
    )
    const remaining = await Promise.all(
      Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) =>
        wpFetch<WpUtility[]>(
          `/pages?per_page=100&page=${index + 2}&orderby=title&order=asc&_fields=id,link,modified,title,excerpt,acf&_utility_index=2`,
          3600,
        ).then((result) => result.data),
      ),
    )
    const data = [first.data, ...remaining].flat()
    /* L'indice contiene solo le pagine di primo livello: /utilita/nome, non /utilita/nome/sottopagina. */
    const utilityPages = data.filter((page) => {
      try {
        const segments = new URL(page.link).pathname.split('/').filter(Boolean)
        return segments.length === 2 && segments[0] === 'utilita'
      } catch {
        return false
      }
    })
    /* The ACF value overrides the URL heuristic, so new pages can be categorized from WordPress. */
    const pages = utilityPages.map((p) => ({
      id: p.id,
      title: decodeEntities(p.title.rendered),
      excerpt: decodeEntities(p.excerpt.rendered),
      href: p.link,
      modified: p.modified,
      category: utilityCategoryFromAcf(p.acf?.[UTILITY_CATEGORY_FIELD]) ?? utilityCategory(p.link),
      popular: POPULAR_UTILITY_SLUGS.has(utilitySlug(p.link)),
    }))
    const knownLinks = new Set(pages.map((page) => page.href))
    const formulari = LIVE_FORMULARI.filter((item) => !knownLinks.has(item.href)).map((item, index) => ({
      id: -(index + 1),
      title: item.title,
      excerpt: '',
      href: item.href,
      modified: '',
      category: 'formulari-civili-penali',
      popular: false,
    }))
    const rank = (page: UtilityPage) => LIVE_UTILITY_ORDER.get(utilitySlug(page.href))?.index ?? Number.MAX_SAFE_INTEGER
    return [...pages, ...formulari].sort((a, b) => rank(a) - rank(b))
  } catch {
    return []
  }
}


const CALC_PARENT_SLUG = 'calcolo'
const WP_ORIGIN = 'https://miolegale.it'

async function getCalcParentId() {
  const { data } = await wpFetch<{ id: number }[]>(`/pages?slug=${CALC_PARENT_SLUG}&parent=0&_fields=id`, 86400)
  return data[0]?.id
}

export type CalcPage = {
  slug: string
  title: string
  excerpt: string
  html: string
  seoTitle?: string
  seoDescription?: string
  modified: string
}

type WpCalcPage = {
  slug: string
  modified: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  meta?: { rank_math_title?: string; rank_math_description?: string }
}

/** Nome del campo ACF (selezione, anche multipla) con cui si assegna la categoria a un calcolatore. */
export const CALC_CATEGORY_FIELD = 'categoria_calcolatore'

/** Il campo ACF può restituire una stringa, un array o oggetti {value,label}: li riduco a un elenco di testi. */
function acfValues(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.flatMap(acfValues)
  if (typeof raw === 'string') return [raw]
  if (typeof raw === 'object') {
    const { value, label } = raw as { value?: unknown; label?: unknown }
    return acfValues(value ?? label)
  }
  return []
}

/** Elenco dei calcolatori pubblicati su WordPress: pagine figlie di "Calcolo". */
export async function getCalcPageList(): Promise<{ slug: string; title: string; excerpt: string; categories: string[] }[]> {
  try {
    const parentId = await getCalcParentId()
    if (!parentId) return []
    const { data } = await wpFetch<
      { slug: string; title: { rendered: string }; excerpt: { rendered: string }; acf?: Record<string, unknown> | unknown[] }[]
    >(`/pages?parent=${parentId}&per_page=100&orderby=title&order=asc&_fields=slug,title,excerpt,acf`, 3600)
    return data.map((p) => ({
      slug: p.slug,
      title: decodeEntities(p.title.rendered),
      excerpt: decodeEntities(p.excerpt.rendered),
      categories: acfValues(Array.isArray(p.acf) ? undefined : p.acf?.[CALC_CATEGORY_FIELD]),
    }))
  } catch {
    return []
  }
}

/**
 * Rimuove da una pagina WordPress ciò che il nuovo sito gestisce da sé (annunci AdSense)
 * e rende assoluti i percorsi relativi di immagini e link.
 */
export function devSameOriginHtml(html: string) {
  if (process.env.NODE_ENV === 'production') return html
  return html.split(WP_UPLOADS).join('/wp-img/')
}

export function prepareCalcHtml(html: string) {
  const absolute = html
    .replace(/<div[^>]*class="[^"]*ads_container[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/<ins[^>]*class="[^"]*adsbygoogle[^"]*"[^>]*>[\s\S]*?<\/ins>/gi, '')
    .replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*adsbygoogle(?:(?!<\/script>)[\s\S])*<\/script>/gi, '')
    .replace(/<script[^>]*src="[^"]*adsbygoogle[^"]*"[^>]*><\/script>/gi, '')
    .replace(/(src|href|srcset)="(?:\.\.\/)+wp-content/g, `$1="${WP_ORIGIN}/wp-content`)
    .replace(/(src|href|srcset)="\/wp-content/g, `$1="${WP_ORIGIN}/wp-content`)
  return devSameOriginHtml(absolute)
}

export async function getCalcPage(slug: string): Promise<CalcPage | null> {
  try {
    const parentId = await getCalcParentId()
    if (!parentId) return null
    const { data } = await wpFetch<WpCalcPage[]>(
      `/pages?slug=${encodeURIComponent(slug)}&parent=${parentId}&_fields=slug,modified,title,excerpt,content,meta`,
      3600,
    )
    const page = data[0]
    if (!page) return null
    return {
      slug: page.slug,
      title: decodeEntities(page.title.rendered),
      excerpt: decodeEntities(page.excerpt.rendered),
      html: prepareCalcHtml(page.content.rendered),
      seoTitle: page.meta?.rank_math_title || undefined,
      seoDescription: page.meta?.rank_math_description || undefined,
      modified: page.modified,
    }
  } catch {
    return null
  }
}

/** I link relativi di WordPress (../../norme/x/) sono validi solo con lo slash finale: li rendo assoluti sul sito. */
function resolveRelativeLinks(html: string, pagePath: string) {
  return html.replace(/href="(\.\.?\/[^"]*)"/g, (_, href: string) => {
    const { pathname, search, hash } = new URL(href, `${WP_ORIGIN}${pagePath}`)
    return `href="${pathname.replace(/\/$/, '') || '/'}${search}${hash}"`
  })
}

/** Pagina di primo livello sotto "Utilità" (es. /utilita/tabella-contributo-unificato). */
export async function getUtilityPage(slug: string): Promise<CalcPage | null> {
  try {
    const { data: parents } = await wpFetch<{ id: number }[]>(`/pages?slug=utilita&parent=0&_fields=id`, 86400)
    const parentId = parents[0]?.id
    if (!parentId) return null
    const { data } = await wpFetch<WpCalcPage[]>(
      `/pages?slug=${encodeURIComponent(slug)}&parent=${parentId}&_fields=slug,modified,title,excerpt,content,meta`,
      3600,
    )
    const page = data[0]
    if (!page) return null
    return {
      slug: page.slug,
      title: decodeEntities(page.title.rendered),
      excerpt: decodeEntities(page.excerpt.rendered),
      html: resolveRelativeLinks(prepareCalcHtml(page.content.rendered), `/utilita/${page.slug}/`),
      seoTitle: page.meta?.rank_math_title || undefined,
      seoDescription: page.meta?.rank_math_description || undefined,
      modified: page.modified,
    }
  } catch {
    return null
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
  categoryCache ??= wpFetch<WPCategory[]>('/categories?per_page=100&_fields=id,name,slug,count,parent,description', 3600)
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

export type WPTag = { id: number; name: string; slug: string; count: number; description?: string }

export async function getTagBySlug(slug: string) {
  try {
    const { data } = await wpFetch<WPTag[]>(`/tags?slug=${encodeURIComponent(slug)}&_fields=id,name,slug,count,description`, 3600)
    return data[0] ?? null
  } catch {
    return null
  }
}

export function getPostTags(post: WPPost) {
  return (post._embedded?.['wp:term']?.flat() ?? [])
    .filter((t) => t.taxonomy === 'post_tag')
    .map((t) => ({ id: t.id, name: decodeEntities(t.name), slug: t.slug }))
}

export async function getPostsByTag(tagId: number, page = 1, perPage = 15) {
  const params = new URLSearchParams({ tags: String(tagId), per_page: String(perPage), page: String(page), _fields: LIST_FIELDS })
  try {
    const { data, total, totalPages } = await wpFetch<WPPost[]>(`/posts?${params}`, 600)
    return { posts: data.map(toCard), total, totalPages }
  } catch {
    return { posts: [] as PostCard[], total: 0, totalPages: 0 }
  }
}

const RELATED_SECTIONS = ['norme', 'notizie', 'guide', 'massime']
// Un post può stare in più categorie: escludiamo esplicitamente quelle che non devono mai comparire.
const RELATED_EXCLUDED = ['brocardi', 'formulario-civile', 'formulario-penale']

/**
 * Correlati guidati dai tag, solo da norme, notizie, guide e massime:
 * ordinati per numero di tag in comune, a parità per data. Senza tag, ripiega sulla stessa sezione.
 */
export async function getRelatedPosts(post: WPPost, sectionSlug: string, limit = 3) {
  const tagIds = post.tags ?? []
  const fetchList = async (filter: Record<string, string>, perPage: number) => {
    const params = new URLSearchParams({
      ...filter,
      exclude: String(post.id),
      per_page: String(perPage),
      _fields: `${LIST_FIELDS},tags`,
      _embed: 'wp:featuredmedia',
    })
    try {
      return (await wpFetch<WPPost[]>(`/posts?${params}`, 3600)).data
    } catch {
      return []
    }
  }

  const allowed = (await Promise.all(RELATED_SECTIONS.map(getCategoryBySlug))).filter(
    (c): c is WPCategory => Boolean(c),
  )
  const allowedIds = allowed.map((c) => c.id).join(',')
  const excludedIds = (await Promise.all(RELATED_EXCLUDED.map(getCategoryBySlug)))
    .filter((c): c is WPCategory => Boolean(c))
    .map((c) => c.id)
    .join(',')
  const sectionFilter: Record<string, string> = {
    categories: allowedIds,
    ...(excludedIds ? { categories_exclude: excludedIds } : {}),
  }

  let picked: WPPost[] = []
  if (tagIds.length) {
    const tags = new Set(tagIds)
    const candidates = await fetchList({ ...sectionFilter, tags: tagIds.join(',') }, 30)
    picked = candidates
      .map((p, i) => ({ p, i, score: (p.tags ?? []).filter((t) => tags.has(t)).length }))
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .slice(0, limit)
      .map((x) => x.p)
  }
  if (picked.length < limit) {
    const section = allowed.find((c) => c.slug === sectionSlug)
    const fill = await fetchList(
      section ? { ...sectionFilter, categories: String(section.id) } : sectionFilter,
      limit + 3,
    )
    picked = [...picked, ...fill.filter((p) => !picked.some((q) => q.id === p.id))].slice(0, limit)
  }
  return picked.map(toCard)
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

export const IN_ARTICLE_ADS = {
  everyWords: 650,
  maxAds: 4,
  minTailWords: 300,
}

const AD_SAFE_CONTAINERS = new Set(['table', 'ul', 'ol', 'blockquote', 'figure', 'pre', 'details', 'div', 'section'])

function countWords(html: string) {
  return decodeEntities(html).split(' ').filter(Boolean).length
}

/**
 * Taglia l'HTML in blocchi da circa `everyWords` parole: tra un blocco e l'altro la pagina inserisce un annuncio.
 * Si taglia solo dopo la fine di un paragrafo di primo livello, così un titolo non resta mai separato dal suo testo
 * e non si entra in tabelle, elenchi o citazioni; mai negli ultimi `minTailWords` parole.
 */
export function splitContentForAds(html: string, opts = IN_ARTICLE_ADS): string[] {
  const totalWords = countWords(html)
  if (totalWords < opts.everyWords + opts.minTailWords) return [html]

  const chunks: string[] = []
  const tagRe = /<(\/?)([a-z][a-z0-9]*)\b[^>]*>/gi
  let depth = 0
  let lastCut = 0
  let wordsBeforeChunk = 0
  let match: RegExpExecArray | null

  while ((match = tagRe.exec(html)) && chunks.length < opts.maxAds) {
    const closing = match[1] === '/'
    const tag = match[2].toLowerCase()

    if (AD_SAFE_CONTAINERS.has(tag)) {
      depth = Math.max(0, depth + (closing ? -1 : 1))
      continue
    }
    if (!closing || tag !== 'p' || depth > 0) continue

    const cut = match.index + match[0].length
    const chunkWords = countWords(html.slice(lastCut, cut))
    if (chunkWords < opts.everyWords) continue
    if (totalWords - wordsBeforeChunk - chunkWords < opts.minTailWords) break

    chunks.push(html.slice(lastCut, cut))
    lastCut = cut
    wordsBeforeChunk += chunkWords
  }

  chunks.push(html.slice(lastCut))
  return chunks
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}
