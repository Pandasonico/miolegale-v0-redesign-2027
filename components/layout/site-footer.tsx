import Link from 'next/link'
import { DATABASE_MENU, MATERIE, SITE, TOOLS } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-tight">MioLegale</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">{SITE.tagline}.</p>
        </div>
        <FooterCol title="Banca dati" items={DATABASE_MENU} />
        <FooterCol
          title="Strumenti"
          items={[
            ...TOOLS.map((t) => ({ href: `/calcolatori/${t.slug}`, label: t.title })),
            { href: '/assistente-ai', label: 'Assistente AI giuridico' },
          ]}
        />
        <FooterCol title="Materie" items={MATERIE.slice(0, 8).map((m) => ({ href: `/${m.slug}`, label: m.label }))} />
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-ink-foreground/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {SITE.domain}. I contenuti hanno finalità informativa e non costituiscono consulenza legale.</p>
          <p>Privacy · Cookie policy · Contatti</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-mono font-medium uppercase tracking-wider text-accent">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="text-ink-foreground/80 hover:text-ink-foreground">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
