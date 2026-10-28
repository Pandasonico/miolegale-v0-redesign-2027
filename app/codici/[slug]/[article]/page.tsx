import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActArticleView, articleHeading } from '@/components/content/act-article'
import { getActArticle } from '@/lib/act-article'

type Props = { params: Promise<{ slug: string; article: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, article } = await params
  const a = await getActArticle(`codici/${slug}/${article}`)
  if (!a) return {}
  return {
    title: articleHeading(a),
    description: `Testo vigente e commento: ${articleHeading(a)} (${a.act.title}).`,
    alternates: { canonical: `/codici/${slug}/${article}` },
  }
}

export default async function Page({ params }: Props) {
  const { slug, article } = await params
  const a = await getActArticle(`codici/${slug}/${article}`)
  if (!a) notFound()
  return <ActArticleView article={a} parent={{ href: '/codici', label: 'Codici' }} />
}
