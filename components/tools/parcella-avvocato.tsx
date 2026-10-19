'use client'

import { useState } from 'react'
import { calcolaParcella, euro } from '@/lib/calc'
import { Field, ResultCard, inputCls } from './tool-shell'

const toNum = (v: string) => Number(v.replace(/\./g, '').replace(',', '.')) || 0

export function ParcellaAvvocatoCalculator() {
  const [compenso, setCompenso] = useState('1000')
  const [spese, setSpese] = useState('0')
  const [opts, setOpts] = useState({ speseGenerali: true, cpa: true, iva: true, ritenuta: true })

  const result = calcolaParcella({ compenso: toNum(compenso), speseEsenti: toNum(spese), ...opts })
  const toggles: { key: keyof typeof opts; label: string }[] = [
    { key: 'speseGenerali', label: 'Spese generali 15%' },
    { key: 'cpa', label: 'CPA 4%' },
    { key: 'iva', label: 'IVA 22%' },
    { key: 'ritenuta', label: 'Ritenuta d’acconto 20% (cliente sostituto d’imposta)' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
        <Field label="Compenso (€)" htmlFor="compenso">
          <input id="compenso" inputMode="decimal" className={inputCls} value={compenso} onChange={(e) => setCompenso(e.target.value)} />
        </Field>
        <Field label="Spese esenti anticipate (€)" htmlFor="spese" hint="Es. contributo unificato, marche da bollo.">
          <input id="spese" inputMode="decimal" className={inputCls} value={spese} onChange={(e) => setSpese(e.target.value)} />
        </Field>
        <fieldset className="grid gap-2 sm:grid-cols-2 md:col-span-2">
          <legend className="sr-only">Voci da applicare</legend>
          {toggles.map((t) => (
            <label key={t.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-[var(--primary)]"
                checked={opts[t.key]}
                onChange={(e) => setOpts((o) => ({ ...o, [t.key]: e.target.checked }))}
              />
              {t.label}
            </label>
          ))}
        </fieldset>
      </div>

      <ResultCard label="Netto a pagare" value={euro(result.netto)}>
        <dl className="mt-4 divide-y divide-ink-foreground/10 text-sm">
          {result.rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-4 py-2">
              <dt className={r.strong ? 'font-semibold' : 'text-ink-foreground/75'}>{r.label}</dt>
              <dd className={`tabular-nums ${r.strong ? 'font-semibold' : ''}`}>{euro(r.value)}</dd>
            </div>
          ))}
        </dl>
      </ResultCard>
    </div>
  )
}
