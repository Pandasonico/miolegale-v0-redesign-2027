import type { Metadata } from 'next'
import { PercentualeCalculator } from '@/components/tools/percentuale'
import { ToolShell } from '@/components/tools/tool-shell'

export const metadata: Metadata = {
  title: 'Calcolo percentuale online',
  description: 'Calcola la percentuale di un numero, il rapporto percentuale, la variazione percentuale, aumenti e diminuzioni.',
}

export default function Page() {
  return (
    <ToolShell
      slug="percentuale"
      guide={
        <>
          <h2>Formule della percentuale</h2><p>La percentuale di un numero è il numero moltiplicato per la percentuale e diviso per cento. Il rapporto percentuale è la parte divisa per il totale e moltiplicata per cento. La variazione percentuale è la differenza tra valore finale e iniziale, divisa per il valore iniziale, per cento.</p><p>Per aumentare un numero del 22% si moltiplica per 1,22; per diminuirlo del 22% si moltiplica per 0,78.</p>
        </>
      }
    >
      <PercentualeCalculator />
    </ToolShell>
  )
}
