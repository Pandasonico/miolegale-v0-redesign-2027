import type { Metadata } from 'next'
import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
import { UtilitaIndex } from '@/components/utilita/utilita-index'
import { getUtilityPages, UTILITY_CATEGORIES } from '@/lib/wp'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Utilità legali e formulari',
  description: 'Tabelle, formulari e strumenti giuridici aggiornati per avvocati e cittadini.',
}

export default async function UtilitaPage() {
  const pages = await getUtilityPages()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">Utilità legali</span>
      </nav>
      <h1 className="mt-3 whitespace-nowrap font-sans tracking-tight text-4xl font-semibold">Utilità legali e formulari</h1>
      <p className="mt-3 max-w-none leading-relaxed text-muted-foreground">
        Strumenti gratuiti e aggiornati alla normativa vigente. I risultati hanno valore indicativo: verifica sempre i casi particolari.
      </p>
      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="my-8" />
      {pages.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Elenco momentaneamente non disponibile.{' '}
          <a href="https://miolegale.it/utilita/" className="font-semibold text-primary underline">Consultalo su miolegale.it</a>
        </p>
      ) : (
        <UtilitaIndex pages={pages} categories={UTILITY_CATEGORIES as unknown as { slug: string; label: string }[]} />
      )}
    </div>
  )
}
