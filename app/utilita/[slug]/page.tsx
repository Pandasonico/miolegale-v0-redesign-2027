import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdSlot } from '@/components/ads/ad-slot'
import { WpCalculator } from '@/components/tools/wp-calculator'
import { UtilityShell } from '@/components/utilita/utility-shell'
import { getUtilityPage, getUtilityPages } from '@/lib/wp'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getUtilityPage(slug)
  if (!page) return {}
  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.excerpt.slice(0, 160),
    alternates: { canonical: `/utilita/${slug}` },
  }
}

export default async function UtilitaDetailPage({ params }: Props) {
  const { slug } = await params
  const [page, others] = await Promise.all([getUtilityPage(slug), getUtilityPages()])
  if (!page) notFound()

  return (
    <UtilityShell slug={slug} title={page.title} others={others}>
      <WpCalculator
        html={page.html}
        afterForm={<AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_RESULT} />}
      />
    </UtilityShell>
  )
}
