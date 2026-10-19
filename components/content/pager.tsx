import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pager({ page, totalPages, baseHref }: { page: number; totalPages: number; baseHref: string }) {
  if (totalPages <= 1) return null
  const sep = baseHref.includes('?') ? '&' : '?'
  const href = (p: number) => (p === 1 ? baseHref : `${baseHref}${sep}page=${p}`)
  const cls = 'flex items-center gap-1 rounded-md border border-input bg-card px-4 py-2 text-sm font-medium hover:bg-muted'

  return (
    <nav aria-label="Paginazione" className="mt-8 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} className={cls} rel="prev">
          <ChevronLeft className="size-4" aria-hidden /> Precedente
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground tabular-nums">
        Pagina {page} di {totalPages.toLocaleString('it-IT')}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={cls} rel="next">
          Successiva <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
