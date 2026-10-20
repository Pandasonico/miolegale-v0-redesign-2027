'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  FilePenLine,
  FileText,
  FolderTree,
  Home,
  Landmark,
  Search,
  Scale,
  Table2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { UtilityPage } from '@/lib/wp'

export type UtilityCategory = { slug: string; label: string }

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const localHref = (page: UtilityPage) => page.href.replace('https://miolegale.it', '')

/** Altezza stimata di una card: intestazione più una riga per pagina (più alta se l'estratto va a capo). */
function estimateHeight(items: UtilityPage[]) {
  return 90 + items.reduce((sum, p) => sum + (p.excerpt ? (p.excerpt.length > 75 ? 92 : 69) : 46), 0)
}

/** Stesso bilanciamento dei calcolatori: due colonne di altezza quasi uguale, ordine originale mantenuto. */
function balanceColumns<T extends { items: UtilityPage[] }>(items: T[]): { ordered: T[]; firstColumnCount: number } {
  const n = items.length
  if (n < 2 || n > 20) return { ordered: items, firstColumnCount: n }
  const heights = items.map((c) => estimateHeight(c.items))
  const total = heights.reduce((a, b) => a + b, 0)
  let bestMask = 0
  let bestDiff = Infinity
  for (let mask = 1; mask < 1 << n; mask += 2) {
    let left = 0
    for (let i = 0; i < n; i++) if (mask & (1 << i)) left += heights[i]
    const diff = Math.abs(total - 2 * left)
    if (diff < bestDiff) {
      bestDiff = diff
      bestMask = mask
    }
  }
  const left = items.filter((_, i) => bestMask & (1 << i))
  const right = items.filter((_, i) => !(bestMask & (1 << i)))
  return { ordered: [...left, ...right], firstColumnCount: left.length }
}

const POPULAR_UTILITY_MATCHERS = [
  { match: ['tabella-contributo-unificato'], icon: Landmark },
  { match: ['ultimo-indice-istat'], icon: BarChart3 },
  { match: ['coefficienti-calcolo-usufrutto'], icon: Home },
  { match: ['categorie-catastali'], icon: FolderTree },
  { match: ['testimonianza-scritta'], icon: FilePenLine },
  { match: ['tabelle-indennizzo-danno-biologico-inail'], icon: Landmark },
  { match: ['tabelle-tribunale-milano'], icon: Table2 },
  { match: ['tabelle-tribunale-roma'], icon: Scale },
] as const

function utilityMatches(page: UtilityPage, values: readonly string[]) {
  const path = page.href.toLowerCase().replace(/\/+$/, '')
  return values.some((value) => path.endsWith(`/${value}`))
}

function utilityIcon(page: UtilityPage) {
  return POPULAR_UTILITY_MATCHERS.find(({ match }) => utilityMatches(page, match))?.icon ?? FileText
}

function UtilityCard({ page }: { page: UtilityPage }) {
  const Icon = utilityIcon(page)
  return (
    <Link href={localHref(page)} className="group flex flex-col rounded-lg border border-border bg-card p-5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
      </div>
      <h3 className="mt-4 font-sans text-lg font-semibold leading-snug tracking-tight">{page.title}</h3>
      {page.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{page.excerpt}</p>}
    </Link>
  )
}

function UtilityRow({ page, categoryLabel }: { page: UtilityPage; categoryLabel?: string }) {
  return (
    <li>
      <Link href={localHref(page)} className="group block rounded-md px-3 py-2.5 hover:bg-secondary">
        <span className="font-medium text-primary group-hover:underline">{page.title}</span>
        {page.excerpt && <span className="mt-0.5 block line-clamp-2 text-sm leading-relaxed text-muted-foreground">{page.excerpt}</span>}
        {categoryLabel && (
          <span className="mt-1 block text-xs font-mono uppercase tracking-wider text-muted-foreground">{categoryLabel}</span>
        )}
      </Link>
    </li>
  )
}

export function UtilitaIndex({ pages, categories }: { pages: UtilityPage[]; categories: UtilityCategory[] }) {
  const [query, setQuery] = useState('')
  const normalized = normalize(query)

  const popular = POPULAR_UTILITY_MATCHERS.map(({ match }) => pages.find((page) => utilityMatches(page, match))).filter(
    (page): page is UtilityPage => Boolean(page),
  )

  const grouped = useMemo(
    () =>
      categories
        .map((category) => ({ ...category, items: pages.filter((page) => page.category === category.slug) }))
        .filter((category) => category.items.length > 0),
    [categories, pages],
  )

  const { ordered, firstColumnCount } = useMemo(() => balanceColumns(grouped), [grouped])

  const labelOf = (slug?: string) => categories.find((c) => c.slug === slug)?.label

  const results = useMemo(
    () =>
      normalized
        ? pages.filter((page) => {
            const haystack = normalize(`${page.title} ${page.excerpt} ${labelOf(page.category) ?? ''}`)
            return normalized.split(/\s+/).every((word) => haystack.includes(word))
          })
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [normalized, pages, categories],
  )

  return (
    <div className="mt-8 flex flex-col gap-12">
      <div role="search">
        <label htmlFor="utility-search" className="sr-only">
          Cerca tra le utilità
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="utility-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca tra tabelle, parametri, formulari…"
            className="h-14 w-full rounded-lg border border-input bg-card pl-12 pr-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoComplete="off"
          />
        </div>
      </div>

      {normalized ? (
        <section aria-live="polite" aria-label="Risultati della ricerca">
          <p className="text-sm text-muted-foreground">
            {results.length === 0
              ? `Nessuna utilità trovata per “${query.trim()}”.`
              : `${results.length} ${results.length === 1 ? 'risultato' : 'risultati'}`}
          </p>
          {results.length > 0 && (
            <ul className="mt-3 grid gap-x-8 gap-y-1 rounded-lg border border-border bg-card p-3 md:grid-cols-2">
              {results.map((page) => (
                <UtilityRow key={page.id} page={page} categoryLabel={labelOf(page.category)} />
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section aria-labelledby="popular-utilities-title">
            <h2 id="popular-utilities-title" className="font-sans text-2xl font-semibold tracking-tight">
              Le più consultate
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((page) => (
                <UtilityCard key={page.id} page={page} />
              ))}
            </div>
          </section>

          <section aria-labelledby="utility-categories-title">
            <h2 id="utility-categories-title" className="font-sans text-2xl font-semibold tracking-tight">
              Tutte le utilità per materia
            </h2>
            <nav aria-label="Materie delle utilità" className="mt-4">
              <ul className="flex flex-wrap gap-2">
                {grouped.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`#${c.slug}`}
                      className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-primary hover:bg-secondary"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 lg:columns-2 lg:gap-5">
              {ordered.map((c, index) => (
                <section
                  key={c.slug}
                  id={c.slug}
                  aria-labelledby={`${c.slug}-title`}
                  className={`mb-5 scroll-mt-28 break-inside-avoid rounded-lg border border-border bg-card p-3 ${
                    index === firstColumnCount - 1 ? 'lg:break-after-column' : ''
                  }`}
                >
                  <h3 id={`${c.slug}-title`} className="border-b border-border px-3 pb-3 pt-2 font-sans text-lg font-semibold tracking-tight">
                    {c.label}
                  </h3>
                  <ul className="mt-2">
                    {c.items.map((page) => (
                      <UtilityRow key={page.id} page={page} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
