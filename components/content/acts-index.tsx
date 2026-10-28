import Link from 'next/link'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { ARCHIVES, type Archive } from '@/lib/site'
import { getArchiveSections, type ArchiveAct } from '@/lib/archives'

export async function ActsIndex({ archive }: { archive: Archive }) {
  const { intro, sections } = await getArchiveSections(archive.slug)
  const total = sections.reduce((n, s) => n + s.acts.length, 0)

  return (
    <div className="mx-auto max-w-site px-4 lg:px-8 py-10">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <Link href="/banca-dati" className="hover:text-primary">
          Banca dati
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{archive.short}</span>
      </nav>

      <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-balance">{archive.label}</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        {intro ?? archive.description}
        {total > 0 && <span className="text-foreground"> {total} atti aggiornati al 2026.</span>}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Altre raccolte">
        {ARCHIVES.filter((a) => a.slug !== archive.slug).map((a) => (
          <li key={a.slug}>
            <Link
              href={`/${a.slug}`}
              className="block rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:border-primary hover:text-primary"
            >
              {a.label}
            </Link>
          </li>
        ))}
      </ul>

      {sections.length > 1 && (
        <nav aria-label="Sezioni" className="mt-8 flex flex-wrap gap-2">
          {sections.map((s, i) => (
            <a
              key={s.title ?? i}
              href={`#sezione-${i}`}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-primary hover:border-primary"
            >
              {s.title}
            </a>
          ))}
        </nav>
      )}

      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="my-8" />

      {total === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Indice momentaneamente non disponibile.{' '}
          <a href={`https://miolegale.it/${archive.slug}/`} className="font-semibold text-primary underline">
            Consultalo su miolegale.it
          </a>
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {sections.map((s, i) => (
            <section key={s.title ?? i} id={`sezione-${i}`} aria-labelledby={s.title ? `sezione-${i}-title` : undefined} className="scroll-mt-24">
              {s.title && (
                <h2 id={`sezione-${i}-title`} className="mb-4 font-sans text-2xl font-semibold tracking-tight">
                  {s.title} <span className="text-base font-normal text-muted-foreground">({s.acts.length})</span>
                </h2>
              )}
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {s.acts.map((act) => (
                  <li key={act.key}>
                    <ActCard act={act} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function ActCard({ act }: { act: ArchiveAct }) {
  return (
    <a
      href={act.href}
      title={act.title}
      className="group flex h-full items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        <BookOpen className="size-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold leading-snug text-foreground group-hover:text-primary text-pretty">{act.label}</span>
        {act.estremi && <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{act.estremi}</span>}
        {act.articles && <span className="mt-2 text-xs font-medium tabular-nums text-primary">{act.articles}</span>}
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
    </a>
  )
}
