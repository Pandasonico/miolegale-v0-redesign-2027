'use client'

import { useState } from 'react'
import { TASSI_LEGALI, euro, num, parseNum, valoreUsufruttoTermine } from '@/lib/calc'
import { Field, Panel, ResultCard, Stats, inputCls } from './tool-shell'

const TASSO_VIGENTE = TASSI_LEGALI[TASSI_LEGALI.length - 1].rate

export function UsufruttoTermineCalculator() {
  const [valore, setValore] = useState('200000')
  const [anni, setAnni] = useState('10')
  const [tasso, setTasso] = useState(String(TASSO_VIGENTE).replace('.', ','))

  const n = Math.floor(Number(anni) || 0)
  const t = parseNum(tasso)
  const r = valoreUsufruttoTermine(parseNum(valore), n, t)
  const valido = parseNum(valore) > 0 && n > 0 && t > 0

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={3}>
        <Field label="Valore della piena proprietà (€)" htmlFor="valore">
          <input id="valore" inputMode="decimal" className={inputCls} value={valore} onChange={(e) => setValore(e.target.value)} />
        </Field>
        <Field label="Durata dell’usufrutto (anni)" htmlFor="anni">
          <input id="anni" inputMode="numeric" className={inputCls} value={anni} onChange={(e) => setAnni(e.target.value)} />
        </Field>
        <Field label="Tasso di interesse legale (%)" htmlFor="tasso" hint={`Tasso vigente: ${num(TASSO_VIGENTE)}%`}>
          <input id="tasso" inputMode="decimal" className={inputCls} value={tasso} onChange={(e) => setTasso(e.target.value)} />
        </Field>
      </Panel>
      <ResultCard label="Valore dell’usufrutto a termine" value={valido ? euro(r.usufrutto) : '—'}>
        {valido && (
          <>
            <Stats
              items={[
                ['Valore della nuda proprietà', euro(r.nudaProprieta)],
                ['Coefficiente', num(r.coefficiente, 6)],
                ['Quota usufrutto', `${num((r.usufrutto / parseNum(valore)) * 100)}%`],
              ]}
            />
            {r.tettoApplicato && (
              <p className="mt-4 text-xs text-ink-foreground/60">
                Applicato il limite di venti annualità ({euro(r.massimo)}) previsto dall&apos;art. 46, comma 2, lett. b) DPR 131/1986.
              </p>
            )}
          </>
        )}
      </ResultCard>
    </div>
  )
}
