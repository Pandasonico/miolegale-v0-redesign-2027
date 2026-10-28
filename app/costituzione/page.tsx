import type { Metadata } from 'next'
import { ArchiveIndex } from '@/components/content/archive-index'
import { ActIndexView } from '@/components/content/act-index'
import { getActIndex } from '@/lib/act-index'
import { ARCHIVES } from '@/lib/site'

const archive = ARCHIVES.find((a) => a.slug === 'costituzione')!

export const metadata: Metadata = { title: 'Costituzione della Repubblica italiana (Cost.)', description: archive.description }

export default async function Page() {
  const act = await getActIndex('costituzione')
  if (!act) return <ArchiveIndex archive={archive} />
  return <ActIndexView act={act} parent={{ href: '/codici', label: 'Codici' }} />
}
