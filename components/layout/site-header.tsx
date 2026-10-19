import Image from 'next/image'
import Link from 'next/link'
import { Calculator, Scale, Sparkles, Table2 } from 'lucide-react'
import { DATABASE_MENU, STUDIO } from '@/lib/site'
import { HeaderSearch } from './header-search'
import { NavLink } from './nav-link'

export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-ink text-ink-foreground">
        <div className="mx-auto flex h-16 max-w-7xl lg:h-[90px] items-center gap-4 px-4 lg:gap-8">
          <Link href="/" className="shrink-0" aria-label="MioLegale, home">
            <Image
              src="/images/logo-miolegale.webp"
              alt="MioLegale"
              width={475}
              height={100}
              priority
              unoptimized
              className="h-9 w-auto lg:h-[50px]"
            />
          </Link>

          <HeaderSearch />

          <div className="flex items-center gap-2">
            <Link
              href="/calcolatori"
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-foreground/85 hover:bg-ink-foreground/10 hover:text-ink-foreground lg:flex"
            >
              <Calculator className="size-4" aria-hidden />
              Calcolatori
            </Link>
            <Link
              href="/utilita"
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-foreground/85 hover:bg-ink-foreground/10 hover:text-ink-foreground lg:flex"
            >
              <Table2 className="size-4" aria-hidden />
              Utilità legali
            </Link>
            <a
              href={STUDIO.consulenzaUrl}
              className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-ink-foreground/85 hover:bg-ink-foreground/10 hover:text-ink-foreground lg:flex"
            >
              <Scale className="size-4" aria-hidden />
              Consulenza legale
            </a>
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
