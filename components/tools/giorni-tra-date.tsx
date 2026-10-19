'use client'

import { useState } from 'react'
import { giorniTraDate } from '@/lib/calc'
import { Field, ResultCard, inputCls } from './tool-shell'

export function GiorniTraDateCalculator() {
  const [from, setFrom] = useState('2026-01-01')
  const [to, setTo] = useState('2026-12-31')
  const r = from && to ? giorniTraDate(from, to) : null
  const fmt = (n: number) => n.toLocaleString('it-IT')

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
        <Field label="Data iniziale" htmlFor="from">
          <input id="from" type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Data finale" htmlFor="to">
          <input id="to" type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
      </div>
      {r && (
        <ResultCard label="Giorni di calendario" value={fmt(r.calendario)}>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-ink-foreground/70">Giorni lavorativi</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">{fmt(r.lavorativi)}</dd>
            </div>
            <div>
              <dt className="text-ink-foreground/70">Settimane</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">{fmt(r.settimane)}</dd>
            </div>
            <div>
              <dt className="text-ink-foreground/70">Durata</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                {r.anni} a · {r.mesi} m · {r.giorni} g
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-ink-foreground/60">
            Giorni lavorativi: esclusi sabati, domeniche e festività nazionali. Il giorno iniziale non è computato.
          </p>
        </ResultCard>
      )}
    </div>
  )
}
