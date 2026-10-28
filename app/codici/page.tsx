import type { Metadata } from 'next'
import { ActsIndex } from '@/components/content/acts-index'
import { ARCHIVES } from '@/lib/site'

const archive = ARCHIVES.find((a) => a.slug === 'codici')!

export const metadata: Metadata = { title: 'Codici – aggiornati al 2026', description: archive.description }

export default function Page() {
  return <ActsIndex archive={archive} />
}
