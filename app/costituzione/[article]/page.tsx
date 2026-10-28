import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActArticleView, articleHeading } from '@/components/content/act-article'
import { getActArticle } from '@/lib/act-article'

type Props = { params: Promise<{ article: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article } = await params
  const a = await getActArticle(`costituzione/${article}`)
  if (!a) return {}
  return {
    title: `${articleHeading(a)} della Costituzione`,
    description: `Testo vigente e commento: ${articleHeading(a)} della Costituzione italiana.`,
    alternates: { canonical: `/costituzione/${article}` },
  }
}

export default async function Page({ params }: Props) {
  const { article } = await params
  const a = await getActArticle(`costituzione/${article}`)
  if (!a) notFound()
  return <ActArticleView article={a} parent={{ href: '/codici', label: 'Codici' }} />
}
