import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { formatDate, getUtilityPages } from '@/lib/wp'

export const metadata: Metadata = {
  title: 'Utilità legali e formulari',
  description:
    'Tabelle e dati aggiornati per lo studio legale: indici ISTAT, tassi di interesse legale e moratori, tassi soglia usura, parametri forensi, tabelle di Milano e Roma, contributo unificato e altro.',
}

export default async function UtilitaPage() {
  const pages = await getUtilityPages()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">Utilità legali</span>
      </nav>
      <h1 className="mt-3 font-sans tracking-tight text-4xl font-semibold text-balance">Utilità legali e formulari</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
        Tabelle, tassi e indici aggiornati da consultare al volo: interessi, usura, ISTAT, parametri forensi, risarcimento del danno e
        adempimenti di cancelleria.{' '}
        <Link href="/calcolo" className="font-medium text-primary hover:underline">
          Cerchi un calcolo? Vai ai calcolatori
        </Link>
        .
      </p>

      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="my-8" />

      {pages.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Elenco momentaneamente non disponibile.{' '}
          <a href="https://miolegale.it/utilita/" className="font-semibold text-primary underline">
            Consultalo su miolegale.it
          </a>
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p) => (
            <li key={p.id}>
              <a href={p.href} className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 hover:border-primary">
                <span className="flex items-start justify-between gap-3 font-semibold leading-snug text-foreground group-hover:text-primary">
                  {p.title}
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                </span>
                {p.excerpt && <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</span>}
                <span className="mt-auto pt-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Aggiornato {formatDate(p.modified)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
