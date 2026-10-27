'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { RotateCcw, Search } from 'lucide-react'
import { nomiComuniNormativa, sezioniGiudiziarie, tipologieNormativa, ufficiGiudiziari } from '@/lib/banca-dati-options'

const RESULTS_BASE = 'https://miolegale.it/banca-dati-giuridica/#sf-'

const ARCHIVES = [
  { value: '', label: 'Tutta la banca dati' },
  { value: '2', label: 'Massime giurisprudenziali' },
  { value: '4', label: 'Testi normativi' },
  { value: '1', label: 'Notizie giuridiche' },
  { value: '9', label: 'Guide' },
  { value: '6', label: 'Formulario civile' },
  { value: '7', label: 'Formulario penale' },
  { value: '5', label: 'Brocardi e aforismi' },
] as const

const MASSIME = '2'
const NORMATIVA = '4'

const controlClass =
  'h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40'

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

function OptionSelect({ id, name, placeholder, options }: { id: string; name: string; placeholder: string; options: string[] }) {
  return (
    <select id={id} name={name} defaultValue="" className={controlClass}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

function YearInput({ id, name }: { id: string; name: string }) {
  return (
    <input
      id={id}
      name={name}
      inputMode="numeric"
      pattern="\d{4}"
      maxLength={4}
      placeholder="Es. 2024"
      title="Anno in quattro cifre"
      className={controlClass}
    />
  )
}

export function BancaDatiSearchForm() {
  const [archive, setArchive] = useState<string>('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const filters: Record<string, string> = {}
    for (const [key, value] of data.entries()) {
      const v = String(value).trim()
      if (v) filters[key] = v
    }
    if (!Object.keys(filters).some((k) => k !== '1')) {
      setError('Inserisci delle parole chiave o almeno un filtro.')
      return
    }
    setError('')
    const json = JSON.stringify({ ...filters, 'search-id': 'banca_dati_giuridica' })
    const url = RESULTS_BASE + encodeURI(json).replace(/%7B/g, '{').replace(/%7D/g, '}')
    if (window.self !== window.top) window.open(url, '_blank', 'noopener')
    else window.location.assign(url)
  }

  function handleReset() {
    setArchive('')
    setError('')
  }

  const detailTitle = archive === MASSIME ? 'Estremi della pronuncia' : archive === NORMATIVA ? 'Estremi della norma' : null

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      role="search"
      aria-label="Ricerca nella banca dati giuridica"
      className="flex flex-col gap-6 rounded-xl bg-card p-5 text-card-foreground shadow-sm md:p-7"
    >
      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mb-3 text-sm font-semibold">Cerca in</legend>
        <div className="flex flex-wrap gap-2">
          {ARCHIVES.map((a) => (
            <label
              key={a.value || 'tutto'}
              className="cursor-pointer rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2"
            >
              <input
                type="radio"
                name="1"
                value={a.value}
                checked={archive === a.value}
                onChange={() => setArchive(a.value)}
                className="sr-only"
              />
              {a.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="bd-q" label="Parole chiave">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="bd-q"
            name="2"
            type="search"
            maxLength={120}
            placeholder="Es. assegno di mantenimento, usucapione, danno da vacanza rovinata…"
            className={`${controlClass} h-12 pl-11`}
          />
        </div>
      </Field>

      {detailTitle && (
        <fieldset key={archive} className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-muted/50 p-4 md:p-5">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{detailTitle}</legend>
          {archive === MASSIME ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field id="bd-ufficio" label="Ufficio giudiziario">
                <OptionSelect id="bd-ufficio" name="7" placeholder="Tutti gli uffici" options={ufficiGiudiziari} />
              </Field>
              <Field id="bd-sezione" label="Sezione">
                <OptionSelect id="bd-sezione" name="8" placeholder="Tutte le sezioni" options={sezioniGiudiziarie} />
              </Field>
              <Field id="bd-num-sent" label="Numero sentenza">
                <input id="bd-num-sent" name="9" inputMode="numeric" maxLength={10} placeholder="Es. 12345" className={controlClass} />
              </Field>
              <Field id="bd-anno-sent" label="Anno sentenza">
                <YearInput id="bd-anno-sent" name="10" />
              </Field>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field id="bd-tipo" label="Tipologia">
                <OptionSelect id="bd-tipo" name="3" placeholder="Legge, decreto…" options={tipologieNormativa} />
              </Field>
              <Field id="bd-volgare" label="Nome comune">
                <OptionSelect id="bd-volgare" name="4" placeholder="Es. Jobs Act, Codice privacy…" options={nomiComuniNormativa} />
              </Field>
              <Field id="bd-num-norma" label="Numero">
                <input id="bd-num-norma" name="5" maxLength={10} placeholder="Es. 196" className={controlClass} />
              </Field>
              <Field id="bd-anno-norma" label="Anno">
                <YearInput id="bd-anno-norma" name="6" />
              </Field>
            </div>
          )}
        </fieldset>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground" aria-live="polite">
          {error ? <span className="font-medium text-destructive">{error}</span> : 'I risultati si aprono nella banca dati di MioLegale.'}
        </p>
        <div className="flex gap-3">
          <button
            type="reset"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <RotateCcw className="size-4" aria-hidden />
            Cancella
          </button>
          <button
            type="submit"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-none"
          >
            <Search className="size-4" aria-hidden />
            Cerca
          </button>
        </div>
      </div>
    </form>
  )
}
