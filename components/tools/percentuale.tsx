'use client'

import { useState } from 'react'
import { calcolaPercentuale, num, parseNum, type ModoPercentuale } from '@/lib/calc'
import { Field, Panel, ResultCard, inputCls } from './tool-shell'

const MODI: Record<ModoPercentuale, { label: string; a: string; b: string; result: string; example: [string, string] }> = {
  di: { label: 'Quanto è X% di Y', a: 'Percentuale (%)', b: 'Numero', result: 'Risultato', example: ['22', '1000'] },
  quale: { label: 'X è quanto per cento di Y', a: 'Valore parziale', b: 'Valore totale', result: 'Percentuale', example: ['250', '1000'] },
  variazione: { label: 'Variazione percentuale da X a Y', a: 'Valore iniziale', b: 'Valore finale', result: 'Variazione', example: ['800', '1000'] },
  aumenta: { label: 'Aumenta Y del X%', a: 'Percentuale (%)', b: 'Numero', result: 'Valore aumentato', example: ['22', '1000'] },
  diminuisci: { label: 'Diminuisci Y del X%', a: 'Percentuale (%)', b: 'Numero', result: 'Valore diminuito', example: ['22', '1000'] },
}

export function PercentualeCalculator() {
  const [modo, setModo] = useState<ModoPercentuale>('di')
  const [a, setA] = useState(MODI.di.example[0])
  const [b, setB] = useState(MODI.di.example[1])
  const m = MODI[modo]
  const r = calcolaPercentuale(modo, parseNum(a), parseNum(b))

  const change = (next: ModoPercentuale) => {
    setModo(next)
    setA(MODI[next].example[0])
    setB(MODI[next].example[1])
  }

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={3}>
        <Field label="Operazione" htmlFor="modo">
          <select id="modo" className={inputCls} value={modo} onChange={(e) => change(e.target.value as ModoPercentuale)}>
            {Object.entries(MODI).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={m.a} htmlFor="a">
          <input id="a" inputMode="decimal" className={inputCls} value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field label={m.b} htmlFor="b">
          <input id="b" inputMode="decimal" className={inputCls} value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
      </Panel>
      <ResultCard label={m.result} value={r.percent ? `${num(r.value)}%` : num(r.value)} />
    </div>
  )
}
