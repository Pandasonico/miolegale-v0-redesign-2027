import Link from 'next/link'
import { Calculator, Scale, Search, Sparkles } from 'lucide-react'
import { SECTIONS } from '@/lib/site'
import { MobileMenu } from './mobile-menu'

const MAIN_NAV = [
  { href: '/banca-dati', label: 'Banca dati' },
  { href: '/calcolatori', label: 'Calcolatori' },
  { href: '/assistente-ai', label: 'Assistente AI' },
  { href: '/notizie', label: 'Notizie' },
  { href: '/guide', label: 'Guide' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="MioLegale, home">
          <span className="flex size-8 items-center justify-center rounded-md bg-ink text-ink-foreground">
            <Scale className="size-4" aria-hidden />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight">
            Mio<span className="text-primary">Legale</span>
          </span>
        </Link>

        <nav aria-label="Principale" className="hidden flex-1 items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form action="/cerca" className="relative hidden md:block">
            <label htmlFor="header-search" className="sr-only">
              Cerca nella banca dati
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Cerca massime, norme…"
              className="h-9 w-56 rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring xl:w-72"
            />
          </form>
          <Link
            href="/calcolatori"
            className="hidden items-center gap-1.5 rounded-md border border-input bg-card px-3 py-2 text-sm font-medium hover:bg-muted sm:flex lg:hidden"
          >
            <Calculator className="size-4" aria-hidden /> Calcolatori
          </Link>
          <Link
            href="/assistente-ai"
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-4" aria-hidden />
            <span className="hidden sm:inline">Chiedi all&apos;AI</span>
            <span className="sm:hidden">AI</span>
          </Link>
          <MobileMenu nav={MAIN_NAV} sections={SECTIONS.map((s) => ({ href: `/${s.slug}`, label: s.short }))} />
        </div>
      </div>

      <div className="hidden border-t border-border bg-card lg:block">
        <nav aria-label="Sezioni banca dati" className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-2 text-sm">
          {SECTIONS.map((s) => (
            <Link key={s.slug} href={`/${s.slug}`} className="whitespace-nowrap text-muted-foreground hover:text-primary">
              {s.short}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
