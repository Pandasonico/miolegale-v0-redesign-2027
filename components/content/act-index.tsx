import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
import { ShareButtons } from '@/components/article/share-buttons'
import { ActTree } from '@/components/content/act-tree'
import { SITE } from '@/lib/site'
import type { ActIndex } from '@/lib/act-index'

export function ActIndexView({ act, parent }: { act: ActIndex; parent: { href: string; label: string } }) {
  const shortTitle = act.title.replace(/\s*\([^)]*\)\s*$/, '')

  return (
    <>
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-8 lg:pb-12">
          <nav aria-label="Percorso" className="text-sm text-ink-foreground/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-ink-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden>»</li>
              <li>
                <Link href={parent.href} className="hover:text-ink-foreground">
                  {parent.label}
                </Link>
              </li>
              <li aria-hidden>»</li>
              <li aria-current="page" className="text-ink-foreground">
                {shortTitle}
              </li>
            </ol>
          </nav>

          <div className="mt-6">
            <h1 className="font-sans text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl lg:text-5xl">
              {act.title}
            </h1>
            {act.estremi && <p className="mt-4 font-sans text-xl font-semibold md:text-2xl">{act.estremi}</p>}
            {act.officialTitle && (
              <p className="mt-2 max-w-3xl text-lg italic leading-relaxed text-ink-foreground/80 text-pretty">
                {act.officialTitle}
              </p>
            )}
            <div className="mt-6">
              <ShareButtons url={`${SITE.url}/${act.path}/`} title={act.title} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pb-10">
        <ActTree root={act.root} />

        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="mt-10" />
      </div>
    </>
  )
}
