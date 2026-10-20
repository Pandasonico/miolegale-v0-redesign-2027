import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
import { AVAILABLE_TOOLS, TOOLS } from '@/lib/site'

export function ToolShell({
  slug,
  children,
  guide,
}: {
  slug: string
  children: React.ReactNode
  guide: React.ReactNode
}) {
  const tool = TOOLS.find((t) => t.slug === slug)!
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <Link href="/calcolo" className="hover:text-primary">
          Calcolatori
        </Link>{' '}
        / <span>{tool.title}</span>
      </nav>
      <h1 className="mt-3 font-sans tracking-tight text-4xl font-semibold text-balance">{tool.title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{tool.description}</p>

      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_TOP} className="my-6" />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {children}
          <AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_RESULT} className="my-10" />
          <section className="wp-content max-w-3xl">{guide}</section>
        </div>
        <aside className="flex flex-col gap-8" aria-label="Altri strumenti">
          <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} />
          <nav className="rounded-lg border border-border bg-card p-5" aria-labelledby="other-tools">
            <p id="other-tools" className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
              Altri calcolatori
            </p>
            <ul className="mt-3 space-y-1">
              {AVAILABLE_TOOLS.filter((t) => t.slug !== slug).map((t) => (
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
          </nav>
          <div className="sticky top-24">
            <AdSlot variant="skyscraper" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_STICKY} />
          </div>
        </aside>
      </div>
    </div>
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

export function Stats({ items, cols = 3 }: { items: [string, string][]; cols?: 2 | 3 | 4 }) {
  const colsCls = cols === 2 ? 'sm:grid-cols-2' : cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'
  return (
    <dl className={`mt-4 grid gap-4 text-sm ${colsCls}`}>
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-ink-foreground/70">{label}</dt>
          <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Check({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
      <input id={id} type="checkbox" className="size-4 accent-primary" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

export function Panel({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  const colsCls = cols === 1 ? '' : cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  return <div className={`grid gap-4 rounded-lg border border-border bg-card p-6 ${colsCls}`}>{children}</div>
}
