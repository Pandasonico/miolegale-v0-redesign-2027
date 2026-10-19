'use client'

import { useState } from 'react'
import { TERMINI_PRESCRIZIONE, calcolaPrescrizione, dataIT } from '@/lib/calc'
import { Field, ResultCard, inputCls } from './tool-shell'

export function PrescrizioneCalculator() {
  const [start, setStart] = useState('2024-03-15')
  const [tipo, setTipo] = useState<string>('ordinaria')
  const termine = TERMINI_PRESCRIZIONE.find((t) => t.id === tipo)!
  const r = start ? calcolaPrescrizione(start, termine.years) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
        <Field label="Decorrenza" htmlFor="start" hint="Giorno in cui il diritto può essere fatto valere (art. 2935 c.c.).">
          <input id="start" type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="Tipo di diritto" htmlFor="tipo">
          <select id="tipo" className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TERMINI_PRESCRIZIONE.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {r && (
        <ResultCard label="Il diritto si prescrive il" value={dataIT(r.date)}>
          <ul className="mt-3 space-y-1 text-sm text-ink-foreground/75">
            <li>
              Termine di {termine.years} {termine.years === 1 ? 'anno' : 'anni'} ({termine.norm}).
            </li>
            {r.prorogata && <li>La scadenza cadeva in un giorno festivo ed è prorogata al primo giorno non festivo (art. 2963 c.c.).</li>}
            <li>Il calcolo non considera atti interruttivi (art. 2943 c.c.) o cause di sospensione (artt. 2941-2942 c.c.).</li>
          </ul>
        </ResultCard>
      )}
    </div>
  )
}
