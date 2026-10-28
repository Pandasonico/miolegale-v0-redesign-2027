import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
import { ShareButtons } from '@/components/article/share-buttons'
import { ActTree } from '@/components/content/act-tree'
import { ListingSidebar } from '@/components/content/listing'
import { SITE } from '@/lib/site'
import type { ActIndex, ActNode } from '@/lib/act-index'

function collectArticleSlugs(node: ActNode, slugs: Set<string>) {
  for (const article of node.articles) slugs.add(article.slug)
  for (const child of node.children) collectArticleSlugs(child, slugs)
  return slugs
}

export function ActIndexView({ act, parent }: { act: ActIndex; parent: { href: string; label: string } }) {
  const shortTitle = act.title.replace(/\s*\([^)]*\)\s*$/, '')
  const articleCount = collectArticleSlugs(act.root, new Set()).size

  return (
    <>
      <header className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-site px-4 lg:px-8 pb-10 pt-8 lg:pb-12">
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
            {act.officialTitle && (
              <p className="mt-4 max-w-3xl text-lg italic leading-relaxed text-ink-foreground/80 text-pretty">
                {act.officialTitle}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink-foreground/15 pt-5">
              <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-ink-foreground/80">
                {act.estremi && (
                  <div className="flex gap-1.5">
                    <dt className="sr-only">Estremi dell&apos;atto</dt>
                    <dd className="text-base font-semibold text-ink-foreground">{act.estremi}</dd>
                  </div>
                )}
                {articleCount > 0 && (
                  <div className="flex gap-1.5">
                    <dt className="sr-only">Numero di articoli</dt>
                    <dd>
                      {articleCount.toLocaleString('it-IT')} {articleCount === 1 ? 'articolo' : 'articoli'}
                    </dd>
                  </div>
                )}
              </dl>
              <ShareButtons url={`${SITE.url}/${act.path}/`} title={act.title} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-site gap-10 px-4 lg:px-8 pb-10 pt-8 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="min-w-0">
          <ActTree root={act.root} />

          <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="mt-10" />
        </div>
        <ListingSidebar />
      </div>
    </>
  )
}
