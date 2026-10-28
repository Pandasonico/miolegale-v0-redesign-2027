import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Listing } from '@/components/content/listing'
import { decodeEntities, getPostsByTag, getTagBySlug } from '@/lib/wp'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await getTagBySlug(slug)
  if (!tag) return {}
  const name = decodeEntities(tag.name)
  return {
    title: name,
    description: tag.description ? decodeEntities(tag.description) : `Notizie, massime, norme e guide su ${name}.`,
    alternates: { canonical: `/tag/${slug}` },
  }
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const { posts, total, totalPages } = await getPostsByTag(tag.id, page)
  const name = decodeEntities(tag.name)

  return (
    <Listing
      eyebrow="Argomento"
      title={name}
      description={tag.description ? decodeEntities(tag.description) : `Notizie, massime, norme e guide su ${name}.`}
      posts={posts}
      total={total}
      page={page}
      totalPages={totalPages}
      baseHref={`/tag/${slug}`}
    />
  )
}
