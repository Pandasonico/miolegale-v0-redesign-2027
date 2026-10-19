import Link from 'next/link'
import { ChevronDown, Search, Sparkles } from 'lucide-react'
import { DATABASE_MENU, TOOLS } from '@/lib/site'
import { MobileMenu } from './mobile-menu'

type Item = { href: string; label: string }

const TOOLS_MENU: Item[] = [
  ...TOOLS.map((t) => ({ href: `/calcolatori/${t.slug}`, label: t.title })),
  { href: '/calcolatori', label: 'Tutti i calcolatori' },
]

const LINKS: Item[] = [
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
              className="h-10 w-full rounded-md border border-ink-foreground/15 bg-ink-foreground/10 pl-9 pr-3 text-sm text-ink-foreground placeholder:text-ink-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ink-foreground/40"
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
            <MobileMenu database={DATABASE_MENU} tools={TOOLS_MENU} links={LINKS} />
          </div>
        </div>
      </div>

      <div className="hidden bg-primary text-primary-foreground lg:block">
        <nav aria-label="Principale" className="mx-auto flex h-11 max-w-7xl items-stretch gap-1 px-4">
          <Dropdown label="Banca dati giuridica" href="/banca-dati" items={DATABASE_MENU} />
          <Dropdown label="Calcolatori" href="/calcolatori" items={TOOLS_MENU} />
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center px-3 text-sm font-semibold hover:bg-primary-foreground/10">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Dropdown({ label, href, items }: { label: string; href: string; items: Item[] }) {
  return (
    <div className="group relative flex">
      <Link href={href} aria-haspopup="true" className="flex items-center gap-1 px-3 text-sm font-semibold hover:bg-primary-foreground/10">
        {label}
        <ChevronDown className="size-4" aria-hidden />
      </Link>
      <ul className="invisible absolute left-0 top-full z-50 w-72 border border-border bg-card text-card-foreground shadow-lg group-focus-within:visible group-hover:visible">
        {items.map((item) => (
          <li key={item.href} className="border-b border-border last:border-b-0">
            <Link href={item.href} className="block px-4 py-2.5 text-sm hover:bg-secondary hover:text-primary focus-visible:bg-secondary">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
