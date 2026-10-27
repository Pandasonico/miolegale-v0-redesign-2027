import { Search } from 'lucide-react'
import { SEARCH_ARCHIVES } from '@/lib/site'

export function BancaDatiSearchForm({ defaultQuery = '', defaultArchive = '' }: { defaultQuery?: string; defaultArchive?: string }) {
  return (
    <form action="/cerca" method="get" role="search" className="flex flex-col gap-6 rounded-xl bg-card p-5 text-card-foreground shadow-sm md:p-7">
      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="text-sm font-semibold">Archivio</legend>
        <div className="flex flex-wrap gap-2">
          {[{ slug: '', label: 'Tutta la banca dati' }, ...SEARCH_ARCHIVES].map((a) => (
            <label
              key={a.slug || 'tutto'}
              className="cursor-pointer rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2"
            >
              <input type="radio" name="archivio" value={a.slug} defaultChecked={a.slug === defaultArchive} className="sr-only" />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="bd-q" className="text-sm font-semibold">
          Termini di ricerca
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              id="bd-q"
              name="q"
              type="search"
              required
              maxLength={120}
              defaultValue={defaultQuery}
              placeholder="Es. assegno di mantenimento, art. 2043 c.c., usucapione…"
              className="h-12 w-full rounded-md border border-input bg-background pl-11 pr-4 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Cerca
          </button>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Inserisci una o più parole: la ricerca restituisce i contenuti che le contengono nel titolo o nel testo.
        </p>
      </div>
    </form>
  )
}
