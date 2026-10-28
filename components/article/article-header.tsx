import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ShareButtons } from '@/components/article/share-buttons'
import { formatDate } from '@/lib/wp'

export function ArticleHeader({
  title,
  lead,
  category,
  categoryLabel,
  date,
  modified,
  minutes,
  url,
}: {
  title: string
  lead?: string
  category: string
  categoryLabel: string
  date: string
  modified: string
  minutes: number
  url: string
}) {
  const updated = new Date(modified).getTime() > new Date(date).getTime()
  return (
    <header className="bg-ink text-ink-foreground">
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
            <li>
              <Link href={`/${category}`} className="hover:text-ink-foreground">
                {categoryLabel}
              </Link>
            </li>
          </ol>
        </nav>

        <div className="mt-6">
          <Link
            href={`/${category}`}
            className="inline-block rounded bg-ink-foreground/10 px-2 py-0.5 text-xs font-mono font-medium uppercase tracking-wider hover:bg-ink-foreground/20"
          >
            {categoryLabel}
          </Link>
          <h1 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight text-pretty md:text-4xl lg:text-[2.5rem]">
            {title}
          </h1>
          {lead && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-pretty text-ink-foreground/75">{lead}</p>}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-ink-foreground/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-foreground/75">
            <div className="flex gap-1.5">
              <dt>Pubblicato il</dt>
              <dd>
                <time dateTime={date} className="font-medium text-ink-foreground">
                  {formatDate(date)}
                </time>
              </dd>
            </div>
            {updated && (
              <div className="flex gap-1.5">
                <dt>Aggiornato il</dt>
                <dd>
                  <time dateTime={modified} className="font-medium text-ink-foreground">
                    {formatDate(modified)}
                  </time>
                </dd>
              </div>
            )}
            {minutes <= 45 && (
            <div className="flex gap-1.5">
              <dt className="sr-only">Tempo di lettura</dt>
              <dd>
                <span className="font-medium text-ink-foreground">{minutes} min</span> di lettura
              </dd>
            </div>
            )}
          </dl>
          <ShareButtons url={url} title={title} />
        </div>
      </div>
    </header>
  )
}
