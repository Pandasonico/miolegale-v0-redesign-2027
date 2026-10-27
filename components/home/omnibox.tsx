'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

type Mode = 'cerca' | 'ai'

const MODES = {
  cerca: {
    label: 'Cerca nella banca dati',
    action: '/cerca',
    placeholder: 'Es. usucapione, art. 2051 c.c., licenziamento…',
    submit: 'Cerca',
    suggestions: ['Responsabilità medica', 'Art. 2051 c.c.', 'Assegno di mantenimento', 'Usucapione'],
  },
  ai: {
    label: "Chiedi all'Avvocato AI",
    action: '/assistente-ai',
    placeholder: 'Descrivi il tuo caso o fai una domanda giuridica…',
    submit: 'Chiedi',
    suggestions: [
      'Termini per impugnare una sentenza civile',
      'Infiltrazioni: quando risponde il condominio?',
      'Giusta causa o giustificato motivo?',
    ],
  },
} as const

export function Omnibox() {
  const [mode, setMode] = useState<Mode>('cerca')
  const current = MODES[mode]

  return (
    <div className="rounded-xl bg-card p-2 text-card-foreground shadow-2xl shadow-ink/30">
      <div role="tablist" aria-label="Modalità di ricerca" className="flex h-[46px] gap-6 p-1">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold',
              mode === m ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {m === 'cerca' ? <Search className="size-4" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
            <span className="hidden sm:inline">{MODES[m].label}</span>
            <span className="sm:hidden">{m === 'cerca' ? 'Cerca' : "Chiedi all'AI"}</span>
          </button>
        ))}
      </div>

      <form action={current.action} className="flex flex-col gap-2 p-1 sm:flex-row" role="search">
        <label htmlFor="omnibox" className="sr-only">
          {current.label}
        </label>
        <input
          key={mode}
          id="omnibox"
          name="q"
          type="search"
          required
          maxLength={500}
          placeholder={current.placeholder}
          className="h-14 w-full shrink-0 rounded-md sm:flex-1 sm:shrink border border-input bg-background px-4 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        <button
          type="submit"
          className="flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-7 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {current.submit}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 px-2 pb-2 pt-1">
        <span className="hidden text-xs font-medium text-muted-foreground sm:inline">{mode === 'ai' ? 'Prova:' : 'Ad esempio:'}</span>
        {current.suggestions.map((s) => (
          <Link
            key={s}
            href={`${current.action}?q=${encodeURIComponent(s)}`}
            className="hidden rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground sm:inline-block"
          >
            {s}
          </Link>
        ))}
        {mode === 'cerca' && (
          <a
            href={SITE.bancaDatiGiuridicaUrl}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden />
            Ricerca avanzata nella banca dati
          </a>
        )}
      </div>
    </div>
  )
}
