import type { Metadata } from 'next'
import { ArchiveIndex } from '@/components/content/archive-index'
import { ARCHIVES } from '@/lib/site'

const archive = ARCHIVES.find((a) => a.slug === 'testi-unici')!

export const metadata: Metadata = { title: archive.label, description: archive.description }

export default function Page() {
  return <ArchiveIndex archive={archive} />
}
