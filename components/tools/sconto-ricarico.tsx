'use client'

import { useState } from 'react'
import { calcolaScontoRicarico, euro, num, parseNum } from '@/lib/calc'
import { Field, Panel, ResultCard, Stats, inputCls } from './tool-shell'

type Modo = 'sconto' | 'ricarico' | 'margine'

const MODI: Record<Modo, { label: string; prezzo: string; percentuale: string; result: string }> = {
  sconto: { label: 'Applica uno sconto', prezzo: 'Prezzo di listino (€)', percentuale: 'Sconto (%)', result: 'Prezzo scontato' },
  ricarico: { label: 'Applica un ricarico sul costo', prezzo: 'Costo di acquisto (€)', percentuale: 'Ricarico (%)', result: 'Prezzo di vendita' },
  margine: { label: 'Ottieni un margine sul prezzo', prezzo: 'Costo di acquisto (€)', percentuale: 'Margine (%)', result: 'Prezzo di vendita' },
}

export function ScontoRicaricoCalculator() {
  const [modo, setModo] = useState<Modo>('sconto')
  const [prezzo, setPrezzo] = useState('100')
  const [percentuale, setPercentuale] = useState('20')
  const m = MODI[modo]
  const p = parseNum(percentuale)
  const r = calcolaScontoRicarico(modo, parseNum(prezzo), p)
  const valido = modo !== 'margine' || p < 100

  const items: [string, string][] = [
    [modo === 'sconto' ? 'Risparmio' : 'Guadagno', euro(r.differenza)],
  ]
  if (modo === 'ricarico' && r.margine !== undefined) items.push(['Margine sul prezzo', `${num(r.margine)}%`])
  if (modo === 'margine' && r.ricarico !== undefined) items.push(['Ricarico sul costo', `${num(r.ricarico)}%`])

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={3}>
        <Field label="Operazione" htmlFor="modo">
          <select id="modo" className={inputCls} value={modo} onChange={(e) => setModo(e.target.value as Modo)}>
            {Object.entries(MODI).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={m.prezzo} htmlFor="prezzo">
          <input id="prezzo" inputMode="decimal" className={inputCls} value={prezzo} onChange={(e) => setPrezzo(e.target.value)} />
        </Field>
        <Field label={m.percentuale} htmlFor="percentuale">
          <input id="percentuale" inputMode="decimal" className={inputCls} value={percentuale} onChange={(e) => setPercentuale(e.target.value)} />
        </Field>
      </Panel>
      <ResultCard label={m.result} value={valido ? euro(r.finale) : '—'}>
        {valido && <Stats items={items} cols={2} />}
      </ResultCard>
    </div>
  )
}
