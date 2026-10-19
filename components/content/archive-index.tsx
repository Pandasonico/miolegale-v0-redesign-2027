import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
import { ARCHIVES, type Archive } from '@/lib/site'
import { getArchiveIndex, type ArchiveEntry } from '@/lib/archives'

export async function ArchiveIndex({ archive }: { archive: Archive }) {
  const entries = await getArchiveIndex(archive.slug)
  const isCostituzione = archive.slug === 'costituzione'
  const articles = entries.filter((e) => !e.key.startsWith('disp-trans'))
  const transitional = entries.filter((e) => e.key.startsWith('disp-trans'))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <Link href="/banca-dati" className="hover:text-primary">
          Banca dati
        </Link>
        <span aria-hidden> / </span>
        <span className="text-foreground">{archive.short}</span>
      </nav>
      <h1 className="mt-3 font-serif tracking-tight text-4xl font-semibold text-balance">{archive.label}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{archive.description}</p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Altre raccolte">
        {ARCHIVES.filter((a) => a.slug !== archive.slug).map((a) => (
          <li key={a.slug}>
            <Link href={`/${a.slug}`} className="block rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary">
              {a.label}
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_LIST_TOP} className="my-8" />

      {entries.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Indice momentaneamente non disponibile.{' '}
          <a href={`https://miolegale.it/${archive.slug}/`} className="font-semibold text-primary underline">
            Consultalo su miolegale.it
          </a>
        </p>
      ) : isCostituzione ? (
        <div className="flex flex-col gap-10">
          <ArticleGrid title="Articoli" entries={articles} />
          {transitional.length > 0 && <ArticleGrid title="Disposizioni transitorie e finali" entries={transitional} />}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <li key={e.key}>
              <a href={e.href} className="flex h-full flex-col rounded-lg border border-border bg-card p-4 hover:border-primary">
                <span className="font-semibold text-foreground">{e.label}</span>
                {e.title && e.title !== e.label && (
                  <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{e.title}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ArticleGrid({ title, entries }: { title: string; entries: ArchiveEntry[] }) {
  return (
    <section>
      <h2 className="font-sans tracking-tight text-2xl font-semibold">
        {title} <span className="text-base font-normal text-muted-foreground">({entries.length})</span>
      </h2>
      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-10">
        {entries.map((e) => (
          <li key={e.key}>
            <a href={e.href} className="block rounded-md border border-border bg-card px-2 py-2 text-center text-sm font-medium tabular-nums hover:border-primary hover:text-primary">
              {e.label.replace('Disp. trans. ', '')}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
