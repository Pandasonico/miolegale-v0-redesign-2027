'use client'

import { useDeferredValue, useMemo, useState, type FormEvent } from 'react'
import { ChevronRight, Search } from 'lucide-react'
import type { ActArticle, ActNode } from '@/lib/act-index'

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const articleKey = (label: string) => norm(label).replace(/^art\.?\s*/, '').replace(/[\s.-]/g, '')

function filterTree(node: ActNode, q: string): ActNode | null {
  if (!q) return node
  if (node.title && norm(node.title).includes(q)) return node
  const articles = node.articles.filter((a) => norm(`${a.label} ${a.rubrica ?? ''}`).includes(q))
  const children = node.children.map((c) => filterTree(c, q)).filter((c): c is ActNode => c !== null)
  if (!articles.length && !children.length) return null
  return { ...node, articles, children }
}

function collect(node: ActNode, out: { ids: string[]; articles: ActArticle[] }) {
  if (node.id !== 'root') out.ids.push(node.id)
  out.articles.push(...node.articles)
  node.children.forEach((c) => collect(c, out))
  return out
}

const countArticles = (node: ActNode): number => node.articles.length + node.children.reduce((n, c) => n + countArticles(c), 0)

export function ActTree({ root }: { root: ActNode }) {
  const all = useMemo(() => collect(root, { ids: [], articles: [] }), [root])
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState('')
  const [status, setStatus] = useState('')
  const q = norm(useDeferredValue(query))
  const filtered = useMemo(() => filterTree(root, q), [root, q])
  const filtering = q.length > 0

  function toggle(id: string, isOpen: boolean) {
    setOpen((prev) => {
      if (prev.has(id) === isOpen) return prev
      const next = new Set(prev)
      if (isOpen) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function goTo(e: FormEvent) {
    e.preventDefault()
    const raw = norm(target)
    if (!raw) return
    const isDisp = raw.includes('disp')
    const key = articleKey(raw.replace(/disp\.?\s*trans\.?|disposizion\S*\s*transitori\S*/g, ''))
    const match = all.articles.find(
      (a) => articleKey(a.label) === key && (a.group?.includes('disp') ?? false) === isDisp,
    ) ?? all.articles.find((a) => articleKey(a.label) === key)
    if (match) {
      setStatus(`Apertura di ${match.label}…`)
      window.location.href = match.href
    } else {
      setStatus(`Nessun articolo trovato per “${target}”.`)
    }
  }

  const shown = filtered ? countArticles(filtered) : 0

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end print:hidden">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-semibold text-foreground">Filtra l&apos;indice</span>
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Parola o numero"
              autoComplete="off"
              className="h-11 w-full rounded-md border border-input bg-card pl-9 pr-3 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </span>
        </label>

        <form onSubmit={goTo} noValidate className="flex flex-1 items-end gap-2">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-sm font-semibold text-foreground">Vai all&apos;articolo</span>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="es. 56, XVIII disp. trans."
              autoComplete="off"
              className="h-11 w-full rounded-md border border-input bg-card px-3 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </label>
          <button type="submit" className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Vai
          </button>
        </form>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(new Set(all.ids))}
            className="h-11 rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80"
          >
            Espandi tutto
          </button>
          <button
            type="button"
            onClick={() => setOpen(new Set())}
            className="h-11 rounded-md bg-secondary px-4 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80"
          >
            Comprimi tutto
          </button>
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {filtering ? (shown ? `${shown} articoli corrispondono a “${query}”.` : `Nessun risultato per “${query}”.`) : status}
      </p>

      {filtered && (
        <div className="mt-4">
          <ArticleList articles={filtered.articles} />
          <div className="flex flex-col">
            {filtered.children.map((node) => (
              <TreeNode key={node.id} node={node} open={open} forceOpen={filtering} onToggle={toggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const HEADING_SIZE: Record<number, string> = {
  2: 'text-xl md:text-2xl',
  3: 'text-lg md:text-xl',
  4: 'text-base md:text-lg',
}

function TreeNode({
  node,
  open,
  forceOpen,
  onToggle,
}: {
  node: ActNode
  open: Set<string>
  forceOpen: boolean
  onToggle: (id: string, isOpen: boolean) => void
}) {
  const isOpen = forceOpen || open.has(node.id)
  const Heading = (`h${Math.min(Math.max(node.level, 2), 6)}`) as 'h2'
  return (
    <details
      id={node.id}
      open={isOpen}
      onToggle={(e) => !forceOpen && onToggle(node.id, e.currentTarget.open)}
      className="group/node"
    >
      <summary className="flex cursor-pointer list-none items-start gap-2 rounded-md py-2.5 hover:text-primary [&::-webkit-details-marker]:hidden">
        <ChevronRight
          className="mt-1.5 size-4 shrink-0 text-muted-foreground transition-transform group-open/node:rotate-90"
          aria-hidden
        />
        <Heading className={`font-sans font-semibold leading-snug tracking-tight text-primary text-pretty ${HEADING_SIZE[node.level] ?? 'text-base'}`}>
          {node.title}
        </Heading>
      </summary>
      <div className="flex flex-col border-l border-border pb-2 pl-5 ml-2">
        <ArticleList articles={node.articles} />
        {node.children.map((child) => (
          <TreeNode key={child.id} node={child} open={open} forceOpen={forceOpen} onToggle={onToggle} />
        ))}
      </div>
    </details>
  )
}

function ArticleList({ articles }: { articles: ActArticle[] }) {
  if (!articles.length) return null
  const hasRubriche = articles.some((a) => a.rubrica)

  if (!hasRubriche) {
    return (
      <ul className="flex flex-wrap gap-2 py-2">
        {articles.map((a) => (
          <li key={a.slug}>
            <a
              href={a.href}
              className="flex h-9 min-w-16 items-center justify-center rounded-md border border-border bg-card px-3 text-sm font-semibold tabular-nums text-foreground hover:border-primary hover:text-primary"
            >
              {a.label}
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="flex flex-col py-1">
      {articles.map((a) => (
        <li key={a.slug}>
          <a href={a.href} className="flex items-baseline gap-3 rounded-md px-2 py-1.5 leading-relaxed hover:bg-secondary">
            <strong className="w-24 shrink-0 font-semibold tabular-nums text-primary">{a.label}</strong>
            {a.rubrica && <span className="text-foreground text-pretty">{a.rubrica}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
