import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ToolShell } from '@/components/tools/tool-shell'
import { WpCalculator } from '@/components/tools/wp-calculator'
import { getCalcPage } from '@/lib/wp'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getCalcPage(slug)
  if (!page) return {}
  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.excerpt.slice(0, 160),
    alternates: { canonical: `/calcolo/${slug}` },
  }
}

export default async function CalcolatorePage({ params }: Props) {
  const { slug } = await params
  const page = await getCalcPage(slug)
  if (!page) notFound()

  return (
    <ToolShell slug={slug} title={page.title}>
      <WpCalculator html={page.html} />
    </ToolShell>
  )
}
