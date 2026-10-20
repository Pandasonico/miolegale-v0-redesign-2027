import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
import { ShareButtons } from '@/components/article/share-buttons'
import { ActTree } from '@/components/content/act-tree'
import { SITE } from '@/lib/site'
import type { ActIndex } from '@/lib/act-index'

export function ActIndexView({ act, parent }: { act: ActIndex; parent: { href: string; label: string } }) {
  const shortTitle = act.title.replace(/\s*\([^)]*\)\s*$/, '')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="font-medium text-primary hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>»</li>
          <li>
            <Link href={parent.href} className="font-medium text-primary hover:underline">
              {parent.label}
            </Link>
          </li>
          <li aria-hidden>»</li>
          <li aria-current="page" className="text-foreground">
            {shortTitle}
          </li>
        </ol>
      </nav>

      <header className="mt-6">
        <h1 className="font-sans text-4xl font-semibold tracking-tight text-primary text-balance md:text-5xl">{act.title}</h1>
        {act.estremi && <p className="mt-6 font-sans text-2xl font-semibold text-primary">{act.estremi}</p>}
        {act.officialTitle && <p className="mt-2 text-lg italic leading-relaxed text-foreground text-pretty">{act.officialTitle}</p>}
        <div className="mt-6">
          <ShareButtons url={`${SITE.url}/${act.path}/`} title={act.title} tone="light" />
        </div>
      </header>

      <ActTree root={act.root} />

      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="mt-10" />
    </div>
  )
}
