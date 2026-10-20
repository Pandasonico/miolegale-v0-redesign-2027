'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { POPULAR_TOOLS, TOOLS, TOOL_CATEGORIES, toolCategory, type Tool } from '@/lib/site'
import { ToolsGrid } from './tools-grid'

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

function matches(tool: Tool, query: string) {
  const haystack = normalize(
    [tool.title, tool.description, toolCategory(tool.category)?.label, ...(tool.keywords ?? [])].filter(Boolean).join(' '),
  )
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

function ToolRow({ tool, showCategory = false }: { tool: Tool; showCategory?: boolean }) {
  const body = (
    <>
      <span className="flex items-center gap-2">
        <span className="font-medium text-primary group-hover:underline">{tool.title}</span>
        {tool.popular && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">Più usato</span>
        )}
      </span>
      <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{tool.description}</span>
      {showCategory && (
        <span className="mt-1 block text-xs font-mono uppercase tracking-wider text-muted-foreground">{toolCategory(tool.category)?.label}</span>
      )}
    </>
  )
  return (
    <li>
      <Link href={`/calcolo/${tool.slug}`} className="group block rounded-md px-3 py-2.5 hover:bg-secondary">
        {body}
      </Link>
    </li>
  )
}

export function ToolsIndex() {
  const [query, setQuery] = useState('')
  const normalized = normalize(query.trim())

  const results = useMemo(() => (normalized ? TOOLS.filter((t) => matches(t, normalized)) : []), [normalized])

  const categories = useMemo(
    () =>
      TOOL_CATEGORIES.map((c) => ({ ...c, tools: TOOLS.filter((t) => t.category === c.slug || t.alsoIn?.includes(c.slug)) })).filter(
        (c) => c.tools.length > 0,
      ),
    [],
  )

  return (
    <div className="flex flex-col gap-12">
      <div role="search">
        <label htmlFor="tools-search" className="sr-only">
          Cerca un calcolatore
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="tools-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un calcolatore: interessi, scadenza, IVA, prescrizione…"
            className="h-14 w-full rounded-lg border border-input bg-card pl-12 pr-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoComplete="off"
          />
        </div>
      </div>

      {normalized ? (
        <section aria-live="polite" aria-label="Risultati della ricerca">
          <p className="text-sm text-muted-foreground">
            {results.length === 0
              ? `Nessun calcolatore trovato per “${query.trim()}”.`
              : `${results.length} ${results.length === 1 ? 'risultato' : 'risultati'}`}
          </p>
          {results.length > 0 && (
            <ul className="mt-3 grid gap-x-8 gap-y-1 rounded-lg border border-border bg-card p-3 md:grid-cols-2">
              {results.map((tool) => (
                <ToolRow key={tool.slug} tool={tool} showCategory />
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section aria-labelledby="popular-title">
            <h2 id="popular-title" className="font-sans tracking-tight text-2xl font-semibold">
              I più usati
            </h2>
            <div className="mt-5">
              <ToolsGrid tools={POPULAR_TOOLS} withAi={false} />
            </div>
          </section>

          <Link
            href="/assistente-ai"
            className="group flex flex-col gap-3 rounded-lg bg-primary p-5 text-primary-foreground sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex items-center gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Sparkles className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-sans tracking-tight text-lg font-semibold">Assistente AI giuridico</span>
                <span className="block text-sm leading-relaxed text-primary-foreground/80">
                  Non trovi il calcolo che cerchi? Fai una domanda: l&apos;AI risponde citando massime e norme della banca dati.
                </span>
              </span>
            </span>
            <ArrowRight className="hidden size-5 shrink-0 opacity-70 group-hover:opacity-100 sm:block" aria-hidden />
          </Link>

          <section aria-labelledby="by-subject-title">
            <h2 id="by-subject-title" className="font-sans tracking-tight text-2xl font-semibold">
              Tutti i calcolatori per materia
            </h2>
            <nav aria-label="Materie dei calcolatori" className="mt-4">
              <ul className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`#${c.slug}`}
                      className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-primary hover:bg-secondary"
                    >
                      {c.short}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {categories.map((c) => (
                <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="scroll-mt-28 rounded-lg border border-border bg-card p-3">
                  <h3
                    id={`${c.slug}-title`}
                    className="border-b border-border px-3 pb-3 pt-2 font-sans tracking-tight text-lg font-semibold"
                  >
                    {c.label}
                  </h3>
                  <ul className="mt-2">
                    {c.tools.map((tool) => (
                      <ToolRow key={tool.slug} tool={tool} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
