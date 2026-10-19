import Link from 'next/link'
import { Search, Sparkles } from 'lucide-react'
import { DATABASE_MENU } from '@/lib/site'
import { NavLink } from './nav-link'

const PRIMARY = [
  { href: '/banca-dati', label: 'Banca dati' },
  { href: '/calcolatori', label: 'Calcolatori' },
  { href: '/notizie', label: 'Notizie' },
  { href: '/guide', label: 'Guide' },
]

export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-ink text-ink-foreground">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 lg:gap-8">
          <Link href="/" className="text-xl font-semibold tracking-tight lg:text-2xl" aria-label="MioLegale, home">
            MioLegale
          </Link>

          <nav aria-label="Principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {PRIMARY.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-ink-foreground/80 hover:bg-ink-foreground/10 hover:text-ink-foreground"
                    activeClassName="bg-ink-foreground/10 text-ink-foreground"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <form action="/cerca" role="search" className="relative ml-auto hidden w-full max-w-sm md:block">
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

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link
              href="/cerca"
              className="flex size-9 items-center justify-center rounded-md hover:bg-ink-foreground/10 md:hidden"
              aria-label="Cerca"
            >
              <Search className="size-5" aria-hidden />
            </Link>
            <Link
              href="/assistente-ai"
              className="hidden items-center gap-1.5 rounded-md bg-ink-foreground px-3 py-2 text-sm font-semibold text-ink hover:bg-ink-foreground/90 sm:flex"
            >
              <Sparkles className="size-4" aria-hidden />
              Avvocato AI
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label="Sezioni della banca dati" className="border-b border-border bg-card">
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DATABASE_MENU.map((item) => (
            <li key={item.href} className="shrink-0">
              <NavLink
                href={item.href}
                className="block whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground/80 hover:border-primary hover:text-primary"
                activeClassName="border-primary bg-primary text-primary-foreground hover:text-primary-foreground"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
