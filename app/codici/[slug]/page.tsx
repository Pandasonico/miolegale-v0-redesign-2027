import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActIndexView } from '@/components/content/act-index'
import { getActIndex } from '@/lib/act-index'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const act = await getActIndex(`codici/${slug}`)
  if (!act) return {}
  return { title: act.title, description: act.officialTitle ?? `Indice completo e testo aggiornato: ${act.title}.` }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const act = await getActIndex(`codici/${slug}`)
  if (!act) notFound()
  return <ActIndexView act={act} parent={{ href: '/codici', label: 'Codici' }} />
}
