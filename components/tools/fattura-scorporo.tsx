'use client'

import { useState } from 'react'
import { calcolaFattura, calcolaFatturaInversa, euro, parseNum, type FatturaOpts } from '@/lib/calc'
import { Check, Field, Panel, ResultCard, inputCls } from './tool-shell'

type Da = 'compenso' | 'totale' | 'netto'

const DA: Record<Da, { label: string; field: string }> = {
  compenso: { label: 'Dal compenso (fattura diretta)', field: 'Importo delle competenze (€)' },
  totale: { label: 'Dal totale in fattura (inversa)', field: 'Totale in fattura (€)' },
  netto: { label: 'Dal netto a pagare (inversa)', field: 'Netto a pagare (€)' },
}

const ALIQUOTE = [22, 10, 5, 4]

export function FatturaScorporoCalculator() {
  const [da, setDa] = useState<Da>('compenso')
  const [importo, setImporto] = useState('1000')
  const [speseEsenti, setSpeseEsenti] = useState('0')
  const [aliquota, setAliquota] = useState(22)
  const [forfettario, setForfettario] = useState(false)
  const [cassa, setCassa] = useState(true)
  const [speseGenerali, setSpeseGenerali] = useState(true)
  const [ritenuta, setRitenuta] = useState(false)
  const [split, setSplit] = useState(false)
  const [bollo, setBollo] = useState(false)

  const opts: FatturaOpts = {
    aliquota,
    cassa,
    speseGenerali,
    ritenuta,
    split,
    forfettario,
    bollo,
    speseEsenti: parseNum(speseEsenti),
  }
  const valore = parseNum(importo)
  const r = da === 'compenso' ? calcolaFattura(valore, opts) : calcolaFatturaInversa(valore, da, opts)

  const rows: { label: string; value: number; strong?: boolean }[] = [
    { label: 'Compenso', value: r.compenso },
    ...(speseGenerali ? [{ label: 'Rimborso spese generali 15% (art. 2 DM 55/2014)', value: r.sg }] : []),
    ...(r.bollo ? [{ label: 'Bollo addebitato al cliente', value: r.bollo }] : []),
    ...(cassa ? [{ label: 'Cassa previdenziale 4%', value: r.cassa }] : []),
    { label: 'Imponibile', value: r.imponibile, strong: true },
    ...(!forfettario ? [{ label: `IVA ${aliquota}%`, value: r.iva }] : []),
    ...(r.speseEsenti ? [{ label: 'Spese esenti IVA (art. 15 DPR 633/72)', value: r.speseEsenti }] : []),
    { label: 'Totale in fattura', value: r.totale, strong: true },
    ...(r.ritenuta ? [{ label: 'Ritenuta d’acconto 20%', value: -r.ritenuta }] : []),
    ...(r.ivaSplit ? [{ label: 'IVA versata dal committente (split payment)', value: -r.ivaSplit }] : []),
    { label: 'Netto a pagare', value: r.netto, strong: true },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Panel cols={3}>
        <Field label="Parti da" htmlFor="da">
          <select id="da" className={inputCls} value={da} onChange={(e) => setDa(e.target.value as Da)}>
            {Object.entries(DA).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={DA[da].field} htmlFor="importo">
          <input id="importo" inputMode="decimal" className={inputCls} value={importo} onChange={(e) => setImporto(e.target.value)} />
        </Field>
        <Field label="Spese anticipate esenti IVA (€)" htmlFor="spese">
          <input id="spese" inputMode="decimal" className={inputCls} value={speseEsenti} onChange={(e) => setSpeseEsenti(e.target.value)} />
        </Field>
        <Field label="Aliquota IVA" htmlFor="aliquota">
          <select
            id="aliquota"
            className={inputCls}
            value={forfettario ? 0 : aliquota}
            disabled={forfettario}
            onChange={(e) => setAliquota(Number(e.target.value))}
          >
            {forfettario && <option value={0}>Regime forfettario</option>}
            {ALIQUOTE.map((a) => (
              <option key={a} value={a}>
                {a}%
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-x-6 md:col-span-2 md:grid-cols-2">
          <Check id="forfettario" label="Regime forfettario (senza IVA e ritenuta)" checked={forfettario} onChange={setForfettario} />
          <Check id="cassa" label="Cassa previdenziale 4%" checked={cassa} onChange={setCassa} />
          <Check id="sg" label="Rimborso spese generali 15%" checked={speseGenerali} onChange={setSpeseGenerali} />
          <Check id="ritenuta" label="Ritenuta d’acconto 20%" checked={ritenuta && !forfettario} onChange={setRitenuta} />
          <Check id="split" label="Split payment (PA)" checked={split && !forfettario} onChange={setSplit} />
          {forfettario && <Check id="bollo" label="Addebita bollo di € 2 al cliente" checked={bollo} onChange={setBollo} />}
        </div>
      </Panel>

      <ResultCard label={da === 'compenso' ? 'Netto a pagare' : 'Compenso'} value={euro(da === 'compenso' ? r.netto : r.compenso)}>
        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">Dettaglio della fattura</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-ink-foreground/15">
                <th scope="row" className={`py-2 pr-4 text-left ${row.strong ? 'font-semibold' : 'font-normal text-ink-foreground/80'}`}>
                  {row.label}
                </th>
                <td className={`py-2 text-right tabular-nums ${row.strong ? 'font-semibold' : ''}`}>{euro(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResultCard>
    </div>
  )
}
