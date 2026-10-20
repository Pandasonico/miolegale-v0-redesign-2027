import type { Metadata } from 'next'
import { TaegCalculator } from '@/components/tools/taeg'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo TAN e TAEG di un finanziamento',
  description: 'Calcola TAN e TAEG di un finanziamento da importo, rata, numero di rate e spese.',
}

export default function Page() {
  return (
    <ToolShell
      slug="tasso-interesse-calcolo-taeg"
      guide={
        <>
          <h2>TAN e TAEG</h2><p>Il TAN è il tasso nominale annuo che lega importo, rata e durata. Il TAEG include anche le spese iniziali e quelle applicate a ogni rata, ed esprime il costo reale del credito su base annua.</p><p>Il tasso è ricavato risolvendo l&apos;equazione di equivalenza finanziaria tra l&apos;importo ricevuto e il valore attuale delle rate. Il risultato è indicativo: fa fede il documento informativo (SECCI) fornito dal finanziatore.</p>
        </>
      }
    >
      <TaegCalculator />
    </ToolShell>
  )
}
