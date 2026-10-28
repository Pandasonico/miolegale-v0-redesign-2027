import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActArticleView, articleHeading } from '@/components/content/act-article'
import { getActArticle } from '@/lib/act-article'

type Props = { params: Promise<{ slug: string; article: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, article } = await params
  const a = await getActArticle(`testi-unici/${slug}/${article}`)
  if (!a) return {}
  return {
    title: articleHeading(a),
    description: `Testo vigente: ${articleHeading(a)} (${a.act.title}).`,
    alternates: { canonical: `/testi-unici/${slug}/${article}` },
  }
}

export default async function Page({ params }: Props) {
  const { slug, article } = await params
  const a = await getActArticle(`testi-unici/${slug}/${article}`)
  if (!a) notFound()
  return <ActArticleView article={a} parent={{ href: '/testi-unici', label: 'Testi unici' }} />
}
