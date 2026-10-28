import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { ReviewsWidget } from '@/components/contacts/reviews-widget'
import { LAWYER_CONTACTS, OFFICES, QUICK_ACTIONS, TRUSTINDEX_LOADER, type ContactLine, type Office } from '@/lib/contacts'
import { STUDIO } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contatti dello studio legale Avv. Gianluca Lanciano',
  description:
    'Telefono, email, PEC e indirizzi degli studi legali dell’Avv. Gianluca Lanciano a Pescara e Raiano (foro di Sulmona). Consulenza e assistenza in giudizio.',
  alternates: { canonical: '/info/contatti' },
}

const ACTIONS = [
  { href: QUICK_ACTIONS.phone, label: 'Chiama', icon: Phone, external: false },
  { href: QUICK_ACTIONS.whatsapp, label: 'WhatsApp', icon: MessageCircle, external: true },
  { href: QUICK_ACTIONS.telegram, label: 'Telegram', icon: Send, external: true },
  { href: QUICK_ACTIONS.email, label: 'Email', icon: Mail, external: false },
]

export default function ContattiPage() {
  return (
    <div className="mx-auto max-w-site px-4 lg:px-8 py-10">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden>»</li>
          <li aria-current="page">Contatti</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="text-sm font-mono font-medium uppercase tracking-widest text-primary">Studio legale</p>
        <h1 className="mt-2 font-sans text-4xl font-semibold tracking-tight text-balance">
          Contatta lo studio legale dell&apos;{STUDIO.lawyer}
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Scrivi o chiama per una consulenza o per l&apos;assistenza in giudizio, e per concordare un appuntamento in studio a Pescara
          o a Raiano (foro di Sulmona).
        </p>
      </header>

      <section aria-labelledby="direct-title" className="mt-10 rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 id="direct-title" className="font-sans text-2xl font-semibold tracking-tight">
              {STUDIO.lawyer}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Contatto diretto, anche su WhatsApp e Telegram</p>
            <ContactList lines={LAWYER_CONTACTS} />
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-md lg:grid-cols-2">
            {ACTIONS.map(({ href, label, icon: Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="offices-title" className="mt-12">
        <h2 id="offices-title" className="font-sans text-2xl font-semibold tracking-tight">
          Le sedi dello studio
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Apri le indicazioni stradali per impostare il percorso direttamente sul navigatore del cellulare.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {OFFICES.map((office) => (
            <OfficeCard key={office.id} office={office} />
          ))}
        </div>
      </section>

      <section aria-labelledby="consulenza-title" className="mt-12 flex flex-col gap-4 rounded-xl bg-ink p-6 text-ink-foreground md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h2 id="consulenza-title" className="font-sans text-xl font-semibold tracking-tight">
            Preferisci una consulenza online?
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-foreground/70">
            Invia il tuo quesito: risposta scritta entro {STUDIO.responseTime}, a partire da {STUDIO.priceFrom} €.
          </p>
        </div>
        <a
          href={STUDIO.consulenzaUrl}
          className="flex w-fit shrink-0 items-center gap-1.5 rounded-md border border-ink-foreground/25 px-4 py-2.5 text-sm font-medium hover:bg-ink-foreground/10"
        >
          Richiedi una consulenza legale
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </section>

      <section aria-labelledby="reviews-title" className="mt-12">
        <h2 id="reviews-title" className="font-sans text-2xl font-semibold tracking-tight">
          Opinioni dei clienti
        </h2>
        <div className="mt-6">
          <ReviewsWidget src={TRUSTINDEX_LOADER} />
        </div>
      </section>
    </div>
  )
}

function OfficeCard({ office }: { office: Office }) {
  return (
    <article aria-labelledby={`${office.id}-title`} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-4 p-6">
        <div>
          <p className="text-xs font-mono font-medium uppercase tracking-wider text-primary">{office.court}</p>
          <h3 id={`${office.id}-title`} className="mt-1 font-sans text-xl font-semibold tracking-tight">
            {office.name}
          </h3>
          <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            {office.address}
          </p>
        </div>
        <ContactList lines={office.lines} />
        <a
          href={office.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Indicazioni stradali
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
      <iframe
        src={office.mapEmbed}
        title={`Mappa: ${office.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="mt-auto aspect-video w-full border-0 border-t border-border"
      />
    </article>
  )
}

function ContactList({ lines }: { lines: ContactLine[] }) {
  return (
    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
      {lines.map((line) => (
        <div key={line.href + line.label} className="contents">
          <dt className="text-muted-foreground">{line.label}</dt>
          <dd>
            <a href={line.href} className="font-medium text-foreground hover:text-primary hover:underline">
              {line.value}
            </a>
          </dd>
        </div>
      ))}
    </dl>
  )
}
