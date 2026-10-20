'use client'

import { useState } from 'react'
import { aggiungiPeriodo, dataIT, festivita } from '@/lib/calc'
import { Field, Panel, ResultCard, inputCls } from './tool-shell'

const toInt = (s: string) => Math.max(0, Math.floor(Number(s) || 0))

export function CalcoloDataCalculator() {
  const [start, setStart] = useState('2026-10-20')
  const [segno, setSegno] = useState<'1' | '-1'>('1')
  const [anni, setAnni] = useState('0')
  const [mesi, setMesi] = useState('0')
  const [giorni, setGiorni] = useState('30')

  const result = start ? aggiungiPeriodo(start, Number(segno) as 1 | -1, toInt(anni), toInt(mesi), toInt(giorni)) : null
  const nonLavorativo = result ? festivita(new Date(`${result}T00:00:00Z`).getTime()) : null

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={2}>
        <Field label="Data di partenza" htmlFor="start">
          <input id="start" type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field label="Operazione" htmlFor="segno">
          <select id="segno" className={inputCls} value={segno} onChange={(e) => setSegno(e.target.value as '1' | '-1')}>
            <option value="1">Aggiungi</option>
            <option value="-1">Sottrai</option>
          </select>
        </Field>
        <Field label="Anni" htmlFor="anni">
          <input id="anni" inputMode="numeric" className={inputCls} value={anni} onChange={(e) => setAnni(e.target.value)} />
        </Field>
        <Field label="Mesi" htmlFor="mesi">
          <input id="mesi" inputMode="numeric" className={inputCls} value={mesi} onChange={(e) => setMesi(e.target.value)} />
        </Field>
        <Field label="Giorni" htmlFor="giorni">
          <input id="giorni" inputMode="numeric" className={inputCls} value={giorni} onChange={(e) => setGiorni(e.target.value)} />
        </Field>
      </Panel>
      {result && (
        <ResultCard label="Data risultante" value={dataIT(result)}>
          {nonLavorativo && <p className="mt-4 text-xs text-ink-foreground/60">Attenzione: la data cade in un giorno non lavorativo ({nonLavorativo}).</p>}
        </ResultCard>
      )}
    </div>
  )
}
