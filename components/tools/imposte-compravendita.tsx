'use client'

import { useState } from 'react'
import { calcolaImposteCompravendita, euro, parseNum } from '@/lib/calc'
import { Check, Field, Panel, ResultCard, inputCls } from './tool-shell'

export function ImposteCompravenditaCalculator() {
  const [venditore, setVenditore] = useState<'privato' | 'impresa'>('privato')
  const [primaCasa, setPrimaCasa] = useState(true)
  const [prezzo, setPrezzo] = useState('200000')
  const [rendita, setRendita] = useState('600')
  const [prezzoValore, setPrezzoValore] = useState(false)

  const r = calcolaImposteCompravendita({
    venditore,
    primaCasa,
    prezzo: parseNum(prezzo),
    rendita: parseNum(rendita),
    prezzoValore,
  })

  const rows: [string, number][] = [
    ...(venditore === 'impresa' ? ([[`IVA ${primaCasa ? '4%' : '10%'}`, r.iva]] as [string, number][]) : []),
    [venditore === 'impresa' ? 'Imposta di registro (fissa)' : `Imposta di registro ${primaCasa ? '2%' : '9%'}`, r.registro],
    ['Imposta ipotecaria', r.ipotecaria],
    ['Imposta catastale', r.catastale],
  ]

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={3}>
        <Field label="Venditore" htmlFor="venditore">
          <select id="venditore" className={inputCls} value={venditore} onChange={(e) => setVenditore(e.target.value as typeof venditore)}>
            <option value="privato">Privato (imposta di registro)</option>
            <option value="impresa">Impresa costruttrice (IVA)</option>
          </select>
        </Field>
        <Field label="Prezzo di acquisto (€)" htmlFor="prezzo">
          <input id="prezzo" inputMode="decimal" className={inputCls} value={prezzo} onChange={(e) => setPrezzo(e.target.value)} />
        </Field>
        <Field label="Rendita catastale (€)" htmlFor="rendita" hint="Serve solo per il regime prezzo-valore.">
          <input id="rendita" inputMode="decimal" className={inputCls} value={rendita} onChange={(e) => setRendita(e.target.value)} />
        </Field>
        <div className="md:col-span-3 grid gap-x-6 md:grid-cols-2">
          <Check id="prima" label="Acquisto con agevolazioni prima casa" checked={primaCasa} onChange={setPrimaCasa} />
          {venditore === 'privato' && (
            <Check id="pv" label="Prezzo-valore (imposte sul valore catastale)" checked={prezzoValore} onChange={setPrezzoValore} />
          )}
        </div>
      </Panel>
      <ResultCard label="Imposte dovute" value={euro(r.totale)}>
        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">Dettaglio delle imposte</caption>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-t border-ink-foreground/15">
                <th scope="row" className="py-2 pr-4 text-left font-normal text-ink-foreground/80">
                  {label}
                </th>
                <td className="py-2 text-right tabular-nums">{euro(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-ink-foreground/60">
          {venditore === 'privato'
            ? `Base imponibile: ${euro(r.base)}. L’imposta di registro non può essere inferiore a € 1.000.`
            : 'Abitazioni non di lusso: per categorie A/1, A/8 e A/9 l’IVA è al 22%.'}{' '}
          Esclusi onorari del notaio, spese di mutuo e provvigioni.
        </p>
      </ResultCard>
    </div>
  )
}
