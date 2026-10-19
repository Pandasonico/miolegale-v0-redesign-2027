'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'

export function HeaderSearch() {
  const isHome = usePathname() === '/'

  if (isHome) return <div className="ml-auto" aria-hidden />

  return (
    <>
      <form action="/cerca" role="search" className="relative ml-auto hidden w-full max-w-sm md:block lg:hidden xl:block">
        <label htmlFor="header-search" className="sr-only">
          Cerca nella banca dati
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-foreground/60" aria-hidden />
        <input
          id="header-search"
          name="q"
          type="search"
          placeholder="Cerca norme, sentenze, massime…"
          className="h-9 w-full rounded-md border border-ink-foreground/15 bg-ink-foreground/10 pl-9 pr-3 text-sm text-ink-foreground placeholder:text-ink-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ink-foreground/40"
        />
      </form>
      <Link
        href="/cerca"
        className="ml-auto flex size-9 items-center justify-center rounded-md hover:bg-ink-foreground/10 md:hidden lg:ml-0 lg:flex xl:hidden"
        aria-label="Cerca"
      >
        <Search className="size-5" aria-hidden />
      </Link>
    </>
  )
}
