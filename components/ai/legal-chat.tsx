'use client'

import { useChat } from '@ai-sdk/react'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUp, BookOpen, Loader2, Search, Sparkles, Square } from 'lucide-react'
import { AdSlot } from '@/components/ads/ad-slot'

type Source = { title: string; url: string; section?: string; excerpt: string }

const SUGGESTIONS = [
  'Entro quanto tempo posso impugnare una sentenza civile?',
  'Cosa succede se il conduttore non paga l’affitto?',
  'Come funziona la successione legittima senza testamento?',
  'Posso essere licenziato durante la malattia?',
]

export function LegalChat({ initialQuestion = '' }: { initialQuestion?: string }) {
  const [input, setInput] = useState(initialQuestion)
  const { messages, sendMessage, status, stop, error } = useChat()
  const busy = status === 'submitted' || status === 'streaming'

  const submit = (text: string) => {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput('')
  }

  return (
    <div className="flex flex-col gap-6">
      {messages.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">Come posso aiutarti?</p>
              <p className="text-sm text-muted-foreground">Le risposte si basano sulla banca dati di MioLegale.</p>
            </div>
          </div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => submit(s)}
                  className="h-full w-full rounded-md border border-input bg-background px-4 py-3 text-left text-sm hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ol className="flex flex-col gap-6" aria-live="polite">
          {messages.map((m, idx) => (
            <li key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex flex-col gap-3'}>
              {m.role === 'user' ? (
                <div className="max-w-[85%] rounded-lg bg-primary px-4 py-3 text-primary-foreground">
                  {m.parts.map((p, i) => (p.type === 'text' ? <p key={i}>{p.text}</p> : null))}
                </div>
              ) : (
                <>
                  {m.parts.map((p, i) => {
                    if (p.type === 'text') {
                      return (
                        <div key={i} className="whitespace-pre-wrap leading-relaxed">
                          {p.text}
                        </div>
                      )
                    }
                    if (p.type === 'tool-cercaBancaDati') {
                      if (p.state !== 'output-available') {
                        return (
                          <p key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Search className="size-4" aria-hidden /> Ricerca nella banca dati in corso…
                          </p>
                        )
                      }
                      const sources = (p.output as Source[]) ?? []
                      if (sources.length === 0) return null
                      return (
                        <div key={i} className="rounded-lg border border-border bg-card p-4">
                          <p className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wide text-muted-foreground">
                            <BookOpen className="size-4" aria-hidden /> Fonti dalla banca dati
                          </p>
                          <ul className="mt-2 divide-y divide-border">
                            {sources.map((s) => (
                              <li key={s.url} className="py-2">
                                <Link href={s.url} className="text-sm font-medium text-primary hover:underline">
                                  {s.title}
                                </Link>
                                {s.section && <span className="ml-2 text-xs text-muted-foreground">{s.section}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    }
                    return null
                  })}
                  {idx === 1 && status === 'ready' && (
                    <AdSlot variant="in-article" slot={process.env.NEXT_PUBLIC_AD_SLOT_AI} className="my-2" />
                  )}
                </>
              )}
            </li>
          ))}
          {status === 'submitted' && (
            <li className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Sto elaborando la risposta…
            </li>
          )}
        </ol>
      )}

      {error && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          Si è verificato un errore. Riprova tra qualche istante.
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="sticky bottom-4 flex items-end gap-2 rounded-lg border border-input bg-card p-2 shadow-lg"
      >
        <label htmlFor="chat-input" className="sr-only">
          Scrivi la tua domanda
        </label>
        <textarea
          id="chat-input"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              if (e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              submit(input)
            }
          }}
          placeholder="Descrivi la tua questione giuridica…"
          className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-base outline-none"
          maxLength={2000}
        />
        {busy ? (
          <button type="button" onClick={stop} className="flex size-11 items-center justify-center rounded-md bg-muted" aria-label="Interrompi">
            <Square className="size-4" aria-hidden />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40"
            aria-label="Invia"
          >
            <ArrowUp className="size-5" aria-hidden />
          </button>
        )}
      </form>
      <p className="text-center text-xs text-muted-foreground">
        Le risposte sono generate automaticamente e hanno valore informativo. Non sostituiscono il parere di un avvocato.
      </p>
    </div>
  )
}
