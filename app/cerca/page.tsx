import type { Metadata } from 'next'
import { Listing } from '@/components/content/listing'
import { getPosts } from '@/lib/wp'
import { SEARCH_ARCHIVES } from '@/lib/site'

export const metadata: Metadata = { title: 'Ricerca', robots: { index: false } }

type Props = { searchParams: Promise<{ q?: string; page?: string; archivio?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageParam, archivio = '' } = await searchParams
  const query = q.trim().slice(0, 120)
  const page = Math.max(1, Number(pageParam) || 1)
  const archive = SEARCH_ARCHIVES.find((a) => a.slug === archivio)
  const result = query
    ? await getPosts({ search: query, page, perPage: 15, categorySlug: archive?.slug })
    : { posts: [], total: 0, totalPages: 0 }
  const archiveParam = archive ? `&archivio=${archive.slug}` : ''

  return (
    <Listing
      eyebrow={archive ? `Ricerca in ${archive.label}` : 'Ricerca'}
      title={query ? `Risultati per “${query}”` : 'Cerca nella banca dati'}
      description={query ? undefined : 'Usa la barra di ricerca in alto per trovare massime, sentenze, norme e guide.'}
      posts={result.posts}
      total={result.total}
      page={page}
      totalPages={result.totalPages}
      baseHref={`/cerca?q=${encodeURIComponent(query)}${archiveParam}`}
      emptyText={query ? 'Nessun risultato. Prova con termini diversi o chiedi all’assistente AI.' : 'Inserisci un termine di ricerca.'}
    />
  )
}
