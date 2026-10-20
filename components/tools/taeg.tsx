'use client'

import { useState } from 'react'
import { calcolaTaeg, euro, num, parseNum } from '@/lib/calc'
import { Field, Panel, ResultCard, Stats, inputCls } from './tool-shell'

export function TaegCalculator() {
  const [importo, setImporto] = useState('10000')
  const [rata, setRata] = useState('230')
  const [rate, setRate] = useState('48')
  const [speseIniziali, setSpeseIniziali] = useState('150')
  const [speseRata, setSpeseRata] = useState('2')

  const n = Math.floor(Number(rate) || 0)
  const r = calcolaTaeg({
    importo: parseNum(importo),
    rata: parseNum(rata),
    rate: n,
    speseIniziali: parseNum(speseIniziali),
    speseRata: parseNum(speseRata),
  })
  const valido = parseNum(importo) > 0 && parseNum(rata) > 0 && n > 0

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={3}>
        <Field label="Importo finanziato (€)" htmlFor="importo">
          <input id="importo" inputMode="decimal" className={inputCls} value={importo} onChange={(e) => setImporto(e.target.value)} />
        </Field>
        <Field label="Rata mensile (€)" htmlFor="rata">
          <input id="rata" inputMode="decimal" className={inputCls} value={rata} onChange={(e) => setRata(e.target.value)} />
        </Field>
        <Field label="Numero di rate mensili" htmlFor="rate">
          <input id="rate" inputMode="numeric" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Spese iniziali (€)" htmlFor="iniziali" hint="Istruttoria, imposta sostitutiva, assicurazioni pagate subito.">
          <input id="iniziali" inputMode="decimal" className={inputCls} value={speseIniziali} onChange={(e) => setSpeseIniziali(e.target.value)} />
        </Field>
        <Field label="Spese per ogni rata (€)" htmlFor="perRata" hint="Incasso, gestione, invio estratto conto.">
          <input id="perRata" inputMode="decimal" className={inputCls} value={speseRata} onChange={(e) => setSpeseRata(e.target.value)} />
        </Field>
      </Panel>
      <ResultCard label="TAEG" value={valido ? `${num(r.taeg)}%` : '—'}>
        {valido && (
          <Stats
            items={[
              ['TAN', `${num(r.tan)}%`],
              ['Costo totale del credito', euro(r.costoTotale)],
              ['Totale da restituire', euro(r.totaleDaRestituire)],
            ]}
          />
        )}
        <p className="mt-4 text-xs text-ink-foreground/60">
          Il TAEG è il tasso annuo che rende uguale l&apos;importo ricevuto, al netto delle spese iniziali, al valore delle rate versate comprensive delle
          spese. Calcolo indicativo: non sostituisce il documento SECCI.
        </p>
      </ResultCard>
    </div>
  )
}
