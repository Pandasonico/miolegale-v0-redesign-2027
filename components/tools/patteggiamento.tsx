'use client'

import { useState } from 'react'
import { calcolaPatteggiamento, num, parseNum } from '@/lib/calc'
import { Field, Panel, ResultCard, Stats, inputCls } from './tool-shell'

const REGIMI = {
  ordinario: 'Patteggiamento ordinario (pena non superiore a due anni)',
  allargato: 'Patteggiamento allargato (pena tra due e cinque anni)',
  'non ammesso': 'Patteggiamento non ammesso (pena superiore a cinque anni)',
} as const

export function PatteggiamentoCalculator() {
  const [anni, setAnni] = useState('2')
  const [mesi, setMesi] = useState('6')
  const [giorni, setGiorni] = useState('0')
  const [riduzione, setRiduzione] = useState('33,33')

  const toInt = (s: string) => Math.max(0, Math.floor(Number(s) || 0))
  const red = Math.min(Math.max(parseNum(riduzione), 0), 100 / 3)
  const r = calcolaPatteggiamento(toInt(anni), toInt(mesi), toInt(giorni), red)
  const base = toInt(anni) + toInt(mesi) + toInt(giorni) > 0

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={2}>
        <Field label="Anni" htmlFor="anni" hint="Pena base, già bilanciata con aggravanti e attenuanti.">
          <input id="anni" inputMode="numeric" className={inputCls} value={anni} onChange={(e) => setAnni(e.target.value)} />
        </Field>
        <Field label="Mesi" htmlFor="mesi">
          <input id="mesi" inputMode="numeric" className={inputCls} value={mesi} onChange={(e) => setMesi(e.target.value)} />
        </Field>
        <Field label="Giorni" htmlFor="giorni">
          <input id="giorni" inputMode="numeric" className={inputCls} value={giorni} onChange={(e) => setGiorni(e.target.value)} />
        </Field>
        <Field label="Riduzione per il rito (%)" htmlFor="riduzione" hint="Fino a un terzo (33,33%).">
          <input id="riduzione" inputMode="decimal" className={inputCls} value={riduzione} onChange={(e) => setRiduzione(e.target.value)} />
        </Field>
      </Panel>
      {base && (
        <ResultCard label="Pena concordata" value={`${r.anni} anni, ${r.mesi} mesi, ${r.giorni} giorni`}>
          <Stats
            items={[
              ['Riduzione applicata', `${num(red)}%`],
              ['Tipo di patteggiamento', REGIMI[r.regime]],
            ]}
            cols={2}
          />
          <p className="mt-4 text-xs text-ink-foreground/60">
            Pena detentiva sola o congiunta a pena pecuniaria (art. 444 c.p.p.). Il mese è computato in 30 giorni.
          </p>
        </ResultCard>
      )}
    </div>
  )
}
