'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

type Item = { href: string; label: string }

export function MobileMenu({ nav, sections }: { nav: Item[]; sections: Item[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex size-9 items-center justify-center rounded-md border border-input bg-card"
      >
        {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
        <span className="sr-only">{open ? 'Chiudi menu' : 'Apri menu'}</span>
      </button>
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-16 border-b border-border bg-background px-4 pb-6 pt-4 shadow-lg">
          <form action="/cerca" className="mb-4">
            <label htmlFor="mobile-search" className="sr-only">
              Cerca
            </label>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Cerca nella banca dati…"
              className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
            />
          </form>
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((i) => (
              <Link key={i.href} href={i.href} onClick={() => setOpen(false)} className="border-b border-border py-3 font-medium">
                {i.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sezioni</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sections.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setOpen(false)} className="rounded-full bg-muted px-3 py-1 text-sm">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
