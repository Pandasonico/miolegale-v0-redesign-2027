import Link from 'next/link'
import { AdSlot } from '@/components/ads/ad-slot'
import { toLocalPath, type UtilityPage } from '@/lib/wp'

export function UtilityShell({
  slug,
  title,
  others,
  children,
}: {
  slug: string
  title: string
  others: UtilityPage[]
  children: React.ReactNode
}) {
  const related = others
    .map((page) => ({ ...page, path: toLocalPath(page.href) }))
    .filter((page) => page.path !== `/utilita/${slug}`)
    .slice(0, 8)
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Percorso" className="text-sm text-muted-foreground">
        <Link href="/utilita" className="hover:text-primary">
          Utilità legali
        </Link>{' '}
        / <span>{title}</span>
      </nav>
      <h1 className="mt-3 font-sans tracking-tight text-4xl font-semibold text-balance">{title}</h1>

      <AdSlot variant="leaderboard" slot={process.env.NEXT_PUBLIC_AD_SLOT_TOOL_TOP} className="my-6" />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">{children}</div>
        <aside className="flex flex-col gap-8" aria-label="Altre utilità">
          <AdSlot variant="rectangle" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR} />
          {related.length > 0 && (
            <nav className="rounded-lg border border-border bg-card p-5" aria-labelledby="other-utilities">
              <p id="other-utilities" className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                Altre utilità
              </p>
              <ul className="mt-3 space-y-1">
                {related.map((page) => (
                  <li key={page.path}>
                    <Link href={page.path} className="block py-1.5 text-sm font-medium text-primary hover:underline">
                      {page.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/utilita" className="block py-1.5 text-sm font-semibold text-primary hover:underline">
                    Tutte le utilità
                  </Link>
                </li>
              </ul>
            </nav>
          )}
          <div className="sticky top-24">
            <AdSlot variant="skyscraper" slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_STICKY} />
          </div>
        </aside>
      </div>
    </div>
  )
}
