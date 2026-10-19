import type { Metadata } from 'next'
import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm font-mono font-medium uppercase tracking-widest text-primary">Banca dati</p>
      <h1 className="mt-2 font-sans tracking-tight text-4xl font-semibold">Tutta la banca dati giuridica</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Consulta i contenuti per tipologia o per materia.</p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {SOURCE_ARCHIVES.map((a) => (
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
  )
}
