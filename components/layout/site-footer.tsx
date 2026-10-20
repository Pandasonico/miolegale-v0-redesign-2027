import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter/newsletter-form'
import { DATABASE_MENU, MATERIE, POPULAR_TOOLS, SITE, STUDIO } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-ink text-ink-foreground">
      <section aria-labelledby="newsletter-title" className="border-b border-ink-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-xl text-sm">
            <p className="text-xs font-mono font-medium uppercase tracking-wider text-accent">Newsletter giuridica</p>
            <h2 id="newsletter-title" className="mt-2 font-sans tracking-tight text-2xl font-semibold text-balance">
              Novità normative e giurisprudenziali nella tua email
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-foreground/70">
              Le ultime massime, norme e notizie selezionate dalla redazione. Gratis per te.
            </p>
          </div>
          <div className="w-full lg:w-auto lg:min-w-xl lg:shrink-0">
            <NewsletterForm />
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Image src="/images/logo-miolegale.webp" alt="MioLegale" width={475} height={100} unoptimized className="h-9 w-auto" />
          <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">{SITE.tagline}.</p>
          <div className="mt-6 border-t border-ink-foreground/10 pt-5 text-sm">
            <p className="text-ink-foreground/60">Un progetto dello</p>
            <a href={STUDIO.profileUrl} className="font-semibold hover:underline">
              {STUDIO.name}
            </a>
            <a
              href={STUDIO.consulenzaUrl}
              className="mt-4 flex w-fit items-center gap-1.5 rounded-md border border-ink-foreground/25 px-3 py-2 font-medium hover:bg-ink-foreground/10"
            >
              Richiedi una consulenza legale
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
        <FooterCol title="Banca dati" items={DATABASE_MENU} />
        <FooterCol
          title="Strumenti"
          items={[
            ...POPULAR_TOOLS.slice(0, 6).map((t) => ({ href: `/calcolo/${t.slug}`, label: t.title })),
            { href: '/calcolo', label: 'Tutti i calcolatori' },
            { href: '/assistente-ai', label: 'Assistente AI giuridico' },
          ]}
        />
        <FooterCol title="Materie" items={MATERIE.slice(0, 8).map((m) => ({ href: `/${m.slug}`, label: m.label }))} />
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs leading-relaxed text-ink-foreground/60 md:flex-row md:items-center md:justify-between md:gap-8">
          <p>
            © 2006–{new Date().getFullYear()} MioLegale<sup>®</sup> è un marchio registrato da {STUDIO.lawyer}. I contenuti hanno finalità
            informativa e non costituiscono consulenza legale.
          </p>
          <ul className="flex shrink-0 items-center gap-4">
            <li>
              <a href={STUDIO.privacyUrl} className="hover:text-ink-foreground hover:underline">
                Note legali e privacy
              </a>
            </li>
            <li>
              <a href={STUDIO.contattiUrl} className="hover:text-ink-foreground hover:underline">
                Contatti
              </a>
            </li>
          </ul>
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
