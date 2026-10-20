'use client'

import { useState } from 'react'
import { euro, num, parseNum, prezzoIniziale } from '@/lib/calc'
import { Field, Panel, ResultCard, Stats, inputCls } from './tool-shell'

export function PrezzoInizialeCalculator() {
  const [finale, setFinale] = useState('80')
  const [percentuale, setPercentuale] = useState('20')
  const [tipo, setTipo] = useState<'sconto' | 'aumento'>('sconto')

  const f = parseNum(finale)
  const p = parseNum(percentuale)
  const iniziale = prezzoIniziale(f, p, tipo)
  const valido = f > 0 && (tipo === 'aumento' || p < 100)

  const [prezzoA, setPrezzoA] = useState('100')
  const [prezzoB, setPrezzoB] = useState('80')
  const a = parseNum(prezzoA)
  const variazione = a > 0 ? ((parseNum(prezzoB) - a) / a) * 100 : 0

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="pi-finale" className="flex flex-col gap-6">
        <h2 id="pi-finale" className="font-sans tracking-tight text-xl font-semibold">
          Dal prezzo finale e dalla percentuale
        </h2>
        <Panel cols={3}>
          <Field label="Prezzo finale (€)" htmlFor="finale">
            <input id="finale" inputMode="decimal" className={inputCls} value={finale} onChange={(e) => setFinale(e.target.value)} />
          </Field>
          <Field label="Percentuale (%)" htmlFor="percentuale">
            <input id="percentuale" inputMode="decimal" className={inputCls} value={percentuale} onChange={(e) => setPercentuale(e.target.value)} />
          </Field>
          <Field label="Il prezzo finale è dopo uno" htmlFor="tipo">
            <select id="tipo" className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
              <option value="sconto">Sconto</option>
              <option value="aumento">Aumento</option>
            </select>
          </Field>
        </Panel>
        <ResultCard label="Prezzo iniziale" value={valido ? euro(iniziale) : '—'}>
          {valido && (
            <Stats
              items={[
                ['Prezzo finale', euro(f)],
                [tipo === 'sconto' ? 'Sconto applicato' : 'Aumento applicato', euro(Math.abs(f - iniziale))],
              ]}
              cols={2}
            />
          )}
        </ResultCard>
      </section>

      <section aria-labelledby="pi-variazione" className="flex flex-col gap-6">
        <h2 id="pi-variazione" className="font-sans tracking-tight text-xl font-semibold">
          Percentuale di sconto tra due prezzi
        </h2>
        <Panel>
          <Field label="Prezzo iniziale (€)" htmlFor="prezzoA">
            <input id="prezzoA" inputMode="decimal" className={inputCls} value={prezzoA} onChange={(e) => setPrezzoA(e.target.value)} />
          </Field>
          <Field label="Prezzo finale (€)" htmlFor="prezzoB">
            <input id="prezzoB" inputMode="decimal" className={inputCls} value={prezzoB} onChange={(e) => setPrezzoB(e.target.value)} />
          </Field>
        </Panel>
        <ResultCard label={variazione <= 0 ? 'Sconto' : 'Aumento'} value={`${num(Math.abs(variazione))}%`} />
      </section>
    </div>
  )
}
