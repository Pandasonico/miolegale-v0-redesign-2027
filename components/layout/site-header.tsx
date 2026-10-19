import Link from 'next/link'
import { Search, Sparkles } from 'lucide-react'
import { SECTIONS } from '@/lib/site'
import { MobileMenu } from './mobile-menu'

const MAIN_NAV = [
  { href: '/banca-dati', label: 'Banca dati' },
  { href: '/calcolatori', label: 'Calcolatori' },
  { href: '/assistente-ai', label: 'Avvocato AI' },
  { href: '/notizie', label: 'Notizie' },
  { href: '/guide', label: 'Guide' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="bg-ink text-ink-foreground">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-tight" aria-label="MioLegale, home">
            MioLegale
          </Link>

          <form action="/cerca" className="relative ml-auto hidden w-full max-w-md md:block" role="search">
            <label htmlFor="header-search" className="sr-only">
              Cerca nella banca dati
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-foreground/60" aria-hidden />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Cerca massime, sentenze, norme…"
              className="h-10 w-full rounded-md border border-ink-foreground/15 bg-ink-foreground/10 pl-9 pr-3 text-sm text-ink-foreground placeholder:text-ink-foreground/60 outline-none focus-visible:bg-ink-foreground/15 focus-visible:ring-2 focus-visible:ring-ink-foreground/40"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link
              href="/assistente-ai"
              className="flex items-center gap-1.5 rounded-md bg-ink-foreground px-3 py-2 text-sm font-semibold text-ink hover:bg-ink-foreground/90"
            >
              <Sparkles className="size-4" aria-hidden />
              <span className="hidden sm:inline">Chiedi all&apos;AI</span>
              <span className="sm:hidden">AI</span>
            </Link>
            <MobileMenu nav={MAIN_NAV} sections={SECTIONS.map((s) => ({ href: `/${s.slug}`, label: s.short }))} />
          </div>
        </div>
      </div>

      <div className="hidden bg-primary text-primary-foreground lg:block">
        <nav aria-label="Principale" className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-4">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-3 h-5 w-px bg-primary-foreground/25" aria-hidden />
          <div className="flex items-center gap-4 overflow-x-auto text-sm text-primary-foreground/80">
            {SECTIONS.slice(0, 5).map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} className="whitespace-nowrap hover:text-primary-foreground">
                {s.short}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
