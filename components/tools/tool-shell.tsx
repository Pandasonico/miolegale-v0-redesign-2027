import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'
import { POPULAR_TOOLS, TOOLS } from '@/lib/site'

export function ToolShell({
  slug,
  title,
  children,
  guide,
  resultAd = true,
}: {
  slug: string
  /** Titolo della pagina WordPress; se manca si usa quello del registro. */
  title?: string
  children: React.ReactNode
  guide?: React.ReactNode
  /** Annuncio in fondo al contenuto; disattivabile quando l'annuncio è già nel corpo della pagina. */
  resultAd?: boolean
}) {
  const tool = TOOLS.find((t) => t.slug === slug)
  const heading = title ?? tool?.title ?? slug
  return (
    <>
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
                <Link href="/calcolo" className="hover:text-ink-foreground">
                  Calcolatori
                </Link>
              </li>
            </ol>
          </nav>
          <div className="mt-6">
            <Link
              href="/calcolo"
              className="inline-block rounded bg-ink-foreground/10 px-2 py-0.5 text-xs font-mono font-medium uppercase tracking-wider hover:bg-ink-foreground/20"
            >
              Calcolatori
            </Link>
            <h1 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight text-pretty md:text-4xl lg:text-[2.5rem]">
              {heading}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-site px-4 lg:px-8 py-8">
        <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_TOP} className="mb-6" />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {children}
          {resultAd && (
            <AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_RESULT} className="my-10" />
          )}
          {guide && <section className="wp-content max-w-3xl">{guide}</section>}
        </div>
        <aside className="flex flex-col gap-8" aria-label="Altri strumenti">
          <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} />
          <nav className="rounded-lg border border-border bg-card p-5" aria-labelledby="other-tools">
            <p id="other-tools" className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
              Altri calcolatori
            </p>
            <ul className="mt-3 space-y-1">
              {POPULAR_TOOLS.filter((t) => t.slug !== slug)
                .slice(0, 8)
                .map((t) => (
                  <li key={t.slug}>
                    <Link href={`/calcolo/${t.slug}`} className="block py-1.5 text-sm font-medium text-primary hover:underline">
                      {t.title}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/assistente-ai" className="block py-1.5 text-sm font-medium text-primary hover:underline">
                  Assistente AI giuridico
                </Link>
              </li>
            </ul>
            <Link
              href="/calcolo"
              className="mt-4 flex items-center justify-between gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Tutti i calcolatori
              <ArrowRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </nav>
          <div className="sticky top-24">
            <AdSlot variant="skyscraper" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_STICKY} />
          </div>
        </aside>
      </div>
      </div>
    </>
  )
}

export function Field({ label, htmlFor, children, hint }: { label: string; htmlFor: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export const inputCls =
  'h-11 w-full rounded-md border border-input bg-card px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50'

export function ResultCard({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-ink p-6 text-ink-foreground" aria-live="polite">
      <p className="text-xs font-mono font-medium uppercase tracking-wider text-accent">{label}</p>
      <p className="mt-2 font-sans tracking-tight text-3xl font-semibold capitalize tabular-nums md:text-4xl">{value}</p>
      {children}
    </div>
  )
}
