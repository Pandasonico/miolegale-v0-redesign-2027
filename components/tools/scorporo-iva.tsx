'use client'

import { useState } from 'react'
import { calcolaIva, euro } from '@/lib/calc'
import { Field, ResultCard, inputCls } from './tool-shell'

const ALIQUOTE = [22, 10, 5, 4]

export function ScorporoIvaCalculator() {
  const [importo, setImporto] = useState('1220')
  const [aliquota, setAliquota] = useState(22)
  const [modo, setModo] = useState<'aggiungi' | 'scorpora'>('scorpora')

  const r = calcolaIva(Number(importo.replace(/\./g, '').replace(',', '.')) || 0, aliquota, modo)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-3">
        <Field label={modo === 'scorpora' ? 'Importo IVA inclusa (€)' : 'Imponibile (€)'} htmlFor="importo">
          <input id="importo" inputMode="decimal" className={inputCls} value={importo} onChange={(e) => setImporto(e.target.value)} />
        </Field>
        <Field label="Aliquota" htmlFor="aliquota">
          <select id="aliquota" className={inputCls} value={aliquota} onChange={(e) => setAliquota(Number(e.target.value))}>
            {ALIQUOTE.map((a) => (
              <option key={a} value={a}>
                {a}%
              </option>
            ))}
          </select>
        </Field>
        <Field label="Operazione" htmlFor="modo">
          <select id="modo" className={inputCls} value={modo} onChange={(e) => setModo(e.target.value as typeof modo)}>
            <option value="scorpora">Scorpora IVA</option>
            <option value="aggiungi">Aggiungi IVA</option>
          </select>
        </Field>
      </div>
      <ResultCard label={modo === 'scorpora' ? 'Imponibile' : 'Totale IVA inclusa'} value={euro(modo === 'scorpora' ? r.imponibile : r.totale)}>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          {[
            ['Imponibile', r.imponibile],
            [`IVA ${aliquota}%`, r.imposta],
            ['Totale', r.totale],
          ].map(([l, v]) => (
            <div key={l as string}>
              <dt className="text-ink-foreground/70">{l}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">{euro(v as number)}</dd>
            </div>
          ))}
        </dl>
      </ResultCard>
    </div>
  )
}
