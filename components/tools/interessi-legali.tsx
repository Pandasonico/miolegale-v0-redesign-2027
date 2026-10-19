'use client'

import { useMemo, useState } from 'react'
import { calcolaInteressiLegali, euro } from '@/lib/calc'
import { Field, ResultCard, inputCls } from './tool-shell'

const today = new Date().toISOString().slice(0, 10)

export function InteressiLegaliCalculator() {
  const [capitale, setCapitale] = useState('10000')
  const [start, setStart] = useState('2023-01-01')
  const [end, setEnd] = useState(today)

  const cap = Number(capitale.replace(',', '.'))
  const result = useMemo(() => calcolaInteressiLegali(cap, start, end), [cap, start, end])
  const fmtDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('it-IT', { timeZone: 'UTC' })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-3">
        <Field label="Capitale (€)" htmlFor="capitale">
          <input id="capitale" inputMode="decimal" className={inputCls} value={capitale} onChange={(e) => setCapitale(e.target.value)} />
        </Field>
        <Field label="Dal" htmlFor="start">
          <input id="start" type="date" className={inputCls} value={start} min="1991-01-01" onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="Al" htmlFor="end">
          <input id="end" type="date" className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} />
        </Field>
      </div>

      <ResultCard label="Interessi legali maturati" value={euro(result.total)}>
        <p className="mt-2 text-sm text-ink-foreground/70">
          Montante complessivo: <strong className="text-ink-foreground">{euro((cap || 0) + result.total)}</strong>
        </p>
      </ResultCard>

      {result.rows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <caption className="sr-only">Dettaglio del calcolo per periodo</caption>
            <thead className="bg-muted text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Periodo</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Giorni</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Tasso</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">Interessi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {result.rows.map((r) => (
                <tr key={r.from}>
                  <td className="px-4 py-3">
                    {fmtDate(r.from)} – {fmtDate(r.to)}
                  </td>
                  <td className="px-4 py-3 text-right">{r.days}</td>
                  <td className="px-4 py-3 text-right">{r.rate.toLocaleString('it-IT')}%</td>
                  <td className="px-4 py-3 text-right font-medium">{euro(r.interest)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
