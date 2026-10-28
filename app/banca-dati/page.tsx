import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { BancaDatiSearchForm } from '@/components/banca-dati/search-form'
import { MATERIE, SECTIONS, SOURCE_ARCHIVES } from '@/lib/site'
import { getCategories } from '@/lib/wp'

export const metadata: Metadata = {
  title: 'Banca dati giuridica',
  description: 'Massime, sentenze, norme, brocardi, guide e formulari: tutta la banca dati di MioLegale.',
}

export default async function BancaDatiPage() {
  const categories = await getCategories()
  const count = (slug: string) => categories.find((c) => c.slug === slug)?.count ?? 0

  return (
    <>
    <header id="ricerca" className="scroll-mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-site px-4 lg:px-8 pb-10 pt-8 lg:pb-12">
        <nav aria-label="Percorso" className="text-sm text-ink-foreground/70">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-ink-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page">Banca dati</li>
          </ol>
        </nav>
        <h1 className="mt-6 font-sans text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl lg:text-[2.5rem]">
          Banca dati giuridica gratuita
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-foreground/80 text-pretty">
          Interroga in un&apos;unica ricerca massime, sentenze, leggi, guide, notizie, formulari e brocardi: scegli l&apos;archivio e inserisci uno o più termini.
        </p>
        <div className="mt-8">
          <BancaDatiSearchForm />
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-site px-4 lg:px-8 py-10">
      <h2 className="font-sans tracking-tight text-3xl font-semibold">Sfoglia per archivio</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ...SOURCE_ARCHIVES,
            { slug: 'massime', label: 'Giurisprudenza', description: 'Massime giurisprudenziali e sentenze correlate' },
          ].map((a) => (
          <li key={a.slug}>
            <Link href={`/${a.slug}`} className="flex h-full flex-col rounded-lg bg-primary p-5 text-primary-foreground hover:bg-primary/90">
              <span className="font-sans tracking-tight text-2xl font-semibold">{a.label}</span>
              <span className="mt-2 text-sm leading-relaxed text-primary-foreground/80">{a.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((s) => (
          <li key={s.slug}>
            <Link href={`/${s.slug}`} className="flex h-full flex-col rounded-lg border border-border bg-card p-5 hover:border-primary">
              <span className="font-sans tracking-tight text-3xl font-semibold tabular-nums text-primary">
                {count(s.slug) ? count(s.slug).toLocaleString('it-IT') : '—'}
              </span>
              <span className="mt-2 font-semibold">{s.label}</span>
              <span className="mt-1 text-sm text-muted-foreground">{s.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="my-10" />

      <h2 className="font-sans tracking-tight text-3xl font-semibold">Per materia</h2>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {MATERIE.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/${m.slug}`}
              className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary"
            >
              {m.label}
              <span className="text-xs tabular-nums text-muted-foreground">{count(m.slug) || ''}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </>
  )
}
