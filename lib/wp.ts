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
    'wp:featuredmedia'?: { source_url?: string; alt_text?: string }[]
    'wp:term'?: { id: number; name: string; slug: string; taxonomy: string }[][]
  }
}

export type PostCard = {
  id: number
  title: string
  excerpt: string
  date: string
  href: string
  section: string
  image?: string
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
  return {
    id: post.id,
    title: decodeEntities(post.title.rendered),
    excerpt: decodeEntities(post.excerpt.rendered),
    date: post.date,
    href: path,
    section: path.split('/')[1] ?? '',
    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
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
      1800,
    )
    return data[0] ?? null
  } catch {
    return null
  }
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
