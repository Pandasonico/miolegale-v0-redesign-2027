import Link from 'next/link'
import { Menu, X } from 'lucide-react'

type Item = { href: string; label: string }

export function MobileMenu({ database, tools, links }: { database: Item[]; tools: Item[]; links: Item[] }) {
  return (
    <details className="group lg:hidden">
      <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-md border border-ink-foreground/20 [&::-webkit-details-marker]:hidden">
        <Menu className="size-4 group-open:hidden" aria-hidden />
        <X className="hidden size-4 group-open:block" aria-hidden />
        <span className="sr-only">Menu</span>
      </summary>
      <div className="absolute inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-border bg-background px-4 pb-6 pt-4 text-foreground shadow-lg">
        <form action="/cerca" role="search">
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
        <MenuGroup title="Banca dati giuridica" items={database} />
        <MenuGroup title="Calcolatori" items={tools} />
        <MenuGroup title="Altro" items={links} />
      </div>
    </details>
  )
}

function MenuGroup({ title, items }: { title: string; items: Item[] }) {
  return (
    <nav aria-label={title} className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <ul className="mt-1">
        {items.map((i) => (
          <li key={i.href} className="border-b border-border">
            <Link href={i.href} className="block py-2.5 text-sm font-medium">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
