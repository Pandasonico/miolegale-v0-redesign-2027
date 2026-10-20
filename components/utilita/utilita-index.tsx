'use client'

import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { UtilityPage } from '@/lib/wp'

export type UtilityCategory = { slug: string; label: string }

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

function balance<T extends { items: UtilityPage[] }>(categories: T[]) {
  const ordered = [...categories].sort((a, b) => b.items.length - a.items.length)
  const left: T[] = []
  const right: T[] = []
  let leftHeight = 0
  let rightHeight = 0
  for (const category of ordered) {
    if (leftHeight <= rightHeight) {
      left.push(category)
      leftHeight += category.items.length + 1
    } else {
      right.push(category)
      rightHeight += category.items.length + 1
    }
  }
  return [...left, ...right]
}

function UtilityRow({ page }: { page: UtilityPage }) {
  return (
    <li>
      <Link href={page.href.replace('https://miolegale.it', '')} className="group flex items-start justify-between gap-3 rounded-md px-3 py-2.5 hover:bg-secondary">
        <span>
          <span className="font-medium text-primary group-hover:underline">{page.title}</span>
          {page.excerpt && <span className="mt-0.5 block line-clamp-2 text-sm leading-relaxed text-muted-foreground">{page.excerpt}</span>}
        </span>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
      </Link>
    </li>
  )
}

export function UtilitaIndex({ pages, categories }: { pages: UtilityPage[]; categories: UtilityCategory[] }) {
  const [query, setQuery] = useState('')
  const normalized = normalize(query)
  const popular = pages.filter((page) => page.popular).slice(0, 9)
  const grouped = useMemo(() => {
    const result = categories
      .map((category) => ({ ...category, items: pages.filter((page) => page.category === category.slug) }))
      .filter((category) => category.items.length > 0)
    return balance(result)
  }, [categories, pages])
  const results = pages.filter((page) => normalize(`${page.title} ${page.excerpt}`).includes(normalized))

  return (
    <>
      <div className="relative mt-8 max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="utility-search" className="sr-only">Cerca tra le utilità</label>
        <input id="utility-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca tra tabelle, parametri, formulari…" className="h-12 w-full rounded-md border border-input bg-card pl-10 pr-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>

      {normalized ? (
        <section className="mt-8" aria-labelledby="utility-results-title">
          <h2 id="utility-results-title" className="font-sans text-2xl font-semibold">Risultati ({results.length})</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">{results.map((page) => <UtilityRow key={page.id} page={page} />)}</ul>
        </section>
      ) : (
        <>
          <section className="mt-10" aria-labelledby="popular-utilities-title">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
              <h2 id="popular-utilities-title" className="font-sans text-2xl font-semibold">Le più consultate</h2>
              <span className="text-sm text-muted-foreground">In base ai clic</span>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{popular.map((page) => <UtilityRow key={page.id} page={page} />)}</ul>
          </section>
          <section className="mt-12" aria-labelledby="utility-categories-title">
            <h2 id="utility-categories-title" className="font-sans text-2xl font-semibold">Sfoglia per materia</h2>
            <div className="mt-5 lg:columns-2 lg:gap-5">
              {grouped.map((category) => (
                <section key={category.slug} className="mb-5 break-inside-avoid rounded-lg border border-border bg-card p-3">
                  <h3 className="border-b border-border px-3 pb-3 pt-2 font-sans text-lg font-semibold">{category.label}</h3>
                  <ul className="mt-2">{category.items.map((page) => <UtilityRow key={page.id} page={page} />)}</ul>
                </section>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}
