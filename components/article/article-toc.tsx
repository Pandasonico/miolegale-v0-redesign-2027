import { ChevronDown } from 'lucide-react'
import type { TocItem } from '@/lib/wp'

export function ArticleToc({ items }: { items: TocItem[] }) {
  const hasSubsections = items.some((item) => item.depth > 0)
  const indent = ['', 'pl-8', 'pl-12']
  let counter = 0
  return (
    <details open className="group mt-8 rounded-lg border border-border bg-muted print:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
          In questo articolo
        </span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <nav aria-label="Indice dell'articolo" className="border-t border-border px-5 pb-4 pt-3">
        <ol className={hasSubsections ? 'flex flex-col gap-y-1' : 'grid gap-x-8 gap-y-1 md:grid-cols-2'}>
          {items.map((item) => {
            if (item.depth === 0) counter++
            return (
              <li key={item.id} className={indent[item.depth] || undefined}>
                <a
                  href={`#${item.id}`}
                  className={`flex gap-3 py-1 leading-snug hover:text-primary ${item.depth === 0 ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}`}
                >
                  {item.depth === 2 && <span aria-hidden className="shrink-0 text-muted-foreground/60">–</span>}
                  {item.depth === 0 && <span className="w-5 shrink-0 font-mono tabular-nums text-muted-foreground">{counter}.</span>}
                  <span className="text-pretty">{item.title}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </details>
  )
}
