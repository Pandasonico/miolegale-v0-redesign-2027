'use client'

import { useState } from 'react'
import { aggiungiMesi, dataIT } from '@/lib/calc'
import { Field, Panel, ResultCard, inputCls } from './tool-shell'

const TIPI = {
  consensuale: { label: 'Separazione consensuale', months: 6, note: 'Decorre dalla comparizione dei coniugi davanti al presidente del tribunale.' },
  giudiziale: { label: 'Separazione giudiziale', months: 12, note: 'Decorre dalla comparizione dei coniugi davanti al presidente del tribunale.' },
  trasformata: {
    label: 'Giudiziale trasformata in consensuale',
    months: 6,
    note: 'Il termine breve vale anche se la separazione giudiziale è proseguita in consensuale.',
  },
  negoziazione: {
    label: 'Negoziazione assistita o accordo davanti all’ufficiale di stato civile',
    months: 6,
    note: 'Decorre dalla data certificata nell’accordo.',
  },
} as const

export function TerminiSeparazioneDivorzioCalculator() {
  const [tipo, setTipo] = useState<keyof typeof TIPI>('consensuale')
  const [data, setData] = useState('2026-03-10')
  const t = TIPI[tipo]
  const result = data ? aggiungiMesi(data, t.months) : null

  return (
    <div className="flex flex-col gap-6">
      <Panel>
        <Field label="Tipo di separazione" htmlFor="tipo">
          <select id="tipo" className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value as keyof typeof TIPI)}>
            {Object.entries(TIPI).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Data di decorrenza" htmlFor="data">
          <input id="data" type="date" className={inputCls} value={data} onChange={(e) => setData(e.target.value)} />
        </Field>
      </Panel>
      {result && (
        <ResultCard label="Si può chiedere il divorzio dal" value={dataIT(result)}>
          <p className="mt-4 text-xs text-ink-foreground/60">
            Termine di {t.months} mesi (art. 3, n. 2, lett. b, L. 898/1970, come modificato dalla L. 55/2015). {t.note}
          </p>
        </ResultCard>
      )}
    </div>
  )
}
