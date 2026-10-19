import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Listing } from '@/components/content/listing'
import { MATERIE, sectionBySlug } from '@/lib/site'
import { decodeEntities, getCategoryBySlug, getPosts } from '@/lib/wp'

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) return {}
  const section = sectionBySlug(category)
  return {
    title: section?.label ?? decodeEntities(cat.name),
    description: section?.description ?? `Contenuti di ${decodeEntities(cat.name)} su MioLegale.`,
    alternates: { canonical: `/${category}` },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const cat = await getCategoryBySlug(category)
  if (!cat) notFound()

  const { posts, total, totalPages } = await getPosts({ categorySlug: category, page, perPage: 15 })
  const section = sectionBySlug(category)
  const isMateria = MATERIE.some((m) => m.slug === category)

  return (
    <Listing
      eyebrow={isMateria ? 'Materia' : 'Banca dati'}
      title={section?.label ?? decodeEntities(cat.name)}
      description={section?.description ?? (cat.description ? decodeEntities(cat.description) : undefined)}
      posts={posts}
      total={total}
      page={page}
      totalPages={totalPages}
      baseHref={`/${category}`}
    />
  )
}
