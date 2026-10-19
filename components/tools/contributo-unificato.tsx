'use client'

import { useState } from 'react'
import { calcolaContributoUnificato, euro, type Grado, type Rito } from '@/lib/calc'
import { Field, ResultCard, inputCls } from './tool-shell'

export function ContributoUnificatoCalculator() {
  const [valore, setValore] = useState('15000')
  const [indeterminabile, setIndeterminabile] = useState(false)
  const [grado, setGrado] = useState<Grado>('primo')
  const [rito, setRito] = useState<Rito>('ordinario')

  const result = calcolaContributoUnificato({
    valore: Number(valore.replace(',', '.')) || 0,
    indeterminabile,
    grado,
    rito,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-lg border border-border bg-card p-6 md:grid-cols-3">
        <Field label="Valore della causa (€)" htmlFor="valore">
          <input
            id="valore"
            inputMode="decimal"
            className={inputCls}
            value={valore}
            disabled={indeterminabile}
            onChange={(e) => setValore(e.target.value)}
          />
        </Field>
        <Field label="Procedimento" htmlFor="rito">
          <select id="rito" className={inputCls} value={rito} onChange={(e) => setRito(e.target.value as Rito)}>
            <option value="ordinario">Cognizione ordinaria</option>
            <option value="monitorio">Decreto ingiuntivo</option>
            <option value="lavoro">Lavoro e previdenza</option>
          </select>
        </Field>
        <Field label="Grado di giudizio" htmlFor="grado">
          <select id="grado" className={inputCls} value={grado} onChange={(e) => setGrado(e.target.value as Grado)}>
            <option value="primo">Primo grado</option>
            <option value="appello">Appello</option>
            <option value="cassazione">Cassazione</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm md:col-span-3">
          <input
            type="checkbox"
            className="size-4 accent-[var(--primary)]"
            checked={indeterminabile}
            onChange={(e) => setIndeterminabile(e.target.checked)}
          />
          Valore indeterminabile
        </label>
      </div>

      <ResultCard label="Contributo unificato dovuto" value={euro(result.amount)}>
        <ul className="mt-3 space-y-1 text-sm text-ink-foreground/75">
          {result.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </ResultCard>
    </div>
  )
}
