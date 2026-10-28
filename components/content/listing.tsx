import { Fragment } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { PostRow } from '@/components/content/post-list'
import { Pager } from '@/components/content/pager'
import { DATABASE_MENU, POPULAR_TOOLS, SECTIONS, SITE } from '@/lib/site'
import type { PostCard } from '@/lib/wp'

export function Listing({
  eyebrow,
  title,
  description,
  posts,
  total,
  page,
  totalPages,
  baseHref,
  emptyText = 'Nessun contenuto trovato.',
}: {
  eyebrow: string
  title: string
  description?: string
  posts: PostCard[]
  total: number
  page: number
  totalPages: number
  baseHref: string
  emptyText?: string
}) {
  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-site px-4 lg:px-8 py-10">
          <p className="text-sm font-mono font-medium uppercase tracking-widest text-primary">{eyebrow}</p>
          <h1 className="mt-2 font-sans tracking-tight text-4xl font-semibold text-balance">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}
          {total > 0 && (
            <p className="mt-3 text-sm text-muted-foreground tabular-nums">{total.toLocaleString('it-IT')} contenuti</p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-site px-4 lg:px-8 pt-6">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} />
      </div>

      <div className="mx-auto grid max-w-site gap-10 px-4 lg:px-8 pt-8 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div>
          {posts.length === 0 ? (
            <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">{emptyText}</p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border bg-card px-5">
              {posts.map((p, i) => (
                <Fragment key={p.id}>
                  <PostRow post={p} />
                  {i === 4 && posts.length > 6 && (
                    <div className="py-4">
                      <AdSlot variant="in-feed" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_FEED} />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}
          <Pager page={page} totalPages={totalPages} baseHref={baseHref} />
        </div>
        <ListingSidebar />
      </div>
    </>
  )
}

export function ListingSidebar({ rectangleAfterDatabase = false }: { rectangleAfterDatabase?: boolean }) {
  const rectangle = <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} />
  return (
  <aside className="flex flex-col gap-8" aria-label="Barra laterale">
  {!rectangleAfterDatabase && rectangle}
      <nav aria-labelledby="sb-sections" className="rounded-lg border border-border bg-card p-5">
        <p id="sb-sections" className="text-sm font-mono font-medium uppercase tracking-wider text-muted-foreground">
          Banca dati
        </p>
        <ul className="mt-3 space-y-1">
          {DATABASE_MENU.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="block py-1.5 text-base font-medium text-foreground hover:text-primary hover:underline">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={SITE.bancaDatiGiuridicaUrl}
          className="mt-4 flex items-center justify-between gap-2 rounded-md bg-primary px-3 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Ricerca avanzata con filtri
          <ArrowUpRight className="size-4 shrink-0" aria-hidden />
        </a>
      </nav>
      {rectangleAfterDatabase && rectangle}
      <nav aria-labelledby="sb-tools" className="rounded-lg border border-transparent bg-secondary p-5">
        <p id="sb-tools" className="text-sm font-mono font-medium uppercase tracking-wider text-secondary-foreground">
          Calcolatori
        </p>
        <ul className="mt-3 space-y-1">
          {POPULAR_TOOLS.slice(0, 6).map((t) => (
            <li key={t.slug}>
              <Link href={`/calcolo/${t.slug}`} className="block py-1.5 text-base font-medium text-primary hover:underline">
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/calcolo"
          className="mt-4 flex items-center justify-between gap-2 rounded-md bg-primary px-3 py-2.5 text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Tutti i calcolatori
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </Link>
      </nav>
      <div className="sticky top-24">
        <AdSlot variant="skyscraper" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_STICKY} />
      </div>
    </aside>
  )
}
