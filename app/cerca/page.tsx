import type { Metadata } from 'next'
import { Listing } from '@/components/content/listing'
import { getPosts } from '@/lib/wp'

export const metadata: Metadata = { title: 'Ricerca', robots: { index: false } }

type Props = { searchParams: Promise<{ q?: string; page?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageParam } = await searchParams
  const query = q.trim().slice(0, 120)
  const page = Math.max(1, Number(pageParam) || 1)
  const result = query ? await getPosts({ search: query, page, perPage: 15 }) : { posts: [], total: 0, totalPages: 0 }

  return (
    <Listing
      eyebrow="Ricerca"
      title={query ? `Risultati per “${query}”` : 'Cerca nella banca dati'}
      description={query ? undefined : 'Usa la barra di ricerca in alto per trovare massime, sentenze, norme e guide.'}
      posts={result.posts}
      total={result.total}
      page={page}
      totalPages={result.totalPages}
      baseHref={`/cerca?q=${encodeURIComponent(query)}`}
      emptyText={query ? 'Nessun risultato. Prova con termini diversi o chiedi all’assistente AI.' : 'Inserisci un termine di ricerca.'}
    />
  )
}
