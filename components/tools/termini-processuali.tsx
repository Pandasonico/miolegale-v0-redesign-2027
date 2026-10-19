'use client'

import { useState } from 'react'
import { calcolaScadenza, dataIT } from '@/lib/calc'
import { Field, ResultCard, inputCls } from './tool-shell'

const PRESETS = [
  { label: 'Appello (breve) – 30 gg', days: 30 },
  { label: 'Opposizione a D.I. – 40 gg', days: 40 },
  { label: 'Cassazione (breve) – 60 gg', days: 60 },
  { label: 'Appello (lungo) – 180 gg', days: 180 },
]

export function TerminiProcessualiCalculator() {
  const [start, setStart] = useState(new Date().toISOString().slice(0, 10))
  const [days, setDays] = useState('30')
  const [direction, setDirection] = useState<'avanti' | 'indietro'>('avanti')
  const [sospensioneFeriale, setSospensioneFeriale] = useState(true)
  const [sabatoFestivo, setSabatoFestivo] = useState(true)

  const n = Math.max(0, Math.min(3650, Number(days) || 0))
  const result = start ? calcolaScadenza({ start, days: n, direction, sospensioneFeriale, sabatoFestivo }) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Data di decorrenza" htmlFor="start" hint="Notifica, comunicazione o deposito">
            <input id="start" type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Durata del termine (giorni)" htmlFor="days">
            <input id="days" type="number" min={0} className={inputCls} value={days} onChange={(e) => setDays(e.target.value)} />
          </Field>
          <Field label="Direzione" htmlFor="direction" hint="A ritroso per i termini liberi prima dell'udienza">
            <select id="direction" className={inputCls} value={direction} onChange={(e) => setDirection(e.target.value as 'avanti' | 'indietro')}>
              <option value="avanti">In avanti</option>
              <option value="indietro">A ritroso</option>
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => {
                setDays(String(p.days))
                setDirection('avanti')
              }}
              className="rounded-full border border-input bg-background px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary"
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="size-4" checked={sospensioneFeriale} onChange={(e) => setSospensioneFeriale(e.target.checked)} />
            Applica sospensione feriale (1–31 agosto)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="size-4" checked={sabatoFestivo} onChange={(e) => setSabatoFestivo(e.target.checked)} />
            Sabato come giorno festivo
          </label>
        </div>
      </div>

      {result && (
        <ResultCard label="Scadenza del termine" value={dataIT(result.date)}>
          {result.notes.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-ink-foreground/75">
              {result.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </ResultCard>
      )}
    </div>
  )
}
