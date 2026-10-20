'use client'

import { useState } from 'react'
import { aggiungiPeriodo, dataIT, fasciaEta, giorniTraDate } from '@/lib/calc'
import { Field, Panel, ResultCard, Stats, inputCls } from './tool-shell'

export function EtaAnagraficaCalculator() {
  const [nascita, setNascita] = useState('1985-06-15')
  const [alla, setAlla] = useState('2026-10-20')
  const [giorni, setGiorni] = useState('10000')

  const eta = nascita && alla && nascita <= alla ? giorniTraDate(nascita, alla) : null
  const n = Math.max(0, Math.floor(Number(giorni) || 0))
  const raggiunta = nascita ? aggiungiPeriodo(nascita, 1, 0, 0, n) : null
  const etaRaggiunta = nascita && raggiunta ? giorniTraDate(nascita, raggiunta) : null

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="eta-data" className="flex flex-col gap-6">
        <h2 id="eta-data" className="font-sans tracking-tight text-xl font-semibold">
          Età a una data
        </h2>
        <Panel>
          <Field label="Data di nascita" htmlFor="nascita">
            <input id="nascita" type="date" className={inputCls} value={nascita} onChange={(e) => setNascita(e.target.value)} />
          </Field>
          <Field label="Calcola l’età alla data" htmlFor="alla">
            <input id="alla" type="date" className={inputCls} value={alla} onChange={(e) => setAlla(e.target.value)} />
          </Field>
        </Panel>
        {eta ? (
          <ResultCard label="Età anagrafica" value={`${eta.anni} anni, ${eta.mesi} mesi, ${eta.giorni} giorni`}>
            <Stats
              items={[
                ['Giorni vissuti', eta.calendario.toLocaleString('it-IT')],
                ['Settimane', eta.settimane.toLocaleString('it-IT')],
                ['Fase della vita', fasciaEta(eta.anni, eta.calendario)],
              ]}
            />
          </ResultCard>
        ) : (
          <p className="text-sm text-muted-foreground">La data di nascita deve precedere la data di calcolo.</p>
        )}
      </section>

      <section aria-labelledby="eta-giorni" className="flex flex-col gap-6">
        <h2 id="eta-giorni" className="font-sans tracking-tight text-xl font-semibold">
          Età aggiungendo giorni alla nascita
        </h2>
        <Panel>
          <Field label="Giorni dalla nascita" htmlFor="giorni" hint="Il giorno di nascita non è computato.">
            <input id="giorni" inputMode="numeric" className={inputCls} value={giorni} onChange={(e) => setGiorni(e.target.value)} />
          </Field>
        </Panel>
        {raggiunta && etaRaggiunta && (
          <ResultCard label="Data raggiunta" value={dataIT(raggiunta)}>
            <Stats
              items={[
                ['Età in quella data', `${etaRaggiunta.anni} a · ${etaRaggiunta.mesi} m · ${etaRaggiunta.giorni} g`],
                ['Fase della vita', fasciaEta(etaRaggiunta.anni, etaRaggiunta.calendario)],
              ]}
              cols={2}
            />
          </ResultCard>
        )}
      </section>
    </div>
  )
}
